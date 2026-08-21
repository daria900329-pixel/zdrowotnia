import { ScrollReveal } from "@/components/ScrollReveal";
import freshEggs from "@/assets/quail/fresh-eggs.jpg";
import breadCut from "@/assets/home/bread-cut.jpg";
import vinegarEditorial from "@/assets/home/vinegar-editorial.jpg";

const NotPerfect = () => {
  return (
    <section className="bg-background py-20 md:py-32 overflow-hidden">
      <div className="px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollReveal>
            <h2 className="font-serif text-[2rem] leading-[1.08] sm:text-4xl lg:text-[3rem] text-foreground mb-8 break-words">
              Prawdziwe jedzenie nie zawsze wygląda identycznie.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg mb-10">
              Jajka mają różne odcienie. Chleb nie wyrasta co do milimetra. Naturalna fermentacja
              żyje swoim rytmem.
            </p>
            <p className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary">
              I bardzo dobrze.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <ScrollReveal variant="zoom-in">
              <img
                src={freshEggs}
                alt="Jajka przepiórcze o różnych odcieniach skorupki"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover"
              />
            </ScrollReveal>
            <div className="space-y-4 sm:space-y-6 mt-10">
              <ScrollReveal variant="zoom-in" delay={120}>
                <img
                  src={breadCut}
                  alt="Nieregularny miękisz chleba na zakwasie"
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                />
              </ScrollReveal>
              <ScrollReveal variant="zoom-in" delay={220}>
                <img
                  src={vinegarEditorial}
                  alt="Naturalny osad w butelce octu jabłkowego"
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover"
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotPerfect;
