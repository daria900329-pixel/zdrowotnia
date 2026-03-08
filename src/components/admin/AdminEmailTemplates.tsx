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
import { Loader2, Save, Eye, EyeOff, Mail, Code } from "lucide-react";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject: string;
  html_content: string;
  description: string | null;
  available_variables: string[];
  is_active: boolean;
}

export function AdminEmailTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EmailTemplate>>({});
  const [previewId, setPreviewId] = useState<string | null>(null);

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
    const { error } = await supabase
      .from("email_templates")
      .update({
        subject: editForm.subject,
        html_content: editForm.html_content,
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
  }

  function getPreviewHtml(template: EmailTemplate) {
    let html = editingId === template.id ? (editForm.html_content || "") : template.html_content;
    html = html
      .replace(/\{\{customer_email\}\}/g, "jan@example.com")
      .replace(/\{\{order_id\}\}/g, "abc12345-6789-0000-1111-222233334444")
      .replace(/\{\{order_id_short\}\}/g, "ABC123")
      .replace(/\{\{order_total\}\}/g, "89,00 zł")
      .replace(/\{\{order_date\}\}/g, new Date().toLocaleDateString("pl-PL"))
      .replace(/\{\{order_items\}\}/g, `
        <div style="padding: 12px 0;">
          <p style="color: #5c4a3a; margin: 4px 0;"><strong>Ocet jabłkowy</strong> – Mały (250 ml) × 2 — 38,00 zł</p>
          <p style="color: #5c4a3a; margin: 4px 0;"><strong>Kombucha</strong> – Duży (500 ml) × 1 — 51,00 zł</p>
        </div>
      `);
    return html;
  }

  const templateKeyLabels: Record<string, string> = {
    order_confirmation: "Potwierdzenie zamówienia",
    shipping_notification: "Powiadomienie o wysyłce",
  };

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
      <div className="flex items-center gap-3 mb-2">
        <Mail className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-semibold text-lg">Szablony e-mail</h3>
          <p className="text-sm text-muted-foreground">
            Edytuj treść automatycznych wiadomości wysyłanych do klientów. Użyj zmiennych w podwójnych klamrach.
          </p>
        </div>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Brak szablonów e-mail. Zostaną utworzone automatycznie.
          </CardContent>
        </Card>
      ) : (
        templates.map((template) => {
          const isEditing = editingId === template.id;
          const isPreviewing = previewId === template.id;

          return (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">
                      {templateKeyLabels[template.template_key] || template.template_key}
                    </CardTitle>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Aktywny" : "Nieaktywny"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewId(isPreviewing ? null : template.id)}
                    >
                      {isPreviewing ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {isPreviewing ? "Ukryj" : "Podgląd"}
                    </Button>
                    {!isEditing ? (
                      <Button size="sm" onClick={() => startEdit(template)}>
                        <Code className="w-4 h-4 mr-1" />
                        Edytuj
                      </Button>
                    ) : (
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
                    )}
                  </div>
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Available variables */}
                {template.available_variables.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Dostępne zmienne:</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {template.available_variables.map((v) => (
                        <Badge key={v} variant="outline" className="text-xs font-mono cursor-pointer"
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
                  <>
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
                    <div className="space-y-2">
                      <Label>Treść HTML</Label>
                      <Textarea
                        value={editForm.html_content || ""}
                        onChange={(e) => setEditForm({ ...editForm, html_content: e.target.value })}
                        rows={16}
                        className="font-mono text-xs"
                      />
                    </div>
                  </>
                )}

                {isPreviewing && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-3 py-2 text-xs text-muted-foreground border-b">
                      Podgląd z przykładowymi danymi
                    </div>
                    <iframe
                      srcDoc={getPreviewHtml(template)}
                      className="w-full h-[400px] bg-white"
                      title="Email preview"
                      sandbox=""
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
