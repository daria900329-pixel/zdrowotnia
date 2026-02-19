import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string;
  is_published: boolean;
  display_order: number;
}

const categories = [
  { value: "przepis", label: "Przepis" },
  { value: "porada", label: "Porada" },
  { value: "fermentacja", label: "Fermentacja" },
  { value: "zdrowie", label: "Zdrowie" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e")
    .replace(/ł/g, "l").replace(/ń/g, "n").replace(/ó/g, "o")
    .replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    cover_image_url: "", category: "przepis", is_published: false, display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, cover_image_url, category, is_published, display_order")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", cover_image_url: "", category: "przepis", is_published: false, display_order: 0 });
    setEditingId(null);
  };

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      cover_image_url: post.cover_image_url ?? "",
      category: post.category,
      is_published: post.is_published,
      display_order: post.display_order,
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast({ title: "Tytuł jest wymagany", variant: "destructive" });
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image_url: form.cover_image_url || null,
      category: form.category,
      is_published: form.is_published,
      display_order: form.display_order,
    };

    if (editingId) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Błąd zapisu", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Zapisano zmiany" });
        resetForm();
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) {
        toast({ title: "Błąd tworzenia", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Artykuł dodany" });
        resetForm();
        fetchPosts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć ten artykuł?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  const togglePublished = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ is_published: !post.is_published }).eq("id", post.id);
    fetchPosts();
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-card border border-border/30 rounded-2xl p-6">
        <h3 className="font-serif text-xl font-semibold mb-5">
          {editingId ? "Edytuj artykuł" : "Nowy artykuł"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Tytuł</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
              placeholder="Domowy ocet jabłkowy krok po kroku"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="domowy-ocet-jablkowy"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Kategoria</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>URL okładki (opcjonalnie)</Label>
            <Input
              value={form.cover_image_url}
              onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Zajawka (krótki opis)</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="Kilka słów wprowadzenia..."
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Treść</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              placeholder="Pełna treść artykułu..."
              className="mt-1 font-mono text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={form.is_published}
              onCheckedChange={(v) => setForm({ ...form, is_published: v })}
            />
            <Label htmlFor="published">Opublikowany</Label>
          </div>
          <div>
            <Label>Kolejność wyświetlania</Label>
            <Input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
              className="mt-1 w-24"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? "Zapisz zmiany" : "Dodaj artykuł"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>Anuluj</Button>
          )}
        </div>
      </div>

      {/* List */}
      <div>
        <h3 className="font-serif text-xl font-semibold mb-4">Artykuły ({posts.length})</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">Brak artykułów. Dodaj pierwszy powyżej.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-card border border-border/30 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePublished(post)}
                    title={post.is_published ? "Ukryj" : "Opublikuj"}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(post.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
