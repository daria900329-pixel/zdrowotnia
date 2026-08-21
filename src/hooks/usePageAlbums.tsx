import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  PAGE_ALBUMS_SECTION_KEY,
  getAlbumsSnapshot,
  getAlbum,
  setActiveAlbums,
  subscribeAlbums,
  type Albums,
} from "@/lib/pageAlbums";

let loaded = false;
let inFlight: Promise<void> | null = null;

async function load() {
  if (loaded) return;
  if (!inFlight) {
    inFlight = (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", PAGE_ALBUMS_SECTION_KEY)
        .maybeSingle();
      setActiveAlbums((data?.content as Albums) || {});
      loaded = true;
      inFlight = null;
    })();
  }
  await inFlight;
}

export function invalidatePageAlbumsCache() {
  loaded = false;
  inFlight = null;
}

/** Zwraca dodatkowe zdjęcia albumu wgrane w panelu admina. */
export function useAlbum(id: string): string[] {
  useSyncExternalStore(subscribeAlbums, getAlbumsSnapshot, getAlbumsSnapshot);

  useEffect(() => {
    void load();
  }, []);

  return getAlbum(id);
}
