import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import { t } from "@/lib/pageText";
import { usePageText } from "@/hooks/usePageText";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import AboutGallery from "@/components/AboutGallery";


import heroTable from "@/assets/home/hero-table.jpg";
import handsEggs from "@/assets/home/hands-eggs.jpg";
import kitchenCorner from "@/assets/home/kitchen-corner.jpg";
import breadCut from "@/assets/home/bread-cut.jpg";
import quails from "@/assets/quail/quails.jpg";
import feedMix from "@/assets/quail/feed-mix.jpg";
import freshEggs from "@/assets/quail/fresh-eggs.jpg";
import kombuchaBrew from "@/assets/kombucha/step-brew.jpg";
import vinegarApples from "@/assets/vinegar/apples.jpg";
import vinegarFerment from "@/assets/vinegar/step-ferment.jpg";
import rabbits from "@/assets/about/rabbits.jpg";
import quailsCare from "@/assets/about/przepiorki-opieka.jpg";
import heroProducts from "@/assets/hero-products.jpg";
import breadAsset from "@/assets/product-bread.jpg.asset.json";
import { img } from "@/lib/pageImages";
import { usePageImages } from "@/hooks/usePageImages";

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

const DashedText = ({ text, className }: { text: string; className?: string }) => {
  const nodes: ReactNode[] = [];
  const regex = /(?<=\s|^)([—–-])(?=\s|$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    nodes.push(text.slice(lastIndex, match.index));
    nodes.push(<span key={match.index}>—</span>);
    lastIndex = match.index + match[0].length;
  }
  nodes.push(text.slice(lastIndex));
  return <span className={className}>{nodes}</span>;
};

const DEFAULT_STORY = [
  "Ona — dietetyk kliniczny z potrzebą karmienia bliskich tak, żeby jedzenie naprawdę służyło zdrowiu i regeneracji.",
  "On — człowiek ziemi, z sercem do rolnictwa i hodowli zwierząt.",
  "One — gromada naszych szkrabów, małych i dużych, ale najukochańszych na świecie.",
];

// Czyści tekst z emotek i podwójnych spacji / łamań linii
const clean = (s: string) =>
  s
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2700}-\u{27BF}]/gu,
      ""
    )
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .trim();


