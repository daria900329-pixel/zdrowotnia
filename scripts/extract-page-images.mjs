// Generuje src/lib/pageImageRegistry.ts na podstawie importów zdjęć w komponentach stron.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PAGES = [
  { key: "home", label: "Strona główna", dirs: ["src/components/home"] },
  { key: "about", label: "O nas", dirs: ["src/components/about"] },
  { key: "quail", label: "Jaja przepiórcze", dirs: ["src/components/quail"] },
  { key: "vinegar", label: "Ocet jabłkowy", dirs: ["src/components/vinegar"] },
  { key: "bread", label: "Chleb żytni", dirs: ["src/components/bread"] },
  { key: "kombucha", label: "Kombucha", dirs: ["src/components/kombucha"] },
];

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const importRe = /import\s+(\w+)\s+from\s+"(@\/assets\/[^"]+\.(?:jpg|jpeg|png|webp|avif|svg)(?:\.asset\.json)?)"/g;

const pages = [];
const allSpecs = new Map(); // spec -> varName

for (const page of PAGES) {
  const images = new Map(); // spec -> { usedIn:Set }
  for (const dir of page.dirs) {
    for (const file of walk(dir)) {
      if (!/\.(tsx|ts)$/.test(file)) continue;
      const src = readFileSync(file, "utf8");
      let m;
      while ((m = importRe.exec(src))) {
        const spec = m[2];
        if (!images.has(spec)) images.set(spec, new Set());
        images.get(spec).add(file.split("/").pop());
      }
    }
  }
  pages.push({ ...page, images });
  for (const spec of images.keys()) {
    if (!allSpecs.has(spec)) allSpecs.set(spec, `a${allSpecs.size}`);
  }
}

const keyFor = (spec) => spec.replace("@/assets/", "").replace(".asset.json", "");
const labelFor = (spec) =>
  keyFor(spec)
    .replace(/\.(jpg|jpeg|png|webp|avif|svg)$/, "")
    .replace(/[-/]/g, " ");

const lines = [];
lines.push("// AUTOGENEROWANE przez scripts/extract-page-images.mjs — nie edytuj ręcznie.");
for (const [spec, name] of allSpecs) {
  lines.push(`import ${name} from "${spec}";`);
}
lines.push("");
lines.push("export interface PageImageEntry { key: string; label: string; src: string; usedIn: string[] }");
lines.push("export interface PageImageGroup { label: string; images: PageImageEntry[] }");
lines.push("");
lines.push("export const PAGE_IMAGE_REGISTRY: Record<string, PageImageGroup> = {");
for (const page of pages) {
  lines.push(`  ${page.key}: {`);
  lines.push(`    label: ${JSON.stringify(page.label)},`);
  lines.push("    images: [");
  for (const [spec, usedIn] of page.images) {
    const name = allSpecs.get(spec);
    const resolved = spec.endsWith(".asset.json") ? `${name}.url` : name;
    lines.push(
      `      { key: ${JSON.stringify(keyFor(spec))}, label: ${JSON.stringify(
        labelFor(spec)
      )}, src: ${resolved}, usedIn: ${JSON.stringify([...usedIn])} },`
    );
  }
  lines.push("    ],");
  lines.push("  },");
}
lines.push("};");
lines.push("");
lines.push("/** Mapa: zbudowany URL zdjęcia -> stabilny klucz. */");
lines.push("export const SRC_TO_KEY: Record<string, string> = Object.fromEntries(");
lines.push("  Object.values(PAGE_IMAGE_REGISTRY).flatMap((g) => g.images.map((i) => [i.src, i.key]))");
lines.push(");");
lines.push("");

writeFileSync("src/lib/pageImageRegistry.ts", lines.join("\n"));
console.log(
  "Zapisano src/lib/pageImageRegistry.ts:",
  pages.map((p) => `${p.key}=${p.images.size}`).join(", ")
);
