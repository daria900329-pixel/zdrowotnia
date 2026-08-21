/**
 * Skanuje komponenty stron i wyciąga wszystkie edytowalne teksty do rejestru,
 * ZACHOWUJĄC kolejność występowania na stronie i dzieląc je na sekcje
 * (na podstawie komentarzy sekcyjnych w kodzie).
 *
 * Uruchomienie: node scripts/extract-page-texts.mjs
 */
import fs from "node:fs";
import path from "node:path";

const PAGES = [
  {
    key: "home",
    label: "Strona główna",
    preview: "/",
    files: [
      ["src/components/home/HomeHero.tsx", "Hero"],
      ["src/components/home/Philosophy.tsx", "Filozofia"],
      ["src/components/home/homeData.ts", "Opisy produktów (kafelki)"],
      ["src/components/home/StoryProducts.tsx", "Produkty — sekcja editorial"],
      ["src/components/home/TodaySection.tsx", "Dzisiaj w Zdrowotni"],
      ["src/components/home/FeedSection.tsx", "Wiemy, czym karmimy"],
      ["src/components/home/JourneySection.tsx", "Od nas do Ciebie"],
      ["src/components/home/FromDaria.tsx", "Od Darii"],
      ["src/components/home/NotPerfect.tsx", "Nie musi być idealne"],
      ["src/components/home/KitchenGallery.tsx", "Galeria"],
      ["src/components/home/ShopGrid.tsx", "Sklep — lista produktów"],
      ["src/components/home/FinalStatement.tsx", "Finał"],
    ],
  },
  {
    key: "quail",
    label: "Jaja przepiórcze",
    preview: "/product/c04e492a-fe9f-461f-bc06-a5bb0539b58f",
    files: [
      ["src/components/quail/QuailEggLanding.tsx", null],
      ["src/components/quail/QuailBuyBox.tsx", "Panel zakupu"],
    ],
  },
  {
    key: "vinegar",
    label: "Ocet jabłkowy",
    preview: "/product/ed5cb95d-4e3a-478c-8134-534838d09823",
    files: [["src/components/vinegar/VinegarLanding.tsx", null]],
  },
  {
    key: "bread",
    label: "Chleb żytni",
    preview: "/product/bee5ca9b-4bc6-4241-8222-6d49b7c1b44e",
    files: [["src/components/bread/BreadLanding.tsx", null]],
  },
  {
    key: "kombucha",
    label: "Kombucha",
    preview: "/product/59baca9b-5095-4a5e-bcf5-ddaf744a17e3",
    files: [["src/components/kombucha/KombuchaLanding.tsx", null]],
  },
  {
    key: "about",
    label: "O nas",
    preview: "/o-nas",
    files: [["src/components/about/AboutLanding.tsx", null]],
  },
];

function textId(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < normalized.length; i++) {
    const c = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 + c, 2246822519) >>> 0;
  }
  return h1.toString(36) + h2.toString(36);
}

const CALL = /\bt\(\s*("(?:[^"\\]|\\.)*")\s*\)/g;
const FIELD = /\b(?:label|text|title|heading|quote|caption|body|note|answer|question)\s*:\s*("(?:[^"\\]|\\.)*")/g;
const CONST_ARRAY = /^const ([A-Z_0-9]+)(?::[^=]+)? = \[([\s\S]*?)^\];$/gm;

/** Komentarz sekcyjny: {/* ==== 3. COŚ ==== *␘/} lub {/* 3. COŚ *␘/} */
const SECTION_COMMENT = /\{\/\*\s*=*\s*([^*]+?)\s*=*\s*\*\/\}/g;

function prettyLabel(raw) {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  const upperRatio =
    cleaned.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "").length === 0
      ? 0
      : cleaned.replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, "").length /
        cleaned.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "").length;
  if (upperRatio < 0.7) return cleaned;
  const lower = cleaned.toLocaleLowerCase("pl");
  return lower.replace(/(^|\d+\.\s*)([a-ząćęłńóśźż])/, (m, p, c) => p + c.toLocaleUpperCase("pl"));
}

/** Czy komentarz wygląda na znacznik sekcji strony (a nie zwykły komentarz w kodzie)? */
function isSectionMarker(raw) {
  const c = raw.trim();
  if (c.length < 3 || c.length > 80) return false;
  if (c.startsWith("---") || c.startsWith("//")) return false;
  const letters = c.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "");
  if (!letters) return false;
  const upper = c.replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, "").length / letters.length;
  return /^\d+\./.test(c) || upper > 0.7;
}

