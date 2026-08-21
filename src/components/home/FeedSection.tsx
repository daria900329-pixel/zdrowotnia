import { t } from "@/lib/pageText";
import { ScrollReveal } from "@/components/ScrollReveal";
import quailsPhoto from "@/assets/quail/quails.jpg";
import { img } from "@/lib/pageImages";

const STATEMENTS = [
  {
    label: "Bez pszenicy",
    text: "W żywieniu naszych przepiórek stosujemy własną mieszankę bez pszenicy.",
  },
  {
    label: "Małe stada",
    text: "Chcemy widzieć nasze zwierzęta, a nie tylko wyniki produkcji.",
  },
  {
    label: "Codzienna opieka",
    text: "Wiemy, co jedzą. Wiemy, gdzie żyją. Wiemy, skąd pochodzi nasze jedzenie.",
  },
];

const FeedSection = () => {
  return (
    <section className="bg-earth/5">
      <div className="bg-earth/10">
        <img
          src={img(quailsPhoto)}
          alt="Przepiórki w naszym rodzinnym chowie"
          loading="lazy"
          className="w-full h-auto max-h-[85vh] object-contain object-center mx-auto"
        />
      </div>


      <div className="px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <ScrollReveal className="max-w-3xl">
          <p className="text-[0.62rem] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8">
            {t("Wiemy, czym karmimy")}
          </p>
          <h2 className="font-serif text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.2rem] text-foreground mb-10 break-words">
            {t("Zanim coś trafi na Twój stół,")}
            <span className="block text-primary">{t("najpierw trafia na nasz.")}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            {t("Dlatego interesuje nas nie tylko to, co otrzymujemy od zwierząt. Interesuje nas przede wszystkim to, co wcześniej dajemy im my.")}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-x-12 gap-y-12 mt-16 md:mt-24 max-w-6xl">
          {STATEMENTS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div className="h-px w-10 bg-primary/50 mb-6" />
              <h3 className="text-[0.7rem] tracking-[0.25em] uppercase text-foreground mb-4">
                {t(s.label)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{t(s.text)}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedSection;
