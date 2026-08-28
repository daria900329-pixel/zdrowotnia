import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Minus, Plus } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  unit: string;
  value: number;
  price: number;
  promo_price: number | null;
}

interface QuailBuyBoxProps {
  productId: string;
  productName: string;
  imageUrl: string | null;
  note?: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);

export function QuailBuyBox({ productId, productName, imageUrl, note }: QuailBuyBoxProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selected, setSelected] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addItem, updateQuantity } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("product_variants")
        .select("id, name, unit, value, price, promo_price")
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!cancelled) {
        if (data) {
          setVariants(data);
          setSelected(data[0] ?? null);
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleAdd = async () => {
    if (!selected) return;
    setAdding(true);
    await addItem(
      productId,
      selected.id,
      productName,
      selected.name,
      selected.unit,
      selected.value,
      selected.promo_price ?? selected.price,
      imageUrl
    );

    if (quantity > 1 && user) {
      const { data: row } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("variant_id", selected.id)
        .maybeSingle();
      if (row) {
        await updateQuantity(row.id, row.quantity + quantity - 1);
      }
    }
    setAdding(false);
  };

  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;
  }

  if (!selected) {
    return <p className="text-sm text-muted-foreground italic">Chwilowo niedostępne</p>;
  }

  const price = selected.promo_price ?? selected.price;

  return (
    <div className="space-y-6">
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelected(v)}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-colors ${
                selected.id === v.id
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {v.value} {v.unit}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-baseline gap-3">
        {selected.promo_price && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(selected.price)}
          </span>
        )}
        <span className="font-serif text-4xl md:text-5xl text-foreground">
          {formatPrice(price)}
        </span>
        <span className="text-sm text-muted-foreground">
          / {selected.value} {selected.unit}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-stretch">
        <div className="flex items-center border border-border/80 bg-background/60 w-fit">
          <button
            aria-label="Zmniejsz ilość"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-base tabular-nums">{quantity}</span>
          <button
            aria-label="Zwiększ ilość"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="px-4 py-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex-1 sm:flex-none sm:min-w-[280px] bg-foreground text-background px-10 py-4 text-xs sm:text-sm tracking-[0.25em] uppercase hover:bg-earth transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Dodaj do koszyka"}
        </button>
      </div>

      <p className="text-sm text-muted-foreground italic font-handwritten text-base">
        {note ?? "Świeże. Lokalne. Od naszych przepiórek."}
      </p>
    </div>
  );
}
