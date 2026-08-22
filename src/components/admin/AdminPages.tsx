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
import {
  Loader2,
  Save,
  RotateCcw,
  ExternalLink,
  Upload,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Images,
  Type,
} from "lucide-react";
import {
  PAGE_CONTENT_REGISTRY,
  pageTextCount,
  type ContentSection,
} from "@/lib/pageContentRegistry";
import { sectionKeyForPage } from "@/lib/pageText";
import { invalidatePageTextCache } from "@/hooks/usePageText";
import {
  PAGE_IMAGES_SECTION_KEY,
  setActiveImageOverrides,
  scopedImageKey,
} from "@/lib/pageImages";
import { invalidatePageImagesCache } from "@/hooks/usePageImages";
import { PAGE_ALBUMS_SECTION_KEY, type Albums } from "@/lib/pageAlbums";
import { invalidatePageAlbumsCache } from "@/hooks/usePageAlbums";

const PAGE_KEYS = Object.keys(PAGE_CONTENT_REGISTRY);
const MAX_SIZE = 10 * 1024 * 1024;

async function uploadFile(file: File, prefix: string): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) return null;
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

export const AdminPages = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(PAGE_KEYS[0]);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [albums, setAlbums] = useState<Albums>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string[]>([]);

  const group = PAGE_CONTENT_REGISTRY[page];

  // teksty ładujemy per strona
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
      setTexts((data?.content as Record<string, string>) || {});
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  // zdjęcia i albumy są wspólne dla całego serwisu
  useEffect(() => {
    (async () => {
      const [{ data: imgRow }, { data: albRow }] = await Promise.all([
        supabase
          .from("site_content")
          .select("content")
          .eq("section_key", PAGE_IMAGES_SECTION_KEY)
          .maybeSingle(),
        supabase
          .from("site_content")
          .select("content")
          .eq("section_key", PAGE_ALBUMS_SECTION_KEY)
          .maybeSingle(),
      ]);
      setImages((imgRow?.content as Record<string, string>) || {});
      setAlbums((albRow?.content as Albums) || {});
    })();
  }, []);

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = group?.sections ?? [];
    if (!q) return all;
    return all.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.texts.some(
          (t) =>
            t.text.toLowerCase().includes(q) || (texts[t.id] ?? "").toLowerCase().includes(q)
        ) ||
        s.images.some((i) => i.label.toLowerCase().includes(q))
    );
  }, [group, search, texts]);

  useEffect(() => {
    if (search.trim()) setOpen(sections.map((s) => s.id));
  }, [search, sections]);

  const saveTexts = async () => {
    setSaving(true);
    const cleaned = Object.fromEntries(
      Object.entries(texts).filter(([, v]) => v && v.trim() !== "")
    );
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { section_key: sectionKeyForPage(page), content: cleaned },
        { onConflict: "section_key" }
      );
    setSaving(false);
    if (error) {
      toast({ title: "Nie udało się zapisać", description: error.message, variant: "destructive" });
      return;
    }
    invalidatePageTextCache(page);
    toast({ title: "Zapisano teksty", description: group.label });
  };

  const persistImages = async (next: Record<string, string>) => {
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { section_key: PAGE_IMAGES_SECTION_KEY, content: next },
        { onConflict: "section_key" }
      );
    if (error) {
      toast({ title: "Nie udało się zapisać zdjęcia", description: error.message, variant: "destructive" });
      return false;
    }
    setActiveImageOverrides(next);
    invalidatePageImagesCache();
    return true;
  };

  const replaceImage = async (key: string, file: File) => {
    if (!file.type.startsWith("image/") || file.size > MAX_SIZE) {
      toast({ title: "Wybierz zdjęcie do 10 MB", variant: "destructive" });
      return;
    }
    setBusy(key);
    const url = await uploadFile(file, "page-images");
    if (!url) {
      setBusy(null);
      toast({ title: "Nie udało się wgrać zdjęcia", variant: "destructive" });
      return;
    }
    const next = { ...images, [key]: url };
    setImages(next);
    await persistImages(next);
    setBusy(null);
    toast({ title: "Zdjęcie podmienione w tej sekcji" });
  };

  const resetImage = async (key: string, globalKey: string) => {
    setBusy(key);
    const next = { ...images };
    delete next[key];
    delete next[globalKey];
    setImages(next);
    await persistImages(next);
    setBusy(null);
    toast({ title: "Przywrócono oryginalne zdjęcie" });
  };

  const persistAlbums = async (next: Albums) => {
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { section_key: PAGE_ALBUMS_SECTION_KEY, content: next },
        { onConflict: "section_key" }
      );
    if (error) {
      toast({ title: "Nie udało się zapisać albumu", description: error.message, variant: "destructive" });
      return false;
    }
    invalidatePageAlbumsCache();
    return true;
  };

  const addToAlbum = async (albumId: string, files: File[]) => {
    const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= MAX_SIZE);
    if (!valid.length) {
      toast({ title: "Wybierz zdjęcia (max 10 MB każde)", variant: "destructive" });
      return;
    }
    setBusy(albumId);
    setProgress({ done: 0, total: valid.length });
    const urls: string[] = [];
    for (let i = 0; i < valid.length; i++) {
      const url = await uploadFile(valid[i], `page-albums/${albumId}`);
      if (url) urls.push(url);
      setProgress({ done: i + 1, total: valid.length });
    }
    const next: Albums = { ...albums, [albumId]: [...(albums[albumId] || []), ...urls] };
    setAlbums(next);
    await persistAlbums(next);
    setBusy(null);
    setProgress(null);
    toast({ title: `Dodano ${urls.length} zdjęć do galerii` });
  };

  const albumRemove = async (albumId: string, index: number) => {
    const list = [...(albums[albumId] || [])];
    list.splice(index, 1);
    const next = { ...albums, [albumId]: list };
    setAlbums(next);
    await persistAlbums(next);
  };

  const albumMove = async (albumId: string, index: number, dir: -1 | 1) => {
    const list = [...(albums[albumId] || [])];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const next = { ...albums, [albumId]: list };
    setAlbums(next);
    await persistAlbums(next);
  };

  const changedTexts = (s: ContentSection) =>
    s.texts.filter((t) => Object.prototype.hasOwnProperty.call(texts, t.id)).length;
  const changedImages = (s: ContentSection) =>
    s.images.filter((i) => images[i.key] || images[i.globalKey]).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PAGE_KEYS.map((key) => (
          <Button
            key={key}
            variant={key === page ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(key)}
          >
            {PAGE_CONTENT_REGISTRY[key].label}
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
              Sekcje w kolejności, w jakiej występują na stronie. W każdej sekcji masz jej
              teksty i jej zdjęcia — zmiana zdjęcia dotyczy tylko tej sekcji.
            </p>
          </div>
          <Button onClick={saveTexts} disabled={saving || loading}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Zapisz teksty
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Szukaj sekcji, tekstu lub zdjęcia…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : sections.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nic nie pasuje do wyszukiwania.
            </p>
          ) : (
            <Accordion type="multiple" value={open} onValueChange={setOpen}>
              {sections.map((section) => {
                const albumList = section.albumId ? albums[section.albumId] || [] : [];
                return (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="text-left">
                      <span className="flex flex-wrap items-center gap-2 pr-4">
                        <span className="font-medium">{section.label}</span>
                        {section.texts.length > 0 && (
                          <Badge variant="secondary" className="gap-1 font-normal">
                            <Type className="w-3 h-3" />
                            {section.texts.length}
                          </Badge>
                        )}
                        {(section.images.length > 0 || section.albumId) && (
                          <Badge variant="secondary" className="gap-1 font-normal">
                            <Images className="w-3 h-3" />
                            {section.images.length + albumList.length}
                          </Badge>
                        )}
                        {changedTexts(section) + changedImages(section) > 0 && (
                          <Badge className="font-normal">
                            zmienione: {changedTexts(section) + changedImages(section)}
                          </Badge>
                        )}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="space-y-8 pt-2">
                      {/* ZDJĘCIA SEKCJI */}
                      {section.images.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Zdjęcia w tej sekcji
                          </p>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {section.images.map((image) => {
                              const current =
                                images[image.key] || images[image.globalKey] || image.src;
                              const overridden = Boolean(
                                images[image.key] || images[image.globalKey]
                              );
                              return (
                                <div
                                  key={image.key}
                                  className="rounded-lg border border-border overflow-hidden bg-card"
                                >
                                  <div className="aspect-[4/3] bg-muted">
                                    <img
                                      src={current}
                                      alt={image.label}
                                      loading="lazy"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="p-3 space-y-2">
                                    <p className="text-xs text-muted-foreground truncate">
                                      {image.label}
                                      {overridden && " • podmienione"}
                                    </p>
                                    <div className="flex gap-2">
                                      <label className="flex-1">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          disabled={busy === image.key}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) replaceImage(image.key, file);
                                            e.target.value = "";
                                          }}
                                        />
                                        <span className="w-full inline-flex items-center justify-center gap-1 h-8 px-2 rounded-md border border-input text-xs cursor-pointer hover:bg-accent">
                                          {busy === image.key ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : (
                                            <Upload className="w-3.5 h-3.5" />
                                          )}
                                          Podmień
                                        </span>
                                      </label>
                                      {overridden && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-2 text-xs"
                                          onClick={() => resetImage(image.key, image.globalKey)}
                                        >
                                          <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                          Oryginał
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ALBUM SEKCJI */}
                      {section.albumId && (
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Dodatkowe zdjęcia w tej galerii
                          </p>
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              disabled={busy === section.albumId}
                              onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                if (files.length) addToAlbum(section.albumId!, files);
                                e.target.value = "";
                              }}
                            />
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                              {busy === section.albumId ? (
                                <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Przesyłanie {progress?.done ?? 0}/{progress?.total ?? 0}...
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
                                  <Upload className="w-4 h-4" />
                                  Dodaj zdjęcia — możesz zaznaczyć wiele naraz (max 10 MB każde)
                                </span>
                              )}
                            </div>
                          </label>

                          {albumList.length > 0 && (
                            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                              {albumList.map((url, i) => (
                                <div
                                  key={`${url}-${i}`}
                                  className="rounded-lg border border-border overflow-hidden bg-card"
                                >
                                  <div className="aspect-square bg-muted">
                                    <img
                                      src={url}
                                      alt=""
                                      loading="lazy"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between p-1">
                                    <div className="flex">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        aria-label="Przesuń w lewo"
                                        disabled={i === 0}
                                        onClick={() => albumMove(section.albumId!, i, -1)}
                                      >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        aria-label="Przesuń w prawo"
                                        disabled={i === albumList.length - 1}
                                        onClick={() => albumMove(section.albumId!, i, 1)}
                                      >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive"
                                      aria-label="Usuń zdjęcie"
                                      onClick={() => albumRemove(section.albumId!, i)}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TEKSTY SEKCJI */}
                      {section.texts.length > 0 && (
                        <div className="space-y-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Teksty w tej sekcji
                          </p>
                          {section.texts.map((entry) => {
                            const value = texts[entry.id] ?? entry.text;
                            const changed = value !== entry.text;
                            const long = entry.text.length > 70;
                            return (
                              <div key={entry.id} className="space-y-1.5">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-xs text-muted-foreground leading-snug">
                                    Domyślnie: „{entry.text}”
                                  </p>
                                  {changed && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs shrink-0"
                                      onClick={() =>
                                        setTexts((prev) => {
                                          const next = { ...prev };
                                          delete next[entry.id];
                                          return next;
                                        })
                                      }
                                    >
                                      <RotateCcw className="w-3 h-3 mr-1" />
                                      Przywróć
                                    </Button>
                                  )}
                                </div>
                                {long ? (
                                  <Textarea
                                    value={value}
                                    rows={3}
                                    onChange={(e) =>
                                      setTexts((prev) => ({ ...prev, [entry.id]: e.target.value }))
                                    }
                                  />
                                ) : (
                                  <Input
                                    value={value}
                                    onChange={(e) =>
                                      setTexts((prev) => ({ ...prev, [entry.id]: e.target.value }))
                                    }
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
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
