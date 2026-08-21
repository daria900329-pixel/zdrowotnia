import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, RotateCcw, Upload } from "lucide-react";
import { PAGE_IMAGE_REGISTRY } from "@/lib/pageImageRegistry";
import { PAGE_IMAGES_SECTION_KEY } from "@/lib/pageImages";
import { invalidatePageImagesCache } from "@/hooks/usePageImages";
import { AdminPageAlbums } from "@/components/admin/AdminPageAlbums";

const PAGE_KEYS = Object.keys(PAGE_IMAGE_REGISTRY);
const MAX_SIZE = 5 * 1024 * 1024;

export const AdminPageImages = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(PAGE_KEYS[0]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", PAGE_IMAGES_SECTION_KEY)
        .maybeSingle();
      if (cancelled) return;
      setOverrides((data?.content as Record<string, string>) || {});
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const entries = useMemo(() => {
    const all = PAGE_IMAGE_REGISTRY[page]?.images ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.key.toLowerCase().includes(q) ||
        e.usedIn.join(" ").toLowerCase().includes(q)
    );
  }, [page, search]);

  const persist = async (next: Record<string, string>) => {
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v && v.trim() !== "")
    );
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { section_key: PAGE_IMAGES_SECTION_KEY, content: cleaned },
        { onConflict: "section_key" }
      );
    if (error) {
      toast({
        title: "Nie udało się zapisać",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    invalidatePageImagesCache();
    return true;
  };

  const save = async () => {
    setSaving(true);
    const ok = await persist(overrides);
    setSaving(false);
    if (ok) toast({ title: "Zapisano zdjęcia" });
  };

  const handleUpload = async (key: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "To nie jest zdjęcie", variant: "destructive" });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: "Maksymalny rozmiar to 5 MB", variant: "destructive" });
      return;
    }
    setUploading(key);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `page-images/${key.replace(/[^a-z0-9]+/gi, "-")}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      setUploading(null);
      toast({ title: "Błąd wysyłania", description: error.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    const next = { ...overrides, [key]: data.publicUrl };
    setOverrides(next);
    await persist(next);
    setUploading(null);
    toast({ title: "Zdjęcie podmienione" });
  };

  const reset = async (key: string) => {
    const next = { ...overrides };
    delete next[key];
    setOverrides(next);
    await persist(next);
  };

  return (
    <Tabs value={page} onValueChange={setPage}>
      <TabsList className="flex flex-wrap h-auto">
        <TabsTrigger value="__albums" className="text-xs md:text-sm">
          Albumy (dodaj zdjęcia)
        </TabsTrigger>
        {PAGE_KEYS.map((key) => (
          <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
            {PAGE_IMAGE_REGISTRY[key].label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="__albums" className="space-y-4">
        <AdminPageAlbums />
      </TabsContent>

      {PAGE_KEYS.map((key) => (
        <TabsContent key={key} value={key} className="space-y-4">
          <Card>
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{PAGE_IMAGE_REGISTRY[key].label}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {PAGE_IMAGE_REGISTRY[key].images.length} zdjęć. Wgraj własne, aby
                  podmienić — „Przywróć” wraca do domyślnego.
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
                placeholder="Szukaj zdjęcia…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((entry) => {
                    const current = overrides[entry.key];
                    return (
                      <div
                        key={entry.key}
                        className="rounded-lg border border-border overflow-hidden bg-card"
                      >
                        <div className="aspect-[4/3] bg-muted">
                          <img
                            src={current || entry.src}
                            alt={entry.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 space-y-2">
                          <p className="text-sm font-medium capitalize">{entry.label}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {entry.usedIn.join(", ")}
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUpload(entry.key, file);
                                  e.target.value = "";
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full pointer-events-none"
                                disabled={uploading === entry.key}
                              >
                                {uploading === entry.key ? (
                                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5 mr-1" />
                                )}
                                Podmień
                              </Button>
                            </label>
                            {current && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => reset(entry.key)}
                                aria-label="Przywróć domyślne zdjęcie"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {entries.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8 col-span-full">
                      Brak zdjęć pasujących do wyszukiwania.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
