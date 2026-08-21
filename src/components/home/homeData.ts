import breadCut from "@/assets/home/bread-cut.jpg";
import kombuchaEditorial from "@/assets/home/kombucha-editorial.jpg";
import vinegarEditorial from "@/assets/home/vinegar-editorial.jpg";
import freshEggs from "@/assets/quail/fresh-eggs.jpg";

export interface HomeProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  badge: string | null;
  display_order: number;
}

export interface ProductStory {
  eyebrow: string;
  headline: string;
  lead: string;
  tags: string[];
  cta: string;
  edu?: string;
  image?: string;
  scale?: "large" | "small";
}

/** Redakcyjne historie produktów — klucz to id produktu w bazie. */
export const PRODUCT_STORIES: Record<string, ProductStory> = {
  // Jajka przepiórcze
  "c04e492a-fe9f-461f-bc06-a5bb0539b58f": {
    eyebrow: "Z naszego chowu",
    headline: "Małe jajko.\nOgromnie dużo dobrego.",
    lead: "Od przepiórek karmionych naszą własną mieszanką, bez pszenicy.",
    tags: ["karmione bez pszenicy", "rodzinny chów", "świeże"],
    cta: "Poznaj te jajka",
    edu: "Dlaczego te maleńkie jajka są tak interesujące?",
    image: freshEggs,
    scale: "large",
  },
  // Chleb żytni na zakwasie
  "bee5ca9b-4bc6-4241-8222-6d49b7c1b44e": {
    eyebrow: "Prosto z pieca",
    headline: "Chleb, któremu daliśmy czas.",
    lead: "Naturalny zakwas. Powolne wyrastanie. Prosty skład.",
    tags: ["żytni zakwas", "długa fermentacja", "małe wypieki"],
    cta: "Poznaj nasz chleb",
    edu: "Co zmienia długi proces fermentacji?",
    image: breadCut,
    scale: "large",
  },
  // Kombucha z zielonej herbaty
  "bbc312f2-a276-4cdc-a34d-880e95b26064": {
    eyebrow: "Żywa fermentacja",
    headline: "Żywa. Kwaśna.\nNaturalnie inna.",
    lead: "Zielona herbata, grzybek kombuchy i czas. Fermentacja robi resztę — dlatego każda partia smakuje trochę po swojemu.",
    tags: ["fermentowana powoli", "bez sztucznych aromatów", "małe partie"],
    cta: "Zobacz kombuchę",
    edu: "Co właściwie dzieje się podczas fermentacji?",
    image: kombuchaEditorial,
  },
  // Kombucha z opuncją
  "59baca9b-5095-4a5e-bcf5-ddaf744a17e3": {
    eyebrow: "Wariant sezonowy",
    headline: "Ta sama kombucha.\nInny nastrój.",
    lead: "Zielona herbata z dodatkiem opuncji — łagodniejsza, z wyraźnym kolorem.",
    tags: ["sezonowo", "małe partie", "żywa kultura"],
    cta: "Zobacz ten wariant",
  },
  // Ocet jabłkowy
  "ed5cb95d-4e3a-478c-8134-534838d09823": {
    eyebrow: "Z przydomowego sadu",
    headline: "Dobry ocet nie musi być\nidealnie klarowny.",
    lead: "Naturalnie fermentowany ocet jabłkowy, niepasteryzowany, z żywą matką octową.",
    tags: ["niepasteryzowany", "z naszych jabłek", "żywa matka octowa"],
    cta: "Poznaj go",
    image: vinegarEditorial,
  },
};

export const defaultStory = (p: HomeProduct): ProductStory => ({
  eyebrow: "Z naszej spiżarni",
  headline: p.name,
  lead: p.description?.split("\n")[0] ?? "",
  tags: ["małe partie", "naturalnie", "od nas"],
  cta: "Zobacz produkt",
});

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);
