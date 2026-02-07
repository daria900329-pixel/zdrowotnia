import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id: string;
  product_id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  display_order: number;
  show_in_menu: boolean;
}

interface AdminProductSectionsProps {
  productId: string;
}

export function AdminProductSections({ productId }: AdminProductSectionsProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, [productId]);

  async function fetchSections() {
    const { data, error } = await supabase
      .from("product_description_sections")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching sections:", error);
      toast.error("Błąd wczytywania sekcji");
    } else {
      setSections(data || []);
    }
    setLoading(false);
  }

  async function addSection() {
    const newOrder = sections.length > 0 
      ? Math.max(...sections.map(s => s.display_order)) + 1 
      : 0;

    const { data, error } = await supabase
      .from("product_description_sections")
      .insert({
        product_id: productId,
        title: "Nowa sekcja",
        content: "",
        display_order: newOrder,
        show_in_menu: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding section:", error);
      toast.error("Błąd dodawania sekcji");
    } else if (data) {
      setSections([...sections, data]);
      toast.success("Dodano sekcję");
    }
  }

  async function updateSection(id: string, updates: Partial<Section>) {
    setSaving(true);
    const { error } = await supabase
      .from("product_description_sections")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating section:", error);
      toast.error("Błąd zapisywania");
    } else {
      setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
    }
    setSaving(false);
  }

  async function deleteSection(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć tę sekcję?")) return;

    const { error } = await supabase
      .from("product_description_sections")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting section:", error);
      toast.error("Błąd usuwania sekcji");
    } else {
      setSections(sections.filter(s => s.id !== id));
      toast.success("Usunięto sekcję");
    }
  }

  async function handleImageUpload(sectionId: string, file: File) {
    if (!file) return;

    // Validate file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Dozwolone formaty: JPG, PNG, WebP, GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maksymalny rozmiar pliku: 5MB");
      return;
    }

    setUploadingId(sectionId);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-section.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Błąd przesyłania zdjęcia");
      setUploadingId(null);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    await updateSection(sectionId, { image_url: urlData.publicUrl });
    toast.success("Zdjęcie przesłane");
    setUploadingId(null);
  }

  async function removeImage(sectionId: string) {
    await updateSection(sectionId, { image_url: null });
    toast.success("Usunięto zdjęcie");
  }

  async function moveSection(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    
    // Update display_order for both sections
    const updates = newSections.map((s, i) => ({
      id: s.id,
      display_order: i,
    }));

    setSections(newSections.map((s, i) => ({ ...s, display_order: i })));

    for (const update of updates) {
      await supabase
        .from("product_description_sections")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sekcje opisu produktu</h3>
        <Button onClick={addSection} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Dodaj sekcję
        </Button>
      </div>

      {sections.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4">
          Brak sekcji. Kliknij "Dodaj sekcję" aby utworzyć pierwszą.
        </p>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                    >
                      <GripVertical className="w-4 h-4 rotate-90" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      placeholder="Tytuł sekcji"
                      className="font-semibold"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`menu-${section.id}`} className="text-sm text-muted-foreground">
                      W menu
                    </Label>
                    <Switch
                      id={`menu-${section.id}`}
                      checked={section.show_in_menu}
                      onCheckedChange={(checked) => updateSection(section.id, { show_in_menu: checked })}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSection(section.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Treść</Label>
                  <Textarea
                    value={section.content || ""}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="Treść sekcji..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Zdjęcie sekcji (opcjonalne)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    To zdjęcie pojawi się po lewej stronie (obok galerii głównej) gdy użytkownik przewinie do tej sekcji.
                  </p>
                  
                  {section.image_url ? (
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                      <img
                        src={section.image_url}
                        alt={section.title}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeImage(section.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      {uploadingId === section.id ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Dodaj zdjęcie</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(section.id, file);
                        }}
                        disabled={uploadingId === section.id}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {saving && (
        <p className="text-sm text-muted-foreground">Zapisywanie...</p>
      )}
    </div>
  );
}
