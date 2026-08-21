import { t } from "@/lib/pageText";
import { usePageText } from "@/hooks/usePageText";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO, productJsonLd, breadcrumbJsonLd } from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { QuailBuyBox } from "@/components/quail/QuailBuyBox";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import heroVinegar from "@/assets/vinegar/hero.jpg";
import pouring from "@/assets/vinegar/pouring.jpg";
import applesCrate from "@/assets/vinegar/apples.jpg";
import sediment from "@/assets/vinegar/sediment.jpg";
import tasteShot from "@/assets/vinegar/taste.jpg";
import morning from "@/assets/vinegar/morning.jpg";
import backlight from "@/assets/vinegar/backlight.jpg";
import useDressing from "@/assets/vinegar/use-dressing.jpg";
import useMarinade from "@/assets/vinegar/use-marinade.jpg";
import useSauce from "@/assets/vinegar/use-sauce.jpg";
import useKitchen from "@/assets/vinegar/use-kitchen.jpg";
import useDrink from "@/assets/vinegar/use-drink.jpg";
import stepPrep from "@/assets/vinegar/step-prep.jpg";
import stepFerment from "@/assets/vinegar/step-ferment.jpg";
import stepAging from "@/assets/vinegar/step-aging.jpg";
import stepBottling from "@/assets/vinegar/step-bottling.jpg";
import stepTable from "@/assets/vinegar/step-table.jpg";
import pairSalad from "@/assets/vinegar/pair-salad.jpg";
import pairVeg from "@/assets/vinegar/pair-veg.jpg";
import tryShot from "@/assets/vinegar/try.jpg";

interface VinegarProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const DIFFERENCE = [
  { label: "Jabłka", text: "To od nich wszystko się zaczyna." },
  { label: "Czas", text: "Fermentacja nie lubi pośpiechu." },
  {
    label: "Naturalność",
    text: "Nie oczekujemy od produktu naturalnego, żeby wyglądał jak laboratoryjnie wyczyszczony.",
  },
];

const USES = [
  { img: useDressing, label: "Do dressingów", text: "oliwa + ocet + musztarda + zioła" },
  { img: useMarinade, label: "Do marynat", text: "do mięsa i warzyw" },
  { img: useSauce, label: "Do sosów", text: "dla przełamania smaku" },
  { img: useKitchen, label: "Do domowej kuchni", text: "tam, gdzie potrzebujesz kwasowości" },
  { img: useDrink, label: "Do napojów", text: "jeśli ktoś lubi rozcieńczać ocet w wodzie" },
];

const PROCESS = [
  "jabłka",
  "cukry naturalnie obecne w owocach",
  "fermentacja",
  "kwasy organiczne",
  "ocet",
];

const JOURNEY = [
  { img: applesCrate, label: "Jabłka" },
  { img: stepPrep, label: "Przygotowanie" },
  { img: stepFerment, label: "Fermentacja" },
  { img: stepAging, label: "Dojrzewanie" },
  { img: stepBottling, label: "Butelkowanie" },
  { img: stepTable, label: "Twój stół" },
];

const PAIRINGS = [
  { img: pairSalad, label: "Sałata + oliwa + ocet" },
  { img: pairVeg, label: "Pieczone warzywa + ocet" },
  { img: useMarinade, label: "Marynata do mięsa" },
  { img: useDressing, label: "Sos musztardowo-octowy" },
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-muted-foreground mb-6">
    {children}
  </p>
);

