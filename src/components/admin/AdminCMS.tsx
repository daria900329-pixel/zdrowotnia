import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Plus, Trash2, Eye, EyeOff, Image, Video, GripVertical, Clock, Users, Leaf, Award, Heart, Sparkles, Home, MapPin, Star, ShieldCheck, Flame, Droplets, Sun, Wheat, TreePine, ImageIcon, Volume2, X, type LucideIcon } from "lucide-react";
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
  is_hero: boolean;
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
      { name: "order_title", label: "Jak zamówić — Tytuł", type: "input" },
      { name: "order_description", label: "Jak zamówić — Opis", type: "textarea" },
    ],
  },
  {
    key: "footer",
    label: "Stopka",
    fields: [{ name: "tagline", label: "Tekst", type: "textarea" }],
  },
];

interface AboutSubSection {
  id: string;
  label: string;
  fields: { name: string; label: string; type: "input" | "textarea" | "icon" }[];
}

const aboutSubSections: AboutSubSection[] = [
  {
    id: "hero",
    label: "Nagłówek",
    fields: [
      { name: "hero_title", label: "Tytuł", type: "input" },
      { name: "hero_badge", label: "Odznaka", type: "input" },
      { name: "hero_paragraph1", label: "Opis", type: "textarea" },
    ],
  },
  {
    id: "stats",
    label: "Statystyki",
    fields: [
      { name: "stat1_value", label: "Statystyka 1 - Wartość (np. 6+)", type: "input" },
      { name: "stat1_label", label: "Statystyka 1 - Etykieta (np. Lat Doświadczenia)", type: "input" },
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
    ],
  },
  {
    id: "story",
    label: "Historia",
    fields: [
      { name: "story_title", label: "Tytuł", type: "input" },
      { name: "story_highlight", label: "Wyróżnienie", type: "textarea" },
    ],
  },
  {
    id: "values",
    label: "Wartości",
    fields: [
      { name: "value1_title", label: "Wartość 1 - Tytuł", type: "input" },
      { name: "value1_desc", label: "Wartość 1 - Opis", type: "textarea" },
      { name: "value2_title", label: "Wartość 2 - Tytuł", type: "input" },
      { name: "value2_desc", label: "Wartość 2 - Opis", type: "textarea" },
      { name: "value3_title", label: "Wartość 3 - Tytuł", type: "input" },
      { name: "value3_desc", label: "Wartość 3 - Opis", type: "textarea" },
      { name: "value4_title", label: "Wartość 4 - Tytuł", type: "input" },
      { name: "value4_desc", label: "Wartość 4 - Opis", type: "textarea" },
    ],
  },
  {
    id: "timeline",
    label: "Oś czasu",
    fields: [
      { name: "timeline_title", label: "Tytuł", type: "input" },
      { name: "timeline_subtitle", label: "Podtytuł", type: "textarea" },
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
    ],
  },
  {
    id: "location",
    label: "Lokalizacja",
    fields: [
      { name: "location_title", label: "Tytuł", type: "input" },
      { name: "location_description", label: "Opis", type: "textarea" },
      { name: "location_cta", label: "Przycisk", type: "input" },
    ],
  },
  {
    id: "gallery",
    label: "Galeria",
    fields: [
      { name: "gallery_title", label: "Tytuł", type: "input" },
      { name: "gallery_subtitle", label: "Podtytuł", type: "textarea" },
    ],
  },
];

