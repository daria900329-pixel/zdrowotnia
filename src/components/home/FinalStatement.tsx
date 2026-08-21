import { t } from "@/lib/pageText";
import { ScrollReveal } from "@/components/ScrollReveal";
import handsEggs from "@/assets/home/hands-eggs.jpg";
import { img } from "@/lib/pageImages";

const FinalStatement = () => {
  return (
    <section className="relative">
      <img
        src={img(handsEggs)}
        alt="Dłonie zbierające jaja przepiórcze w Zdrowotni"
        loading="lazy"
        className="w-full h-[70vh] md:h-[85vh] object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />

      <div className="absolute inset-0 flex items-end">
        <div className="px-6 md:px-10 lg:px-16 pb-16 md:pb-24 w-full">
          <ScrollReveal className="max-w-3xl">
            <h2 className="font-serif text-[1.9rem] leading-[1.1] sm:text-4xl lg:text-[3.2rem] text-foreground mb-4 break-words">
              {t("Dobre jedzenie nie potrzebuje wielkiej historii.")}
            </h2>
            <p className="font-serif text-[1.5rem] sm:text-3xl lg:text-[2.4rem] text-primary mb-10">
              {t("Potrzebuje dobrego początku.")}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-10">
              {t("Wybieraj naturalnie.")}
              <br />
              {t("Wybieraj świadomie.")}
              <br />
              {t("Wybieraj Zdrowotnię. ♡")}
            </p>
            <a
              href="#sklep"
              className="inline-flex items-center justify-center bg-foreground text-background text-[0.7rem] tracking-[0.25em] uppercase px-9 py-4 hover:bg-earth transition-colors"
            >
              {t("Zobacz, co dziś mamy")}
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FinalStatement;