function constBlocks(src) {
  const blocks = [];
  for (const m of src.matchAll(/^const ([A-Za-z_0-9]+)(?::[^=]+)? = [\[{]([\s\S]*?)^[\]}];?$/gm)) {
    const start = m.index;
    const end = m.index + m[0].length;
    // gdzie ta stała jest użyta w JSX — tam należy jej treść
    const usage = new RegExp(`\\b${m[1]}\\b`, "g");
    let usedAt = null;
    for (const um of src.matchAll(usage)) {
      if (um.index > end) {
        usedAt = um.index;
        break;
      }
    }
    blocks.push({ start, end, usedAt: usedAt ?? start });
  }
  return blocks;
}

function collectMatches(src) {
  const out = [];
  const blocks = constBlocks(src);
  const remap = (index) => {
    const b = blocks.find((x) => index >= x.start && index <= x.end);
    return b ? b.usedAt : index;
  };
  const push = (index, value) => {
    const v = value.replace(/\s+/g, " ").trim();
    if (!v || v.length < 2) return;
    if (/^[\p{P}\p{S}\s]+$/u.test(v)) return;
    if (/^(https?:|\/|#|data:)/.test(v)) return;
    out.push({ index: remap(index), value: v });
  };

  for (const m of src.matchAll(CALL)) push(m.index, JSON.parse(m[1]));
  for (const m of src.matchAll(FIELD)) push(m.index, JSON.parse(m[1]));
  for (const m of src.matchAll(CONST_ARRAY)) {
    const base = m.index;
    for (const sm of m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
      const value = JSON.parse(`"${sm[1]}"`);
      if (value.includes("/") || value.length < 3) continue;
      push(base + sm.index, value);
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

function sectionsForFile(file, fallbackLabel) {
  const src = fs.readFileSync(file, "utf8");
  const markers = [];
  for (const m of src.matchAll(SECTION_COMMENT)) {
    if (!isSectionMarker(m[1])) continue;
    markers.push({ index: m.index, label: prettyLabel(m[1]) });
  }

  const base = fallbackLabel || prettyLabel(path.basename(file).replace(/\.(tsx|ts)$/, ""));
  const buckets = [];
  const bucketFor = (index) => {
    let label = base;
    for (const mk of markers) {
      if (mk.index <= index) label = fallbackLabel ? `${fallbackLabel} — ${mk.label}` : mk.label;
      else break;
    }
    let b = buckets.find((x) => x.label === label);
    if (!b) {
      b = { label, texts: [] };
      buckets.push(b);
    }
    return b;
  };

  for (const { index, value } of collectMatches(src)) {
    bucketFor(index).texts.push({ id: textId(value), text: value });
  }
  return buckets;
}

const registry = {};
for (const page of PAGES) {
  const sections = [];
  const seen = new Set();
  for (const [file, label] of page.files) {
    if (!fs.existsSync(file)) continue;
    for (const bucket of sectionsForFile(file, label)) {
      const texts = bucket.texts.filter((e) => (seen.has(e.id) ? false : seen.add(e.id)));
      if (!texts.length) continue;
      const existing = sections.find((s) => s.label === bucket.label);
      if (existing) existing.texts.push(...texts);
      else sections.push({ id: textId(page.key + bucket.label), label: bucket.label, texts });
    }
  }
  registry[page.key] = { label: page.label, preview: page.preview, sections };
}

const out = `// PLIK GENEROWANY AUTOMATYCZNIE — nie edytuj ręcznie.
// Wygeneruj ponownie: node scripts/extract-page-texts.mjs

export type PageTextEntry = { id: string; text: string };
export type PageTextSection = { id: string; label: string; texts: PageTextEntry[] };
export type PageTextGroup = { label: string; preview: string; sections: PageTextSection[] };

export const PAGE_TEXT_REGISTRY: Record<string, PageTextGroup> = ${JSON.stringify(
  registry,
  null,
  2
)};

export const pageTextCount = (key: string) =>
  (PAGE_TEXT_REGISTRY[key]?.sections ?? []).reduce((n, s) => n + s.texts.length, 0);
`;

fs.writeFileSync("src/lib/pageTextRegistry.ts", out);
const total = Object.values(registry).reduce(
  (n, g) => n + g.sections.reduce((m, s) => m + s.texts.length, 0),
  0
);
console.log(
  `Zapisano src/lib/pageTextRegistry.ts — ${total} tekstów w ${Object.values(registry).reduce(
    (n, g) => n + g.sections.length,
    0
  )} sekcjach.`
);
