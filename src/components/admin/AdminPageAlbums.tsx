import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import {
  ALBUM_REGISTRY,
  PAGE_ALBUMS_SECTION_KEY,
  type Albums,
} from "@/lib/pageAlbums";
import { invalidatePageAlbumsCache } from "@/hooks/usePageAlbums";

const MAX_SIZE = 10 * 1024 * 1024;

export const AdminPageAlbums = () => {
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Albums>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", PAGE_ALBUMS_SECTION_KEY)
        .maybeSingle();
      if (cancelled) return;
      setAlbums((data?.content as Albums) || {});
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = async (next: Albums) => {
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { section_key: PAGE_ALBUMS_SECTION_KEY, content: next },
        { onConflict: "section_key" }
      );
    if (error) {
      toast({ title: "Nie udało się zapisać", description: error.message, variant: "destructive" });
      return false;
    }
    invalidatePageAlbumsCache();
    return true;
  };

  const handleUpload = async (albumId: string, files: File[]) => {
    const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= MAX_SIZE);
    const skipped = files.length - valid.length;
    if (valid.length === 0) {
      toast({ title: "Wybierz zdjęcia (max 10 MB każde)", variant: "destructive" });
      return;
    }

    setUploading(albumId);
    setProgress({ done: 0, total: valid.length });

    const urls: string[] = [];
    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      const ext = file.name.split(".").pop() || "jpg";
      const path = `page-albums/${albumId}-${Date.now()}-${i}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setProgress({ done: i + 1, total: valid.length });
    }

    const next: Albums = { ...albums, [albumId]: [...(albums[albumId] || []), ...urls] };
    setAlbums(next);
    const ok = await persist(next);

    setUploading(null);
    setProgress(null);
    if (ok) {
      toast({
        title: `Dodano ${urls.length} zdjęć`,
        description: skipped ? `Pominięto niepoprawne: ${skipped}` : undefined,
      });
    }
  };

  const removeAt = async (albumId: string, index: number) => {
    const list = [...(albums[albumId] || [])];
    list.splice(index, 1);
    const next = { ...albums, [albumId]: list };
    setAlbums(next);
    await persist(next);
  };

  const move = async (albumId: string, index: number, dir: -1 | 1) => {
    const list = [...(albums[albumId] || [])];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const next = { ...albums, [albumId]: list };
    setAlbums(next);
    await persist(next);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ALBUM_REGISTRY.map((album) => {
        const list = albums[album.id] || [];
        return (
          <Card key={album.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {album.label}{" "}
                <span className="text-xs font-normal text-muted-foreground">({album.page})</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{album.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploading === album.id}
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length) handleUpload(album.id, files);
                    e.target.value = "";
                  }}
                />
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  {uploading === album.id ? (
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

              {list.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Brak dodatkowych zdjęć w tym albumie.
                </p>
              ) : (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {list.map((url, i) => (
                    <div key={`${url}-${i}`} className="rounded-lg border border-border overflow-hidden bg-card">
                      <div className="aspect-square bg-muted">
                        <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center justify-between p-1">
                        <div className="flex">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label="Przesuń w lewo"
                            onClick={() => move(album.id, i, -1)}
                            disabled={i === 0}
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label="Przesuń w prawo"
                            onClick={() => move(album.id, i, 1)}
                            disabled={i === list.length - 1}
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
                          onClick={() => removeAt(album.id, i)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