export function AboutLanding() {
  usePageText("about");
  usePageImages();
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

  const stripLabel = (t: string) =>
    t.replace(/^\s*(Ona|On|One)\s*[—–-]\s*/i, "").replace(/^./, (c) => c.toUpperCase());

  const storyTitle = clean(content.story_title || "Nasza droga do Zdrowotni");
  const storyHighlight = clean(content.story_highlight || "Wierzymy, że dobre jedzenie łączy ludzi. Zapraszamy Cię do naszego stołu!");

  const p1 = clean(content.story_paragraph1 || "Ona — dietetyk kliniczny z potrzebą karmienia bliskich tak, żeby jedzenie naprawdę służyło zdrowiu i regeneracji.");
  const p2 = clean(content.story_paragraph2 || "On — człowiek ziemi, z sercem do rolnictwa i hodowli zwierząt, DJ, który puszcza muzykę naszym zwierzakom, a nie tylko na eventach.");

  const p3 = clean(content.story_paragraph3 || "One — gromada naszych szkrabów, małych i dużych, blisko i daleko, ale najukochańszych na świecie. Nasze dzieci dorastają wśród zapachu chleba na zakwasie, dźwięków fermentującej kombuchy i zwierząt, które traktujemy z troską i uważnością.");
  const [oneIntro, afterOne] = p3.split("Nasze dzieci").map((s) => s.trim());
  const childrenQuote = afterOne ? `Nasze dzieci ${afterOne}` : "";

  const p4 = clean(content.story_paragraph4 || "I a propos zwierząt. Dbamy o nie od pierwszych minut życia. Kurki inkubujemy sami w domu (tak, w domu), potem doglądamy ich w odchowalniku, więc od samego początku mamy realny wpływ na to, czym są karmione. Dzięki temu ich jaja są naturalnie bogate w omega-3, a żółtko to prawdziwe wsparcie dla naszego mózgu — bez kapsułek i obietnic z etykiety.");
  const p4Highlight = "Dbamy o nie od pierwszych minut życia.";
  const [p4BeforeHighlight, p4AfterHighlight] = p4.split(p4Highlight).map((s) => s.trim());

  const p5 = clean(content.story_paragraph5 || "Tak samo króliki. Królicze mamy jedzą lepiej niż wielu z nas. I dokładnie to widać w jakości mięsa. Chleb pieczemy na żywym zakwasie, który ma już ponad 10 lat. Dodajemy do niego mnóstwo dobroci - siemię lniane (nasz polski superfood), pestki dyni, słonecznik i sól kłodawska, bez antyzbrylaczy czy innych dodatków.");
  const [rabbitText, afterBread] = p5.split("Chleb pieczemy").map((s) => s.trim());
  const breadText = afterBread ? `Chleb pieczemy ${afterBread}` : "";

  const p6 = clean(content.story_paragraph6 || "Nasz przydomowy sad co roku obdarza nas obficie jabłkami, które nie znają oprysków. To z nich powstaje nasz ocet — żywy, naturalnie fermentowany, z matką octową. Kombucha i ocet… po prostu się rozkręciły — fermentacja zrobiła swoje, a my uznaliśmy, że szkoda byłoby się tym nie podzielić.");
  const p6Highlight = "fermentacja zrobiła swoje";
  const [p6BeforeHighlight, p6AfterHighlight] = p6.split(p6Highlight).map((s) => s.trim());

  const p7 = clean(content.story_paragraph7 || "Nasze produkty powstają dokładnie tak, jak robiły to nasze babcie: bez pośpiechu, bez kombinowania, z sercem i z najlepszych składników. Robimy jedzenie, które sami chcemy mieć na stole.");
  const [p7First, p7Rest] = p7.split("Robimy").map((s) => s.trim());
  const p7RestSentence = p7Rest ? `Robimy ${p7Rest}` : "";

  const p8 = clean(content.story_paragraph8 || "I jeśli pytasz: „gdzie trafisz lepiej?” — my naprawdę nie znamy lepszego miejsca.");


  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <main className="bg-background">
      {/* 1. HERO */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollReveal variant="fade-up">
              <div>
                <Eyebrow>{t("O nas")}</Eyebrow>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground mb-8 break-words hyphens-auto">
                  {t("Zdrowotnia nie zaczęła się od biznesplanu.")}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
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
            <ScrollReveal variant="fade-up">
              <img
                src={img(togetherImage || heroTable)}
                alt="Daria i Marcin — twórcy Zdrowotni"
                className="w-full aspect-[4/5] md:aspect-[4/5] object-cover object-top rounded-sm shadow-card"
                loading="eager"
              />
            </ScrollReveal>
          </div>
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
                    <span className="text-primary leading-relaxed">—</span>
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
                src={img(handsEggs)}
                alt="Ręce zbierające świeże jajka przepiórcze"
                className="w-full aspect-[4/5] object-cover rounded-sm shadow-card"
                loading="lazy"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. NASZA DROGA DO ZDROWOTNI */}
      <section id="nasza-droga" className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-4xl mb-16 md:mb-24 pt-16 md:pt-24">
            <Eyebrow>My</Eyebrow>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-tight">
              {storyTitle}
            </h2>
          </div>

          {/* Top: couple image + three short fragments + quote */}
          <div className="grid lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-20 items-start mb-24 md:mb-32">
            <ScrollReveal variant="fade-right">
              <div className="lg:sticky lg:top-32">
                <img
                  src={img(togetherImage || heroTable)}
                  alt="Daria i Marcin — twórcy Zdrowotni"
                  className="w-full aspect-[4/5] object-cover rounded-sm shadow-card"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fade-left">
              <div className="space-y-12 lg:pt-12">
                <div className="flex gap-6 items-center">
                  <span className="font-serif text-primary text-3xl md:text-4xl shrink-0 w-24">Ona</span>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{stripLabel(p1)}</p>
                </div>
                <div className="flex gap-6 items-center">
                  <span className="font-serif text-primary text-3xl md:text-4xl shrink-0 w-24">On</span>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{stripLabel(p2)}</p>
                </div>
                <div className="flex gap-6 items-center">
                  <span className="font-serif text-primary text-3xl md:text-4xl shrink-0 w-24">One</span>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{stripLabel(oneIntro)}</p>
                </div>
                <div className="pt-4 lg:pt-8">
                  <div className="w-12 h-px bg-primary/40 mb-8" />
                  <p className="font-serif text-2xl md:text-3xl text-foreground leading-snug">
                    {childrenQuote}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Animals: one cohesive section */}
          <div className="my-20 md:my-28">
            <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-start mb-16 md:mb-20">
              <ScrollReveal variant="fade-right">
                <img
                  src={img(quailsCare)}
                  alt="Nasze przepiórki w gospodarstwie"
                  className="w-full aspect-[4/5] object-cover rounded-sm"
                  loading="lazy"
                />
              </ScrollReveal>
              <ScrollReveal variant="fade-left">
                <div className="lg:pt-8">
                  <Eyebrow>{p4BeforeHighlight}</Eyebrow>
                  <h3 className="font-serif text-3xl md:text-4xl text-foreground leading-tight mb-8">
                    {p4Highlight}
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                    <DashedText text={p4AfterHighlight} />
                  </p>
                </div>
              </ScrollReveal>
            </div>
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-start">
              <ScrollReveal variant="fade-right">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl lg:pt-8">
                  <DashedText text={rabbitText} />
                </p>
              </ScrollReveal>
              <ScrollReveal variant="fade-left">
                <img
                  src={img(rabbits)}
                  alt="Nasze króliki"
                  className="w-full aspect-[4/5] object-cover rounded-sm"
                  loading="lazy"
                />
              </ScrollReveal>
            </div>
          </div>

          {/* Bread */}
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-start my-20 md:my-28">
            <ScrollReveal variant="fade-right">
              <img
                src={img(bread)}
                alt="Chleb na żywym zakwasie"
                className="w-full aspect-[4/5] object-cover rounded-sm"
                loading="lazy"
              />
            </ScrollReveal>
            <ScrollReveal variant="fade-left">
              <div className="lg:pt-8 max-w-xl">
                <Eyebrow>{t("Z naszego stołu")}</Eyebrow>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  <DashedText text={breadText} />
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Orchard / fermentation */}
          <ScrollReveal variant="fade-up">
            <div className="my-20 md:my-28">
              <img
                src={img(vinegarFerment)}
                alt="Jabłka podczas naturalnej fermentacji"
                className="w-full aspect-[16/9] md:aspect-[21/9] object-cover rounded-sm mb-10 md:mb-12"
                loading="lazy"
              />
              <div className="max-w-5xl">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                  <DashedText text={p6BeforeHighlight} />
                </p>
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-snug">
                  {p6Highlight}
                  {p6AfterHighlight.startsWith(",") ? "" : ","}{" "}
                  {p6AfterHighlight.replace(/^,\s*/, "")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Final history — editorial rhythm */}
          <ScrollReveal variant="fade-up">
            <div className="my-20 md:my-28 max-w-5xl">
              {/* BLOK 1 — FERMENTACJA */}
              <div className="max-w-[700px]">
                <p className="text-base md:text-[17px] leading-[1.6] text-muted-foreground mb-8">
                  <DashedText text={p6BeforeHighlight} />
                </p>
                <p className="font-serif text-[30px] md:text-[36px] lg:text-[40px] text-foreground leading-[1.15] max-w-[750px]">
                  {p6Highlight}
                  {p6AfterHighlight.startsWith(",") ? "" : ","}{" "}
                  {p6AfterHighlight.replace(/^,\s*/, "")}
                </p>
              </div>

              <div className="my-24 md:my-32" />

              {/* BLOK 2 — NASZA FILOZOFIA */}
              <div className="max-w-[620px]">
                <p className="text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-muted-foreground mb-5">
                  {t("TAK TO ROBIMY")}
                </p>
                <p className="font-serif text-[26px] md:text-[30px] lg:text-[34px] text-foreground leading-[1.15] mb-6">
                  {p7First.split(":").slice(0, 1).join(":")}
                  {p7First.includes(":") ? ":" : ""}
                </p>
                <p className="text-base md:text-[17px] leading-[1.6] text-muted-foreground">
                  {p7First.includes(":") ? p7First.split(":").slice(1).join(":").trim() : ""}{" "}
                  {p7RestSentence}
                </p>
              </div>

              <div className="my-16 md:my-20" />

              {/* BLOK 3 — OSOBISTY DOPISEK */}
              <div className="max-w-[500px]">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-3">
                  {p8.split(" — ").slice(0, 1).join(" — ")}
                  {p8.includes(" — ") ? " —" : ""}
                </p>
                <p className="font-serif text-xl md:text-2xl text-foreground leading-snug">
                  {p8.includes(" — ") ? p8.split(" — ").slice(1).join(" — ") : p8}
                </p>
              </div>

              <div className="my-24 md:my-32" />

              {/* BLOK 4 — FINAŁ */}
              <div className="max-w-[620px]">
                <div className="w-16 h-px bg-primary/60 mb-10" />
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
                  {storyHighlight.split(".").slice(0, 1).join(".")}
                  {storyHighlight.includes(".") ? "." : ""}
                </p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
                  {storyHighlight.includes(".")
                    ? clean(storyHighlight.split(".").slice(1).join(".").replace(/!$/, "").replace(/\.$/, ""))
                    : clean(storyHighlight.replace(/!$/, ""))}
                  .
                </p>
                <Link to="/sklep">
                  <Button variant="outline" size="lg">
                    {t("Zobacz nasze produkty")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>

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
      <section className="relative grid overflow-hidden">
        <img
          src={img(quails)}
          alt="Nasza przepiórka"
          className="col-start-1 row-start-1 w-full h-auto min-h-[34rem] md:min-h-0 object-cover md:object-contain"
          loading="lazy"
        />
        <div className="col-start-1 row-start-1 bg-foreground/60" />
        <div className="container mx-auto px-6 py-24 md:py-32 relative col-start-1 row-start-1 self-center">
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
                src={img(feedMix)}
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
                  src={img(item.img)}
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

      {/* 13 + 14. EMOCJONALNY FINAŁ NA JEDNYM ZDJĘCIU */}
      <section className="relative min-h-[90vh] md:min-h-screen overflow-hidden flex flex-col">
        <img
          src={img(heroProducts)}
          alt="Chleb na zakwasie z domowymi przetworami"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/55 to-foreground/80" />

        {/* Górny blok — rozjaśniona połowa */}
        <div className="relative flex-1 flex items-center justify-center py-24 md:py-32">
          <div className="container mx-auto px-6 text-center">
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
        </div>

        {/* Dolny blok — przyciemniona połowa */}
        <div className="relative flex-1 flex items-center justify-center py-24 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <ScrollReveal variant="fade-up">
              <h2 className="font-serif text-4xl md:text-6xl text-background mb-10">
                {t("To jest nasza Zdrowotnia.")}
              </h2>
              <div className="space-y-1 text-lg text-background/80 mb-4">
                <p>{t("Nie idealna.")}</p>
                <p>{t("Nie przemysłowa.")}</p>
                <p>{t("Nie z historią wymyśloną na potrzeby marketingu.")}</p>
              </div>
              <p className="font-serif text-2xl md:text-3xl text-background mb-12">
                {t("Za to prawdziwa.")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/sklep"
                  className="inline-flex items-center justify-center gap-3 bg-background text-foreground px-8 py-4 text-xs tracking-[0.3em] uppercase hover:bg-background/90 transition-colors"
                >
                  {t("Zobacz, co dziś mamy")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/sklep"
                  className="inline-flex items-center justify-center gap-3 border border-background/60 text-background px-8 py-4 text-xs tracking-[0.3em] uppercase hover:bg-background/10 transition-colors"
                >
                  {t("Poznaj nasze produkty")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </main>
  );
}
