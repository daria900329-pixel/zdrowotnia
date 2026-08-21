import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductVariantSelect } from "@/components/ProductVariantSelect";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductDescription, ActiveSection } from "@/components/ProductDescription";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO, productJsonLd, breadcrumbJsonLd } from "@/components/SEO";
import { QuailEggLanding } from "@/components/quail/QuailEggLanding";

const QUAIL_PRODUCT_ID = "c04e492a-fe9f-461f-bc06-a5bb0539b58f";

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
  const [lowestPrice, setLowestPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection | null>(null);

  const handleActiveSectionChange = useCallback((section: ActiveSection | null) => {
    setActiveSection(section);
  }, []);

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
        if (import.meta.env.DEV) console.error("Error fetching product:", error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setProduct(data);
        // Fetch lowest variant price
        const { data: variants } = await supabase
          .from("product_variants")
          .select("price, promo_price")
          .eq("product_id", data.id)
          .eq("is_active", true)
          .order("price", { ascending: true })
          .limit(1);
        if (variants && variants.length > 0) {
          setLowestPrice(variants[0].promo_price ?? variants[0].price);
        }
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

  if (product.id === QUAIL_PRODUCT_ID) {
    return <QuailEggLanding product={product} />;
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={product.name}
        description={product.description || `${product.name} — naturalny produkt od Zdrowotni`}
        canonical={`/product/${product.id}`}
        ogType="product"
        ogImage={product.image_url || undefined}
        jsonLd={[
          productJsonLd({ ...product, image: product.image_url, price: lowestPrice }),
          breadcrumbJsonLd([
            { name: "Strona główna", url: "/" },
            { name: "Produkty", url: "/#produkty" },
            { name: product.name, url: `/product/${product.id}` },
          ]),
        ]}
      />
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
            {/* Left Column: Product Gallery (sticky) */}
            <div className="relative lg:sticky lg:top-44 lg:self-start">
              <ProductGallery
                productId={product.id}
                productName={product.name}
                fallbackImage={product.image_url}
                overlayImageUrl={activeSection?.image_url ?? null}
                overlayAlt={activeSection ? `Sekcja: ${activeSection.title}` : undefined}
              />
              
              {product.badge && (
                <span className="absolute top-6 left-6 z-10 bg-gradient-to-r from-accent to-primary text-accent-foreground text-sm font-semibold px-4 py-2 rounded-full shadow-soft">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Right Column: Product Info + Description */}
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

              {/* Detailed description & menu sections */}
              <div className="pt-6">
                <ProductDescription
                  productId={product.id}
                  fallbackDescription={product.long_description}
                  onActiveSectionChange={handleActiveSectionChange}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
