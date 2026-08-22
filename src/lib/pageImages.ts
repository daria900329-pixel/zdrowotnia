/**
 * System podmiany zdjęć na stronach (CMS).
 *
 * Każde zdjęcie ma klucz ZAKRESOWY: `<idSekcji>::<plik>`, dzięki czemu to samo
 * zdjęcie użyte w kilku sekcjach można podmienić osobno w każdej z nich.
 * Dla zgodności wstecznej obsługiwany jest też stary, globalny klucz `<plik>`.
 */
import { SRC_TO_KEY } from "@/lib/pageContentRegistry";

type Overrides = Record<string, string>;

let active: Overrides = {};
const listeners = new Set<() => void>();

export const PAGE_IMAGES_SECTION_KEY = "page_images";

export function setActiveImageOverrides(next: Overrides) {
  active = next || {};
  listeners.forEach((l) => l());
}

export function subscribeImageOverrides(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getImageOverridesSnapshot(): Overrides {
  return active;
}

export const scopedImageKey = (sectionId: string, globalKey: string) =>
  `${sectionId}::${globalKey}`;

/** Zwraca podmienione zdjęcie albo domyślne z kodu. */
export function img(src?: string | null, sectionId?: string): string {
  if (!src) return src || "";
  const globalKey = SRC_TO_KEY[src];
  if (!globalKey) return src;

  const scoped = sectionId ? active[scopedImageKey(sectionId, globalKey)] : undefined;
  if (scoped && scoped.trim() !== "") return scoped;

  const global = active[globalKey];
  return global && global.trim() !== "" ? global : src;
}
