import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getOverridesSnapshot,
  sectionKeyForPage,
  setActiveOverrides,
  subscribeOverrides,
} from "@/lib/pageText";

const cache = new Map<string, Record<string, string>>();

/**
 * Ładuje nadpisania tekstów dla danej strony i subskrybuje komponent
 * na zmiany, żeby `t()` (z @/lib/pageText) zwracało aktualne wartości.
 */
export function usePageText(pageKey: string) {
  useSyncExternalStore(subscribeOverrides, getOverridesSnapshot, getOverridesSnapshot);

  useEffect(() => {
    let cancelled = false;
    const cached = cache.get(pageKey);
    if (cached) {
      setActiveOverrides(cached);
      return;
    }
    setActiveOverrides({});
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", sectionKeyForPage(pageKey))
        .maybeSingle();
      if (cancelled) return;
      const overrides = (data?.content as Record<string, string>) || {};
      cache.set(pageKey, overrides);
      setActiveOverrides(overrides);
    })();
    return () => {
      cancelled = true;
    };
  }, [pageKey]);
}

export function invalidatePageTextCache(pageKey?: string) {
  if (pageKey) cache.delete(pageKey);
  else cache.clear();
}
