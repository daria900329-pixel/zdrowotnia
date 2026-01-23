import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Wand2,
  Upload,
} from "lucide-react";

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

interface ProductImagesManagerProps {
  productId: string;
  productName: string;
}

export function ProductImagesManager({ productId, productName }: ProductImagesManagerProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, productId]);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;
    
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

    const isFirstImage = images.length === 0;

    const { error: insertError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_url: urlData.publicUrl,
        display_order: maxOrder + 1,
        is_primary: isFirstImage,
      });

    // If first image, sync to products.image_url
    if (isFirstImage && !insertError) {
      await supabase
        .from("products")
        .update({ image_url: urlData.publicUrl })
        .eq("id", productId);
    }

    if (insertError) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać zdjęcia",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sukces", description: "Zdjęcie zostało dodane" });
      fetchImages();
    }
    
    setUploading(false);
  };

  const handleRemoveBackground = async (image: ProductImage) => {
    setProcessing(true);
    setEditingImage(image);
    
    try {
      const { data, error } = await supabase.functions.invoke('edit-image', {
        body: { imageUrl: image.image_url }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.imageUrl) {
        await saveEditedImage(image, data.imageUrl);
        toast({ title: "Sukces", description: "Tło zostało usunięte" });
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      console.error("Remove background error:", error);
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się usunąć tła",
        variant: "destructive",
      });
    }
    
    setProcessing(false);
    setEditingImage(null);
  };

  const handleCustomEdit = async () => {
    if (!editingImage || !editPrompt.trim()) return;
    
    setProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('edit-image', {
        body: { 
          imageUrl: editingImage.image_url,
          prompt: editPrompt
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.imageUrl) {
        await saveEditedImage(editingImage, data.imageUrl);
        toast({ title: "Sukces", description: "Zdjęcie zostało zmodyfikowane" });
        setEditPrompt("");
        setEditingImage(null);
      } else {
        throw new Error("No image returned");
      }
    } catch (error) {
      console.error("Custom edit error:", error);
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się zmodyfikować zdjęcia",
        variant: "destructive",
      });
    }
    
    setProcessing(false);
  };

  const saveEditedImage = async (image: ProductImage, base64Url: string) => {
    // Convert base64 to blob
    const response = await fetch(base64Url);
    const blob = await response.blob();
    
    // Upload new image
    const fileName = `${productId}/${Date.now()}-edited.png`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, blob);

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    // Update database record
    await supabase
      .from("product_images")
      .update({ image_url: urlData.publicUrl })
      .eq("id", image.id);

    // If this is the primary image, sync to products.image_url
    if (image.is_primary) {
      await supabase
        .from("products")
        .update({ image_url: urlData.publicUrl })
        .eq("id", productId);
    }

    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;

    const { error } = await supabase.from("product_images").delete().eq("id", id);

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć zdjęcia",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sukces", description: "Zdjęcie zostało usunięte" });
      fetchImages();
    }
  };

  const handleSetPrimary = async (id: string) => {
    const targetImage = images.find(img => img.id === id);
    if (!targetImage) return;

    // First, unset all primary
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    // Then set the new primary
    await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", id);

    // Sync to products.image_url
    await supabase
      .from("products")
      .update({ image_url: targetImage.image_url })
      .eq("id", productId);

    fetchImages();
    toast({ title: "Sukces", description: "Ustawiono jako główne zdjęcie" });
  };

  const handleMove = async (imageId: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === imageId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const currentImage = images[currentIndex];
    const targetImage = images[targetIndex];

    await Promise.all([
      supabase
        .from("product_images")
        .update({ display_order: targetImage.display_order })
        .eq("id", currentImage.id),
      supabase
        .from("product_images")
        .update({ display_order: currentImage.display_order })
        .eq("id", targetImage.id),
    ]);

    fetchImages();
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-secondary/30">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/50 transition-colors">
          <span className="font-medium text-sm">
            Galeria zdjęć ({images.length})
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative group rounded-lg overflow-hidden border-2 ${
                      image.is_primary ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${productName} ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    
                    {image.is_primary && (
                      <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                        Główne
                      </div>
                    )}

                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => handleMove(image.id, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => handleMove(image.id, "down")}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={image.is_primary}
                      >
                        <Star className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => handleRemoveBackground(image)}
                        disabled={processing}
                      >
                        <Wand2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => setEditingImage(image)}
                      >
                        <Plus className="w-3 h-3 rotate-45" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload button */}
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs">Dodaj zdjęcie</span>
                  </div>
                )}
              </label>

              {processing && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Przetwarzanie zdjęcia...
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Custom Edit Dialog */}
      <Dialog open={!!editingImage && !processing} onOpenChange={() => setEditingImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj zdjęcie AI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingImage && (
              <img
                src={editingImage.image_url}
                alt="Edytowane zdjęcie"
                className="w-full h-48 object-contain rounded-lg bg-secondary"
              />
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => editingImage && handleRemoveBackground(editingImage)}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Usuń tło (białe)
              </Button>
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Opisz jak chcesz zmodyfikować zdjęcie, np. 'Dodaj cień pod produktem' lub 'Zmień tło na kremowe'"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleCustomEdit}
                disabled={!editPrompt.trim() || processing}
                className="w-full"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Zastosuj edycję
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}