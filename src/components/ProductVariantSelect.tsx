import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface Variant {
  id: string;
  name: string;
  unit: string;
  value: number;
  price: number;
}

interface ProductVariantSelectProps {
  productId: string;
  productName: string;
  imageUrl: string | null;
}

export function ProductVariantSelect({ productId, productName, imageUrl }: ProductVariantSelectProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchVariants() {
      const { data, error } = await supabase
        .from("product_variants")
        .select("id, name, unit, value, price")
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setVariants(data);
        if (data.length > 0) {
          setSelectedVariant(data[0]);
        }
      }
      setLoading(false);
    }

    fetchVariants();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    await addItem(
      productId,
      selectedVariant.id,
      productName,
      selectedVariant.name,
      selectedVariant.unit,
      selectedVariant.value,
      selectedVariant.price,
      imageUrl
    );
    setAdding(false);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
  }

  if (variants.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Brak dostępnych wariantów
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedVariant?.id === variant.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary/50"
              }`}
            >
              {variant.name} {variant.unit}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        {selectedVariant && (
          <span className="font-semibold text-lg text-primary">
            {formatPrice(selectedVariant.price)}
          </span>
        )}
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || adding}
          size="sm"
          className="shadow-soft group/btn"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
              Do koszyka
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
