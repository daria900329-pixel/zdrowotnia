import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  product_name: string;
  variant_name: string;
  variant_unit: string;
  variant_value: number;
  price: number;
  image_url: string | null;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  totalAmount: number;
  addItem: (productId: string, variantId: string, productName: string, variantName: string, variantUnit: string, variantValue: number, price: number, imageUrl: string | null) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        variant_id,
        quantity,
        products:product_id (name, image_url),
        product_variants:variant_id (name, unit, value, price)
      `)
      .eq("user_id", user.id);

    if (error) {
      if (import.meta.env.DEV) console.error("Error fetching cart:", error);
    } else if (data) {
      const cartItems: CartItem[] = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        product_name: item.products?.name || "Produkt",
        variant_name: item.product_variants?.name || "",
        variant_unit: item.product_variants?.unit || "",
        variant_value: item.product_variants?.value || 0,
        price: item.product_variants?.price || 0,
        image_url: item.products?.image_url || null,
      }));
      setItems(cartItems);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (
    productId: string,
    variantId: string,
    productName: string,
    variantName: string,
    variantUnit: string,
    variantValue: number,
    price: number,
    imageUrl: string | null
  ) => {
    if (!user) {
      toast({
        title: "Zaloguj się",
        description: "Aby dodać produkty do koszyka, musisz być zalogowany.",
        variant: "destructive",
      });
      return;
    }

    // Check if item already exists
    const existing = items.find(i => i.variant_id === variantId);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + 1);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        variant_id: variantId,
        quantity: 1,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint - item exists, refetch and update
        await fetchCart();
        const existingItem = items.find(i => i.variant_id === variantId);
        if (existingItem) {
          await updateQuantity(existingItem.id, existingItem.quantity + 1);
        }
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się dodać do koszyka",
          variant: "destructive",
        });
      }
    } else {
      setItems(prev => [...prev, {
        id: data.id,
        product_id: productId,
        variant_id: variantId,
        quantity: 1,
        product_name: productName,
        variant_name: variantName,
        variant_unit: variantUnit,
        variant_value: variantValue,
        price,
        image_url: imageUrl,
      }]);
      toast({
        title: "Dodano do koszyka! 🛒",
        description: `${productName} - ${variantName}`,
      });
    }
  }, [user, items, toast, fetchCart]);

  const removeItem = useCallback(async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (!error) {
      setItems(prev => prev.filter(i => i.id !== itemId));
    }
  }, []);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);

    if (!error) {
      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, quantity } : i
      ));
    }
  }, [removeItem]);

  const clearCart = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (!error) {
      setItems([]);
    }
  }, [user]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      itemCount,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refetch: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
