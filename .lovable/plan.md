# Jeden panel „Strony” zamiast rozrzuconych zakładek

## Problem
Dziś edycja jest rozbita na trzy miejsca: „Treści”, „Teksty stron”, „Zdjęcia stron” (plus albumy).
Dodatkowo jedno zdjęcie z kodu bywa użyte w kilku sekcjach i ma **jeden wspólny klucz** — podmiana
w galerii zmienia też zdjęcie w środku strony. Nie da się tego ogarnąć.

## Co zrobimy

### 1. Jedna zakładka: „Strony”
Wybierasz stronę (Strona główna, O nas, Jaja przepiórcze, Ocet, Chleb, Kombucha).
Widzisz **sekcje w takiej kolejności, jak lecą na stronie**. Każda sekcja to jedna karta zawierająca:

- teksty tej sekcji (edycja w miejscu, przywracanie domyślnego),
- zdjęcia tej sekcji (miniatura + „Podmień” + „Przywróć oryginał”),
- album zdjęć, jeśli sekcja jest galerią (dodaj wiele, usuń, zmień kolejność).

Czyli: tekst siedzi obok zdjęcia, które go wspiera. Nic nie jest „gdzie indziej”.

### 2. Każda sekcja ma własne zdjęcia
Klucz zdjęcia przestaje być globalny — będzie **zakresowy: sekcja + plik zdjęcia**.
Podmiana zdjęcia w galerii na stronie głównej nie ruszy tego samego zdjęcia w sekcji „Wiemy, czym karmimy”.
Istniejące podmiany, które już zrobiłaś, zostaną automatycznie przeniesione na nowe klucze (nic nie zniknie).

### 3. Albumy przy galeriach
Album „Zdrowotnia od kuchni” i „Nasza codzienność” przestają być osobną listą — pokażą się
wewnątrz swoich sekcji, z uploadem wielu zdjęć naraz.

### 4. Sprzątanie zakładek
- „Teksty stron” + „Zdjęcia stron” + albumy → znikają, zastępuje je „Strony”.
- „Treści” zostaje tylko dla rzeczy spoza sekcji stron (dane kontaktowe, ustawienia globalne),
  z jasnym opisem czego dotyczy — żeby nie dublowało się z „Stronami”.

## Szczegóły techniczne

- `scripts/extract-page-texts.mjs` i `scripts/extract-page-images.mjs` łączymy w jeden generator
  `scripts/extract-page-content.mjs`, produkujący wspólny rejestr `src/lib/pageContentRegistry.ts`:
  sekcja → `{ id, label, texts[], images[], albumId? }` (kolejność zgodna z plikiem komponentu).
- Zdjęcia dostają klucz `sekcja::asset`. W komponentach `import { img }` zamieniamy na
  `const img = scopedImg("<id sekcji/plik>")` — miejsca wywołań `img(x)` zostają bez zmian.
- `pageImages.ts` rozwiązuje najpierw klucz zakresowy, potem stary globalny (kompatybilność),
  a jednorazowa migracja przepisuje istniejące wpisy `site_content.page_images` na nowe klucze.
- Nowy komponent `src/components/admin/AdminPages.tsx` (zastępuje `AdminPageTexts`,
  `AdminPageImages`, `AdminPageAlbums`); zapis nadal do `site_content` (`page_texts_*`,
  `page_images`, `page_albums`) — bez zmian w bazie.
- Weryfikacja: build + przejście Playwrightem po `/admin` i po stronach, żeby potwierdzić,
  że podmiana w jednej sekcji nie rusza innej.
