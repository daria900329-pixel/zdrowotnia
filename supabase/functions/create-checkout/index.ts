import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  success_url: string;
  cancel_url: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const authHeader = req.headers.get("Authorization")!;
    
    // Use anon key client for auth check
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Use service role client for database queries (bypasses RLS for price verification)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { items, success_url, cancel_url }: CheckoutRequest = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // SECURITY FIX: Validate all variant IDs exist and get prices from database
    const variantIds = items.map(item => item.variant_id);
    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("id, price, name, product_id, is_active")
      .in("id", variantIds);

    if (variantsError) {
      console.error("Variants query error:", variantsError);
      throw new Error("Failed to validate products");
    }

    if (!variants || variants.length !== items.length) {
      throw new Error("One or more products are unavailable");
    }

    // Validate all variants are active
    const inactiveVariants = variants.filter(v => !v.is_active);
    if (inactiveVariants.length > 0) {
      throw new Error("One or more products are no longer available");
    }

    // Get product names from database for security
    const productIds = [...new Set(items.map(item => item.product_id))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, is_active")
      .in("id", productIds);

    if (productsError) {
      console.error("Products query error:", productsError);
      throw new Error("Failed to validate products");
    }

    if (!products || products.length !== productIds.length) {
      throw new Error("One or more products are unavailable");
    }

    // Validate all products are active
    const inactiveProducts = products.filter(p => !p.is_active);
    if (inactiveProducts.length > 0) {
      throw new Error("One or more products are no longer available");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    // Calculate total using SERVER-SIDE prices (not client-provided)
    let totalAmount = 0;
    const lineItems = items.map(item => {
      const variant = variants.find(v => v.id === item.variant_id);
      const product = products.find(p => p.id === item.product_id);
      
      if (!variant || !product) {
        throw new Error("Invalid product or variant");
      }

      // Verify product_id matches the variant's product_id
      if (variant.product_id !== item.product_id) {
        throw new Error("Product and variant mismatch");
      }

      const serverPrice = Number(variant.price);
      totalAmount += serverPrice * item.quantity;

      return {
        price_data: {
          currency: "pln",
          product_data: {
            name: product.name,
            description: variant.name,
          },
          unit_amount: Math.round(serverPrice * 100), // Use SERVER-VALIDATED price
        },
        quantity: item.quantity,
      };
    });

    // Create order in database with SERVER-VALIDATED total
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Insert order items with SERVER-VALIDATED prices
    const orderItems = items.map(item => {
      const variant = variants.find(v => v.id === item.variant_id);
      const product = products.find(p => p.id === item.product_id);
      
      return {
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: product!.name,
        variant_name: variant!.name,
        price: Number(variant!.price),
        quantity: item.quantity,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url,
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
      shipping_address_collection: {
        allowed_countries: ["PL"],
      },
    });

    // Update order with Stripe session ID
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
