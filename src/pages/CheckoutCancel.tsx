import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, Home, ShoppingCart } from "lucide-react";

const CheckoutCancel = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-accent" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Płatność anulowana
          </h1>
          <p className="text-muted-foreground">
            Twoja płatność została anulowana. Nie martw się — 
            produkty nadal czekają na Ciebie w koszyku!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Strona główna
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/#produkty">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Wróć do zakupów
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;
