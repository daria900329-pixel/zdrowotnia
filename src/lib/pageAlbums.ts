/**
 * Albumy zdjęć na stronach.
 *
 * W przeciwieństwie do `pageImages` (podmiana pojedynczych zdjęć w kodzie),
 * albumy pozwalają dodać DOWOLNĄ liczbę zdjęć do wybranej galerii na stronie.
 * Zapis: site_content.section_key = "page_albums", content = { albumId: string[] }.
 */

export const PAGE_ALBUMS_SECTION_KEY = "page_albums";

export type AlbumDef = {
  id: string;
  label: string;
  page: string;
  description: string;
};

export const ALBUM_REGISTRY: AlbumDef[] = [
  {
    id: "home-kitchen",
    label: 'Galeria „Zdrowotnia od kuchni”',
    page: "Strona główna",
    description: "Zdjęcia dodane tutaj pojawią się w galerii na stronie głównej.",
  },
  {
    id: "about-gallery",
    label: 'Galeria „Nasza codzienność”',
    page: "O nas",
    description: "Zdjęcia dodane tutaj pojawią się w galerii na podstronie O nas.",
  },
];

export type Albums = Record<string, string[]>;

let active: Albums = {};
const listeners = new Set<() => void>();

export function setActiveAlbums(next: Albums) {
  active = next || {};
  listeners.forEach((l) => l());
}

export function subscribeAlbums(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAlbumsSnapshot(): Albums {
  return active;
}

export function getAlbum(id: string): string[] {
  const value = active[id];
  return Array.isArray(value) ? value : [];
}
