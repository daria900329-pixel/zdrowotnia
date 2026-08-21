import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HomeProduct } from "./homeData";

export function useHomeProducts() {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("products")
        .select("id, name, description, image_url, badge, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (cancelled) return;
      const list = data ?? [];
      setProducts(list);

      if (list.length > 0) {
        const { data: variants } = await supabase
          .from("product_variants")
          .select("product_id, price, promo_price")
          .eq("is_active", true)
          .in(
            "product_id",
            list.map((p) => p.id)
          );

        if (!cancelled && variants) {
          const min: Record<string, number> = {};
          for (const v of variants) {
            const price = Number(v.promo_price ?? v.price);
            if (!Number.isFinite(price)) continue;
            if (min[v.product_id] === undefined || price < min[v.product_id]) {
              min[v.product_id] = price;
            }
          }
          setPrices(min);
        }
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, prices, loading };
}