export function VinegarLanding({ product }: { product: VinegarProduct }) {
  const heroImage = product.image_url ?? heroVinegar;

  const scrollToBuy = () => {
    document.getElementById("kup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Naturalnie fermentowany ocet jabłkowy"
        description="Ocet jabłkowy Zdrowotni z jabłek z przydomowego sadu — naturalna fermentacja, wyrazisty smak, prosty skład. Poznaj proces i zastosowania w kuchni."
        canonical={`/product/${product.id}`}
        ogType="product"
        ogImage={product.image_url || undefined}
        jsonLd={[
          productJsonLd({ ...product, image: product.image_url, price: null }),
          breadcrumbJsonLd([
            { name: "Strona główna", url: "/" },
            { name: "Produkty", url: "/#produkty" },
            { name: product.name, url: `/product/${product.id}` },
          ]),
        ]}
      />
      <Header />

      <main>
        {/* ============ 1. HERO ============ */}
        <section className="pt-28 md:pt-36">
          <div className="px-6 md:px-10 lg:px-16 mb-10">
            <Link
              to="/#produkty"
              className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              {t("Produkty")}
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 items-center">
            <div
              id="kup"
              className="px-6 md:px-10 lg:px-16 order-2 lg:order-1 py-12 lg:py-20 max-w-2xl scroll-mt-32"
            >
              <Eyebrow>{t("Zdrowotnia — naturalna fermentacja")}</Eyebrow>
              <h1 className="font-serif text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-7xl text-foreground mb-8 break-words">
                {t("Dobry ocet")}
                <span className="block text-primary">{t("nie musi być idealnie klarowny.")}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8">
                {t("Naturalnie fermentowany ocet jabłkowy o wyrazistym smaku i prostym składzie.")}
              </p>
              <p className="text-[0.7rem] sm:text-xs tracking-[0.2em] uppercase text-foreground/70 mb-10 leading-relaxed">
                {t("naturalna fermentacja")} <span className="text-primary">·</span> jabłka{" "}
                <span className="text-primary">·</span> {t("bez zbędnych dodatków")}
              </p>

              <div className="h-px w-16 bg-primary/50 mb-10" />

              <QuailBuyBox
                productId={product.id}
                productName={product.name}
                imageUrl={product.image_url}
                note="Kwaśny. Żywy w charakterze. Prawdziwy."
              />
            </div>

            <div className="order-1 lg:order-2">
              <img
                src={heroImage}
                alt="Butelka octu jabłkowego Zdrowotnia na drewnianym stole z jabłkami"
                className="w-full h-[52vh] sm:h-[70vh] lg:h-[88vh] object-cover"
              />
            </div>
          </div>
        </section>

        {/* ============ 2. EMOCJE ============ */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal>
              <div>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-10 leading-[1.08]">
                  {t("Czuć, że powstał z jabłek.")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t("Nie jest płaski.")}
                  <br />
                  {t("Nie jest przesadnie łagodny.")}
                  <br />
                  {t("Nie udaje czegoś, czym nie jest.")}
                </p>
                <p className="font-serif text-3xl sm:text-4xl text-primary">
                  {t("Ma smak fermentacji.")}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="zoom-in">
              <img
                src={pouring}
                alt="Ocet jabłkowy nalewany do ceramicznej miseczki"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 3. CO W NIM INNEGO ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-14 max-w-3xl">
                {t("Co sprawia, że taki ocet smakuje inaczej?")}
              </h2>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <ScrollReveal>
                <img
                  src={applesCrate}
                  alt="Jabłka z przydomowego sadu w drewnianej skrzynce"
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover"
                />
              </ScrollReveal>

              <div className="space-y-12">
                {DIFFERENCE.map((d, i) => (
                  <ScrollReveal key={d.label} delay={i * 80}>
                    <div>
                      <h3 className="text-[0.7rem] tracking-[0.3em] uppercase text-foreground mb-3">
                        {t(d.label)}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{t(d.text)}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <ScrollReveal>
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mt-20 max-w-3xl leading-[1.15]">
                {t("To nie niedoskonałość.")}
                <span className="block text-primary">{t("To ślad procesu.")}</span>
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 4. OSAD ============ */}
        <section className="section-padding bg-earth/10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal variant="zoom-in">
              <img
                src={sediment}
                alt="Naturalny osad na dnie butelki octu jabłkowego"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </ScrollReveal>
            <ScrollReveal>
              <div>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-10 leading-[1.08]">
                  {t("Osad?")}
                  <span className="block text-primary">{t("Właśnie tak.")}</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {t("Naturalny ocet może być mętny i może zawierać osad. To efekt naturalnego charakteru produktu i procesu fermentacji. Nie traktujmy tego jako wady wizualnej.")}
                </p>
                <p className="font-serif text-2xl sm:text-3xl text-foreground border-l-2 border-primary/60 pl-6 mb-8 leading-snug">
                  {t("Nie klarujemy wszystkiego tylko po to, żeby wyglądało idealnie na półce.")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("Przed użyciem możesz delikatnie wstrząsnąć butelką.")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 5. SMAK ============ */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal>
              <div>
                <Eyebrow>{t("Smak")}</Eyebrow>
                <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-10">
                  {t("Jak smakuje?")}
                </h2>
                <div className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.15] mb-10">
                  <span className="block text-foreground">{t("kwaśny")}</span>
                  <span className="block text-primary">{t("jabłkowy")}</span>
                  <span className="block text-foreground">{t("wyrazisty")}</span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  {t("To nie słodki napój jabłkowy.")}
                  <br />
                  {t("To prawdziwy ocet.")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("Wyrazisty, kwaśny smak przełamany naturalnym aromatem jabłek.")}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="zoom-in">
              <img
                src={tasteShot}
                alt="Kropla octu jabłkowego na drewnianej łyżce obok przekrojonego jabłka"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 6. NIE TYLKO DO SAŁATKI ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-14 max-w-3xl leading-[1.1]">
                {t("Jedna butelka.")}
                <span className="block text-primary">{t("Mnóstwo zastosowań.")}</span>
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
              {USES.map((u, i) => (
                <ScrollReveal key={u.label} delay={i * 70}>
                  <figure>
                    <img
                      src={u.img}
                      alt={u.label}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover mb-4"
                    />
                    <figcaption>
                      <h3 className="text-[0.65rem] tracking-[0.25em] uppercase text-foreground mb-2">
                        {t(u.label)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(u.text)}</p>
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <p className="mt-12 text-sm text-muted-foreground border-l-2 border-primary/60 pl-6 max-w-2xl">
                {t("Ocet zawsze rozcieńczaj przed piciem. Nie pij go nierozcieńczonego.")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 7. RANO, W KUCHNI ============ */}
        <section className="grid lg:grid-cols-2 items-stretch">
          <ScrollReveal>
            <img
              src={morning}
              alt="Szklanka wody z odrobiną octu jabłkowego w porannym świetle"
              loading="lazy"
              className="w-full h-full min-h-[45vh] object-cover"
            />
          </ScrollReveal>
          <div className="flex items-center bg-secondary/30">
            <ScrollReveal>
              <div className="px-6 md:px-14 lg:px-20 py-20">
                <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-8 leading-[1.1]">
                  {t("Mały rytuał.")}
                  <span className="block text-primary">{t("Wyrazisty początek dnia.")}</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("Nie dlatego, że trzeba.")}
                  <br />
                  {t("Dlatego, że niektórzy po prostu lubią ten kwaśny, świeży smak.")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 8. FERMENTACJA ============ */}
        <section className="section-padding">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollReveal>
              <Eyebrow>{t("Fermentacja")}</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-14">
                {t("Co właściwie dzieje się podczas fermentacji?")}
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <ol className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:gap-6 mb-14">
                {PROCESS.map((step, i) => (
                  <li key={step} className="flex items-center gap-4 sm:gap-6">
                    <span className="font-serif text-lg sm:text-xl text-foreground border border-primary/40 rounded-full px-6 py-3">
                      {t(step)}
                    </span>
                    {i < PROCESS.length - 1 && (
                      <span className="text-primary hidden sm:inline">→</span>
                    )}
                  </li>
                ))}
              </ol>
            </ScrollReveal>

            <ScrollReveal>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t("Fermentacja zmienia smak i charakter produktu. To proces biologiczny, który wymaga czasu i odpowiednich warunków.")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 9. KWASOWOŚĆ ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-10 leading-[1.1]">
                {t("Kwasowość robi w kuchni coś niezwykłego.")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("Podkręca smak.")}
                <br />
                {t("Równoważy tłustość.")}
                <br />
                {t("Przełamuje słodycz.")}
                <br />
                {t("Nadaje potrawom świeżości.")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-14">
                {t("To właśnie dlatego ocet jest jednym z najstarszych i najbardziej uniwersalnych składników kuchennych.")}
              </p>
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.15]">
                {t("Czasem daniu nie brakuje soli.")}
                <span className="block text-primary">{t("Brakuje mu kwasu.")}</span>
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 10. A CO ZE ZDROWIEM ============ */}
        <section className="section-padding">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <Eyebrow>{t("Co bada nauka?")}</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-8">
                {t("Ocet to żywność, nie lekarstwo.")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t("Ocet jabłkowy jest przede wszystkim składnikiem diety.")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("Badania nad octem i kwasem octowym dotyczą m.in. odpowiedzi glikemicznej po posiłkach, ale wyniki nie oznaczają, że ocet może zastępować dietę, leczenie ani zalecenia medyczne.")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 11. NIE MUSI WYGLĄDAĆ IDEALNIE ============ */}
        <section className="section-padding bg-earth/10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal>
              <div>
                <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-10 leading-[1.1]">
                  {t("Prawdziwe jedzenie")}
                  <span className="block text-primary">
                    {t("nie zawsze jest perfekcyjnie przezroczyste.")}
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t("Kolor może się delikatnie różnić.")}
                  <br />
                  {t("Osad może opaść na dno.")}
                  <br />
                  {t("Aromat może zmieniać się między partiami.")}
                </p>
                <p className="font-serif text-4xl sm:text-5xl text-foreground">{t("I bardzo dobrze.")}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="zoom-in">
              <img
                src={backlight}
                alt="Butelka octu jabłkowego pod światło z widoczną naturalną mętnością"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 12. OD JABŁKA DO BUTELKI ============ */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-14 max-w-3xl leading-[1.1]">
                {t("Krótki skład.")}
                <span className="block text-primary">{t("Długi proces.")}</span>
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {JOURNEY.map((s, i) => (
                <ScrollReveal key={s.label} delay={i * 60}>
                  <figure>
                    <img
                      src={s.img}
                      alt={s.label}
                      loading="lazy"
                      className="w-full aspect-[3/4] object-cover mb-3"
                    />
                    <figcaption className="text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground">
                      {t(s.label)}
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 13. Z CZYM POŁĄCZYĆ ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-14">
                {t("Z czym go połączyć?")}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {PAIRINGS.map((p, i) => (
                <ScrollReveal key={p.label} delay={i * 70}>
                  <figure>
                    <img
                      src={p.img}
                      alt={p.label}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover mb-4"
                    />
                    <figcaption className="text-[0.65rem] tracking-[0.25em] uppercase text-foreground">
                      {t(p.label)}
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 14. CHCĘ SPRÓBOWAĆ ============ */}
        <section className="relative">
          <img
            src={tryShot}
            alt="Otwarta butelka octu jabłkowego, łyżka z kroplą octu i przekrojone jabłko"
            loading="lazy"
            className="w-full h-[70vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-earth/80 via-earth/45 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-14 lg:px-24 max-w-2xl">
              <h2 className="font-serif text-4xl sm:text-6xl text-background mb-6 leading-[1.08]">
                {t("Spróbuj tej kwaśności.")}
              </h2>
              <p className="text-lg text-background/80 mb-10">
                {t("Wyrazistej. Jabłkowej. Naturalnej.")}
              </p>
              <button
                onClick={scrollToBuy}
                className="bg-background text-foreground px-10 py-4 text-xs sm:text-sm tracking-[0.25em] uppercase hover:bg-secondary transition-colors"
              >
                {t("Chcę spróbować")}
              </button>
            </div>
          </div>
        </section>

        {/* ============ 15. FINAŁOWE CTA ============ */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal>
              <img
                src={heroImage}
                alt={product.name}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />
            </ScrollReveal>
            <ScrollReveal>
              <div>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-8 leading-[1.08]">
                  {t("Z naszej spiżarni")}
                  <span className="block text-primary">{t("na Twój stół.")}</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t("Naturalnie fermentowany ocet jabłkowy Zdrowotni.")}
                </p>

                <QuailBuyBox
                  productId={product.id}
                  productName={product.name}
                  imageUrl={product.image_url}
                  note="Zdrowotnia — naturalnie dla Ciebie."
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
