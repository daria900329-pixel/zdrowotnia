import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Phone,
  Mail,
  MapPin,
  Store,
  Pencil,
} from "lucide-react";

type Fulfillment = "pickup" | "delivery";

const STATUSES = [
  { value: "new", label: "Nowe" },
  { value: "confirmed", label: "Potwierdzone" },
  { value: "in_progress", label: "W realizacji" },
  { value: "ready", label: "Gotowe" },
  { value: "completed", label: "Zrealizowane" },
  { value: "cancelled", label: "Anulowane" },
] as const;

interface ManualItem {
  id?: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  unit_price: number;
  quantity: number;
}

interface ManualOrder {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  fulfillment: Fulfillment;
  delivery_address: string | null;
  due_date: string;
  status: string;
  is_paid: boolean;
  note: string | null;
  total_amount: number;
  created_at: string;
  manual_order_items: ManualItem[];
}

interface VariantRow {
  id: string;
  name: string;
  price: number;
  promo_price: number | null;
  product_id: string;
}
interface ProductRow {
  id: string;
  name: string;
  product_variants: VariantRow[];
}

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const PL_DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const PL_MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });

const emptyForm = () => ({
  id: null as string | null,
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  fulfillment: "pickup" as Fulfillment,
  delivery_address: "",
  due_date: toISO(new Date()),
  status: "new",
  is_paid: false,
  note: "",
  items: [] as ManualItem[],
});