export function AdminCMS() {
  console.log("[AdminCMS] v3 loaded with sub-tabs and dynamic paragraphs");
  const { toast } = useToast();
  const [contents, setContents] = useState<Record<string, SectionContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);

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
      toast({ title: "Błąd", description: "Nie udało się zapisać zmian", variant: "destructive" });
    } else {
      toast({ title: "Zapisano", description: "Zmiany zostały zapisane" });
    }
    setSaving(null);
  };

  const updateField = (sectionKey: string, fieldName: string, value: string) => {
    setContents((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [fieldName]: value },
    }));
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

    let maxOrder = galleryItems.length > 0 ? Math.max(...galleryItems.map(item => item.display_order)) : -1;
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `about-gallery/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);

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
        description: `Dodano ${succeeded} ${type === "video" ? "filmów" : "zdjęć"}${failed ? `, błędy: ${failed}` : ""}${skipped ? `, pominięto: ${skipped}` : ""}`,
      });
      fetchGalleryItems();
    } else {
      toast({ title: "Błąd", description: "Nie udało się przesłać plików", variant: "destructive" });
    }

    setUploading(false);
    setUploadProgress(null);
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

  const setHeroImage = async (id: string) => {
    // Unset all others, set this one
    await supabase.from("about_gallery").update({ is_hero: false }).neq("id", id);
    await supabase.from("about_gallery").update({ is_hero: true }).eq("id", id);
    setGalleryItems(prev => prev.map(item => ({ ...item, is_hero: item.id === id })));
    toast({ title: "Zdjęcie hero ustawione" });
  };

  // Get story paragraphs from content
  const getStoryParagraphs = () => {
    const paragraphs: { key: string; index: number }[] = [];
    for (let i = 1; i <= 20; i++) {
      if (contents["about_page"]?.[`story_paragraph${i}`] !== undefined) {
        paragraphs.push({ key: `story_paragraph${i}`, index: i });
      }
    }
    if (paragraphs.length === 0) {
      paragraphs.push({ key: "story_paragraph1", index: 1 });
      paragraphs.push({ key: "story_paragraph2", index: 2 });
      paragraphs.push({ key: "story_paragraph3", index: 3 });
    }
    return paragraphs;
  };

  const addParagraph = () => {
    const paragraphs = getStoryParagraphs();
    const nextIndex = Math.max(...paragraphs.map(p => p.index)) + 1;
    updateField("about_page", `story_paragraph${nextIndex}`, "");
  };

  const removeParagraph = (removeKey: string, removeIndex: number) => {
    const updated = { ...contents["about_page"] };
    delete updated[removeKey];
    const remaining: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const val = i === removeIndex ? undefined : updated[`story_paragraph${i}`];
      if (val !== undefined) remaining.push(val);
      delete updated[`story_paragraph${i}`];
    }
    remaining.forEach((val, i) => {
      updated[`story_paragraph${i + 1}`] = val;
    });
    setContents(prev => ({ ...prev, about_page: updated }));
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

  const renderField = (field: { name: string; label: string; type: "input" | "textarea" | "icon" }, sectionKey: string) => (
    <div key={field.name} className="space-y-2">
      <Label>{field.label}</Label>
      {field.type === "icon" ? (
        <Select
          value={contents[sectionKey]?.[field.name] || ""}
          onValueChange={(val) => updateField(sectionKey, field.name, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Wybierz ikonę">
              {(() => {
                const selected = ICON_OPTIONS.find(o => o.value === contents[sectionKey]?.[field.name]);
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
          value={contents[sectionKey]?.[field.name] || ""}
          onChange={(e) => updateField(sectionKey, field.name, e.target.value)}
        />
      ) : (
        <Textarea
          value={contents[sectionKey]?.[field.name] || ""}
          onChange={(e) => updateField(sectionKey, field.name, e.target.value)}
          rows={3}
        />
      )}
    </div>
  );

  const renderGalleryManager = () => (
    <div className="mt-4">
      <h3 className="font-semibold text-lg mb-4">Zdjęcia i filmy w galerii</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
          <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, "image")} className="hidden" id="cms-image-upload" disabled={uploading} />
          <Label htmlFor="cms-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : <Image className="w-6 h-6 text-muted-foreground" />}
            <span className="text-sm text-muted-foreground">{uploading && uploadProgress ? `Przesyłanie ${uploadProgress.done}/${uploadProgress.total}...` : "Dodaj zdjęcia (możesz wybrać wiele)"}</span>
          </Label>
        </div>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
          <input type="file" accept="video/*" multiple onChange={(e) => handleFileUpload(e, "video")} className="hidden" id="cms-video-upload" disabled={uploading} />
          <Label htmlFor="cms-video-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : <Video className="w-6 h-6 text-muted-foreground" />}
            <span className="text-sm text-muted-foreground">{uploading && uploadProgress ? `Przesyłanie ${uploadProgress.done}/${uploadProgress.total}...` : "Dodaj filmy (możesz wybrać wiele)"}</span>
          </Label>
        </div>
      </div>
      {galleryLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : galleryItems.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Brak elementów w galerii.</p>
      ) : (
        <div className="space-y-3">
          {galleryItems.map((item, index) => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border ${item.is_active ? "bg-card" : "bg-muted/50 opacity-60"}`}>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveItem(item.id, "up")} disabled={index === 0}>
                <GripVertical className="w-3 h-3" />
              </Button>
              <div className="relative w-16 h-16 flex-shrink-0">
                {item.media_type === "video" ? (
                  <div className="w-full h-full bg-muted rounded flex items-center justify-center"><Video className="w-6 h-6 text-muted-foreground" /></div>
                ) : (
                  <img src={item.image_url} alt="" className="w-full h-full object-cover rounded" />
                )}
                <span className={`absolute top-0.5 left-0.5 text-[10px] px-1 py-0.5 rounded ${item.media_type === "video" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
                  {item.media_type === "video" ? "Film" : "Foto"}
                </span>
              </div>
              <Input placeholder="Podpis (opcjonalny)" value={item.caption || ""} onChange={(e) => updateCaption(item.id, e.target.value)} className="flex-1" />
              {item.media_type === "image" && (
                <Button
                  variant={item.is_hero ? "default" : "ghost"}
                  size="icon"
                  title={item.is_hero ? "Zdjęcie hero (aktywne)" : "Ustaw jako zdjęcie hero"}
                  onClick={() => setHeroImage(item.id)}
                >
                  <Star className={`w-4 h-4 ${item.is_hero ? "fill-current" : ""}`} />
                </Button>
              )}
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
  );

  const storyParagraphs = getStoryParagraphs();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ustawienia i dane globalne</CardTitle>
        <p className="text-sm text-muted-foreground">
          Dane kontaktowe, stopka i pozostałe ustawienia wspólne dla całego serwisu.
          Teksty i zdjęcia poszczególnych sekcji stron edytujesz w zakładce „Strony”.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hero">
          <TabsList className="flex flex-wrap gap-1 mb-6">
            {sections.map((section) => (
              <TabsTrigger key={section.key} value={section.key} className="text-xs md:text-sm">
                {section.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="about_page" className="text-xs md:text-sm">
              O nas (strona)
            </TabsTrigger>
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.key} value={section.key} className="space-y-4">
              {section.fields.map((field) => renderField(field, section.key))}
              <Button onClick={() => handleSave(section.key)} disabled={saving === section.key}>
                {saving === section.key ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Zapisz {section.label}
              </Button>
            </TabsContent>
          ))}

          <TabsContent value="about_page" className="space-y-4">
            <Tabs defaultValue="stats">
              <TabsList className="flex flex-wrap gap-1 mb-4">
                {aboutSubSections.map((sub) => (
                  <TabsTrigger key={sub.id} value={sub.id} className="text-xs">
                    {sub.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {aboutSubSections.map((sub) => (
                <TabsContent key={sub.id} value={sub.id} className="space-y-4">
                  {sub.fields.map((field) => renderField(field, "about_page"))}

                   {sub.id === "story" && (
                    <div className="space-y-3">
                      {/* Audio upload for story highlight */}
                      <div className="space-y-2 p-4 rounded-lg border border-border bg-secondary/20">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Volume2 className="w-4 h-4" /> Nagranie audio (wyróżnienie)
                        </Label>
                        <p className="text-xs text-muted-foreground">Nagranie odtwarzane po najechaniu kursorem na wyróżniony akapit na stronie O nas.</p>
                        {contents["about_page"]?.story_highlight_audio ? (
                          <div className="flex items-center gap-3">
                            <audio controls src={contents["about_page"].story_highlight_audio} className="flex-1 h-10" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive flex-shrink-0"
                              onClick={() => {
                                const audioUrl = contents["about_page"]?.story_highlight_audio;
                                if (audioUrl) {
                                  const path = audioUrl.split("/product-images/")[1];
                                  if (path) supabase.storage.from("product-images").remove([path]);
                                }
                                updateField("about_page", "story_highlight_audio", "");
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              id="cms-audio-upload"
                              disabled={uploading}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (!file.type.startsWith("audio/")) {
                                  toast({ title: "Błąd", description: "Wybierz plik audio", variant: "destructive" });
                                  return;
                                }
                                if (file.size > 10 * 1024 * 1024) {
                                  toast({ title: "Błąd", description: "Plik za duży (max 10MB)", variant: "destructive" });
                                  return;
                                }
                                setUploading(true);
                                const fileExt = file.name.split(".").pop();
                                const fileName = `about-audio/${Date.now()}.${fileExt}`;
                                const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
                                if (uploadError) {
                                  toast({ title: "Błąd", description: "Nie udało się przesłać pliku", variant: "destructive" });
                                } else {
                                  const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
                                  updateField("about_page", "story_highlight_audio", urlData.publicUrl);
                                  toast({ title: "Sukces", description: "Nagranie dodane — pamiętaj, aby zapisać!" });
                                }
                                setUploading(false);
                                e.target.value = "";
                              }}
                            />
                            <Label htmlFor="cms-audio-upload" className="cursor-pointer flex flex-col items-center gap-2">
                              {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : <Volume2 className="w-6 h-6 text-muted-foreground" />}
                              <span className="text-sm text-muted-foreground">Wgraj nagranie audio (MP3, WAV, max 10MB)</span>
                            </Label>
                          </div>
                        )}
                      </div>

                      <Label className="text-base font-semibold">Akapity</Label>
                      {storyParagraphs.map((p, idx) => (
                        <div key={p.key} className="flex gap-2 items-start">
                          <span className="text-xs text-muted-foreground mt-3 w-6 flex-shrink-0">{idx + 1}.</span>
                          <Textarea
                            value={contents["about_page"]?.[p.key] || ""}
                            onChange={(e) => updateField("about_page", p.key, e.target.value)}
                            rows={3}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive flex-shrink-0 mt-1"
                            onClick={() => removeParagraph(p.key, p.index)}
                            disabled={storyParagraphs.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addParagraph}>
                        <Plus className="w-4 h-4 mr-2" />
                        Dodaj akapit
                      </Button>
                    </div>
                  )}

                  <Button onClick={() => handleSave("about_page")} disabled={saving === "about_page"}>
                    {saving === "about_page" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Zapisz
                  </Button>

                  {sub.id === "gallery" && renderGalleryManager()}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
