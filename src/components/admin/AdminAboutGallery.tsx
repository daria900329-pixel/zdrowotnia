import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, GripVertical, Eye, EyeOff, Image, Video } from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  media_type: "image" | "video";
}

export function AdminAboutGallery() {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("about_gallery")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setItems(data as GalleryItem[]);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const valid = files.filter(
      (f) => f.type.startsWith(type === "video" ? "video/" : "image/") && f.size <= maxSize
    );
    const skipped = files.length - valid.length;

    if (valid.length === 0) {
      toast({
        title: "Błąd",
        description: `Wybierz pliki ${type === "video" ? "wideo (max 50MB)" : "graficzne (max 10MB)"}`,
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadProgress({ done: 0, total: valid.length });

    let maxOrder = items.length > 0 ? Math.max(...items.map((item) => item.display_order)) : -1;
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `about-gallery/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) {
        failed++;
      } else {
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
        maxOrder += 1;
        const { error: insertError } = await supabase.from("about_gallery").insert({
          image_url: urlData.publicUrl,
          display_order: maxOrder,
          media_type: type,
        });
        if (insertError) failed++;
        else succeeded++;
      }

      setUploadProgress({ done: i + 1, total: valid.length });
    }

    if (succeeded > 0) {
      toast({
        title: "Sukces",
        description: `Dodano ${succeeded} ${type === "video" ? "filmów" : "zdjęć"}${
          failed ? `, nie udało się: ${failed}` : ""
        }${skipped ? `, pominięto niepoprawne: ${skipped}` : ""}`,
      });
      fetchItems();
    } else {
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać plików",
        variant: "destructive",
      });
    }

    setUploading(false);
    setUploadProgress(null);
    e.target.value = "";
  };


  const updateCaption = async (id: string, caption: string) => {
    const { error } = await supabase
      .from("about_gallery")
      .update({ caption })
      .eq("id", id);

    if (!error) {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, caption } : item
      ));
    }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase
      .from("about_gallery")
      .update({ is_active })
      .eq("id", id);

    if (!error) {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_active } : item
      ));
      toast({
        title: is_active ? "Element aktywny" : "Element ukryty",
      });
    }
  };

  const deleteItem = async (id: string, imageUrl: string) => {
    const { error } = await supabase
      .from("about_gallery")
      .delete()
      .eq("id", id);

    if (!error) {
      // Try to delete from storage
      const path = imageUrl.split("/product-images/")[1];
      if (path) {
        await supabase.storage.from("product-images").remove([path]);
      }
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Usunięto",
        description: "Element został usunięty z galerii",
      });
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const currentIndex = items.findIndex(item => item.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === items.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newItems = [...items];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];

    // Update display_order for both items
    const updates = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx,
    }));

    for (const update of updates) {
      await supabase
        .from("about_gallery")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }

    setItems(newItems.map((item, idx) => ({ ...item, display_order: idx })));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galeria "O nas"</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setUploadType("image");
                handleFileUpload(e, "image");
              }}
              className="hidden"
              id="gallery-image-upload"
              disabled={uploading}
            />
            <Label
              htmlFor="gallery-image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {uploading && uploadType === "image" ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : (
                <Image className="w-8 h-8 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {uploading && uploadType === "image"
                  ? `Przesyłanie ${uploadProgress?.done ?? 0}/${uploadProgress?.total ?? 0}...`
                  : "Dodaj zdjęcia"}
              </span>
              <span className="text-xs text-muted-foreground/70">możesz wybrać wiele plików · max 10MB każdy</span>
            </Label>
          </div>

          {/* Video upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => {
                setUploadType("video");
                handleFileUpload(e, "video");
              }}
              className="hidden"
              id="gallery-video-upload"
              disabled={uploading}
            />
            <Label
              htmlFor="gallery-video-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {uploading && uploadType === "video" ? (
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              ) : (
                <Video className="w-8 h-8 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {uploading && uploadType === "video"
                  ? `Przesyłanie ${uploadProgress?.done ?? 0}/${uploadProgress?.total ?? 0}...`
                  : "Dodaj filmy"}
              </span>
              <span className="text-xs text-muted-foreground/70">możesz wybrać wiele plików · max 50MB każdy</span>
            </Label>
          </div>
        </div>

        {/* Items grid */}
        <div className="grid gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                item.is_active ? "bg-card" : "bg-muted/50 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveItem(item.id, "up")}
                  disabled={index === 0}
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview */}
              <div className="relative w-24 h-24 flex-shrink-0">
                {item.media_type === "video" ? (
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <video 
                      src={item.image_url} 
                      className="w-full h-full object-cover rounded-lg"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.caption || ""}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
                <span className={`absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded ${
                  item.media_type === "video" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                }`}>
                  {item.media_type === "video" ? "Film" : "Zdjęcie"}
                </span>
              </div>

              <div className="flex-1">
                <Input
                  placeholder="Podpis (opcjonalny)"
                  value={item.caption || ""}
                  onChange={(e) => updateCaption(item.id, e.target.value)}
                  onBlur={() => {
                    toast({ title: "Zapisano podpis" });
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(item.id, !item.is_active)}
                  title={item.is_active ? "Ukryj" : "Pokaż"}
                >
                  {item.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteItem(item.id, item.image_url)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Brak elementów w galerii. Dodaj zdjęcie lub film powyżej.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
