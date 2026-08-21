import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { t } from "@/lib/pageText";
import { usePageText } from "@/hooks/usePageText";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import AboutGallery from "@/components/AboutGallery";

import heroTable from "@/assets/home/hero-table.jpg";
import handsEggs from "@/assets/home/hands-eggs.jpg";
import kitchenCorner from "@/assets/home/kitchen-corner.jpg";
import quails from "@/assets/quail/quails.jpg";
import feedMix from "@/assets/quail/feed-mix.jpg";
import packing from "@/assets/quail/packing.jpg";
import freshEggs from "@/assets/quail/fresh-eggs.jpg";
import kombuchaBrew from "@/assets/kombucha/step-brew.jpg";
import vinegarApples from "@/assets/vinegar/apples.jpg";
import heroProducts from "@/assets/hero-products.jpg";
import breadAsset from "@/assets/product-bread.jpg.asset.json";

const bread = breadAsset.url;

const THINKING = [
  "Że warto wiedzieć, co się je.",
  "Że sposób karmienia zwierzęcia ma znaczenie.",
  "Że dobry produkt nie potrzebuje dwudziestu składników.",
  "Że fermentacji nie trzeba poganiać.",
  "Że jedzenie może być proste i naprawdę dobre.",
];

const STATEMENTS = [
  { label: "WIEMY, CZYM KARMIMY", text: "Chcemy mieć wpływ na to, co jedzą nasze zwierzęta." },
  { label: "DAJEMY CZAS", text: "Fermentacja, zakwas i naturalne procesy nie lubią pośpiechu." },
  { label: "NIE UDAJEMY IDEALNOŚCI", text: "Kolor, wielkość, osad czy struktura mogą się różnić." },
  { label: "ROBIMY TO, CO SAMI CHCEMY JEŚĆ", text: "To najprostszy filtr jakości." },
];

const SCALE = ["Małe partie.", "Małe stada.", "Codzienna kontrola.", "Dużo pracy ręcznej."];

const WAITING = [
  { label: "Jajka", text: "trzeba zebrać." },
  { label: "Chleb", text: "upiec." },
  { label: "Kombuchę", text: "przefermentować." },
  { label: "Ocet", text: "potrzebuje czasu." },
];

const HOW = ["Czym karmimy.", "Jak przygotowujemy.", "Ile czekamy.", "Dlaczego czasem coś wygląda inaczej."];

const RULES = [
  "Nie sprzedajemy czegoś, czego sami nie chcielibyśmy zjeść.",
  "Nie przyspieszamy procesu tylko po to, żeby szybciej sprzedać.",
  "Nie udajemy, że natura produkuje identyczne rzeczy.",
  "Nie chowamy tego, jak powstaje produkt.",
  "Jeśli czegoś nie wiemy – wolimy to powiedzieć niż wymyślić ładną historię.",
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-muted-foreground mb-6">
    {children}
  </p>
);

const DEFAULT_STORY = [
  "Ona — dietetyk kliniczny z potrzebą karmienia bliskich tak, żeby jedzenie naprawdę służyło zdrowiu i regeneracji.",
  "On — człowiek ziemi, z sercem do rolnictwa i hodowli zwierząt.",
  "One — gromada naszych szkrabów, małych i dużych, ale najukochańszych na świecie.",
];

