/**
 * Jeden generator treści stron: teksty + zdjęcia + albumy, pogrupowane w SEKCJE
 * w kolejności występowania na stronie.
 *
 * Dodatkowo (codemod) dopisuje do wywołań `img(x)` identyfikator sekcji:
 * `img(x, "<sectionId>")`, dzięki czemu każde zdjęcie ma osobny klucz w każdej
 * sekcji (podmiana w galerii nie rusza tego samego zdjęcia w innej sekcji).
 *
 * Uruchomienie: node scripts/extract-page-content.mjs
 */
import fs from "node:fs";

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
      ["src/components/home/KitchenGallery.tsx", "Galeria „Zdrowotnia od kuchni”"],
      ["src/components/home/ShopGrid.tsx", "Sklep — lista produktów"],
      ["src/components/home/FinalStatement.tsx", "Finał"],
    ],
  },
  {
    key: "about",
    label: "O nas",
    preview: "/o-nas",
    files: [
      ["src/components/about/AboutLanding.tsx", null],
      ["src/components/AboutGallery.tsx", "Galeria „Nasza codzienność”"],
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
];

function hashId(text) {
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
const FIELD =
  /\b(?:label|text|title|heading|quote|caption|body|note|answer|question)\s*:\s*("(?:[^"\\]|\\.)*")/g;
const CONST_ARRAY = /^const ([A-Z_0-9]+)(?::[^=]+)? = \[([\s\S]*?)^\];$/gm;
const SECTION_COMMENT = /\{\/\*\s*=*\s*([^*]+?)\s*=*\s*\*\/\}/g;
const IMPORT_IMG =
  /import\s+(\w+)\s+from\s+"(@\/assets\/[^"]+\.(?:jpg|jpeg|png|webp|avif|svg)(?:\.asset\.json)?)"/g;

