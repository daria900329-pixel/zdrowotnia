import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO, productJsonLd, breadcrumbJsonLd } from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { QuailBuyBox } from "@/components/quail/QuailBuyBox";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import heroKombucha from "@/assets/kombucha/hero.jpg";
import pouring from "@/assets/kombucha/pouring.jpg";
import backlight from "@/assets/kombucha/backlight.jpg";
import bubbles from "@/assets/kombucha/bubbles.jpg";
import bottles from "@/assets/kombucha/bottles.jpg";
import chilled from "@/assets/kombucha/chilled.jpg";
import tasteShot from "@/assets/kombucha/taste.jpg";
import teaLeaves from "@/assets/kombucha/tea.jpg";
import stepBrew from "@/assets/kombucha/step-brew.jpg";
import stepMix from "@/assets/kombucha/step-mix.jpg";
import stepFerment from "@/assets/kombucha/step-ferment.jpg";
import stepTaste from "@/assets/kombucha/step-taste.jpg";
import stepBottling from "@/assets/kombucha/step-bottling.jpg";
import stepChill from "@/assets/kombucha/step-chill.jpg";
import stepTable from "@/assets/kombucha/step-table.jpg";
import whenWarm from "@/assets/kombucha/when-warm.jpg";
import whenEvening from "@/assets/kombucha/when-evening.jpg";
import whenJust from "@/assets/kombucha/when-just.jpg";
import finalShot from "@/assets/kombucha/final.jpg";

interface KombuchaProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const PROCESS = ["herbata", "cukier", "kultura fermentacyjna", "czas", "kombucha"];

const TASTE = ["herbaciana", "kwaśna", "orzeźwiająca", "lekko musująca"];

const FOR_WHOM = [
  {
    label: "Dla miłośników kwaśnych smaków",
    text: "Jeżeli lubisz zakwas, kefir, kiszonki czy naturalne fermentacje — prawdopodobnie zrozumiecie się bardzo szybko.",
  },
  {
    label: "Zamiast kolejnego słodkiego napoju",
    text: "Schłodzona kombucha może być ciekawym elementem codziennego menu.",
  },
  {
    label: "Do posiłku lub osobno",
    text: "Nie potrzebuje specjalnej okazji ani „rytuału wellness”.",
  },
];

const WHEN = [
  { img: stepTable, label: "Do obiadu", text: "jako kwaśny, orzeźwiający napój" },
  { img: whenWarm, label: "W ciepły dzień", text: "dobrze schłodzona" },
  { img: whenEvening, label: "Wieczorem przy stole", text: "zamiast słodkiego napoju" },
  { img: whenJust, label: "Po prostu", text: "kiedy mamy na nią ochotę" },
];

const JOURNEY = [
  { img: stepBrew, label: "Parzymy" },
  { img: stepMix, label: "Przygotowujemy nastaw" },
  { img: stepFerment, label: "Fermentujemy" },
  { img: stepTaste, label: "Obserwujemy" },
  { img: stepBottling, label: "Butelkujemy" },
  { img: stepChill, label: "Schładzamy" },
  { img: stepTable, label: "Trafia do Ciebie" },
];

const CAPACITY_NOTES: Record<number, string> = {
  500: "na spróbowanie",
  750: "na kilka porcji",
  1000: "dla tych, którzy już wiedzą",
  5000: "dla prawdziwych fanów kombuchy",
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);

const formatVolume = (value: number, unit: string) =>
  unit === "ml" && value >= 1000 ? `${value / 1000} l` : `${value} ${unit}`;

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-muted-foreground mb-6">
    {children}
  </p>
);

