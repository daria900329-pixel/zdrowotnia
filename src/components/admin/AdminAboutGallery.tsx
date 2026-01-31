import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
}

export function AdminAboutGallery() {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("about_gallery")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `about-gallery/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać zdjęcia",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const maxOrder = images.length > 0 
      ? Math.max(...images.map(img => img.display_order)) 
      : -1;

    const { error: insertError } = await supabase
      .from("about_gallery")
      .insert({
        image_url: urlData.publicUrl,
        display_order: maxOrder + 1,
      });

    if (insertError) {
      toast({
        title: "Błąd",
        description: "Nie udało się dodać zdjęcia do galerii",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sukces",
        description: "Zdjęcie zostało dodane",
      });
      fetchImages();
    }

    setUploading(false);
    e.target.value = "";
  };

  const updateCaption = async (id: string, caption: string) => {
    const { error } = await supabase
      .from("about_gallery")
      .update({ caption })
      .eq("id", id);

    if (!error) {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, caption } : img
      ));
    }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase
      .from("about_gallery")
      .update({ is_active })
      .eq("id", id);

    if (!error) {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, is_active } : img
      ));
      toast({
        title: is_active ? "Zdjęcie aktywne" : "Zdjęcie ukryte",
      });
    }
  };

  const deleteImage = async (id: string, imageUrl: string) => {
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
      
      setImages(prev => prev.filter(img => img.id !== id));
      toast({
        title: "Usunięto",
        description: "Zdjęcie zostało usunięte z galerii",
      });
    }
  };

  const moveImage = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex(img => img.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newImages = [...images];
    [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];

    // Update display_order for both images
    const updates = newImages.map((img, idx) => ({
      id: img.id,
      display_order: idx,
    }));

    for (const update of updates) {
      await supabase
        .from("about_gallery")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }

    setImages(newImages.map((img, idx) => ({ ...img, display_order: idx })));
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
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="gallery-upload"
            disabled={uploading}
          />
          <Label
            htmlFor="gallery-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : (
              <Plus className="w-8 h-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {uploading ? "Przesyłanie..." : "Kliknij, aby dodać zdjęcie"}
            </span>
          </Label>
        </div>

        {/* Images grid */}
        <div className="grid gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                image.is_active ? "bg-card" : "bg-muted/50 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveImage(image.id, "up")}
                  disabled={index === 0}
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
              </div>

              <img
                src={image.image_url}
                alt={image.caption || ""}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <Input
                  placeholder="Podpis zdjęcia (opcjonalny)"
                  value={image.caption || ""}
                  onChange={(e) => updateCaption(image.id, e.target.value)}
                  onBlur={() => {
                    toast({ title: "Zapisano podpis" });
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(image.id, !image.is_active)}
                  title={image.is_active ? "Ukryj" : "Pokaż"}
                >
                  {image.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteImage(image.id, image.image_url)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Brak zdjęć w galerii. Dodaj pierwsze zdjęcie powyżej.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