function prettyLabel(raw) {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  const letters = cleaned.replace(/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, "");
  const upperRatio = letters.length === 0 ? 0 : cleaned.replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, "").length / letters.length;
  if (upperRatio < 0.7) return cleaned;
  const lower = cleaned.toLocaleLowerCase("pl");
  return lower.replace(/(^|\d+\.\s*)([a-ząćęłńóśźż])/, (m, p, c) => p + c.toLocaleUpperCase("pl"));
}

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
  for (const m of src.matchAll(/^const ([A-Za-z_0-9]+)(?::[^=]+)? = [[{]([\s\S]*?)^[\]}];?$/gm)) {
    const start = m.index;
    const end = m.index + m[0].length;
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

function collectTexts(src) {
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

/** Etykieta sekcji dla danej pozycji w pliku. */
function labelerFor(src, fallbackLabel) {
  const markers = [];
  for (const m of src.matchAll(SECTION_COMMENT)) {
    if (!isSectionMarker(m[1])) continue;
    markers.push({ index: m.index, label: prettyLabel(m[1]) });
  }
  const base = fallbackLabel || "Listy i wypunktowania";
  return (index) => {
    let label = base;
    for (const mk of markers) {
      if (mk.index <= index) label = fallbackLabel ? `${fallbackLabel} — ${mk.label}` : mk.label;
      else break;
    }
    return label;
  };
}

const assetKey = (spec) => spec.replace("@/assets/", "").replace(".asset.json", "");
const assetLabel = (spec) =>
  assetKey(spec)
    .replace(/\.(jpg|jpeg|png|webp|avif|svg)$/, "")
    .replace(/[-/]/g, " ");

const allSpecs = new Map(); // spec -> varName in registry
const varFor = (spec) => {
  if (!allSpecs.has(spec)) allSpecs.set(spec, `a${allSpecs.size}`);
  return allSpecs.get(spec);
};

const registry = {};
const rewrites = new Map(); // file -> new source

for (const page of PAGES) {
  const sections = [];
  const seenText = new Set();

  const sectionFor = (label) => {
    let s = sections.find((x) => x.label === label);
    if (!s) {
      s = { id: hashId(page.key + label), label, texts: [], images: [], albumId: undefined };
      sections.push(s);
    }
    return s;
  };

  for (const [file, fallbackLabel] of page.files) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    const labelAt = labelerFor(src, fallbackLabel);

    // 1. teksty
    for (const { index, value } of collectTexts(src)) {
      const id = hashId(value);
      if (seenText.has(id)) continue;
      seenText.add(id);
      sectionFor(labelAt(index)).texts.push({ id, text: value });
    }

    // 2. mapowanie zmienna -> plik zdjęcia (z aliasami `const x = yAsset.url;`)
    const specByVar = new Map();
    for (const m of src.matchAll(IMPORT_IMG)) specByVar.set(m[1], m[2]);
    for (const m of src.matchAll(/const\s+(\w+)\s*=\s*(\w+)\.url\s*;/g)) {
      if (specByVar.has(m[2])) specByVar.set(m[1], specByVar.get(m[2]));
    }

    // 3. codemod: dopisz identyfikator sekcji do wywołań img(...)
    const blocks = constBlocks(src);
    const remap = (index) => {
      const b = blocks.find((x) => index >= x.start && index <= x.end);
      return b ? b.usedAt : index;
    };
    const edits = [];
    for (const m of src.matchAll(/\bimg\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g)) {
      const arg = m[1];
      const sectionLabel = labelAt(m.index);
      const section = sectionFor(sectionLabel);
      if (!/,\s*"[a-z0-9]+"\s*$/.test(arg)) {
        edits.push({ at: m.index + m[0].length - 1, text: `, "${section.id}"` });
      }
    }
    if (edits.length) {
      let next = src;
      for (const e of edits.sort((a, b) => b.at - a.at)) {
        next = next.slice(0, e.at) + e.text + next.slice(e.at);
      }
      rewrites.set(file, next);
      src = next;
    }

    // 4. przypisz zdjęcia do sekcji na podstawie miejsca użycia zmiennej
    for (const [varName, spec] of specByVar) {
      const usage = [...src.matchAll(new RegExp(`\\b${varName}\\b`, "g"))]
        .map((m) => m.index)
        .filter((i) => i > (src.indexOf(`import ${varName} `) + varName.length + 8));
      const useIndex = usage.length ? remap(usage[usage.length > 1 ? 1 : 0] ?? usage[0]) : 0;
      const section = sectionFor(labelAt(useIndex));
      const key = `${section.id}::${assetKey(spec)}`;
      if (section.images.some((i) => i.key === key)) continue;
      section.images.push({
        key,
        globalKey: assetKey(spec),
        label: assetLabel(spec),
        v: varFor(spec),
      });
    }

    // 5. album w tej sekcji
    for (const m of src.matchAll(/useAlbum\(\s*"([^"]+)"\s*\)/g)) {
      sectionFor(labelAt(m.index)).albumId = m[1];
    }
  }

  registry[page.key] = {
    label: page.label,
    preview: page.preview,
    sections: sections.filter((s) => s.texts.length || s.images.length || s.albumId),
  };
}

for (const [file, next] of rewrites) fs.writeFileSync(file, next);

// --- zapis rejestru ---
const lines = [];
lines.push("// PLIK GENEROWANY AUTOMATYCZNIE — nie edytuj ręcznie.");
lines.push("// Wygeneruj ponownie: node scripts/extract-page-content.mjs");
lines.push("");
for (const [spec, name] of allSpecs) lines.push(`import ${name} from "${spec}";`);
lines.push("");
lines.push(`export type ContentText = { id: string; text: string };`);
lines.push(
  `export type ContentImage = { key: string; globalKey: string; label: string; src: string };`
);
lines.push(
  `export type ContentSection = { id: string; label: string; texts: ContentText[]; images: ContentImage[]; albumId?: string };`
);
lines.push(
  `export type ContentPage = { label: string; preview: string; sections: ContentSection[] };`
);
lines.push("");
lines.push("export const PAGE_CONTENT_REGISTRY: Record<string, ContentPage> = {");
for (const [key, page] of Object.entries(registry)) {
  lines.push(`  ${JSON.stringify(key)}: {`);
  lines.push(`    label: ${JSON.stringify(page.label)},`);
  lines.push(`    preview: ${JSON.stringify(page.preview)},`);
  lines.push("    sections: [");
  for (const s of page.sections) {
    lines.push("      {");
    lines.push(`        id: ${JSON.stringify(s.id)},`);
    lines.push(`        label: ${JSON.stringify(s.label)},`);
    if (s.albumId) lines.push(`        albumId: ${JSON.stringify(s.albumId)},`);
    lines.push(`        texts: ${JSON.stringify(s.texts)},`);
    lines.push("        images: [");
    for (const i of s.images) {
      const src = allSpecsSrc(i.v);
      lines.push(
        `          { key: ${JSON.stringify(i.key)}, globalKey: ${JSON.stringify(
          i.globalKey
        )}, label: ${JSON.stringify(i.label)}, src: ${src} },`
      );
    }
    lines.push("        ],");
    lines.push("      },");
  }
  lines.push("    ],");
  lines.push("  },");
}
lines.push("};");
lines.push("");
lines.push("/** Mapa: zbudowany URL zdjęcia -> globalny klucz. */");
lines.push("export const SRC_TO_KEY: Record<string, string> = Object.fromEntries(");
lines.push(
  "  Object.values(PAGE_CONTENT_REGISTRY).flatMap((p) => p.sections.flatMap((s) => s.images.map((i) => [i.src, i.globalKey])))"
);
lines.push(");");
lines.push("");
lines.push("export const pageTextCount = (key: string) =>");
lines.push(
  "  (PAGE_CONTENT_REGISTRY[key]?.sections ?? []).reduce((n, s) => n + s.texts.length, 0);"
);
lines.push("");

function allSpecsSrc(varName) {
  const spec = [...allSpecs.entries()].find(([, v]) => v === varName)?.[0] ?? "";
  return spec.endsWith(".asset.json") ? `${varName}.url` : varName;
}

fs.writeFileSync("src/lib/pageContentRegistry.ts", lines.join("\n"));

const stats = Object.entries(registry).map(
  ([k, p]) =>
    `${k}: ${p.sections.length} sekcji / ${p.sections.reduce(
      (n, s) => n + s.texts.length,
      0
    )} tekstów / ${p.sections.reduce((n, s) => n + s.images.length, 0)} zdjęć`
);
console.log("Zapisano src/lib/pageContentRegistry.ts\n" + stats.join("\n"));
console.log("Zmodyfikowane komponenty (scope zdjęć):", [...rewrites.keys()].length);
