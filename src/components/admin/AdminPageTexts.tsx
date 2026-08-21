import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, RotateCcw, ExternalLink } from "lucide-react";
import { PAGE_TEXT_REGISTRY, pageTextCount } from "@/lib/pageTextRegistry";
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
  const [open, setOpen] = useState<string[]>([]);

  const group = PAGE_TEXT_REGISTRY[page];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSearch("");
    setOpen([]);
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

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = group?.sections ?? [];
    if (!q) return all;
    return all
      .map((s) => ({
        ...s,
        texts: s.texts.filter(
          (e) =>
            e.text.toLowerCase().includes(q) ||
            (overrides[e.id] ?? "").toLowerCase().includes(q) ||
            s.label.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.texts.length > 0);
  }, [group, search, overrides]);

  // przy wyszukiwaniu rozwiń wszystkie pasujące sekcje
  useEffect(() => {
    if (search.trim()) setOpen(sections.map((s) => s.id));
  }, [search, sections]);

  const changedCount = useMemo(
    () => Object.values(overrides).filter((v) => v && v.trim() !== "").length,
    [overrides]
  );

  const changedInSection = (ids: string[]) =>
    ids.filter((id) => (overrides[id] ?? "").trim() !== "").length;

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
    toast({ title: "Zapisano teksty", description: group.label });
  };

  return (
    <div className="space-y-4">
      {/* Wybór strony */}
      <div className="flex flex-wrap gap-2">
        {PAGE_KEYS.map((key) => (
          <Button
            key={key}
            variant={key === page ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(key)}
          >
            {PAGE_TEXT_REGISTRY[key].label}
            <span className="ml-2 opacity-60 text-xs">{pageTextCount(key)}</span>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              {group.label}
              <a
                href={group.preview}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-normal text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Podgląd strony
              </a>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sekcje ułożone tak, jak następują po sobie na stronie. Puste pole = tekst
              domyślny. {changedCount > 0 && `Zmienione teksty: ${changedCount}.`}
            </p>
          </div>
          <Button onClick={save} disabled={saving || loading}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Zapisz zmiany
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Szukaj tekstu lub sekcji…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : sections.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Brak tekstów pasujących do wyszukiwania.
            </p>
          ) : (
            <Accordion type="multiple" value={open} onValueChange={setOpen}>
              {sections.map((section) => {
                const changed = changedInSection(section.texts.map((t) => t.id));
                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="text-left">
                      <span className="flex flex-wrap items-center gap-2 pr-3">
                        <span className="font-medium">{section.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {section.texts.length} tekstów
                        </span>
                        {changed > 0 && (
                          <Badge variant="secondary" className="text-[10px]">
                            zmienione: {changed}
                          </Badge>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-5 pt-2">
                      {section.texts.map((entry) => {
                        const value = overrides[entry.id] ?? "";
                        const isChanged = value.trim() !== "";
                        return (
                          <div key={entry.id} className="space-y-1.5">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {entry.text}
                              </p>
                              {isChanged && (
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
                              rows={entry.text.length > 120 ? 4 : entry.text.length > 60 ? 2 : 1}
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
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
