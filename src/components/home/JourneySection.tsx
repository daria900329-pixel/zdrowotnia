import { ScrollReveal } from "@/components/ScrollReveal";
import feedMix from "@/assets/quail/feed-mix.jpg";
import quails from "@/assets/quail/quails.jpg";
import freshEggs from "@/assets/quail/fresh-eggs.jpg";
import breadCut from "@/assets/product-bread.jpg";
import packing from "@/assets/quail/packing.jpg";
import delivery from "@/assets/quail/delivery.jpg";

const STEPS = [
  { img: feedMix, label: "Karmimy" },
  { img: quails, label: "Opiekujemy się" },
  { img: freshEggs, label: "Zbieramy" },
  { img: breadCut, label: "Pieczemy i fermentujemy" },
  { img: packing, label: "Pakujemy" },
  { img: delivery, label: "Oddajemy Tobie" },
];

const JourneySection = () => {
  return (
    <section className="bg-background py-20 md:py-32">
      <div className="px-6 md:px-10 lg:px-16">
        <ScrollReveal className="max-w-2xl mb-14 md:mb-20">
          <p className="text-[0.62rem] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8">
            Od nas do Ciebie
          </p>
          <h2 className="font-serif text-[2rem] leading-[1.08] sm:text-4xl lg:text-[3rem] text-foreground break-words">
            Znamy drogę naszego jedzenia.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-10">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 90}>
              <img
                src={s.img}
                alt={s.label}
                loading="lazy"
                className={`w-full object-cover mb-4 ${
                  i % 2 === 0 ? "aspect-[4/5]" : "aspect-square md:mt-8"
                }`}
              />
              <p className="text-[0.62rem] tracking-[0.22em] uppercase text-foreground/80">
                {s.label}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <p className="font-serif text-[1.8rem] leading-tight sm:text-4xl lg:text-[3rem] text-foreground mt-20 md:mt-28 max-w-3xl">
            Krótka droga.
            <span className="block text-primary">Dużo odpowiedzialności.</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default JourneySection;