export function AboutLanding() {
  usePageText("about");
  const { content } = useSiteContent("about_page");
  const [togetherImage, setTogetherImage] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("about_gallery")
      .select("image_url")
      .eq("is_hero", true)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.image_url) setTogetherImage(data.image_url);
      });
  }, []);

  const storyTitle = content.story_title || "Nasza droga do Zdrowotni";
  const storyHighlight = content.story_highlight || "";
  const storyParagraphs: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const val = content[`story_paragraph${i}`];
    if (val) storyParagraphs.push(val);
  }
  if (storyParagraphs.length === 0) storyParagraphs.push(...DEFAULT_STORY);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <main className="bg-background">
      {/* 1. HERO */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <img
          src={heroTable}
          alt="Stół w kuchni Zdrowotni z jajkami, chlebem i ziołami"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="container mx-auto px-6 relative pb-16 pt-40">
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl">
              <Eyebrow>{t("O nas")}</Eyebrow>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground mb-8 break-words hyphens-auto">
                {t("Zdrowotnia nie zaczęła się od biznesplanu.")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {t("Zaczęła się od prostego pytania: czy da się robić jedzenie tak, żeby naprawdę wiedzieć, skąd pochodzi i co do niego trafia?")}
              </p>
              <button
                onClick={() => scrollTo("blizej")}
                className="mt-10 inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-foreground border-b border-primary/60 pb-2 hover:text-primary transition-colors"
              >
                {t("Poznaj nas bliżej")}
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. NIE JESTEŚMY RODZINNĄ FIRMĄ Z TRZECH POKOLEŃ */}
      <section id="blizej" className="py-28 md:py-40">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-5xl leading-tight text-foreground mb-6">
                {t("Nie jesteśmy gospodarstwem z historią od 1927 roku.")}
              </h2>
              <p className="text-lg text-muted-foreground mb-16">
                {t("I nie będziemy udawać, że jesteśmy.")}
              </p>
              <div className="w-16 h-px bg-primary/40 mx-auto mb-16" />
              <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-4">
                {t("Zdrowotnia jest młoda.")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-16">
                {t("Ale sposób, w jaki podchodzimy do jedzenia, nie jest przypadkowy.")}
              </p>
              <p className="font-serif text-2xl md:text-3xl leading-snug text-foreground">
                {t("Zamiast opowiadać legendę, wolimy pokazać, jak naprawdę robimy swoje produkty.")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. CO NAS POŁĄCZYŁO */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fade-right">
              <Eyebrow>{t("Co nas połączyło?")}</Eyebrow>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-10">
                {t("Połączył nas sposób myślenia.")}
              </h2>
              <ul className="space-y-4">
                {THINKING.map((line) => (
                  <li key={line} className="flex gap-4 text-lg text-muted-foreground leading-relaxed">
                    <span className="text-primary mt-1">—</span>
                    <span>{t(line)}</span>
                  </li>
                ))}
              </ul>
              <p className="font-serif text-3xl md:text-4xl text-foreground mt-12">
                {t("Z tego powstała Zdrowotnia.")}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-left">
              <img
                src={handsEggs}
                alt="Ręce zbierające świeże jajka przepiórcze"
                className="w-full aspect-[4/5] object-cover rounded-sm shadow-card"
                loading="lazy"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. NASZA DROGA DO ZDROWOTNI */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal variant="fade-right">
              <div className="lg:sticky lg:top-32">
                <img
                  src={togetherImage || heroTable}
                  alt="Daria i Marcin — twórcy Zdrowotni"
                  className="w-full aspect-[4/5] object-cover rounded-sm shadow-card"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-left">
              <Eyebrow>{t("My")}</Eyebrow>
              <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-10">
                {storyTitle}
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {storyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {storyHighlight && (
                <p className="font-serif text-xl md:text-2xl text-foreground leading-snug mt-10">
                  {storyHighlight}
                </p>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* 6. DOBRE JEDZENIE */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-16 max-w-3xl">
              {t("Dobre jedzenie nie musi być skomplikowane.")}
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {STATEMENTS.map((s, i) => (
              <ScrollReveal key={s.label} variant="fade-up" delay={i * 100}>
                <div className="border-t border-border pt-6">
                  <h3 className="text-sm md:text-base tracking-[0.25em] uppercase text-foreground mb-4">
                    {t(s.label)}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{t(s.text)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ZDROWOTNIA TO NIE FABRYKA */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <img
          src={quails}
          alt="Nasze przepiórki w gospodarstwie"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container mx-auto px-6 relative">
          <ScrollReveal variant="fade-up">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl md:text-5xl text-background leading-tight mb-10">
                {t("Nie chcemy robić więcej. Chcemy robić lepiej.")}
              </h2>
              <ul className="space-y-2 text-lg text-background/85">
                {SCALE.map((line) => (
                  <li key={line}>{t(line)}</li>
                ))}
              </ul>
              <p className="font-serif text-2xl md:text-3xl text-background mt-12">
                {t("Skala nie jest naszym celem. Jakość jest.")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. DLACZEGO BEZ PSZENICY */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant="fade-right">
              <Eyebrow>{t("Żywienie")}</Eyebrow>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8">
                {t("Zaczęliśmy od tego, czym karmimy.")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t("Bo zanim zapytamy, co dostajemy od zwierzęcia, najpierw pytamy, co sami mu dajemy.")}
              </p>
              <p className="font-serif text-xl md:text-2xl text-foreground leading-snug">
                {t("Dlatego w żywieniu naszych przepiórek stosujemy własną mieszankę bez pszenicy.")}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-left">
              <img
                src={feedMix}
                alt="Własna mieszanka paszowa bez pszenicy"
                className="w-full aspect-[4/3] object-cover rounded-sm shadow-card"
                loading="lazy"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 9. NIE WSZYSTKO MAMY ZAWSZE */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">
                {t("Czasem czegoś nie ma.")}
              </h2>
              <p className="text-lg text-muted-foreground mb-14">{t("Bo nie jesteśmy magazynem.")}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {WAITING.map((w, i) => (
              <ScrollReveal key={w.label} variant="fade-up" delay={i * 80}>
                <p className="font-serif text-2xl text-foreground mb-1">{t(w.label)}</p>
                <p className="text-muted-foreground">{t(w.text)}</p>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal variant="fade-up">
            <p className="font-serif text-2xl md:text-3xl text-center text-foreground mt-16">
              {t("I właśnie tak ma być.")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. OD KUCHNI */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 mb-4">
          <ScrollReveal variant="fade-up">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
              {t("Zdrowotnia od kuchni.")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              {t("Nie wszystko wygląda jak sesja produktowa. I bardzo dobrze.")}
            </p>
          </ScrollReveal>
        </div>
        <AboutGallery />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { img: freshEggs, alt: "Świeże jajka przepiórcze" },
              { img: bread, alt: "Chleb na zakwasie" },
              { img: vinegarApples, alt: "Jabłka na ocet" },
              { img: kombuchaBrew, alt: "Nastaw kombuchy" },
            ].map((item, i) => (
              <ScrollReveal key={item.alt} variant="fade-up" delay={i * 80}>
                <img
                  src={item.img}
                  alt={item.alt}
                  className={`w-full object-cover rounded-sm ${i % 3 === 0 ? "aspect-square" : "aspect-[3/4]"}`}
                  loading="lazy"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11. NIE CHCEMY CI NICZEGO WMÓWIĆ */}
      <section className="py-28 md:py-40 bg-secondary/30">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-10">
                {t("Nie chcemy przekonywać Cię, że wszystko u nas jest „najzdrowsze”.")}
              </h2>
              <p className="text-xl text-foreground mb-10">{t("Chcemy pokazać Ci, jak to robimy.")}</p>
              <ul className="space-y-3 text-lg text-muted-foreground mb-12">
                {HOW.map((line) => (
                  <li key={line}>{t(line)}</li>
                ))}
              </ul>
              <p className="font-serif text-2xl md:text-3xl text-foreground">
                {t("A potem decyzja należy do Ciebie.")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 12. ZASADY */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-14">
              {t("Nasze zasady są dość proste.")}
            </h2>
          </ScrollReveal>
          <ol className="max-w-4xl space-y-0">
            {RULES.map((rule, i) => (
              <ScrollReveal key={rule} variant="fade-up" delay={i * 60}>
                <li className="flex gap-6 border-b border-border py-6">
                  <span className="font-serif text-primary text-lg w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg text-muted-foreground leading-relaxed">{t(rule)}</span>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 13. SEKCJA EMOCJONALNA */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <img
          src={kitchenCorner}
          alt="Stół w naszej kuchni"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="container mx-auto px-6 relative text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-10">
              {t("Chcemy po prostu wiedzieć, co stawiamy na stole.")}
            </h2>
            <div className="space-y-1 text-lg text-muted-foreground">
              <p>{t("Dla siebie.")}</p>
              <p>{t("Dla dzieci.")}</p>
              <p>{t("Dla ludzi, którzy kupują od nas.")}</p>
            </div>
            <p className="font-serif text-xl md:text-2xl text-foreground mt-12 max-w-2xl mx-auto">
              {t("I to jest wystarczający powód, żeby robić Zdrowotnię.")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 14. FINAŁ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <img
          src={heroProducts}
          alt="Produkty Zdrowotni"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-foreground/65" />
        <div className="container mx-auto px-6 relative text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="font-serif text-4xl md:text-6xl text-background mb-10">
              {t("To jest nasza Zdrowotnia.")}
            </h2>
            <div className="space-y-1 text-lg text-background/80 mb-4">
              <p>{t("Nie idealna.")}</p>
              <p>{t("Nie przemysłowa.")}</p>
              <p>{t("Nie z historią wymyśloną na potrzeby marketingu.")}</p>
            </div>
            <p className="font-serif text-2xl md:text-3xl text-background mb-12">{t("Za to prawdziwa.")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#produkty"
                className="inline-flex items-center justify-center gap-3 bg-background text-foreground px-8 py-4 text-xs tracking-[0.3em] uppercase hover:bg-background/90 transition-colors"
              >
                {t("Zobacz, co dziś mamy")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/#produkty"
                className="inline-flex items-center justify-center gap-3 border border-background/60 text-background px-8 py-4 text-xs tracking-[0.3em] uppercase hover:bg-background/10 transition-colors"
              >
                {t("Poznaj nasze produkty")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
