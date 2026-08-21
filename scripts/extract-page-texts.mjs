/**
 * Skanuje komponenty stron i wyciąga wszystkie wywołania t("...") do rejestru,
 * dzięki czemu panel admina wie, jakie teksty można edytować.
 *
 * Uruchomienie: node scripts/extract-page-texts.mjs
 */
import fs from "node:fs";
import path from "node:path";

const PAGES = [
  { key: "home", label: "Strona główna", dirs: ["src/components/home"] },
  { key: "quail", label: "Jaja przepiórcze", dirs: ["src/components/quail"] },
  { key: "vinegar", label: "Ocet jabłkowy", dirs: ["src/components/vinegar"] },
  { key: "kombucha", label: "Kombucha", dirs: ["src/components/kombucha"] },
  { key: "about", label: "O nas", dirs: ["src/components/about"] },
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

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(dir, e.name))
        : e.name.endsWith(".tsx") || e.name.endsWith(".ts")
          ? [path.join(dir, e.name)]
          : []
    );
}

const CALL = /\bt\(\s*("(?:[^"\\]|\\.)*")\s*\)/g;
const STRING_LITERAL = /^"(?:[^"\\]|\\.)*"$/;

const registry = {};

for (const page of PAGES) {
  const seen = new Map();
  for (const dir of page.dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir)) {
      const src = fs.readFileSync(file, "utf8");
      // teksty przekazane bezpośrednio: t("...")
      for (const m of src.matchAll(CALL)) {
        const value = JSON.parse(m[1]);
        if (!value.trim()) continue;
        seen.set(textId(value), value);
      }
      // teksty z tablic danych: label: "...", text: "..."
      for (const m of src.matchAll(/\b(?:label|text)\s*:\s*("(?:[^"\\]|\\.)*")/g)) {
        if (!STRING_LITERAL.test(m[1])) continue;
        const value = JSON.parse(m[1]);
        if (!value.trim()) continue;
        seen.set(textId(value), value);
      }
      // proste tablice stringów renderowane przez t(zmienna)
      for (const m of src.matchAll(/^const [A-Z_]+(?::[^=]+)? = \[([\s\S]*?)\];$/gm)) {
        for (const sm of m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
          const value = JSON.parse(`"${sm[1]}"`);
          if (!value.trim() || value.includes("/") || value.length < 3) continue;
          seen.set(textId(value), value);
        }
      }
    }
  }
  registry[page.key] = {
    label: page.label,
    texts: [...seen.entries()]
      .map(([id, text]) => ({ id, text }))
      .sort((a, b) => a.text.localeCompare(b.text, "pl")),
  };
}

const out = `// PLIK GENEROWANY AUTOMATYCZNIE — nie edytuj ręcznie.
// Wygeneruj ponownie: node scripts/extract-page-texts.mjs

export type PageTextEntry = { id: string; text: string };
export type PageTextGroup = { label: string; texts: PageTextEntry[] };

export const PAGE_TEXT_REGISTRY: Record<string, PageTextGroup> = ${JSON.stringify(
  registry,
  null,
  2
)};
`;

fs.writeFileSync("src/lib/pageTextRegistry.ts", out);
const total = Object.values(registry).reduce((n, g) => n + g.texts.length, 0);
console.log(`Zapisano src/lib/pageTextRegistry.ts — ${total} tekstów.`);
