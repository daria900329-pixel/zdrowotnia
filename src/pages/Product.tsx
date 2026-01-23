import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductVariantSelect } from "@/components/ProductVariantSelect";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string | null;
  long_description: string | null;
  badge: string | null;
  image_url: string | null;
}

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, long_description, badge, image_url")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="section-padding">
          <div className="container mx-auto text-center py-20">
            <h1 className="font-serif text-3xl text-foreground mb-4">
              Produkt nie został znaleziony
            </h1>
            <p className="text-muted-foreground mb-8">
              Przepraszamy, ale szukany produkt nie istnieje lub został usunięty.
            </p>
            <Button asChild>
              <Link to="/#produkty">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Wróć do produktów
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              to="/#produkty" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Wróć do produktów
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-hover bg-secondary/30">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Brak zdjęcia
                  </div>
                )}
              </div>
              {product.badge && (
                <span className="absolute top-6 left-6 bg-gradient-to-r from-accent to-primary text-accent-foreground text-sm font-semibold px-4 py-2 rounded-full shadow-soft">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 text-accent font-medium mb-3 bg-accent/10 px-3 py-1 rounded-full text-sm">
                  <Sparkles className="w-4 h-4" /> Zdrowotnia
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
                  {product.name}
                </h1>
                {product.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Variants & Add to Cart */}
              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-soft">
                <h3 className="font-medium text-foreground mb-4">Wybierz wariant</h3>
                <ProductVariantSelect
                  productId={product.id}
                  productName={product.name}
                  imageUrl={product.image_url}
                />
              </div>

              {/* Long Description */}
              {product.long_description && (
                <div className="prose prose-stone max-w-none">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    O produkcie
                  </h3>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.long_description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
