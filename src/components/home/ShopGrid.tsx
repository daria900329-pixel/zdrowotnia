import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProductVariantSelect } from "@/components/ProductVariantSelect";
import { useHomeProducts } from "./useHomeProducts";
import { PRODUCT_STORIES } from "./homeData";
import quailsPhoto from "@/assets/quail/quails.jpg";

const ShopGrid = () => {
  const { products, loading } = useHomeProducts();

  return (
    <section id="sklep" className="bg-background py-20 md:py-32">
      <div className="px-6 md:px-10 lg:px-16">
        <ScrollReveal className="max-w-2xl mb-14 md:mb-20">
          <p className="text-[0.62rem] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8">
            Do koszyka
          </p>
          <h2 className="font-serif text-[2rem] leading-[1.08] sm:text-4xl lg:text-[3rem] text-foreground break-words">
            Co dziś zabierzesz ze Zdrowotni?
          </h2>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {products.map((product, i) => {
              const story = PRODUCT_STORIES[product.id];
              return (
                <ScrollReveal key={product.id} delay={(i % 3) * 90}>
                  <div className="flex flex-col h-full">
                    <Link
                      to={`/product/${product.id}`}
                      className="block overflow-hidden bg-secondary/50 mb-5"
                    >
                      <img
                        src={product.image_url ?? quailsPhoto}
                        alt={product.name}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </Link>
                    <p className="text-[0.6rem] tracking-[0.22em] uppercase text-primary mb-2">
                      {product.badge || "Dzisiaj dostępne"}
                    </p>
                    <h3 className="font-serif text-xl text-foreground mb-2 leading-snug">
                      <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                      {story?.tags[0] ?? product.description?.split("\n")[0]?.slice(0, 70)}
                    </p>
                    <ProductVariantSelect
                      productId={product.id}
                      productName={product.name}
                      imageUrl={product.image_url}
                    />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopGrid;