export const AdminManualOrders = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<ManualOrder[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(toISO(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const load = async () => {
    setLoading(true);
    const [{ data: o }, { data: p }] = await Promise.all([
      supabase
        .from("manual_orders")
        .select("*, manual_order_items(*)")
        .order("due_date", { ascending: true }),
      supabase
        .from("products")
        .select("id, name, product_variants(id, name, price, promo_price, product_id)")
        .eq("is_active", true)
        .order("display_order"),
    ]);
    setOrders((o as any[])?.map((x) => ({ ...x, manual_order_items: x.manual_order_items ?? [] })) ?? []);
    setProducts((p as any[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------- calendar data ---------- */
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // monday-first
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= total; i++) cells.push(toISO(new Date(month.getFullYear(), month.getMonth(), i)));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [month]);

  const byDay = useMemo(() => {
    const map: Record<string, ManualOrder[]> = {};
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      (map[o.due_date] ||= []).push(o);
    });
    return map;
  }, [orders]);

  const productTotals = (list: ManualOrder[]) => {
    const totals: Record<string, number> = {};
    list.forEach((o) =>
      o.manual_order_items.forEach((it) => {
        const key = it.variant_name ? `${it.product_name} · ${it.variant_name}` : it.product_name;
        totals[key] = (totals[key] ?? 0) + it.quantity;
      })
    );
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  };

  const dayOrders = selectedDay ? byDay[selectedDay] ?? [] : [];

  const monthTotals = useMemo(() => {
    const prefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    return productTotals(orders.filter((o) => o.due_date.startsWith(prefix) && o.status !== "cancelled"));
  }, [orders, month]);

  /* ---------- form ---------- */
  const openNew = (date?: string) => {
    setForm({ ...emptyForm(), due_date: date ?? selectedDay ?? toISO(new Date()) });
    setDialogOpen(true);
  };

  const openEdit = (o: ManualOrder) => {
    setForm({
      id: o.id,
      customer_name: o.customer_name,
      customer_email: o.customer_email ?? "",
      customer_phone: o.customer_phone ?? "",
      fulfillment: o.fulfillment,
      delivery_address: o.delivery_address ?? "",
      due_date: o.due_date,
      status: o.status,
      is_paid: o.is_paid,
      note: o.note ?? "",
      items: o.manual_order_items.map((it) => ({ ...it })),
    });
    setDialogOpen(true);
  };

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        { product_id: null, variant_id: null, product_name: "", variant_name: null, unit_price: 0, quantity: 1 },
      ],
    }));
  };

  const setItem = (idx: number, patch: Partial<ManualItem>) =>
    setForm((f) => ({ ...f, items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) }));

  const pickVariant = (idx: number, value: string) => {
    const [productId, variantId] = value.split("|");
    const product = products.find((p) => p.id === productId);
    const variant = product?.product_variants.find((v) => v.id === variantId);
    setItem(idx, {
      product_id: productId,
      variant_id: variantId || null,
      product_name: product?.name ?? "",
      variant_name: variant?.name ?? null,
      unit_price: Number(variant?.promo_price ?? variant?.price ?? 0),
    });
  };

  const formTotal = form.items.reduce((s, it) => s + Number(it.unit_price) * Number(it.quantity), 0);

  const save = async () => {
    if (!form.customer_name.trim()) {
      toast({ title: "Podaj imię klienta", variant: "destructive" });
      return;
    }
    if (form.items.length === 0 || form.items.some((it) => !it.product_name)) {
      toast({ title: "Dodaj przynajmniej jeden produkt", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      customer_name: form.customer_name.trim(),
      customer_email: form.customer_email.trim() || null,
      customer_phone: form.customer_phone.trim() || null,
      fulfillment: form.fulfillment,
      delivery_address: form.fulfillment === "delivery" ? form.delivery_address.trim() || null : null,
      due_date: form.due_date,
      status: form.status as any,
      is_paid: form.is_paid,
      note: form.note.trim() || null,
      total_amount: formTotal,
    };

    let orderId = form.id;
    if (orderId) {
      const { error } = await supabase.from("manual_orders").update(payload).eq("id", orderId);
      if (error) {
        toast({ title: "Nie udało się zapisać", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      await supabase.from("manual_order_items").delete().eq("order_id", orderId);
    } else {
      const { data, error } = await supabase.from("manual_orders").insert(payload).select("id").single();
      if (error || !data) {
        toast({ title: "Nie udało się zapisać", description: error?.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      orderId = data.id;
    }

    const { error: itemsError } = await supabase.from("manual_order_items").insert(
      form.items.map((it) => ({
        order_id: orderId!,
        product_id: it.product_id,
        variant_id: it.variant_id,
        product_name: it.product_name,
        variant_name: it.variant_name,
        unit_price: Number(it.unit_price),
        quantity: Number(it.quantity),
      }))
    );
    if (itemsError) {
      toast({ title: "Błąd pozycji zamówienia", description: itemsError.message, variant: "destructive" });
    } else {
      toast({ title: form.id ? "Zamówienie zaktualizowane" : "Zamówienie dodane" });
      setDialogOpen(false);
      setSelectedDay(form.due_date);
      setMonth(new Date(Number(form.due_date.slice(0, 4)), Number(form.due_date.slice(5, 7)) - 1, 1));
      await load();
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Usunąć to zamówienie?")) return;
    const { error } = await supabase.from("manual_orders").delete().eq("id", id);
    if (error) toast({ title: "Nie udało się usunąć", variant: "destructive" });
    else {
      toast({ title: "Zamówienie usunięte" });
      load();
    }
  };

  const quickUpdate = async (id: string, patch: Record<string, any>) => {
    const { error } = await supabase.from("manual_orders").update(patch).eq("id", id);
    if (error) toast({ title: "Nie udało się zapisać", variant: "destructive" });
    else load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const todayISO = toISO(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif">Zamówienia ręczne</h2>
          <p className="text-sm text-muted-foreground">
            Zamówienia od klientów z konta i bez konta, z terminem realizacji.
          </p>
        </div>
        <Button onClick={() => openNew()}>
          <Plus className="w-4 h-4 mr-2" /> Nowe zamówienie
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* Calendar */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {PL_MONTHS[month.getMonth()]} {month.getFullYear()}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" aria-label="Poprzedni miesiąc"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Następny miesiąc"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              {PL_DAYS.map((d) => (
                <div key={d} className="text-center py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((iso, i) => {
                if (!iso) return <div key={`e${i}`} />;
                const list = byDay[iso] ?? [];
                const totals = productTotals(list);
                const isSelected = selectedDay === iso;
                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDay(iso)}
                    onDoubleClick={() => openNew(iso)}
                    className={`min-h-[72px] rounded-md border p-1.5 text-left transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${iso === todayISO ? "font-bold text-primary" : "text-muted-foreground"}`}>
                        {Number(iso.slice(8))}
                      </span>
                      {list.length > 0 && (
                        <span className="text-[10px] rounded-full bg-primary/10 text-primary px-1.5">
                          {list.length}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {totals.slice(0, 2).map(([name, qty]) => (
                        <div key={name} className="text-[10px] leading-tight truncate">
                          <span className="font-semibold">{qty}×</span> {name}
                        </div>
                      ))}
                      {totals.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">+{totals.length - 2}…</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {monthTotals.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Do przygotowania w tym miesiącu
                </p>
                <div className="flex flex-wrap gap-2">
                  {monthTotals.map(([name, qty]) => (
                    <Badge key={name} variant="secondary">{qty}× {name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDay ? formatDate(selectedDay) : "Wybierz dzień"}
            </CardTitle>
            {dayOrders.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {productTotals(dayOrders).map(([name, qty]) => (
                  <Badge key={name}>{qty}× {name}</Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {dayOrders.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Brak zamówień na ten dzień.{" "}
                <button className="underline" onClick={() => openNew(selectedDay ?? undefined)}>
                  Dodaj zamówienie
                </button>
              </p>
            )}
            {dayOrders.map((o) => (
              <div key={o.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      {o.customer_phone && (
                        <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{o.customer_phone}</span>
                      )}
                      {o.customer_email && (
                        <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{o.customer_email}</span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        {o.fulfillment === "delivery" ? <MapPin className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                        {o.fulfillment === "delivery" ? o.delivery_address || "Dostawa" : "Odbiór osobisty"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" aria-label="Edytuj zamówienie" onClick={() => openEdit(o)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Usuń zamówienie" onClick={() => remove(o.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <ul className="text-sm space-y-0.5">
                  {o.manual_order_items.map((it, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {it.quantity}× {it.product_name}
                        {it.variant_name ? ` · ${it.variant_name}` : ""}
                      </span>
                      <span className="text-muted-foreground">
                        {(Number(it.unit_price) * it.quantity).toFixed(2)} zł
                      </span>
                    </li>
                  ))}
                </ul>

                {o.note && <p className="text-xs italic text-muted-foreground">{o.note}</p>}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Select value={o.status} onValueChange={(v) => quickUpdate(o.id, { status: v })}>
                    <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-xs">
                    <Switch checked={o.is_paid} onCheckedChange={(v) => quickUpdate(o.id, { is_paid: v })} />
                    {o.is_paid ? "Opłacone" : "Nieopłacone"}
                  </label>
                  <span className="ml-auto font-medium">{Number(o.total_amount).toFixed(2)} zł</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Wpłynęło: {new Date(o.created_at).toLocaleString("pl-PL")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edytuj zamówienie" : "Nowe zamówienie"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Imię i nazwisko *</Label>
                <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
              </div>
              <div>
                <Label>Na kiedy *</Label>
                <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              </div>
              <div>
                <Label>Sposób realizacji</Label>
                <Select value={form.fulfillment} onValueChange={(v: Fulfillment) => setForm({ ...form, fulfillment: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Odbiór osobisty</SelectItem>
                    <SelectItem value="delivery">Dostawa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.fulfillment === "delivery" && (
              <div>
                <Label>Adres dostawy</Label>
                <Textarea rows={2} value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Produkty</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-3 h-3 mr-1" /> Dodaj pozycję
                </Button>
              </div>
              {form.items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_70px_90px_36px] gap-2 items-end">
                  <div>
                    <Select
                      value={it.product_id ? `${it.product_id}|${it.variant_id ?? ""}` : ""}
                      onValueChange={(v) => pickVariant(idx, v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Wybierz produkt" /></SelectTrigger>
                      <SelectContent>
                        {products.flatMap((p) =>
                          (p.product_variants ?? []).map((v) => (
                            <SelectItem key={v.id} value={`${p.id}|${v.id}`}>
                              {p.name} · {v.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="number" min={1} value={it.quantity}
                    onChange={(e) => setItem(idx, { quantity: Math.max(1, Number(e.target.value)) })}
                    aria-label="Ilość"
                  />
                  <Input
                    type="number" step="0.01" value={it.unit_price}
                    onChange={(e) => setItem(idx, { unit_price: Number(e.target.value) })}
                    aria-label="Cena"
                  />
                  <Button
                    type="button" variant="ghost" size="icon" aria-label="Usuń pozycję"
                    onClick={() => setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {form.items.length === 0 && (
                <p className="text-sm text-muted-foreground">Brak pozycji.</p>
              )}
              <p className="text-right text-sm font-medium">Razem: {formTotal.toFixed(2)} zł</p>
            </div>

            <div>
              <Label>Notatka</Label>
              <Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.is_paid} onCheckedChange={(v) => setForm({ ...form, is_paid: v })} />
              Opłacone
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Anuluj</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
