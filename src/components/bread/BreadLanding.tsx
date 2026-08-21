import { t } from "@/lib/pageText";
import { usePageText } from "@/hooks/usePageText";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO, productJsonLd, breadcrumbJsonLd } from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { QuailBuyBox } from "@/components/quail/QuailBuyBox";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { img } from "@/lib/pageImages";
import { usePageImages } from "@/hooks/usePageImages";

import breadAsset from "@/assets/product-bread.jpg.asset.json";

const breadCut = breadAsset.url;

interface BreadProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const INGREDIENTS = [
  "mąka żytnia typ 2000",
  "mąka orkiszowa typ 750",
  "siemię lniane",
  "pestki dyni",
  "słonecznik",
  "sól kłodawska",
];

const SOURDOUGH_POINTS = [
  {
    title: "Łatwiejszy do strawienia",
    text: "Długa fermentacja częściowo rozkłada związki obecne w ziarnie i zmienia strukturę ciasta.",
  },
  {
    title: "Więcej z tego, co daje ziarno",
    text: "Fermentacja pomaga ograniczać zawartość kwasu fitynowego, który może utrudniać wykorzystanie niektórych składników mineralnych.",
  },
  {
    title: "Syci naprawdę",
    text: "Żyto, pełnoziarnista mąka i solidna porcja ziaren dostarczają błonnika i sprawiają, że to jest konkretna kromka chleba, a nie napompowana bułka, po której za chwilę znowu szukasz czegoś do jedzenia.",
  },
];

const SEEDS = [
  "Siemię lniane dostarcza błonnika i kwasu alfa-linolenowego (ALA) z rodziny omega-3.",
  "Pestki dyni są źródłem m.in. magnezu, cynku i nienasyconych kwasów tłuszczowych.",
  "Słonecznik wnosi witaminę E, zdrowe tłuszcze i charakterystyczny lekko orzechowy smak.",
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-muted-foreground mb-6">
    {children}
  </p>
);

