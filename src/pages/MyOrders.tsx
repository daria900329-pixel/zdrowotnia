import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Oczekujące", variant: "secondary" },
  paid: { label: "Opłacone", variant: "default" },
  shipped: { label: "Wysłane", variant: "default" },
  delivered: { label: "Dostarczone", variant: "default" },
  cancelled: { label: "Anulowane", variant: "destructive" },
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(dateStr));

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          status,
          total_amount,
          order_items (
            id,
            product_name,
            variant_name,
            quantity,
            price
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-36 pb-20 flex flex-col items-center gap-6 text-center px-6">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          <h1 className="font-serif text-3xl text-foreground">Moje zamówienia</h1>
          <p className="text-muted-foreground">Zaloguj się, by zobaczyć historię zamówień.</p>
          <Button asChild>
            <Link to="/auth">Zaloguj się</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Moje zamówienia"
        description="Historia Twoich zamówień w Zdrowotni"
        noindex
      />
      <Header />
      <main className="pt-36 pb-20 container mx-auto px-6 max-w-4xl">
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-foreground mb-2">Moje zamówienia</h1>
          <p className="text-muted-foreground">Historia Twoich zakupów</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <Package className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Nie masz jeszcze żadnych zamówień.</p>
            <Button asChild variant="outline">
              <Link to="/#produkty">Przejdź do sklepu</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const status = statusLabels[order.status] ?? { label: order.status, variant: "outline" as const };
              return (
                <div
                  key={order.id}
                  className="bg-card border border-border/30 rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {formatDate(order.created_at)}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="font-semibold text-foreground text-lg">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-4">
                    <ul className="flex flex-col gap-2">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">
                            {item.product_name}{" "}
                            <span className="text-muted-foreground">
                              — {item.variant_name} × {item.quantity}
                            </span>
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
