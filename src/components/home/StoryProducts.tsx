import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useHomeProducts } from "./useHomeProducts";
import { PRODUCT_STORIES, defaultStory } from "./homeData";
import quailsPhoto from "@/assets/quail/quails.jpg";

const StoryProducts = () => {
  const { products, loading } = useHomeProducts();

  return (
    <section id="produkty" className="bg-secondary/40 py-20 md:py-32">
      <div className="px-6 md:px-10 lg:px-16">
        <ScrollReveal className="max-w-3xl">
          <p className="text-[0.62rem] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8">
            Nasza spiżarnia
          </p>
          <h2 className="font-serif text-[2.3rem] leading-[1.05] sm:text-5xl lg:text-[3.6rem] text-foreground mb-8 break-words">
            Co dobrego mamy?
          </h2>
          <p className="font-serif text-xl sm:text-2xl lg:text-[1.75rem] leading-snug text-primary max-w-2xl">
            To, co właśnie dojrzewa, rośnie, fermentuje, piecze się albo znosi.
          </p>
        </ScrollReveal>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-16 md:mt-24 space-y-20 md:space-y-32">
          {products.map((product, index) => {
            const story = PRODUCT_STORIES[product.id] ?? defaultStory(product);
            const image = story.image ?? product.image_url ?? quailsPhoto;
            const reversed = index % 2 === 1;
            const large = story.scale !== "small";

            return (
              <article key={product.id} className="grid lg:grid-cols-12 items-center gap-y-8">
                <div
                  className={`lg:col-span-7 ${
                    reversed ? "lg:order-2 lg:col-start-6" : "lg:order-1"
                  }`}
                >
                  <ScrollReveal variant={reversed ? "fade-left" : "fade-right"}>
                    <Link to={`/product/${product.id}`} className="block group overflow-hidden">
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03] ${
                          large ? "h-[52vh] lg:h-[78vh]" : "h-[42vh] lg:h-[58vh]"
                        }`}
                      />
                    </Link>
                  </ScrollReveal>
                </div>

                <div
                  className={`lg:col-span-5 px-6 md:px-10 lg:px-14 ${
                    reversed ? "lg:order-1 lg:row-start-1" : "lg:order-2"
                  }`}
                >
                  <ScrollReveal delay={120}>
                    <p className="font-handwritten text-lg text-primary mb-4">{story.eyebrow}</p>
                    <h3 className="font-serif text-[1.9rem] leading-[1.1] sm:text-4xl lg:text-[2.6rem] text-foreground mb-6 whitespace-pre-line break-words">
                      {story.headline}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                      {story.lead}
                    </p>
                    <p className="text-[0.65rem] sm:text-[0.7rem] tracking-[0.2em] uppercase text-foreground/70 mb-8 leading-relaxed">
                      {story.tags.join(" · ")}
                    </p>

                    <div className="h-px w-14 bg-primary/40 mb-8" />

                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex items-center justify-center bg-foreground text-background text-[0.7rem] tracking-[0.25em] uppercase px-9 py-4 hover:bg-earth transition-colors"
                    >
                      {story.cta}
                      <ArrowRight className="w-3.5 h-3.5 ml-3" />
                    </Link>


                    {story.edu && (
                      <Link
                        to={`/product/${product.id}`}
                        className="mt-6 block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {story.edu} →
                      </Link>
                    )}
                  </ScrollReveal>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default StoryProducts;