export function BreadLanding({ product }: { product: BreadProduct }) {
  usePageText("bread");
  usePageImages();
  const heroImage = product.image_url ?? breadCut;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chleb żytni na starym zakwasie"
        description="Chleb żytni Zdrowotni na ponad 10-letnim zakwasie — żyto, ziarna, sól kłodawska. Bez drożdży i polepszaczy. Ciężka, wilgotna, sycąca kromka."
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
        {/* ============ HERO ============ */}
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
              className="px-6 md:px-10 lg:px-16 order-2 lg:order-1 py-12 lg:py-24 max-w-2xl scroll-mt-32"
            >
              <Eyebrow>{t("Z naszego stołu")}</Eyebrow>
              <h1 className="font-serif text-[2.5rem] leading-[1.06] sm:text-6xl lg:text-7xl text-foreground mb-8 break-words hyphens-auto">
                {t("Chleb żytni")}
                <span className="block text-primary">{t("na starym zakwasie")}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[34rem] mb-10">
                {t(
                  "Żyto, żywy zakwas, ziarna i sól. Tyle wystarczy, żeby powstał naprawdę dobry chleb."
                )}
              </p>

              <div className="h-px w-16 bg-primary/50 mb-10" />

              <QuailBuyBox
                productId={product.id}
                productName={product.name}
                imageUrl={product.image_url}
              />

              <p className="mt-10 text-[0.7rem] sm:text-xs tracking-[0.18em] uppercase text-foreground/70 leading-relaxed">
                {t(
                  "mąka żytnia 2000 i 750 · siemię lniane · pestki dyni · słonecznik · sól kłodawska"
                )}
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <img
                src={img(heroImage)}
                alt="Bochenek chleba żytniego na zakwasie od Zdrowotni"
                className="w-full h-[52vh] sm:h-[70vh] lg:h-[88vh] object-cover"
              />
            </div>
          </div>
        </section>

        {/* ============ 1. ZAKWAS ============ */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16">
          <div className="max-w-[1150px] mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal variant="zoom-in">
              <img
                src={img(breadCut)}
                alt="Przekrojony bochenek chleba żytniego z widocznym miękiszem"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </ScrollReveal>
            <ScrollReveal>
              <div className="max-w-[600px]">
                <Eyebrow>{t("Ponad 10 lat historii")}</Eyebrow>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-10 leading-[1.08]">
                  {t("Wszystko zaczyna się od zakwasu.")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {t(
                    "Nasz zakwas żytni ma już ponad 10 lat. Jest żywy, regularnie dokarmiany i to właśnie on odpowiada za charakterystyczny smak, zapach i strukturę naszego chleba."
                  )}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                  {t(
                    "Nie potrzebujemy drożdży ani polepszaczy. Mąka, woda, zakwas i czas robią swoją robotę."
                  )}
                </p>
                <p className="font-serif text-3xl sm:text-4xl text-primary leading-[1.15]">
                  {t("Dobrego chleba nie trzeba poprawiać. Trzeba mu pozwolić powstać.")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 2. SKŁAD ============ */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 bg-secondary/40">
          <div className="max-w-[1150px] mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-14 leading-[1.08] max-w-3xl">
                {t("Skład, który można przeczytać jednym tchem.")}
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <ul className="flex flex-wrap gap-x-10 gap-y-6 mb-14">
                {INGREDIENTS.map((item) => (
                  <li
                    key={item}
                    className="text-base sm:text-lg text-foreground/85 tracking-wide"
                  >
                    {t(item)}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal>
              <div className="h-px w-full bg-border mb-10" />
              <p className="text-base sm:text-lg text-muted-foreground max-w-[600px]">
                {t("Bez polepszaczy. Bez gotowych mieszanek piekarniczych. Bez zbędnych dodatków.")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 3. DLACZEGO ZAKWAS ============ */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16">
          <div className="max-w-[1150px] mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-8 leading-[1.08] max-w-3xl">
                {t("Co właściwie daje zakwas?")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[600px] mb-16">
                {t(
                  "Zakwas nie jest tylko sposobem na wyrośnięcie chleba. Fermentacja zmienia mąkę jeszcze zanim chleb trafi do pieca."
                )}
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-12 md:gap-10 mb-20">
              {SOURDOUGH_POINTS.map((point, i) => (
                <ScrollReveal key={point.title} delay={i * 100}>
                  <div className="border-t border-border pt-6">
                    <h3 className="font-serif text-2xl sm:text-[1.7rem] text-foreground mb-4 leading-snug">
                      {t(point.title)}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {t(point.text)}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary leading-[1.15] max-w-3xl">
                {t("Chleb ma karmić. Nie tylko zajmować miejsce na talerzu.")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 4. ZIARNA ============ */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 bg-secondary/40">
          <div className="max-w-[1150px] mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal variant="zoom-in">
              <img
                src={img(heroImage)}
                alt="Skórka chleba z ziarnami słonecznika, dyni i siemienia lnianego"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover order-1"
              />
            </ScrollReveal>
            <ScrollReveal>
              <div className="max-w-[600px]">
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-[1.08]">
                  {t("Sypiemy hojnie.")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                  {t(
                    "Siemię lniane, pestki dyni i słonecznik nie znalazły się tutaj dla wyglądu. Dodają chlebu smaku, struktury i wartości odżywczej."
                  )}
                </p>
                <ul className="space-y-6">
                  {SEEDS.map((seed) => (
                    <li key={seed} className="border-t border-border pt-5">
                      <p className="text-base text-muted-foreground leading-relaxed">{t(seed)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 5. JEST CHLEB I JEST CHLEB ============ */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16">
          <div className="max-w-[1150px] mx-auto">
            <ScrollReveal>
              <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-foreground mb-14 leading-[1.05]">
                {t("Jest chleb i jest chleb.")}
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <div className="max-w-[600px] space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  {t(
                    "Lekki jak piórko bochenek może wyglądać okazale, ale wielkość chleba nie mówi nic o tym, ile naprawdę jest w środku."
                  )}
                </p>
                <p>
                  {t(
                    "Nasz chleb jest ciężki, wilgotny i konkretny. Jedna kromka wygląda jak kromka i zachowuje się jak posiłek."
                  )}
                </p>
                <p>{t("Nie próbujemy zrobić największego bochenka z najmniejszej ilości mąki.")}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <p className="mt-14 font-serif text-3xl sm:text-4xl lg:text-5xl text-primary leading-[1.15] max-w-3xl">
                {t("Wolimy zrobić chleb, którym naprawdę można się najeść.")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ============ 6. JAK JEŚĆ ============ */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16 bg-secondary/40">
          <div className="max-w-[1150px] mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="max-w-[600px] order-2 lg:order-1">
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-10 leading-[1.08]">
                  {t("A najlepiej?")}
                </h2>
                <p className="font-serif text-2xl sm:text-3xl text-foreground/90 leading-[1.3] mb-10">
                  {t(
                    "Jeszcze lekko ciepły. Gruba kromka. Dobre masło. I właściwie można na tym skończyć."
                  )}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t(
                    "Pasuje do jajek, twarogu, pasztetu, domowych past, zupy albo po prostu do wszystkiego, do czego potrzebujesz porządnej kromki chleba."
                  )}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="zoom-in">
              <img
                src={img(breadCut)}
                alt="Gruba kromka chleba żytniego z masłem"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* ============ FINAŁ ============ */}
        <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16">
          <div className="max-w-[1150px] mx-auto">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.08] mb-8">
                  {t("Taki chleb sami chcemy mieć na stole.")}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t("Dlatego dokładnie taki pieczemy dla Was.")}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <ScrollReveal>
                <img
                  src={img(heroImage)}
                  alt={product.name}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                />
              </ScrollReveal>
              <ScrollReveal>
                <div className="max-w-[600px]">
                  <Eyebrow>{t("Z naszego stołu")}</Eyebrow>
                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-10 leading-[1.08]">
                    {t("Chleb żytni na starym zakwasie")}
                  </h3>
                  <QuailBuyBox
                    productId={product.id}
                    productName={product.name}
                    imageUrl={product.image_url}
                    note="Pieczemy w małych ilościach, świeżo na zamówienie."
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
