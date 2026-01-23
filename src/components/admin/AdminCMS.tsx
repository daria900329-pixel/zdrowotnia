import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";

interface SectionContent {
  [key: string]: string | undefined;
}

interface ContentSection {
  key: string;
  label: string;
  fields: { name: string; label: string; type: "input" | "textarea" }[];
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
    label: "O nas",
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

  useEffect(() => {
    fetchAllContent();
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
          <TabsList className="grid grid-cols-5 mb-6">
            {sections.map((section) => (
              <TabsTrigger key={section.key} value={section.key}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.key} value={section.key} className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.type === "input" ? (
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
