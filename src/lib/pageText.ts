/**
 * Globalny, prosty system nadpisywania tekstów strony (CMS).
 *
 * Każdy tekst w kodzie jest jednocześnie wartością domyślną i kluczem —
 * identyfikator to stabilny hash tekstu domyślnego. Dzięki temu można
 * edytować dowolny tekst z panelu admina bez zmian w kodzie.
 */

export function textId(text: string): string {
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

type Overrides = Record<string, string>;

let active: Overrides = {};
const listeners = new Set<() => void>();

export function setActiveOverrides(next: Overrides) {
  active = next || {};
  listeners.forEach((l) => l());
}

export function subscribeOverrides(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getOverridesSnapshot(): Overrides {
  return active;
}

/** Zwraca nadpisany tekst albo domyślny z kodu. */
export function t(text: string): string {
  if (!text) return text;
  const override = active[textId(text)];
  return override !== undefined && override !== "" ? override : text;
}

export const sectionKeyForPage = (pageKey: string) => `page_texts_${pageKey}`;