export function KombuchaLanding({ product }: { product: KombuchaProduct }) {
  const heroImage = product.image_url ?? heroKombucha;
  const [variants, setVariants] = useState<{ value: number; unit: string; price: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("product_variants")
      .select("value, unit, price, promo_price")
      .eq("product_id", product.id)
      .eq("is_active", true)
      .order("value", { ascending: true })
      .then(({ data }) => {
        if (!cancelled && data) {
          setVariants(
            data.map((v) => ({
              value: v.value,
              unit: v.unit,
              price: v.promo_price ?? v.price,
            }))
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const lowestPrice = variants.length ? Math.min(...variants.map((v) => v.price)) : null;

  const scrollToBuy = () => {
    document.getElementById("kup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} — naturalnie fermentowana`}
        description="Kombucha ze Zdrowotni — fermentowany napar herbaciany o kwaśnym, orzeźwiającym smaku. Poznaj proces fermentacji, smak i sposób podania."
        canonical={`/product/${product.id}`}
        ogType="product"
        ogImage={product.image_url || undefined}
        jsonLd={[
          productJsonLd({ ...product, image: product.image_url, price: lowestPrice }),
          breadcrumbJsonLd([
            { name: "Strona główna", url: "/" },
            { name: "Produkty", url: "/#produkty" },
            { name: product.name, url: `/product/${product.id}` },
          ]),
        ]}
      />
      <Header />

      <main className="pb-24 lg:pb-0">
        {/* 1. HERO */}
        <section className="pt-28 md:pt-36">
          <div className="px-6 md:px-10 lg:px-16 mb-10">
            <Link
              to="/#produkty"
              className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Produkty
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 items-center">
            <div
              id="kup"
              className="px-6 md:px-10 lg:px-16 order-2 lg:order-1 py-12 lg:py-20 max-w-2xl scroll-mt-32"
            >
              <Eyebrow>Zdrowotnia — naturalna fermentacja</Eyebrow>
              <h1 className="font-serif text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-7xl text-foreground mb-8 break-words">
                Żywa.
                <span className="block">Kwaśna.</span>
                <span className="block text-primary">Naturalnie inna.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8">
                Fermentowany napar herbaciany o charakterystycznym, orzeźwiającym smaku.
              </p>
              <p className="text-[0.7rem] sm:text-xs tracking-[0.2em] uppercase text-foreground/70 mb-10">
                herbata <span className="text-primary">·</span> fermentacja{" "}
                <span className="text-primary">·</span> czas
              </p>

              <QuailBuyBox
                productId={product.id}
                productName={product.name}
                imageUrl={product.image_url}
                note="Dla tych, którzy nie szukają kolejnego słodkiego napoju."
              />
            </div>

            <div className="order-1 lg:order-2">
              <img
                src={heroImage}
                alt={`${product.name} — butelka i szklanka bursztynowego napoju na drewnianym stole`}
                width={1600}
                height={1200}
                className="w-full h-[52vh] sm:h-[62vh] lg:h-[88vh] object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. ZMYSŁOWA */}
        <section className="py-24 md:py-40 px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <ScrollReveal>
              <img
                src={pouring}
                alt="Kombucha nalewana do cienkiej szklanki, widoczne bąbelki"
                loading="lazy"
                width={1408}
                height={1760}
                className="w-full object-cover"
              />
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-foreground mb-10">
                Najpierw słyszysz.
                <span className="block text-primary">Potem próbujesz.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Ciche syknięcie przy otwarciu.
                <br />
                Delikatne musowanie.
                <br />
                Kwaśny, herbaciany aromat.
                <br />
                I smak, który trudno pomylić z czymkolwiek innym.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={200}>
            <p className="font-serif text-3xl sm:text-5xl lg:text-6xl text-center text-foreground/90 max-w-4xl mx-auto mt-24 md:mt-40 leading-[1.15]">
              Kombucha nie próbuje smakować jak oranżada.
            </p>
          </ScrollReveal>
        </section>

        {/* 3. CO TO WŁAŚCIWIE JEST */}
        <section className="py-24 md:py-32 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <ScrollReveal>
              <Eyebrow>Krótko</Eyebrow>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-10">
                Kombucha?
                <span className="block text-primary">
                  To po prostu herbata, której daliśmy czas.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Powstaje z naparu herbacianego, cukru i kultury mikroorganizmów uczestniczących w
                fermentacji.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Podczas procesu część cukrów zostaje wykorzystana przez mikroorganizmy, a smak
                napoju stopniowo się zmienia: ze słodkiego w kwaśny, złożony i lekko musujący.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="mt-16 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
                {PROCESS.map((step, i) => (
                  <div key={step} className="flex items-center gap-5">
                    <span
                      className={`font-handwritten text-2xl sm:text-3xl ${
                        i === PROCESS.length - 1 ? "text-primary" : "text-foreground/80"
                      }`}
                    >
                      {step}
                    </span>
                    {i < PROCESS.length - 1 && (
                      <span className="text-primary/60 text-xl">→</span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <img
                src={teaLeaves}
                alt="Liście zielonej herbaty w ceramicznej miseczce"
                loading="lazy"
                width={1400}
                height={1000}
                className="w-full mt-16 object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* 4. TAK, DODAJEMY CUKIER */}
        <section className="py-24 md:py-36 px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.1] mb-4">
                Tak. Do kombuchy dodaje się cukier.
              </h2>
              <p className="font-serif text-2xl sm:text-3xl text-primary mb-10">
                Bo bez niego nie byłoby fermentacji.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cukier jest substratem wykorzystywanym podczas procesu fermentacji. Nie twierdzimy,
                że po fermentacji znika w całości — takie deklaracje wymagałyby analizy
                laboratoryjnej gotowego napoju.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mt-16 leading-[1.15]">
                Fermentacja zmienia napój.
                <span className="block text-muted-foreground">Nie działa za pomocą magii.</span>
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 5. ŻYJE SWOIM RYTMEM */}
        <section className="relative">
          <img
            src={backlight}
            alt="Butelka kombuchy pod światło — widoczne zmętnienie i drobny osad"
            loading="lazy"
            width={1600}
            height={1008}
            className="w-full h-[70vh] object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-10 lg:px-16 max-w-3xl">
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-background leading-[1.1] mb-8">
                Naturalna fermentacja
                <span className="block">nie produkuje identycznych butelek.</span>
              </h2>
              <p className="text-background/85 text-lg leading-relaxed">
                Jedna partia może być odrobinę bardziej kwaśna. Inna nieco łagodniejsza. Jedna
                mocniej musująca.
              </p>
              <p className="font-handwritten text-2xl sm:text-3xl text-background mt-8">
                I właśnie to lubimy.
              </p>
            </div>
          </div>
        </section>

        {/* 6. SKĄD TE BĄBELKI */}
        <section className="py-24 md:py-36 px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-8">
                A te bąbelki?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Dwutlenek węgla może powstawać naturalnie podczas fermentacji. Dlatego kombucha może
                mieć delikatne, naturalne musowanie.
              </p>
              <p className="font-serif text-2xl sm:text-3xl text-foreground leading-snug">
                Bąbelki są częścią procesu, a nie efektem robienia „napoju gazowanego”.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <img
                src={bubbles}
                alt="Makrofotografia bąbelków na ściance szklanki"
                loading="lazy"
                width={1408}
                height={1408}
                className="w-full object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* 7. JAK SMAKUJE */}
        <section className="py-24 md:py-36 bg-secondary/30 px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-16">
                Nie pytaj, czy jest słodka.
                <span className="block text-primary">Zapytaj, jak bardzo jest kwaśna.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                {TASTE.map((t) => (
                  <span
                    key={t}
                    className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground/85"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={180}>
              <img
                src={tasteShot}
                alt="Szklanka schłodzonej kombuchy w naturalnym świetle"
                loading="lazy"
                width={1408}
                height={1200}
                className="w-full mt-16 object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* 8. DLA KOGO */}
        <section className="py-24 md:py-36 px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <Eyebrow>Dla kogo</Eyebrow>
              <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-8">
                Dla kogo jest kombucha?
              </h2>
              <p className="font-serif text-2xl sm:text-3xl text-primary mb-16">
                Dla ludzi, którzy lubią, kiedy napój ma charakter.
              </p>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-12">
              {FOR_WHOM.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 100}>
                  <p className="text-[0.65rem] tracking-[0.25em] uppercase text-foreground mb-4">
                    {item.label}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={200}>
              <p className="font-handwritten text-3xl text-foreground/80 mt-16">
                Otwierasz. Nalewasz. Pijesz.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 9. CO ZDROWIE MA Z TYM WSPÓLNEGO */}
        <section className="py-24 md:py-32 bg-secondary/30 px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <Eyebrow>Co bada nauka?</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.15] mb-10">
                Fermentowane nie znaczy „leczy wszystko”.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Kombucha jest fermentowanym napojem herbacianym. Badania naukowe dotyczą m.in. jej
                składu chemicznego, produktów fermentacji, związków pochodzących z herbaty oraz
                mikroorganizmów obecnych w niektórych rodzajach kombuchy.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Jednocześnie ilość i rodzaj mikroorganizmów oraz skład gotowego napoju mogą różnić
                się w zależności od:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "receptury",
                  "czasu fermentacji",
                  "rodzaju herbaty",
                  "warunków procesu",
                  "sposobu przechowywania",
                ].map((li) => (
                  <li key={li} className="flex gap-4">
                    <span className="text-primary">—</span>
                    {li}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground/80 italic mt-10">
                Dlatego nie obiecujemy efektów zdrowotnych. Mówimy o smaku i o procesie.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 10. NIE KAŻDA MUSI SMAKOWAĆ TAK SAMO */}
        <section className="py-24 md:py-36 px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.1] mb-8">
                Nie standaryzujemy natury
                <span className="block text-primary">do ostatniego bąbelka.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fermentacja zależy od czasu i warunków. Dlatego drobne różnice między partiami są
                czymś naturalnym.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <img
                src={bottles}
                alt="Trzy butelki kombuchy obok siebie — różnice w barwie i zmętnieniu"
                loading="lazy"
                width={1600}
                height={1008}
                className="w-full object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* 11. NAJLEPSZA DOBRZE SCHŁODZONA */}
        <section className="relative">
          <img
            src={chilled}
            alt="Zimna butelka kombuchy pokryta skroploną wodą"
            loading="lazy"
            width={1600}
            height={1104}
            className="w-full h-[75vh] object-cover"
          />
          <div className="absolute inset-0 bg-foreground/35" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-background leading-[1.05]">
                Schłódź.
                <span className="block">Otwórz.</span>
                <span className="block">Posłuchaj.</span>
                <span className="block">Nalej.</span>
              </h2>
              <p className="text-background/85 text-lg mt-8 max-w-md mx-auto">
                Kombucha najlepiej pokazuje swój charakter dobrze schłodzona.
              </p>
              <button
                onClick={scrollToBuy}
                className="mt-10 border border-background/70 text-background px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-background hover:text-foreground transition-colors"
              >
                Chcę spróbować ↓
              </button>
            </div>
          </div>
        </section>

        {/* 12. KIEDY JĄ PIJEMY */}
        <section className="py-24 md:py-36 px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-16">
                Kiedy ją pijemy?
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {WHEN.map((w, i) => (
                <ScrollReveal key={w.label} delay={i * 80}>
                  <div className={i === WHEN.length - 1 ? "lg:-mt-10" : ""}>
                    <img
                      src={w.img}
                      alt={w.label}
                      loading="lazy"
                      width={1000}
                      height={1250}
                      className="w-full aspect-[4/5] object-cover mb-5"
                    />
                    <p className="text-[0.65rem] tracking-[0.25em] uppercase text-foreground mb-2">
                      {w.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{w.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 13. OD HERBATY DO BUTELKI */}
        <section className="py-24 md:py-36 bg-secondary/30 px-6 md:px-10 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-16">
                Herbata.
                <span className="block">Fermentacja.</span>
                <span className="block text-primary">Czas.</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
              {JOURNEY.map((s, i) => (
                <ScrollReveal key={s.label} delay={i * 70}>
                  <img
                    src={s.img}
                    alt={s.label}
                    loading="lazy"
                    width={1200}
                    height={1500}
                    className="w-full aspect-[3/4] object-cover mb-4"
                  />
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
                    {s.label}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 14. NIE ŚPIESZYMY JEJ */}
        <section className="py-32 md:py-48 px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-6xl text-foreground mb-12">
                Nie poganiamy fermentacji.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Nie wszystko staje się lepsze, kiedy robi się szybciej.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Kombucha potrzebuje czasu, żeby przestać być po prostu słodką herbatą i nabrać
                własnego charakteru.
              </p>
              <p className="font-serif text-3xl sm:text-5xl text-primary mt-16">
                Dajemy jej ten czas.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 15. PORÓWNANIE */}
        <section className="py-24 md:py-32 bg-secondary/30 px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground text-center mb-16">
                Napój może powstać inaczej.
              </h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-px bg-border">
              <ScrollReveal>
                <div className="bg-background p-10 h-full">
                  <p className="text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground mb-6">
                    Typowy napój
                  </p>
                  <p className="font-serif text-2xl text-foreground/80 leading-snug">
                    Smak komponowany od początku do końca.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="bg-background p-10 h-full">
                  <p className="text-[0.65rem] tracking-[0.25em] uppercase text-primary mb-6">
                    Kombucha
                  </p>
                  <p className="font-serif text-2xl text-foreground leading-snug">
                    Smak zmieniający się podczas fermentacji.
                  </p>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={150}>
              <p className="font-handwritten text-2xl sm:text-3xl text-center text-foreground/80 mt-12">
                Tu proces jest częścią smaku.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 16. A CO TO PŁYWA + 17. OTWIERANIE + 18. PRZECHOWYWANIE */}
        <section className="py-24 md:py-36 px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto space-y-16">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-6">
                    Coś pojawiło się w butelce?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    W naturalnie fermentowanym napoju może pojawić się osad albo drobne struktury
                    związane z procesem fermentacji. Nie musi to oznaczać wady produktu.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Jeśli jednak napój ma nietypowy zapach, oznaki zepsucia, uszkodzone opakowanie
                    albo zachowuje się inaczej niż zwykle —{" "}
                    <Link to="/#kontakt" className="text-primary underline underline-offset-4">
                      napisz do nas
                    </Link>
                    . Sprawdzimy to razem.
                  </p>
                </div>
                <img
                  src={backlight}
                  alt="Kombucha pod światło — naturalny osad w butelce"
                  loading="lazy"
                  width={1600}
                  height={1008}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="border border-primary/40 bg-secondary/40 p-10 md:p-14">
                <p className="text-[0.65rem] tracking-[0.3em] uppercase text-primary mb-6">
                  Ważne — otwieranie
                </p>
                <p className="font-serif text-3xl sm:text-4xl text-foreground mb-6">
                  Otwieraj dobrze schłodzoną.
                </p>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  Naturalna fermentacja może powodować wzrost ciśnienia w butelce. Otwieraj powoli i
                  ostrożnie — to część rytuału, nie ostrzeżenie drobnym drukiem.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <img
                  src={stepChill}
                  alt="Butelki kombuchy w chłodzie"
                  loading="lazy"
                  width={1200}
                  height={1504}
                  className="w-full aspect-[4/5] object-cover"
                />
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-6">
                    Lubi chłód.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Kombucha jest niepasteryzowana, więc przechowuj ją w lodówce i pij dobrze
                    schłodzoną. Trzymaj z dala od światła i ciepła — w cieple fermentacja
                    przyspiesza, a napój staje się bardziej kwaśny i mocniej musujący.
                  </p>
                  <p className="text-sm text-muted-foreground/80 italic">
                    Dokładną datę przydatności znajdziesz na butelce, którą do Ciebie wysyłamy.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 19. POJEMNOŚCI */}
        {variants.length > 0 && (
          <section className="py-24 md:py-32 bg-secondary/30 px-6 md:px-10 lg:px-16">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal>
                <Eyebrow>Pojemności</Eyebrow>
                <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-16">
                  Ile jej chcesz?
                </h2>
              </ScrollReveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
                {variants.map((v, i) => (
                  <ScrollReveal key={`${v.value}-${v.unit}`} delay={i * 80}>
                    <button
                      onClick={scrollToBuy}
                      className="bg-background p-8 md:p-10 w-full h-full text-left hover:bg-secondary/50 transition-colors"
                    >
                      <p className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
                        {formatVolume(v.value, v.unit)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-6">
                        {CAPACITY_NOTES[v.value] ?? "dla Twojego stołu"}
                      </p>
                      <p className="text-xs tracking-[0.2em] uppercase text-primary">
                        {formatPrice(v.price)}
                      </p>
                    </button>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 20. FINAŁ */}
        <section className="relative">
          <img
            src={finalShot}
            alt="Szklanka zimnej kombuchy z bąbelkami obok butelki"
            loading="lazy"
            width={1600}
            height={1104}
            className="w-full h-[85vh] object-cover"
          />
          <div className="absolute inset-0 bg-foreground/45" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 md:px-10 lg:px-16 max-w-2xl">
              <h2 className="font-serif text-4xl sm:text-6xl text-background leading-[1.05] mb-8">
                Ciekawi Cię,
                <span className="block">jak smakuje?</span>
              </h2>
              <p className="text-background/85 text-lg mb-10">
                Najlepszy sposób, żeby się przekonać, jest bardzo prosty.
              </p>
              <button
                onClick={scrollToBuy}
                className="bg-background text-foreground px-12 py-5 text-xs sm:text-sm tracking-[0.25em] uppercase hover:bg-secondary transition-colors"
              >
                Chcę spróbować
              </button>
              <p className="font-handwritten text-2xl text-background/90 mt-10">
                Zdrowotnia — naturalnie dla Ciebie.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky mobile bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border px-5 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.15em] uppercase text-foreground truncate">Kombucha</p>
          {lowestPrice !== null && (
            <p className="text-sm text-muted-foreground">od {formatPrice(lowestPrice)}</p>
          )}
        </div>
        <button
          onClick={scrollToBuy}
          className="shrink-0 bg-foreground text-background px-6 py-3 text-[0.65rem] tracking-[0.2em] uppercase"
        >
          Dodaj
        </button>
      </div>

      <Footer />
    </div>
  );
}
