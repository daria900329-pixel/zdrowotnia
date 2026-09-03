import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Mail, Save } from "lucide-react";

type Status = "unread" | "to_reply" | "replied" | "archived";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: Status;
  admin_note: string | null;
  replied_at: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<Status, string> = {
  unread: "Nieprzeczytane",
  to_reply: "Do odpowiedzi",
  replied: "Odpowiedziane",
  archived: "Archiwum",
};

const FILTERS: Array<{ key: Status | "all"; label: string }> = [
  { key: "unread", label: "Nieprzeczytane" },
  { key: "to_reply", label: "Do odpowiedzi" },
  { key: "replied", label: "Odpowiedziane" },
  { key: "archived", label: "Archiwum" },
  { key: "all", label: "Wszystkie" },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("unread");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Błąd", description: "Nie udało się pobrać wiadomości", variant: "destructive" });
    } else {
      setMessages((data || []) as Message[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: messages.length };
    for (const m of messages) base[m.status] = (base[m.status] || 0) + 1;
    return base;
  }, [messages]);

  const visible = filter === "all" ? messages : messages.filter((m) => m.status === filter);

  const updateMessage = async (id: string, patch: Partial<Message>) => {
    const { error } = await supabase.from("contact_messages").update(patch).eq("id", id);
    if (error) {
      toast({ title: "Błąd", description: "Nie udało się zapisać zmiany", variant: "destructive" });
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } as Message : m)));
  };

  const setStatus = (m: Message, status: Status) =>
    updateMessage(m.id, {
      status,
      replied_at: status === "replied" ? new Date().toISOString() : m.replied_at,
    });

  const removeMessage = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast({ title: "Błąd", description: "Nie udało się usunąć wiadomości", variant: "destructive" });
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast({ title: "Usunięto", description: "Wiadomość została usunięta" });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filter === f.key ? "default" : "outline"}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="ml-2 opacity-70">{counts[f.key] || 0}</span>
          </Button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Brak wiadomości w tej kategorii.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((m) => (
            <Card key={m.id} className={m.status === "unread" ? "border-primary/40" : undefined}>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{m.name}</p>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {m.email}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(m.created_at)}</p>
                  </div>
                  <Badge variant={m.status === "unread" ? "default" : "secondary"}>
                    {STATUS_LABELS[m.status]}
                  </Badge>
                </div>

                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{m.message}</p>

                <div className="space-y-2">
                  <Textarea
                    rows={2}
                    placeholder="Notatka wewnętrzna…"
                    value={notes[m.id] ?? m.admin_note ?? ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [m.id]: e.target.value }))}
                    className="resize-none"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMessage(m.id, { admin_note: notes[m.id] ?? m.admin_note ?? "" })}
                  >
                    <Save className="w-4 h-4 mr-2" /> Zapisz notatkę
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {(Object.keys(STATUS_LABELS) as Status[])
                    .filter((s) => s !== m.status)
                    .map((s) => (
                      <Button key={s} size="sm" variant="secondary" onClick={() => setStatus(m, s)}>
                        {STATUS_LABELS[s]}
                      </Button>
                    ))}
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent("Odpowiedź — Zdrowotnia")}`}>
                      <Mail className="w-4 h-4 mr-2" /> Odpisz
                    </a>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => removeMessage(m.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
