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
import { img } from "@/lib/pageImages";
import { usePageImages } from "@/hooks/usePageImages";

interface VinegarProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const POTENTIAL = [
  { label: "Glukoza", dir: "↓", text: "łagodniejsza odpowiedź po posiłku" },
  { label: "Insulina", dir: "↓", text: "mniejsza odpowiedź poposiłkowa" },
  { label: "Sytość", dir: "↑", text: "może utrzymywać się dłużej" },
  { label: "Masa ciała", dir: "↓", text: "niewielki, ale obserwowany w badaniach efekt" },
  { label: "Cholesterol", dir: "↓", text: "obserwowany wpływ na cholesterol całkowity" },
];

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
  usePageText("vinegar");
  usePageImages();
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
                src={img(heroImage, "12go65mqn17jo")}
                alt="Butelka octu jabłkowego Zdrowotnia na drewnianym stole z jabłkami"
                className="w-full h-[52vh] sm:h-[70vh] lg:h-[88vh] object-cover"
              />
            </div>
          </div>
        </section>

        {/* ============ 1B. DLACZEGO OCET — NAUKA ============ */}
        <section className="section-padding bg-secondary/30">
          <div className="max-w-[1150px] mx-auto">
            <ScrollReveal>
              <Eyebrow>{t("Niepozorna butelka. Dużo ciekawej fizjologii.")}</Eyebrow>
              <h2 className="font-serif text-[2.4rem] leading-[1.06] sm:text-6xl lg:text-7xl text-foreground mb-10">
                {t("Jedna łyżka.")}
                <span className="block text-primary">{t("Zaskakująco dużo możliwości.")}</span>
              </h2>
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-5xl">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("Głównym bohaterem octu jest kwas octowy. I okazuje się, że nauka przygląda mu się znacznie szerzej niż tylko jako składnikowi nadającemu kwaśny smak.")}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("Badania nad octem dotyczą między innymi odpowiedzi glukozy i insuliny po posiłku, sytości, masy ciała, cholesterolu oraz ciśnienia.")}
                </p>
              </div>
            </ScrollReveal>

            {/* typograficzne zestawienie */}
            <div className="mt-20 border-t border-foreground/10">
              {POTENTIAL.map((p, i) => (
                <ScrollReveal key={p.label} delay={i * 70}>
                  <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2 md:gap-12 items-baseline py-7 md:py-9 border-b border-foreground/10">
                    <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
                      {t(p.label)}
                      <span className="font-sans text-primary ml-3 text-2xl sm:text-3xl align-baseline">
                        {p.dir}
                      </span>
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {t(p.text)}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
              <ScrollReveal>
                <p className="pt-7 text-sm text-muted-foreground/80 italic">
                  {t("+ badania wskazują również na niewielki wpływ na ciśnienie skurczowe")}
                </p>
              </ScrollReveal>
            </div>

            {/* posiłek */}
            <div className="mt-24 md:mt-32">
              <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto">
                  <Eyebrow>{t("Najciekawsze dzieje się przy stole")}</Eyebrow>
                  <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-foreground leading-[1.08] mb-6">
                    {t("Ten sam posiłek.")}{" "}
                    <span className="text-primary">{t("Łagodniejsza odpowiedź organizmu.")}</span>
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {t("Ocet spożywany w okolicy posiłku może zmniejszać poposiłkowy wzrost glukozy i insuliny — szczególnie wtedy, gdy na talerzu pojawiają się węglowodany.")}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="zoom-in">
                <figure className="mt-12 sm:mt-16">
                  <svg viewBox="0 0 1000 620" className="w-full h-auto" role="img"
                       aria-label="Schemat: łagodniejsza krzywa odpowiedzi glikemicznej po posiłku z octem">
                    <defs>
                      <linearGradient id="vinegarFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
                      </linearGradient>
                      <linearGradient id="plainFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.09" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                      </linearGradient>
                      <marker id="axisArrow" markerWidth="8" markerHeight="8" refX="6" refY="3"
                              orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
                      </marker>
                    </defs>

                    {/* osie */}
                    <g className="text-foreground/40">
                      <line x1="120" y1="500" x2="960" y2="500" stroke="currentColor" strokeWidth="1.5"
                            markerEnd="url(#axisArrow)" />
                      <line x1="120" y1="500" x2="120" y2="60" stroke="currentColor" strokeWidth="1.5"
                            markerEnd="url(#axisArrow)" />
                    </g>

                    {/* obszary pod krzywymi */}
                    <g className="text-foreground">
                      <path d="M120 494 C 220 490, 250 380, 320 240 C 370 140, 430 120, 500 165 C 590 222, 660 380, 760 445 C 840 480, 900 492, 950 494 L 950 500 L 120 500 Z"
                            fill="url(#plainFill)" />
                    </g>
                    <path d="M120 494 C 230 492, 290 470, 360 400 C 420 340, 470 320, 520 330 C 610 348, 680 420, 780 462 C 860 490, 910 494, 950 496 L 950 500 L 120 500 Z"
                          fill="url(#vinegarFill)" />

                    {/* krzywe */}
                    <path d="M120 494 C 220 490, 250 380, 320 240 C 370 140, 430 120, 500 165 C 590 222, 660 380, 760 445 C 840 480, 900 492, 950 494"
                          fill="none" stroke="currentColor" strokeWidth="3"
                          className="text-foreground/35" strokeDasharray="14 12" strokeLinecap="round" />
                    <path d="M120 494 C 230 492, 290 470, 360 400 C 420 340, 470 320, 520 330 C 610 348, 680 420, 780 462 C 860 490, 910 494, 950 496"
                          fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" />

                    {/* legenda */}
                    <g>
                      <line x1="800" y1="112" x2="860" y2="112" stroke="currentColor" strokeWidth="2.5"
                            className="text-foreground/35" strokeDasharray="10 8" strokeLinecap="round" />
                      <text x="876" y="117" className="fill-current text-foreground/60"
                            style={{ fontSize: "20px", letterSpacing: "0.06em" }}>{t("bez octu")}</text>
                      <line x1="800" y1="152" x2="860" y2="152" stroke="hsl(var(--primary))"
                            strokeWidth="3.5" strokeLinecap="round" />
                      <text x="876" y="158" className="fill-current text-primary"
                            style={{ fontSize: "20px", letterSpacing: "0.06em" }}>{t("z octem")}</text>
                    </g>

                    {/* opis osi Y */}
                    <text x="14" y="290" className="fill-current text-foreground/55 font-serif italic"
                          style={{ fontSize: "20px" }}>
                      <tspan x="14" dy="0">{t("poziom")}</tspan>
                      <tspan x="14" dy="26">{t("glukozy")}</tspan>
                      <tspan x="14" dy="26">{t("we krwi")}</tspan>
                    </text>

                    {/* opisy osi X */}
                    <text x="124" y="534" className="fill-current text-foreground/50"
                          style={{ fontSize: "17px", letterSpacing: "0.18em" }}>{t("POSIŁEK")}</text>
                    <text x="884" y="534" className="fill-current text-foreground/50"
                          style={{ fontSize: "17px", letterSpacing: "0.18em" }}>{t("CZAS")}</text>

                    {/* adnotacja */}
                    <path d="M700 300 C 690 340, 682 366, 676 382" fill="none" stroke="hsl(var(--primary))"
                          strokeWidth="2" markerEnd="url(#axisArrow)" className="text-primary" />
                    <text x="716" y="292" className="fill-current text-primary font-serif italic"
                          style={{ fontSize: "22px" }}>
                      <tspan x="716" dy="0">{t("Łagodniejszy")}</tspan>
                      <tspan x="716" dy="30">{t("wzrost. Spokojniejszy")}</tspan>
                      <tspan x="716" dy="30">{t("powrót do równowagi.")}</tspan>
                    </text>
                  </svg>
                  <figcaption className="mt-6 text-center text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
                    {t("Mniejszy poposiłkowy wzrost glukozy i insuliny — to jeden z najlepiej przebadanych efektów spożywania octu.")}
                    <span className="block mt-2 text-xs text-muted-foreground/60">
                      {t("Schemat poglądowy. Nie przedstawia konkretnych wartości ani wyników badań.")}
                    </span>
                  </figcaption>
                </figure>
              </ScrollReveal>
            </div>


            {/* sytość i masa ciała */}
            <div className="mt-24 md:mt-32 max-w-4xl">
              <ScrollReveal>
                <Eyebrow>{t("A co z apetytem i wagą?")}</Eyebrow>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t("Ocet nie odchudza za nas. Ale badania sugerują, że może wpływać na odczuwanie sytości, a w części badań i metaanaliz obserwowano również niewielkie zmniejszenie masy ciała.")}
                </p>
                <p className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-foreground leading-[1.2]">
                  {t("Mały element diety, który może działać w tę samą stronę co Ty.")}
                </p>
              </ScrollReveal>
            </div>

            {/* finał */}
            <div className="mt-28 md:mt-40 text-center">
              <ScrollReveal>
                <p className="font-serif text-[3rem] sm:text-7xl lg:text-8xl leading-[1.02] text-foreground">
                  {t("Nie cud.")}
                  <span className="block text-primary">{t("Kwas octowy.")}</span>
                </p>
                <p className="mt-10 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  {t("I całkiem sporo nauki za niepozorną łyżką octu.")}
                </p>
              </ScrollReveal>

              <ScrollReveal>
                <div className="mt-20 md:mt-28">
                  <div className="h-px w-16 bg-primary/50 mx-auto mb-10" />
                  <p className="font-serif text-2xl sm:text-3xl text-foreground/80 max-w-2xl mx-auto leading-snug">
                    {t("Tyle potrafi ocet.")}
                    <span className="block">
                      {t("A teraz zobacz, dlaczego nasz nie jest po prostu octem z półki.")}
                    </span>
                    <span className="block mt-4">
                      {t("Bo sklepowy ocet najczęściej jest filtrowany i pasteryzowany. Naszego nie „poprawiamy” po fermentacji — pozostaje niepasteryzowany, niefiltrowany, naturalnie mętny i z matką octową, co umacnia jego właściwości.")}
                    </span>
                  </p>
                </div>
              </ScrollReveal>
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
                src={img(pouring, "1qhx1aude41hy")}
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
                  src={img(applesCrate, "1iw9rt91f0k62t")}
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
                src={img(sediment, "87qhwq1yemcus")}
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
                src={img(tasteShot, "190hea2pjbdyu")}
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
                      src={img(u.img, "1tn4dvcayqc6u")}
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
              src={img(morning, "19vpkbrfaxt0h")}
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
                src={img(backlight, "1ct0o2pzigv4")}
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
                      src={img(s.img, "1fzq1dv1a0xm1n")}
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
                      src={img(p.img, "f0kqv71iu7mpz")}
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
            src={img(tryShot, "o361sh15npffh")}
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
                src={img(heroImage, "541wec11np14w")}
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
