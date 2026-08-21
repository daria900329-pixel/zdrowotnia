import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO, productJsonLd, breadcrumbJsonLd } from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { QuailBuyBox } from "@/components/quail/QuailBuyBox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import eggOpen from "@/assets/quail/egg-open.png";
import yolkMacro from "@/assets/quail/yolk-macro.jpg";
import quailsPhoto from "@/assets/quail/quails.jpg";
import kidsHands from "@/assets/quail/kids-hands.jpg";
import eggInHand from "@/assets/quail/egg-in-hand.jpg";
import sizeCompare from "@/assets/quail/size-compare.jpg";
import eatSoft from "@/assets/quail/eat-soft.jpg";
import eatHard from "@/assets/quail/eat-hard.jpg";
import eatSalad from "@/assets/quail/eat-salad.jpg";
import eatLunchbox from "@/assets/quail/eat-lunchbox.jpg";
import eatSnack from "@/assets/quail/eat-snack.jpg";
import feedMix from "@/assets/quail/feed-mix.jpg";
import freshEggs from "@/assets/quail/fresh-eggs.jpg";
import packing from "@/assets/quail/packing.jpg";
import delivery from "@/assets/quail/delivery.jpg";

interface QuailProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const NUTRIENTS_LEFT = [
  {
    label: "Białko",
    text: "pełnowartościowe białko dostarczające aminokwasów potrzebnych m.in. do budowy i regeneracji tkanek",
  },
  {
    label: "Żelazo",
    text: "pierwiastek potrzebny do prawidłowego transportu tlenu i tworzenia czerwonych krwinek",
  },
  {
    label: "Witaminy z grupy B",
    text: "m.in. B12 — ważna dla układu nerwowego i prawidłowego tworzenia krwi",
  },
];

const NUTRIENTS_RIGHT = [
  {
    label: "Fosfor",
    text: "uczestniczy m.in. w utrzymaniu zdrowych kości i prawidłowym metabolizmie energetycznym",
  },
  {
    label: "Selen",
    text: "pierwiastek uczestniczący w ochronie komórek przed stresem oksydacyjnym i prawidłowej pracy tarczycy",
  },
  {
    label: "Cynk",
    text: "ważny dla odporności, skóry i prawidłowego metabolizmu",
  },
  {
    label: "Witamina A",
    text: "ważna m.in. dla prawidłowego widzenia, skóry i funkcjonowania układu odpornościowego",
  },
];

const AUDIENCE = [
  { label: "Dzieci", text: "wartościowy element urozmaiconej diety w okresie wzrostu" },
  { label: "Aktywni", text: "pełnowartościowe białko i składniki odżywcze potrzebne w codziennej diecie" },
  {
    label: "Seniorzy",
    text: "niewielka objętość produktu, a jednocześnie wartościowe źródło składników odżywczych",
  },
];

const FARM_POINTS = [
  {
    label: "Bez pszenicy",
    text: "Nasze przepiórki karmimy autorską mieszanką pasz bez pszenicy.",
  },
  {
    label: "Naturalne składniki",
    text: "Podstawą żywienia są starannie dobrane składniki, zioła i komponenty mineralne.",
  },
  {
    label: "Małe stada",
    text: "Nie jesteśmy przemysłową fermą. Możemy obserwować nasze ptaki i dbać o nie każdego dnia.",
  },
  {
    label: "Rodzinny chów",
    text: "To, co sprzedajemy Tobie, pochodzi z tego samego miejsca, z którego jedzenie trafia na nasz własny stół.",
  },
];

const EAT_IDEAS = [
  { img: eatSoft, label: "Na miękko" },
  { img: eatHard, label: "Na twardo" },
  { img: eatSalad, label: "Do sałatki" },
  { img: eatLunchbox, label: "Do śniadaniówki" },
  { img: eatSnack, label: "Mała przekąska" },
];

const JOURNEY = [
  { img: quailsPhoto, label: "Nasz chów" },
  { img: feedMix, label: "Nasza mieszanka pasz" },
  { img: freshEggs, label: "Świeże jajko" },
  { img: packing, label: "Pakujemy" },
  { img: delivery, label: "Trafia do Ciebie" },
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-muted-foreground mb-6">
    {children}
  </p>
);

