import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOrderEmailRequest {
  order_id: string;
  template_key: string;
  extra_variables?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify caller is admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { order_id, template_key, extra_variables } = (await req.json()) as SendOrderEmailRequest;

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user email from auth
    const { data: { user: orderUser }, error: orderUserError } = await supabase.auth.admin.getUserById(order.user_id);
    if (orderUserError || !orderUser?.email) {
      return new Response(JSON.stringify({ error: "Could not find customer email" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerEmail = orderUser.email;

    // Fetch order items
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_name, variant_name, quantity, price")
      .eq("order_id", order_id);

    const formatPrice = (amount: number) =>
      new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);

    const itemsHtml = (orderItems || [])
      .map((item: any) =>
        `<p style="color: #5c4a3a; margin: 4px 0;"><strong>${item.product_name}</strong> – ${item.variant_name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}</p>`
      )
      .join("");

    const orderDate = new Date(order.created_at).toLocaleDateString("pl-PL");

    // Build variables
    const variables: Record<string, string> = {
      "{{customer_email}}": customerEmail,
      "{{order_id}}": order_id,
      "{{order_id_short}}": order_id.substring(0, 6).toUpperCase(),
      "{{order_total}}": formatPrice(order.total_amount),
      "{{order_items}}": `<div style="padding: 12px 0;">${itemsHtml}</div>`,
      "{{order_date}}": orderDate,
      ...extra_variables,
    };

    // Call send-email function
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        template_key,
        to: customerEmail,
        variables,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to send email", details: emailResult }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, sent_to: customerEmail }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Send order email error:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
