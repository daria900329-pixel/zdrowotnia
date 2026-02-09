import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Plus, Trash2, Eye, EyeOff, Image, Video, GripVertical, Clock, Users, Leaf, Award, Heart, Sparkles, Home, MapPin, Star, ShieldCheck, Flame, Droplets, Sun, Wheat, TreePine, type LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ICON_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "Clock", label: "Zegar", icon: Clock },
  { value: "Users", label: "Ludzie", icon: Users },
  { value: "Leaf", label: "Liść", icon: Leaf },
  { value: "Award", label: "Nagroda", icon: Award },
  { value: "Heart", label: "Serce", icon: Heart },
  { value: "Sparkles", label: "Iskry", icon: Sparkles },
  { value: "Home", label: "Dom", icon: Home },
  { value: "MapPin", label: "Lokalizacja", icon: MapPin },
  { value: "Star", label: "Gwiazdka", icon: Star },
  { value: "ShieldCheck", label: "Tarcza", icon: ShieldCheck },
  { value: "Flame", label: "Ogień", icon: Flame },
  { value: "Droplets", label: "Krople", icon: Droplets },
  { value: "Sun", label: "Słońce", icon: Sun },
  { value: "Wheat", label: "Zboże", icon: Wheat },
  { value: "TreePine", label: "Drzewo", icon: TreePine },
];

interface SectionContent {
  [key: string]: string | undefined;
}

interface ContentSection {
  key: string;
  label: string;
  fields: { name: string; label: string; type: "input" | "textarea" | "icon" }[];
}

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  media_type: "image" | "video";
}

const sections: ContentSection[] = [
  {
    key: "hero",
    label: "Hero",
    fields: [
      { name: "title", label: "Tytuł", type: "input" },
      { name: "subtitle", label: "Podtytuł", type: "textarea" },
      { name: "badge", label: "Odznaka", type: "input" },
    ],
  },
  {
    key: "about",
    label: "O nas (główna)",
    fields: [
      { name: "title", label: "Tytuł", type: "input" },
      { name: "badge", label: "Odznaka", type: "input" },
      { name: "paragraph1", label: "Akapit 1", type: "textarea" },
      { name: "paragraph2", label: "Akapit 2", type: "textarea" },
      { name: "highlight", label: "Wyróżnienie", type: "textarea" },
    ],
  },
  {
    key: "about_page",
    label: "O nas (strona)",
    fields: [
      // Hero sekcja
      { name: "hero_title", label: "Hero - Tytuł", type: "input" },
      { name: "hero_badge", label: "Hero - Odznaka", type: "input" },
      { name: "hero_paragraph1", label: "Hero - Opis", type: "textarea" },
      // Historia sekcja
      { name: "story_title", label: "Historia - Tytuł", type: "input" },
      { name: "story_paragraph1", label: "Historia - Akapit 1", type: "textarea" },
      { name: "story_paragraph2", label: "Historia - Akapit 2", type: "textarea" },
      { name: "story_paragraph3", label: "Historia - Akapit 3", type: "textarea" },
      { name: "story_highlight", label: "Historia - Wyróżnienie", type: "textarea" },
      // Statystyki
      { name: "stat1_value", label: "Statystyka 1 - Wartość", type: "input" },
      { name: "stat1_label", label: "Statystyka 1 - Etykieta", type: "input" },
      { name: "stat1_icon", label: "Statystyka 1 - Ikona", type: "icon" },
      { name: "stat2_value", label: "Statystyka 2 - Wartość", type: "input" },
      { name: "stat2_label", label: "Statystyka 2 - Etykieta", type: "input" },
      { name: "stat2_icon", label: "Statystyka 2 - Ikona", type: "icon" },
      { name: "stat3_value", label: "Statystyka 3 - Wartość", type: "input" },
      { name: "stat3_label", label: "Statystyka 3 - Etykieta", type: "input" },
      { name: "stat3_icon", label: "Statystyka 3 - Ikona", type: "icon" },
      { name: "stat4_value", label: "Statystyka 4 - Wartość", type: "input" },
      { name: "stat4_label", label: "Statystyka 4 - Etykieta", type: "input" },
      { name: "stat4_icon", label: "Statystyka 4 - Ikona", type: "icon" },
      // Wartości
      { name: "value1_title", label: "Wartość 1 - Tytuł", type: "input" },
      { name: "value1_desc", label: "Wartość 1 - Opis", type: "textarea" },
      { name: "value2_title", label: "Wartość 2 - Tytuł", type: "input" },
      { name: "value2_desc", label: "Wartość 2 - Opis", type: "textarea" },
      { name: "value3_title", label: "Wartość 3 - Tytuł", type: "input" },
      { name: "value3_desc", label: "Wartość 3 - Opis", type: "textarea" },
      { name: "value4_title", label: "Wartość 4 - Tytuł", type: "input" },
      { name: "value4_desc", label: "Wartość 4 - Opis", type: "textarea" },
      // Oś czasu
      { name: "timeline_title", label: "Oś czasu - Tytuł", type: "input" },
      { name: "timeline_subtitle", label: "Oś czasu - Podtytuł", type: "textarea" },
      { name: "timeline1_year", label: "Oś 1 - Rok", type: "input" },
      { name: "timeline1_title", label: "Oś 1 - Tytuł", type: "input" },
      { name: "timeline1_desc", label: "Oś 1 - Opis", type: "textarea" },
      { name: "timeline2_year", label: "Oś 2 - Rok", type: "input" },
      { name: "timeline2_title", label: "Oś 2 - Tytuł", type: "input" },
      { name: "timeline2_desc", label: "Oś 2 - Opis", type: "textarea" },
      { name: "timeline3_year", label: "Oś 3 - Rok", type: "input" },
      { name: "timeline3_title", label: "Oś 3 - Tytuł", type: "input" },
      { name: "timeline3_desc", label: "Oś 3 - Opis", type: "textarea" },
      { name: "timeline4_year", label: "Oś 4 - Rok", type: "input" },
      { name: "timeline4_title", label: "Oś 4 - Tytuł", type: "input" },
      { name: "timeline4_desc", label: "Oś 4 - Opis", type: "textarea" },
      // Lokalizacja
      { name: "location_title", label: "Lokalizacja - Tytuł", type: "input" },
      { name: "location_description", label: "Lokalizacja - Opis", type: "textarea" },
      { name: "location_cta", label: "Lokalizacja - Przycisk", type: "input" },
      // Galeria
      { name: "gallery_title", label: "Galeria - Tytuł", type: "input" },
      { name: "gallery_subtitle", label: "Galeria - Podtytuł", type: "textarea" },
    ],
  },
  {
    key: "products",
    label: "Produkty",
    fields: [
      { name: "title", label: "Tytuł", type: "input" },
      { name: "subtitle", label: "Podtytuł", type: "textarea" },
      { name: "badge", label: "Odznaka", type: "input" },
      { name: "coming_soon", label: "Wkrótce", type: "textarea" },
    ],
  },
  {
    key: "contact",
    label: "Kontakt",
    fields: [
      { name: "title", label: "Tytuł", type: "input" },
      { name: "subtitle", label: "Podtytuł", type: "textarea" },
      { name: "phone", label: "Telefon", type: "input" },
      { name: "email", label: "Email", type: "input" },
      { name: "address", label: "Adres", type: "input" },
    ],
  },
  {
    key: "footer",
    label: "Stopka",
    fields: [{ name: "tagline", label: "Tekst", type: "textarea" }],
  },
];

