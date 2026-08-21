/**
 * Globalny system podmiany zdjęć na stronach (CMS).
 *
 * Każde zdjęcie zaimportowane w komponentach stron ma stabilny klucz
 * (ścieżka w src/assets). Panel admina zapisuje mapę klucz -> URL zdjęcia
 * wgranego przez użytkownika, a `img()` podmienia je w locie.
 */
import { SRC_TO_KEY } from "@/lib/pageImageRegistry";

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

/** Zwraca podmienione zdjęcie albo domyślne z kodu. */
export function img(src?: string | null): string {
  if (!src) return src || "";
  const key = SRC_TO_KEY[src];
  if (!key) return src;
  const override = active[key];
  return override && override.trim() !== "" ? override : src;
}
