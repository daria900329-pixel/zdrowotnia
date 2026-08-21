import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { SEO } from "@/components/SEO";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO
        title="Zamówienie przyjęte"
        description="Dziękujemy za zamówienie w Zdrowotni. Potwierdzenie płatności i szczegóły dostawy wyślemy mailem."
        canonical="/checkout/success"
        noindex
      />
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Dziękujemy za zamówienie! 🎉
          </h1>
          <p className="text-muted-foreground">
            Twoja płatność została pomyślnie przetworzona. 
            Wkrótce otrzymasz email z potwierdzeniem zamówienia.
          </p>
        </div>

        <div className="bg-secondary/50 rounded-xl p-6 text-left space-y-3">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Co dalej?</p>
              <p className="text-sm text-muted-foreground">
                Skontaktujemy się z Tobą w sprawie dostawy lub odbioru osobistego.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Wróć do strony głównej
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
