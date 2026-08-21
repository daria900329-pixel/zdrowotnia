import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  PAGE_IMAGES_SECTION_KEY,
  getImageOverridesSnapshot,
  setActiveImageOverrides,
  subscribeImageOverrides,
} from "@/lib/pageImages";

let loaded = false;
let inFlight: Promise<void> | null = null;

/** Ładuje podmiany zdjęć i subskrybuje komponent na ich zmiany. */
export function usePageImages() {
  useSyncExternalStore(
    subscribeImageOverrides,
    getImageOverridesSnapshot,
    getImageOverridesSnapshot
  );

  useEffect(() => {
    if (loaded) return;
    if (!inFlight) {
      inFlight = (async () => {
        const { data } = await supabase
          .from("site_content")
          .select("content")
          .eq("section_key", PAGE_IMAGES_SECTION_KEY)
          .maybeSingle();
        loaded = true;
        setActiveImageOverrides((data?.content as Record<string, string>) || {});
      })();
    }
    void inFlight;
  }, []);
}

export function invalidatePageImagesCache() {
  loaded = false;
  inFlight = null;
}
