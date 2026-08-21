import { t } from "@/lib/pageText";
import { ScrollReveal } from "@/components/ScrollReveal";
import handsEggs from "@/assets/home/hands-eggs.jpg";

const Philosophy = () => {
  return (
    <section className="bg-background">
      <div className="grid lg:grid-cols-2 items-center">
        <div className="px-6 md:px-10 lg:px-16 py-20 lg:py-36 order-2 lg:order-1">
          <ScrollReveal>
            <p className="text-[0.62rem] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8">
              {t("Nasza filozofia")}
            </p>
            <h2 className="font-serif text-[2.1rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem] text-foreground mb-10 max-w-xl break-words">
              {t("Nie produkujemy wszystkiego.")}
              <span className="block text-primary">{t("Produkujemy to, co sami chcemy jeść.")}</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg mb-10">
              {t("Bez kombinowania. Bez anonimowego pochodzenia. Z troską o to, czym karmimy zwierzęta i z czego powstaje nasze jedzenie.")}
            </p>
            <div className="h-px w-16 bg-primary/50 mb-8" />
            <p className="text-[0.72rem] sm:text-sm tracking-[0.22em] uppercase text-foreground/80 leading-relaxed">
              {t("Małe partie")} <span className="text-primary">·</span> rodzinny chów{" "}
              <span className="text-primary">·</span> {t("prawdziwe składniki")}
            </p>
          </ScrollReveal>
        </div>

        <div className="order-1 lg:order-2">
          <img
            src={handsEggs}
            alt="Dłonie zbierające jajka przepiórcze do drewnianej skrzynki"
            loading="lazy"
            width={1280}
            height={1600}
            className="w-full h-[55vh] lg:h-[88vh] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
