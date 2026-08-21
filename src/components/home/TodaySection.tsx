import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useHomeProducts } from "./useHomeProducts";
import { formatPrice } from "./homeData";
import quailsPhoto from "@/assets/quail/quails.jpg";

const TodaySection = () => {
  const { products, prices, loading } = useHomeProducts();
  const items = products.slice(0, 5);

  return (
    <section className="bg-background py-20 md:py-32">
      <div className="px-6 md:px-10 lg:px-16">
        <ScrollReveal className="max-w-2xl mb-14 md:mb-20">
          <p className="font-handwritten text-xl text-primary mb-3">dzisiaj dostępne</p>
          <h2 className="font-serif text-[2rem] leading-[1.08] sm:text-4xl lg:text-[3rem] text-foreground mb-6 break-words">
            Dzisiaj w Zdrowotni.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nie jesteśmy magazynem. Nie wszystko mamy zawsze. I właśnie tak ma być.
          </p>
        </ScrollReveal>

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
            {items.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 80}>
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="overflow-hidden mb-4 bg-secondary/50">
                    <img
                      src={product.image_url ?? quailsPhoto}
                      alt={product.name}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="text-[0.6rem] tracking-[0.22em] uppercase text-primary mb-2">
                    {product.badge || "Dzisiaj dostępne"}
                  </p>
                  <h3 className="font-serif text-lg text-foreground leading-snug mb-1">
                    {product.name}
                  </h3>

                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaySection;
