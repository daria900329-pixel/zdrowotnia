import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Eye, EyeOff, Mail, Code, Plus, Trash2, Blocks, FileCode } from "lucide-react";
import { EmailBlockEditor, type EmailBlock } from "./email/EmailBlockEditor";
import { emailBlocksToHtml } from "./email/emailBlocksToHtml";
import { EmailPreview } from "./email/EmailPreview";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject: string;
  html_content: string;
  description: string | null;
  available_variables: string[];
  is_active: boolean;
}

type EditorMode = "visual" | "code";

const TEMPLATE_PRESETS: { key: string; label: string; description: string; variables: string[]; defaultBlocks: EmailBlock[] }[] = [
  {
    key: "order_confirmation",
    label: "Potwierdzenie zamówienia",
    description: "Wysyłany automatycznie po opłaceniu zamówienia",
    variables: ["{{customer_email}}", "{{order_id}}", "{{order_id_short}}", "{{order_total}}", "{{order_items}}", "{{order_date}}"],
    defaultBlocks: [
      { id: "h1", type: "header", content: "Dziękujemy za zamówienie! 🌿", styles: { fontSize: "26", color: "#3d2e22", fontWeight: "bold", textAlign: "center", fontFamily: "Georgia, serif" } },
      { id: "d1", type: "divider", content: "", styles: { color: "#e8e0d8", height: "1" } },
      { id: "t1", type: "text", content: "Cześć! Twoje zamówienie {{order_id_short}} zostało opłacone i jest przygotowywane do wysyłki.", styles: { fontSize: "15", color: "#5c4a3a", textAlign: "left", fontFamily: "Arial, sans-serif" } },
      { id: "t2", type: "text", content: "Zamówione produkty:", styles: { fontSize: "15", color: "#3d2e22", textAlign: "left", fontFamily: "Arial, sans-serif" } },
      { id: "items", type: "items_placeholder", content: "{{order_items}}", styles: { fontSize: "14", color: "#5c4a3a" } },
      { id: "d2", type: "divider", content: "", styles: { color: "#e8e0d8", height: "1" } },
      { id: "t3", type: "text", content: "Łączna kwota: {{order_total}}\nData zamówienia: {{order_date}}", styles: { fontSize: "15", color: "#3d2e22", textAlign: "left", fontFamily: "Arial, sans-serif" } },
      { id: "s1", type: "spacer", content: "", styles: { height: "16" } },
      { id: "t4", type: "text", content: "Pozdrawiamy,\nZespół Zdrowotnia 🌱", styles: { fontSize: "14", color: "#7a6b5d", textAlign: "center", fontFamily: "Arial, sans-serif" } },
    ],
  },
  {
    key: "shipping_notification",
    label: "Powiadomienie o wysyłce",
    description: "Wysyłany gdy zamówienie zostanie wysłane",
    variables: ["{{customer_email}}", "{{order_id}}", "{{order_id_short}}", "{{tracking_url}}"],
    defaultBlocks: [
      { id: "h1", type: "header", content: "Twoje zamówienie jest w drodze! 📦", styles: { fontSize: "26", color: "#3d2e22", fontWeight: "bold", textAlign: "center", fontFamily: "Georgia, serif" } },
      { id: "d1", type: "divider", content: "", styles: { color: "#e8e0d8", height: "1" } },
      { id: "t1", type: "text", content: "Zamówienie {{order_id_short}} zostało wysłane! Paczka powinna dotrzeć do Ciebie w ciągu 2-3 dni roboczych.", styles: { fontSize: "15", color: "#5c4a3a", textAlign: "left", fontFamily: "Arial, sans-serif" } },
      { id: "b1", type: "button", content: "Śledź przesyłkę", styles: { backgroundColor: "#6b8e5e", color: "#ffffff", fontSize: "16", borderRadius: "6", padding: "12", textAlign: "center", href: "{{tracking_url}}" } },
      { id: "s1", type: "spacer", content: "", styles: { height: "16" } },
      { id: "t2", type: "text", content: "Pozdrawiamy,\nZespół Zdrowotnia 🌱", styles: { fontSize: "14", color: "#7a6b5d", textAlign: "center", fontFamily: "Arial, sans-serif" } },
    ],
  },
  {
    key: "custom",
    label: "Własny szablon",
    description: "Pusty szablon do dowolnego użycia",
    variables: ["{{customer_email}}"],
    defaultBlocks: [
      { id: "h1", type: "header", content: "Tytuł wiadomości", styles: { fontSize: "24", color: "#3d2e22", fontWeight: "bold", textAlign: "center", fontFamily: "Georgia, serif" } },
      { id: "t1", type: "text", content: "Treść wiadomości...", styles: { fontSize: "15", color: "#5c4a3a", textAlign: "left", fontFamily: "Arial, sans-serif" } },
    ],
  },
];

