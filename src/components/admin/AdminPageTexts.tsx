import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { PAGE_TEXT_REGISTRY } from "@/lib/pageTextRegistry";
import { sectionKeyForPage } from "@/lib/pageText";
import { invalidatePageTextCache } from "@/hooks/usePageText";

const PAGE_KEYS = Object.keys(PAGE_TEXT_REGISTRY);

export const AdminPageTexts = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(PAGE_KEYS[0]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", sectionKeyForPage(page))
        .maybeSingle();
      if (cancelled) return;
      setOverrides((data?.content as Record<string, string>) || {});
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const entries = useMemo(() => {
    const all = PAGE_TEXT_REGISTRY[page]?.texts ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (e) =>
        e.text.toLowerCase().includes(q) ||
        (overrides[e.id] ?? "").toLowerCase().includes(q)
    );
  }, [page, search, overrides]);

  const save = async () => {
    setSaving(true);
    const cleaned = Object.fromEntries(
      Object.entries(overrides).filter(([, v]) => v && v.trim() !== "")
    );
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { section_key: sectionKeyForPage(page), content: cleaned },
        { onConflict: "section_key" }
      );
    setSaving(false);
    if (error) {
      toast({
        title: "Nie udało się zapisać",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    invalidatePageTextCache(page);
    toast({ title: "Zapisano teksty", description: PAGE_TEXT_REGISTRY[page].label });
  };

  return (
    <div className="space-y-4">
      <Tabs value={page} onValueChange={setPage}>
        <TabsList className="flex flex-wrap h-auto">
          {PAGE_KEYS.map((key) => (
            <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
              {PAGE_TEXT_REGISTRY[key].label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGE_KEYS.map((key) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{PAGE_TEXT_REGISTRY[key].label}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {PAGE_TEXT_REGISTRY[key].texts.length} edytowalnych tekstów. Puste
                    pole = tekst domyślny.
                  </p>
                </div>
                <Button onClick={save} disabled={saving || loading}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Zapisz
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  placeholder="Szukaj tekstu…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {entries.map((entry) => {
                      const value = overrides[entry.id] ?? "";
                      const changed = value.trim() !== "";
                      return (
                        <div key={entry.id} className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {entry.text}
                            </p>
                            {changed && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setOverrides((prev) => {
                                    const next = { ...prev };
                                    delete next[entry.id];
                                    return next;
                                  })
                                }
                              >
                                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                Przywróć
                              </Button>
                            )}
                          </div>
                          <Textarea
                            value={value}
                            placeholder={entry.text}
                            rows={entry.text.length > 90 ? 3 : 1}
                            onChange={(e) =>
                              setOverrides((prev) => ({
                                ...prev,
                                [entry.id]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      );
                    })}
                    {entries.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Brak tekstów pasujących do wyszukiwania.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