export function AdminCMS() {
  const { toast } = useToast();
  const [contents, setContents] = useState<Record<string, SectionContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAllContent();
    fetchGalleryItems();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("section_key, content");

    if (!error && data) {
      const contentMap: Record<string, SectionContent> = {};
      data.forEach((item) => {
        contentMap[item.section_key] = item.content as SectionContent;
      });
      setContents(contentMap);
    }
    setLoading(false);
  };

  const fetchGalleryItems = async () => {
    const { data, error } = await supabase
      .from("about_gallery")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setGalleryItems(data as GalleryItem[]);
    }
    setGalleryLoading(false);
  };

  const handleSave = async (sectionKey: string) => {
    setSaving(sectionKey);
    const content = contents[sectionKey] || {};

    const { error } = await supabase
      .from("site_content")
      .update({ content })
      .eq("section_key", sectionKey);

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać zmian",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Zapisano",
        description: "Zmiany zostały zapisane",
      });
    }
    setSaving(null);
  };

  const updateField = (sectionKey: string, fieldName: string, value: string) => {
    setContents((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldName]: value,
      },
    }));
  };

  // Gallery functions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image" && !file.type.startsWith("image/")) {
      toast({ title: "Błąd", description: "Wybierz plik graficzny", variant: "destructive" });
      return;
    }
    if (type === "video" && !file.type.startsWith("video/")) {
      toast({ title: "Błąd", description: "Wybierz plik wideo", variant: "destructive" });
      return;
    }

    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: "Błąd", description: `Plik za duży (max ${type === "video" ? "50MB" : "10MB"})`, variant: "destructive" });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `about-gallery/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);

    if (uploadError) {
      toast({ title: "Błąd", description: "Nie udało się przesłać pliku", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
    const maxOrder = galleryItems.length > 0 ? Math.max(...galleryItems.map(item => item.display_order)) : -1;

    const { error: insertError } = await supabase.from("about_gallery").insert({
      image_url: urlData.publicUrl,
      display_order: maxOrder + 1,
      media_type: type,
    });

    if (insertError) {
      toast({ title: "Błąd", description: "Nie udało się dodać do galerii", variant: "destructive" });
    } else {
      toast({ title: "Sukces", description: type === "video" ? "Film dodany" : "Zdjęcie dodane" });
      fetchGalleryItems();
    }

    setUploading(false);
    e.target.value = "";
  };

  const updateCaption = async (id: string, caption: string) => {
    await supabase.from("about_gallery").update({ caption }).eq("id", id);
    setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, caption } : item));
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from("about_gallery").update({ is_active }).eq("id", id);
    setGalleryItems(prev => prev.map(item => item.id === id ? { ...item, is_active } : item));
    toast({ title: is_active ? "Element aktywny" : "Element ukryty" });
  };

  const deleteGalleryItem = async (id: string, imageUrl: string) => {
    await supabase.from("about_gallery").delete().eq("id", id);
    const path = imageUrl.split("/product-images/")[1];
    if (path) await supabase.storage.from("product-images").remove([path]);
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    toast({ title: "Usunięto" });
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const currentIndex = galleryItems.findIndex(item => item.id === id);
    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === galleryItems.length - 1)) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newItems = [...galleryItems];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];

    for (let i = 0; i < newItems.length; i++) {
      await supabase.from("about_gallery").update({ display_order: i }).eq("id", newItems[i].id);
    }
    setGalleryItems(newItems.map((item, idx) => ({ ...item, display_order: idx })));
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
        <CardTitle>Edycja treści strony</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hero">
          <TabsList className="grid grid-cols-6 mb-6">
            {sections.map((section) => (
              <TabsTrigger key={section.key} value={section.key} className="text-xs md:text-sm">
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.key} value={section.key} className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.type === "icon" ? (
                    <Select
                      value={contents[section.key]?.[field.name] || ""}
                      onValueChange={(val) => updateField(section.key, field.name, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz ikonę">
                          {(() => {
                            const selected = ICON_OPTIONS.find(o => o.value === contents[section.key]?.[field.name]);
                            if (!selected) return "Wybierz ikonę";
                            const IconComp = selected.icon;
                            return <span className="flex items-center gap-2"><IconComp className="w-4 h-4" /> {selected.label}</span>;
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => {
                          const IconComp = opt.icon;
                          return (
                            <SelectItem key={opt.value} value={opt.value}>
                              <span className="flex items-center gap-2"><IconComp className="w-4 h-4" /> {opt.label}</span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : field.type === "input" ? (
                    <Input
                      value={contents[section.key]?.[field.name] || ""}
                      onChange={(e) => updateField(section.key, field.name, e.target.value)}
                    />
                  ) : (
                    <Textarea
                      value={contents[section.key]?.[field.name] || ""}
                      onChange={(e) => updateField(section.key, field.name, e.target.value)}
                      rows={3}
                    />
                  )}
                </div>
              ))}

              <Button
                onClick={() => handleSave(section.key)}
                disabled={saving === section.key}
              >
                {saving === section.key ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Zapisz {section.label}
              </Button>

              {/* Gallery management for about_page section */}
              {section.key === "about_page" && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold text-lg mb-4">Zdjęcia i filmy w galerii</h3>
                  
                  {/* Upload buttons */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "image")}
                        className="hidden"
                        id="cms-image-upload"
                        disabled={uploading}
                      />
                      <Label htmlFor="cms-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : <Image className="w-6 h-6 text-muted-foreground" />}
                        <span className="text-sm text-muted-foreground">Dodaj zdjęcie</span>
                      </Label>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, "video")}
                        className="hidden"
                        id="cms-video-upload"
                        disabled={uploading}
                      />
                      <Label htmlFor="cms-video-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : <Video className="w-6 h-6 text-muted-foreground" />}
                        <span className="text-sm text-muted-foreground">Dodaj film</span>
                      </Label>
                    </div>
                  </div>

                  {/* Gallery items list */}
                  {galleryLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : galleryItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Brak elementów w galerii. Dodaj zdjęcie lub film powyżej.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {galleryItems.map((item, index) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${item.is_active ? "bg-card" : "bg-muted/50 opacity-60"}`}
                        >
                          <div className="flex flex-col">
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem(item.id, "up")} disabled={index === 0}>
                              <GripVertical className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="relative w-16 h-16 flex-shrink-0">
                            {item.media_type === "video" ? (
                              <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                <Video className="w-6 h-6 text-muted-foreground" />
                              </div>
                            ) : (
                              <img src={item.image_url} alt="" className="w-full h-full object-cover rounded" />
                            )}
                            <span className={`absolute top-0.5 left-0.5 text-[10px] px-1 py-0.5 rounded ${item.media_type === "video" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
                              {item.media_type === "video" ? "Film" : "Foto"}
                            </span>
                          </div>

                          <Input
                            placeholder="Podpis (opcjonalny)"
                            value={item.caption || ""}
                            onChange={(e) => updateCaption(item.id, e.target.value)}
                            className="flex-1"
                          />

                          <Button variant="ghost" size="icon" onClick={() => toggleActive(item.id, !item.is_active)}>
                            {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteGalleryItem(item.id, item.image_url)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