const templateKeyLabels: Record<string, string> = {
  order_confirmation: "Potwierdzenie zamówienia",
  order_ready: "Zamówienie gotowe do wysyłki",
  shipping_notification: "Zamówienie wysłane",
  promotion: "Akcja promocyjna",
};

export function AdminEmailTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EmailTemplate>>({});
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTemplateKey, setNewTemplateKey] = useState("");
  const [newCustomKey, setNewCustomKey] = useState("");
  const [newSubject, setNewSubject] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("created_at");

    if (error) {
      toast({ title: "Błąd", description: "Nie udało się pobrać szablonów.", variant: "destructive" });
    } else {
      setTemplates((data as unknown as EmailTemplate[]) || []);
    }
    setLoading(false);
  }

  async function handleSave(id: string) {
    setSaving(id);
    let htmlContent = editForm.html_content;

    // If in visual mode, generate HTML from blocks
    if (editorMode === "visual") {
      htmlContent = emailBlocksToHtml(blocks);
    }

    const { error } = await supabase
      .from("email_templates")
      .update({
        subject: editForm.subject,
        html_content: htmlContent,
        is_active: editForm.is_active,
      })
      .eq("id", id);

    if (error) {
      toast({ title: "Błąd", description: "Nie udało się zapisać szablonu.", variant: "destructive" });
    } else {
      toast({ title: "Zapisano", description: "Szablon został zaktualizowany." });
      setEditingId(null);
      fetchTemplates();
    }
    setSaving(null);
  }

  function startEdit(template: EmailTemplate) {
    setEditingId(template.id);
    setEditForm({
      subject: template.subject,
      html_content: template.html_content,
      is_active: template.is_active,
    });
    setPreviewId(null);
    setEditorMode("code");
    setBlocks([]);
  }

  function startVisualEdit(template: EmailTemplate) {
    setEditingId(template.id);
    setEditForm({
      subject: template.subject,
      html_content: template.html_content,
      is_active: template.is_active,
    });
    setPreviewId(null);
    setEditorMode("visual");
    // Try to find a preset to start with blocks
    const preset = TEMPLATE_PRESETS.find((p) => p.key === template.template_key);
    setBlocks(preset ? preset.defaultBlocks.map((b) => ({ ...b, id: Math.random().toString(36).substring(2, 9) })) : []);
  }

  async function handleAddTemplate() {
    const preset = TEMPLATE_PRESETS.find((p) => p.key === newTemplateKey);
    const key = newTemplateKey === "custom" ? (newCustomKey || `custom_${Date.now()}`) : newTemplateKey;

    if (!key || !newSubject) {
      toast({ title: "Błąd", description: "Uzupełnij nazwę i temat.", variant: "destructive" });
      return;
    }

    // Check duplicate
    if (templates.some((t) => t.template_key === key)) {
      toast({ title: "Błąd", description: "Szablon z takim kluczem już istnieje.", variant: "destructive" });
      return;
    }

    const htmlContent = preset ? emailBlocksToHtml(preset.defaultBlocks) : emailBlocksToHtml(TEMPLATE_PRESETS[2].defaultBlocks);

    const { error } = await supabase.from("email_templates").insert({
      template_key: key,
      subject: newSubject,
      html_content: htmlContent,
      description: preset?.description || null,
      available_variables: preset?.variables || ["{{customer_email}}"],
      is_active: true,
    });

    if (error) {
      toast({ title: "Błąd", description: "Nie udało się dodać szablonu.", variant: "destructive" });
    } else {
      toast({ title: "Dodano", description: "Nowy szablon e-mail został utworzony." });
      setAddDialogOpen(false);
      setNewTemplateKey("");
      setNewCustomKey("");
      setNewSubject("");
      fetchTemplates();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć ten szablon?")) return;

    const { error } = await supabase.from("email_templates").delete().eq("id", id);
    if (error) {
      toast({ title: "Błąd", description: "Nie udało się usunąć szablonu.", variant: "destructive" });
    } else {
      toast({ title: "Usunięto", description: "Szablon został usunięty." });
      if (editingId === id) setEditingId(null);
      fetchTemplates();
    }
  }

  function getPreviewHtml(template: EmailTemplate) {
    return editingId === template.id
      ? (editorMode === "visual" ? emailBlocksToHtml(blocks) : editForm.html_content || "")
      : template.html_content;
  }

  // When switching from visual to code, sync blocks → HTML
  function handleModeSwitch(mode: EditorMode) {
    if (mode === "code" && editorMode === "visual") {
      setEditForm({ ...editForm, html_content: emailBlocksToHtml(blocks) });
    }
    setEditorMode(mode);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-lg">Szablony e-mail</h3>
            <p className="text-sm text-muted-foreground">
              Twórz i edytuj automatyczne wiadomości dla klientów.
            </p>
          </div>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Dodaj szablon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nowy szablon e-mail</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Typ szablonu</Label>
                <Select value={newTemplateKey} onValueChange={(v) => {
                  setNewTemplateKey(v);
                  const preset = TEMPLATE_PRESETS.find((p) => p.key === v);
                  if (preset && v !== "custom") {
                    setNewSubject(
                      v === "order_confirmation" ? "Potwierdzenie zamówienia {{order_id_short}} – Zdrowotnia" :
                      v === "shipping_notification" ? "Twoje zamówienie {{order_id_short}} jest w drodze!" : ""
                    );
                  }
                }}>
                  <SelectTrigger><SelectValue placeholder="Wybierz typ..." /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_PRESETS.map((p) => (
                      <SelectItem key={p.key} value={p.key}>
                        <div>
                          <span className="font-medium">{p.label}</span>
                          <span className="text-muted-foreground ml-2 text-xs">{p.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newTemplateKey === "custom" && (
                <div className="space-y-2">
                  <Label>Klucz szablonu (unikalny identyfikator)</Label>
                  <Input
                    value={newCustomKey}
                    onChange={(e) => setNewCustomKey(e.target.value.replace(/[^a-z0-9_]/g, ""))}
                    placeholder="np. welcome_email"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Temat wiadomości</Label>
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="np. Dziękujemy za zamówienie!"
                />
              </div>

              <Button onClick={handleAddTemplate} className="w-full" disabled={!newTemplateKey || !newSubject}>
                <Plus className="w-4 h-4 mr-2" />
                Utwórz szablon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Brak szablonów e-mail.</p>
            <p className="text-sm mt-1">Kliknij „Dodaj szablon", aby utworzyć pierwszy.</p>
          </CardContent>
        </Card>
      ) : (
        templates.map((template) => {
          const isEditing = editingId === template.id;
          const isPreviewing = previewId === template.id;

          return (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">
                      {templateKeyLabels[template.template_key] || template.template_key}
                    </CardTitle>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Aktywny" : "Nieaktywny"}
                    </Badge>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewId(isPreviewing ? null : template.id)}
                    >
                      {isPreviewing ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {isPreviewing ? "Ukryj" : "Podgląd"}
                    </Button>
                    {!isEditing ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startVisualEdit(template)}>
                          <Blocks className="w-4 h-4 mr-1" />
                          Edytor wizualny
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => startEdit(template)}>
                          <FileCode className="w-4 h-4 mr-1" />
                          Edytor kodu
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSave(template.id)}
                          disabled={saving === template.id}
                        >
                          {saving === template.id ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-1" />
                          )}
                          Zapisz
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Anuluj
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Available variables */}
                {template.available_variables && template.available_variables.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Dostępne zmienne (kliknij by skopiować):</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {template.available_variables.map((v) => (
                        <Badge
                          key={v}
                          variant="outline"
                          className="text-xs font-mono cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(v);
                            toast({ title: "Skopiowano", description: v });
                          }}
                        >
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={editForm.is_active}
                        onCheckedChange={(val) => setEditForm({ ...editForm, is_active: val })}
                      />
                      <Label>Aktywny</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Temat wiadomości</Label>
                      <Input
                        value={editForm.subject || ""}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      />
                    </div>

                    {/* Mode tabs */}
                    <Tabs value={editorMode} onValueChange={(v) => handleModeSwitch(v as EditorMode)}>
                      <TabsList className="grid grid-cols-2 w-fit">
                        <TabsTrigger value="visual" className="gap-1.5">
                          <Blocks className="w-3.5 h-3.5" />
                          Wizualny
                        </TabsTrigger>
                        <TabsTrigger value="code" className="gap-1.5">
                          <FileCode className="w-3.5 h-3.5" />
                          Kod HTML
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="visual" className="mt-4">
                        <EmailBlockEditor blocks={blocks} onChange={setBlocks} />
                      </TabsContent>

                      <TabsContent value="code" className="mt-4">
                        <div className="space-y-2">
                          <Label>Treść HTML</Label>
                          <Textarea
                            value={editForm.html_content || ""}
                            onChange={(e) => setEditForm({ ...editForm, html_content: e.target.value })}
                            rows={16}
                            className="font-mono text-xs"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {isPreviewing && (
                  <EmailPreview html={getPreviewHtml(template)} />
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