export function QuailEggLanding({ product }: { product: QuailProduct }) {
  const heroImage = product.image_url ?? freshEggs;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Jaja przepiórcze z rodzinnego chowu"
        description="Jaja przepiórcze Zdrowotni — od ptaków karmionych autorską mieszanką bez pszenicy. Poznaj skład, biologię i pochodzenie małego jajka."
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
        <section className="pt-28 md:pt-36 pb-0">
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
            <div className="px-6 md:px-10 lg:px-16 order-2 lg:order-1 py-12 lg:py-20 max-w-2xl">
              <Eyebrow>Zdrowotnia — z naszego chowu</Eyebrow>
              <h1 className="font-serif text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[5.2rem] text-foreground mb-8 break-words">
                Małe jajko.
                <span className="block text-primary">Ogromnie dużo dobrego.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8">
                Jaja przepiórcze z naszego rodzinnego chowu, od ptaków karmionych autorską
                mieszanką bez pszenicy.
              </p>
              <p className="text-[0.7rem] sm:text-xs tracking-[0.2em] uppercase text-foreground/70 mb-10 leading-relaxed">
                pełnowartościowe białko <span className="text-primary">·</span> żelazo{" "}
                <span className="text-primary">·</span> witaminy z grupy B{" "}
                <span className="text-primary">·</span> naturalne składniki
              </p>

              <div className="h-px w-16 bg-primary/50 mb-10" />

              <QuailBuyBox
                productId={product.id}
                productName={product.name}
                imageUrl={product.image_url}
              />
            </div>

            <div className="order-1 lg:order-2 relative">
              <img
                src={heroImage}
                alt="Jaja przepiórcze Zdrowotnia"
                className="w-full h-[52vh] sm:h-[70vh] lg:h-[88vh] object-cover"
              />
            </div>
          </div>
        </section>

        {/* ============ 2. INFOGRAFIKA ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto mb-10 md:mb-4">
                <Eyebrow>Skład</Eyebrow>
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] text-foreground mb-4 break-words">
                  Co mieści się w tak małym jajku?
                </h2>
                <p className="text-muted-foreground text-base">
                  Natura potrafi zamknąć zaskakująco dużo w kilkunastu gramach.
                </p>
              </div>
            </ScrollReveal>

            {/* --- desktop: promienie wychodzące dokoła jajka --- */}
            <ScrollReveal>
              <div className="hidden lg:block relative w-full aspect-[16/10] max-w-5xl mx-auto">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 1600 1000"
                  aria-hidden="true"
                >
                  {RADIAL_NUTRIENTS.map((n) => {
                    const dx = n.x - 800;
                    const dy = n.y - 500;
                    const len = Math.hypot(dx, dy);
                    const ux = dx / len;
                    const uy = dy / len;
                    const x1 = 800 + ux * 285;
                    const y1 = 500 + uy * 285;
                    const x2 = 800 + ux * (len - 18);
                    const y2 = 500 + uy * (len - 18);
                    return (
                      <g key={n.label}>
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          className="stroke-primary/50"
                          strokeWidth="1.4"
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle cx={x2} cy={y2} r="5" className="fill-primary/70" />
                      </g>
                    );
                  })}
                </svg>

                <img
                  src={eggOpen}
                  alt="Rozbite jajko przepiórcze z widocznym żółtkiem"
                  loading="lazy"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32%] drop-shadow-[0_25px_45px_rgba(80,60,30,0.18)]"
                />

                {RADIAL_NUTRIENTS.map((n) => (
                  <div
                    key={n.label}
                    className={`absolute w-[24%] ${n.side === "left" ? "text-right" : "text-left"}`}
                    style={{
                      top: `${(n.y / 1000) * 100}%`,
                      transform: "translateY(-50%)",
                      ...(n.side === "left"
                        ? { right: `${100 - (n.x / 1600) * 100 + 1.5}%` }
                        : { left: `${(n.x / 1600) * 100 + 1.5}%` }),
                    }}
                  >
                    <h3 className="text-[0.68rem] tracking-[0.22em] uppercase text-foreground mb-2">
                      {n.label}
                    </h3>
                    <p className="text-[0.8rem] text-muted-foreground leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>



            {/* --- mobile / tablet --- */}
            <div className="lg:hidden">
              <ScrollReveal variant="zoom-in">
                <img
                  src={eggOpen}
                  alt="Rozbite jajko przepiórcze z widocznym żółtkiem"
                  loading="lazy"
                  className="w-56 sm:w-72 mx-auto mb-12 drop-shadow-[0_25px_45px_rgba(80,60,30,0.18)]"
                />
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                {[...NUTRIENTS_LEFT, ...NUTRIENTS_RIGHT].map((n, i) => (
                  <ScrollReveal key={n.label} delay={i * 60}>
                    <h3 className="text-[0.7rem] tracking-[0.25em] uppercase text-foreground mb-2">
                      {n.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{n.text}</p>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground/80 max-w-2xl mx-auto text-center mt-14 md:mt-16 leading-relaxed">
              Jajo to nie pojedynczy wyizolowany składnik. To naturalna matryca białek, tłuszczów,
              witamin i składników mineralnych.
            </p>
          </div>
        </section>


        {/* ============ 3. NIE TYLKO MAKRO ============ */}
        <section className="grid lg:grid-cols-2 items-stretch">
          <div className="order-2 lg:order-1 px-6 md:px-10 lg:px-16 py-20 lg:py-32 flex items-center">
            <div className="max-w-xl">
              <Eyebrow>Biologia</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-8 leading-tight">
                Jajko to znacznie więcej niż białko i kalorie.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Jajo powstaje po to, aby dostarczyć rozwijającemu się organizmowi kompletu
                substancji potrzebnych do wzrostu. Dlatego poza podstawowymi składnikami
                odżywczymi zawiera również naturalnie występujące białka, enzymy oraz inne związki
                o aktywności biologicznej.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative min-h-[45vh]">
            <img
              src={yolkMacro}
              alt="Makro żółtka jaja przepiórczego"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-70 lg:opacity-90" />
          </div>
        </section>

        {/* ============ 4. NAUKOWCY ============ */}
        <section className="bg-earth text-earth-foreground section-padding" id="nauka">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase opacity-60 mb-6">
                Badania
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
                Jajko, którym zainteresowali się naukowcy.
              </h2>
              <p className="font-handwritten text-2xl opacity-80 mb-12">
                I tu robi się naprawdę ciekawie.
              </p>
            </ScrollReveal>

            <div className="space-y-6 text-lg leading-relaxed opacity-90 max-w-3xl">
              <p>
                Bioaktywne składniki pochodzące z jaj przepiórczych były przedmiotem badań
                dotyczących objawów alergicznego nieżytu nosa.
              </p>
              <p>
                W badaniach klinicznych oceniano specjalnie przygotowane preparaty na bazie jaj
                przepiórczych, w części badań łączone z cynkiem.
              </p>
              <p className="text-sm tracking-[0.15em] uppercase opacity-70 pt-4">
                kichanie · świąd nosa · wodnisty katar · uczucie zatkania nosa · objawy ze strony oczu
              </p>
            </div>

            <div className="mt-16 border-t border-earth-foreground/25 pt-12 max-w-3xl">
              <p className="font-serif text-2xl sm:text-3xl mb-6">
                To nie znaczy, że jajko jest lekiem.
              </p>
              <p className="opacity-80 leading-relaxed mb-6">
                Badania dotyczyły konkretnych preparatów i nie pozwalają powiedzieć, że zwykłe
                spożywanie jaj przepiórczych leczy alergię.
              </p>
              <p className="opacity-80 leading-relaxed">
                Pokazują jednak coś fascynującego: jajo przepiórcze jest czymś znacznie bardziej
                biologicznie złożonym niż tylko źródłem kalorii i białka.
              </p>
              <a
                href="#zrodla"
                className="inline-block mt-10 text-xs tracking-[0.25em] uppercase border-b border-earth-foreground/40 pb-1 hover:border-earth-foreground transition-colors"
              >
                Zobacz źródła naukowe ↓
              </a>
            </div>
          </div>
        </section>

        {/* ============ 5. DZIECI ============ */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal variant="fade-right">
              <img
                src={kidsHands}
                alt="Dziecięce dłonie trzymające jaja przepiórcze"
                loading="lazy"
                className="w-full aspect-[4/3] object-cover"
              />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div>
                <Eyebrow>W dziecięcym menu</Eyebrow>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-8 leading-tight">
                  Mały format. Wielkie możliwości w dziecięcym menu.
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <p>
                    Dzieci nie potrzebują „superfoods". Potrzebują prawdziwego, odżywczego
                    jedzenia.
                  </p>
                  <p>
                    Jaja przepiórcze mogą być ciekawym elementem urozmaiconej diety dziecka —
                    dostarczają m.in. pełnowartościowego białka, żelaza, fosforu, cynku, selenu i
                    witamin.
                  </p>
                  <p className="text-foreground">
                    A ich maleńki format ma jeszcze jedną zaletę: dzieci zwyczajnie je uwielbiają.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3 sm:gap-6 mt-16">
            {[
              { img: eatLunchbox, label: "Do śniadaniówki" },
              { img: eatSalad, label: "Do sałatki" },
              { img: eatSoft, label: "Na ciepło" },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 100}>
                <img
                  src={item.img}
                  alt={item.label}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover mb-3"
                />
                <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {item.label}
                </p>
              </ScrollReveal>
            ))}
          </div>

          <p className="max-w-3xl mx-auto text-sm text-muted-foreground/90 mt-14 border-l-2 border-primary/40 pl-5 leading-relaxed">
            Przy rozpoznanej alergii na jaja wprowadzanie jaj innych gatunków należy omówić z
            lekarzem lub dietetykiem.
          </p>
        </section>

        {/* ============ 6. DLA KOGO ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-16 leading-tight max-w-3xl">
                Dla dzieci. Dla dorosłych. Dla seniorów.
                <span className="block text-muted-foreground">Po prostu — dla człowieka.</span>
              </h2>
            </ScrollReveal>

            <div className="divide-y divide-border">
              {AUDIENCE.map((a, i) => (
                <ScrollReveal key={a.label} delay={i * 80}>
                  <div className="py-8 grid sm:grid-cols-[220px_1fr] gap-3 sm:gap-10 items-baseline">
                    <h3 className="text-xs tracking-[0.25em] uppercase text-foreground">
                      {a.label}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{a.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="pt-16">
                <h3 className="text-xs tracking-[0.25em] uppercase text-foreground mb-6">
                  Każdy, kto chce jeść lepiej
                </h3>
                <p className="font-serif text-2xl sm:text-4xl lg:text-[2.75rem] leading-snug text-foreground max-w-4xl">
                  bo wartościowa dieta nie musi zaczynać się od suplementu.
                  <span className="text-primary"> Może zacząć się od jedzenia.</span>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 7. CHÓW ============ */}
        <section className="relative">
          <div className="relative h-[60vh] lg:h-[80vh]">
            <img
              src={quailsPhoto}
              alt="Przepiórki w naszym rodzinnym chowie"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 lg:px-16 pb-12 lg:pb-20">
              <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-background/70 mb-4">
                Ale dla nas liczy się nie tylko to, co jest w jajku
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-background max-w-3xl leading-tight">
                Wiemy, skąd pochodzi każde nasze jajko.
              </h2>
            </div>
          </div>

          <div className="px-6 md:px-10 lg:px-16 py-16 lg:py-24">
            <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
              {FARM_POINTS.map((p, i) => (
                <ScrollReveal key={p.label} delay={i * 80}>
                  <div className="border-t border-border pt-6">
                    <h3 className="text-xs tracking-[0.25em] uppercase text-foreground mb-4">
                      {p.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 8. EMOCJE ============ */}
        <section className="px-6 md:px-10 lg:px-16 py-28 lg:py-44">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollReveal variant="zoom-in">
              <img
                src={eggInHand}
                alt="Jajko przepiórcze na dłoni"
                loading="lazy"
                className="w-full max-w-md mx-auto aspect-[4/3] object-cover mb-16"
              />
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-foreground leading-[1.15] mb-12">
                Nie chcieliśmy produkować więcej.
                <span className="block text-primary">Chcieliśmy produkować lepiej.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Dlatego w Zdrowotni najpierw pytamy, czym nakarmimy zwierzę. Dopiero później — co
                otrzymamy od niego dla siebie.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 9. JAK JEŚĆ ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <Eyebrow>W kuchni</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-14">
                Jedno jajko. Mnóstwo pomysłów.
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {EAT_IDEAS.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 80}>
                  <img
                    src={item.img}
                    alt={item.label}
                    loading="lazy"
                    className="w-full aspect-[3/4] object-cover mb-3"
                  />
                  <p className="text-[0.65rem] sm:text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    {item.label}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 10. WIELKOŚĆ ============ */}
        <section className="section-padding">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <img
                src={sizeCompare}
                alt="Porównanie: jedno jajko kurze i pięć jaj przepiórczych"
                loading="lazy"
                className="w-full object-cover mb-12"
              />
              <div className="grid md:grid-cols-2 gap-8 items-end">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">
                  Małe naprawdę znaczy małe.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Jedno jajko przepiórcze waży przeciętnie około 10–12 g.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 11. DROGA ============ */}
        <section className="section-padding bg-secondary/40">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-14">
                Od naszej przepiórki do Twojego stołu
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {JOURNEY.map((step, i) => (
                <ScrollReveal key={step.label} delay={i * 80}>
                  <div>
                    <img
                      src={step.img}
                      alt={step.label}
                      loading="lazy"
                      className="w-full aspect-square object-cover mb-4"
                    />
                    <span className="text-[0.65rem] tracking-[0.25em] uppercase text-primary">
                      0{i + 1}
                    </span>
                    <p className="text-sm text-foreground mt-1">{step.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 12. ŹRÓDŁA ============ */}
        <section className="section-padding" id="zrodla">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="sources" className="border-t border-b border-border">
                <AccordionTrigger className="text-xs sm:text-sm tracking-[0.25em] uppercase py-8 hover:no-underline">
                  Na czym opieramy informacje?
                </AccordionTrigger>
                <AccordionContent className="pb-10">
                  <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
                    <div>
                      <h3 className="text-xs tracking-[0.2em] uppercase text-foreground mb-2">
                        Wartość odżywcza i skład jaj przepiórczych
                      </h3>
                      <p>
                        Tabele składu i wartości odżywczej żywności (m.in. baza USDA FoodData
                        Central, pozycja „Egg, quail, whole, fresh, raw") oraz opracowania
                        przeglądowe dotyczące składu jaj ptaków hodowlanych.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs tracking-[0.2em] uppercase text-foreground mb-2">
                        Bioaktywne białka jaj
                      </h3>
                      <p>
                        Prace przeglądowe dotyczące białek jaja i ich aktywności biologicznej, m.in.
                        Kovacs-Nolan J., Phillips M., Mine Y., „Advances in the value of eggs and egg
                        components for human health", Journal of Agricultural and Food Chemistry.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs tracking-[0.2em] uppercase text-foreground mb-2">
                        Preparaty na bazie jaj przepiórczych a alergiczny nieżyt nosa
                      </h3>
                      <p>
                        Badania kliniczne oceniające standaryzowane preparaty z jaj przepiórczych
                        (w części łączone z cynkiem) w kontekście objawów alergicznego nieżytu nosa —
                        m.in. Benichou A.C. i wsp., „A proprietary blend of quail egg for the
                        attenuation of nasal provocation with a standardized allergenic challenge",
                        Food Science & Nutrition.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground/80 pt-2">
                      Informacje mają charakter edukacyjny i nie zastępują porady lekarza ani
                      dietetyka.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* ============ 13. FINAŁOWE CTA ============ */}
        <section className="grid lg:grid-cols-2 items-center bg-secondary/40">
          <div className="relative h-[45vh] lg:h-[85vh]">
            <img
              src={heroImage}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="px-6 md:px-10 lg:px-16 py-16 lg:py-24">
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-[1.05]">
                Małe jajko.
                <span className="block text-primary">Dobry wybór.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Od naszych przepiórek. Dla Twojej rodziny.
              </p>

              <QuailBuyBox
                productId={product.id}
                productName={product.name}
                imageUrl={product.image_url}
              />

              <div className="mt-10 pt-8 border-t border-border text-sm text-muted-foreground space-y-1">
                <p>Dostępne — pakowane po zamówieniu, prosto z gospodarstwa.</p>
                <p>Dostawa lub odbiór osobisty zgodnie z ustaleniami przy zamówieniu.</p>
              </div>

              <div className="mt-12">
                <p className="font-serif text-xl text-foreground">Zdrowotnia</p>
                <p className="font-handwritten text-lg text-muted-foreground">
                  Naturalnie dla Ciebie.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default QuailEggLanding;
