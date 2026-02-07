import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ScrollReveal";

// Fallback static products (used when DB is empty)
import kombuchaImg from "@/assets/product-kombucha.jpg";
import vinegarImg from "@/assets/product-vinegar.jpg";
import breadImg from "@/assets/product-bread.jpg";
import rabbitImg from "@/assets/product-rabbit.jpg";

const fallbackProducts = [
  {
    id: "fallback-1",
    name: "Kombucha",
    description: "Nasz rodzinny eliksir zdrowia! Fermentowany napój pełen dobrych bakterii. Mama robi ją od 5 lat. 🫖",
    image: kombuchaImg,
    badge: "Ulubiona!",
  },
  {
    id: "fallback-2",
    name: "Ocet Jabłkowy",
    description: "Z polskich jabłuszek, fermentowany miesiącami. Babciny przepis na zdrowie i urodę! 🍎",
    image: vinegarImg,
  },
  {
    id: "fallback-3",
    name: "Chleb na Zakwasie",
    description: "Pieczony z miłością, na 3-letnim zakwasie. Aromat, który wypełnia cały dom. 🍞",
    image: breadImg,
    badge: "Ciepły!",
  },
  {
    id: "fallback-4",
    name: "Mięso z Królika",
    description: "Z naszej domowej hodowli. Króliki mają imiona i jedzą zioła z ogrodu. Chude i delikatne. 🐰",
    image: rabbitImg,
  },
];

interface DBProduct {
  id: string;
  name: string;
  description: string | null;
  badge: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const { content } = useSiteContent("products");

  const title = content.title || "Co dziś dla Ciebie przygotowaliśmy? 🥰";
  const subtitle = content.subtitle || "Każdy produkt robimy ręcznie, w małych partiach. Dokładnie tak, jak byśmy przygotowywali je dla własnej rodziny — bo tak właśnie jest!";
  const badge = content.badge || "Prosto z Naszej Kuchni";
  const comingSoon = content.coming_soon || "Pasztet z królika • Kurczaki z wolnego wybiegu • Jajka od szczęśliwych kurek • Oliwa z Włoch";

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
        setUseFallback(true);
      } else if (!data || data.length === 0) {
        setUseFallback(true);
      } else {
        setProducts(data);
        setUseFallback(false);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const displayProducts = useFallback ? fallbackProducts : products;

  return (
    <section id="produkty" className="section-padding bg-secondary/40 relative">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto relative">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-accent font-medium mb-3 bg-accent/10 px-3 py-1 rounded-full text-sm">
            <Sparkles className="w-4 h-4" /> {badge}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollRevealGroup 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            staggerDelay={150}
            variant="fade-up"
          >
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={useFallback ? (product as typeof fallbackProducts[0]).description : (product.description || "")}
                image={useFallback ? (product as typeof fallbackProducts[0]).image : ((product as DBProduct).image_url || "")}
                badge={useFallback ? (product as typeof fallbackProducts[0]).badge : ((product as DBProduct).badge || undefined)}
              />
            ))}
          </ScrollRevealGroup>
        )}

        <ScrollReveal delay={400} className="mt-12 text-center">
          <div className="inline-block bg-card border border-primary/20 rounded-2xl px-8 py-6 shadow-soft">
            <p className="text-foreground font-medium mb-2">
              🌟 <strong>Wkrótce w naszej spiżarni:</strong>
            </p>
            <p className="text-muted-foreground">
              {comingSoon}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Products;
