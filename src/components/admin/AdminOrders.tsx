import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Send,
  ChevronDown,
  Truck,
  PackageCheck,
  Tag,
} from "lucide-react";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  user_id: string;
  shipping_address: any;
}

interface OrderItem {
  id: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  price: number;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Oczekuje", icon: Clock },
  { value: "paid", label: "Opłacone", icon: CheckCircle },
  { value: "ready", label: "Gotowe do wysyłki", icon: PackageCheck },
  { value: "shipped", label: "Wysłane", icon: Truck },
  { value: "cancelled", label: "Anulowane", icon: XCircle },
];

const EMAIL_TEMPLATES = [
  { key: "order_confirmation", label: "Potwierdzenie zamówienia", icon: "✉️" },
  { key: "order_ready", label: "Gotowe do wysyłki", icon: "📦" },
  { key: "shipping_notification", label: "Zamówienie wysłane", icon: "🚚" },
  { key: "promotion", label: "Akcja promocyjna", icon: "🍯" },
];

export function AdminOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loadingItems, setLoadingItems] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Email dialog state
  const [emailDialogOrder, setEmailDialogOrder] = useState<Order | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({ title: "Błąd", description: "Nie udało się pobrać zamówień", variant: "destructive" });
    } else if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    if (orderItems[orderId]) return;
    setLoadingItems(orderId);
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (!error && data) {
      setOrderItems((prev) => ({ ...prev, [orderId]: data }));
    }
    setLoadingItems(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Błąd", description: "Nie udało się zmienić statusu", variant: "destructive" });
    } else {
      toast({ title: "Zaktualizowano", description: `Status zmieniony na: ${STATUS_OPTIONS.find((s) => s.value === newStatus)?.label}` });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

      // Suggest sending email for certain status changes
      const order = orders.find((o) => o.id === orderId);
      if (order && (newStatus === "ready" || newStatus === "shipped")) {
        const templateKey = newStatus === "ready" ? "order_ready" : "shipping_notification";
        const templateLabel = newStatus === "ready" ? "Gotowe do wysyłki" : "Zamówienie wysłane";
        toast({
          title: `Wyślij powiadomienie?`,
          description: `Kliknij ikonę ✉️ aby wysłać e-mail "${templateLabel}" do klienta.`,
        });
      }
    }
    setUpdatingStatus(null);
  };

  const handleSendEmail = async () => {
    if (!emailDialogOrder || !selectedTemplate) return;

    setSendingEmail(emailDialogOrder.id);

    const extraVariables: Record<string, string> = {};
    if (selectedTemplate === "shipping_notification" && trackingUrl) {
      extraVariables["{{tracking_url}}"] = trackingUrl;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Błąd", description: "Musisz być zalogowany", variant: "destructive" });
        setSendingEmail(null);
        return;
      }

      const response = await supabase.functions.invoke("send-order-email", {
        body: {
          order_id: emailDialogOrder.id,
          template_key: selectedTemplate,
          extra_variables: Object.keys(extraVariables).length > 0 ? extraVariables : undefined,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Błąd wysyłki");
      }

      const result = response.data;
      if (result?.success) {
        toast({
          title: "E-mail wysłany! ✉️",
          description: `Wiadomość wysłana do ${result.sent_to}`,
        });
        setEmailDialogOrder(null);
        setSelectedTemplate("");
        setTrackingUrl("");
      } else {
        throw new Error(result?.error || "Nieznany błąd");
      }
    } catch (err: any) {
      toast({
        title: "Błąd wysyłki",
        description: err.message || "Nie udało się wysłać e-maila",
        variant: "destructive",
      });
    }
    setSendingEmail(null);
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; icon: React.ReactNode; label: string }> = {
      paid: { className: "bg-primary/20 text-primary hover:bg-primary/20", icon: <CheckCircle className="w-3 h-3 mr-1" />, label: "Opłacone" },
      pending: { className: "", icon: <Clock className="w-3 h-3 mr-1" />, label: "Oczekuje" },
      ready: { className: "bg-amber-100 text-amber-800 hover:bg-amber-100", icon: <PackageCheck className="w-3 h-3 mr-1" />, label: "Gotowe" },
      shipped: { className: "bg-green-100 text-green-800 hover:bg-green-100", icon: <Truck className="w-3 h-3 mr-1" />, label: "Wysłane" },
      cancelled: { className: "", icon: <XCircle className="w-3 h-3 mr-1" />, label: "Anulowane" },
    };
    const c = config[status] || { className: "", icon: null, label: status };
    return (
      <Badge variant={status === "pending" ? "secondary" : status === "cancelled" ? "destructive" : "default"} className={c.className}>
        {c.icon}{c.label}
      </Badge>
    );
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Zamówienia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Brak zamówień</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const isExpanded = expandedId === order.id;
                const items = orderItems[order.id];

                return (
                  <Collapsible
                    key={order.id}
                    open={isExpanded}
                    onOpenChange={(open) => {
                      setExpandedId(open ? order.id : null);
                      if (open) fetchOrderItems(order.id);
                    }}
                  >
                    <div className="bg-secondary/50 rounded-xl overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/70 transition-colors text-left">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-mono text-sm text-muted-foreground">
                                #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right space-y-1">
                              <p className="font-semibold text-primary">
                                {formatPrice(order.total_amount)}
                              </p>
                              {getStatusBadge(order.status)}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-4 border-t border-border/50">
                          {/* Order items */}
                          <div className="pt-3">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Produkty</p>
                            {loadingItems === order.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            ) : items && items.length > 0 ? (
                              <div className="space-y-1.5">
                                {items.map((item) => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-foreground">
                                      {item.product_name} <span className="text-muted-foreground">– {item.variant_name} × {item.quantity}</span>
                                    </span>
                                    <span className="text-foreground font-medium">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Brak danych</p>
                            )}
                          </div>

                          {/* Status change + Email */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">Zmień status</Label>
                              <Select
                                value={order.status}
                                onValueChange={(val) => handleStatusChange(order.id, val)}
                                disabled={updatingStatus === order.id}
                              >
                                <SelectTrigger className="mt-1 h-9">
                                  {updatingStatus === order.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                      <span className="flex items-center gap-2">
                                        <s.icon className="w-3.5 h-3.5" />
                                        {s.label}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 h-9"
                                onClick={() => {
                                  setEmailDialogOrder(order);
                                  // Auto-suggest template based on status
                                  if (order.status === "ready") setSelectedTemplate("order_ready");
                                  else if (order.status === "shipped") setSelectedTemplate("shipping_notification");
                                  else if (order.status === "paid") setSelectedTemplate("order_confirmation");
                                  else setSelectedTemplate("");
                                }}
                              >
                                <Mail className="w-4 h-4" />
                                Wyślij e-mail
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email dialog */}
      <Dialog open={!!emailDialogOrder} onOpenChange={(open) => { if (!open) setEmailDialogOrder(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Wyślij e-mail do klienta
            </DialogTitle>
          </DialogHeader>

          {emailDialogOrder && (
            <div className="space-y-4 pt-2">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm">
                  <span className="text-muted-foreground">Zamówienie:</span>{" "}
                  <span className="font-mono font-medium">#{emailDialogOrder.id.slice(0, 8)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Kwota:</span>{" "}
                  <span className="font-medium">{formatPrice(emailDialogOrder.total_amount)}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Wybierz szablon</Label>
                <div className="grid grid-cols-2 gap-2">
                  {EMAIL_TEMPLATES.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setSelectedTemplate(t.key)}
                      className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                        selectedTemplate === t.key
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <p className="font-medium mt-1">{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTemplate === "shipping_notification" && (
                <div className="space-y-2">
                  <Label>Link do śledzenia przesyłki (opcjonalny)</Label>
                  <Input
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://tracking.inpost.pl/..."
                  />
                </div>
              )}

              <Button
                onClick={handleSendEmail}
                disabled={!selectedTemplate || sendingEmail === emailDialogOrder.id}
                className="w-full gap-2"
              >
                {sendingEmail === emailDialogOrder.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Wyślij wiadomość
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
