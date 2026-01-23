import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Save, X } from "lucide-react";

interface Variant {
  id: string;
  product_id: string;
  name: string;
  unit: string;
  value: number;
  price: number;
  display_order: number;
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
}

export function AdminVariants() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newVariant, setNewVariant] = useState({
    name: "",
    unit: "ml",
    value: 0,
    price: 0,
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchVariants(selectedProduct);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setProducts(data);
      if (data.length > 0 && !selectedProduct) {
        setSelectedProduct(data[0].id);
      }
    }
  };

  const fetchVariants = async (productId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setVariants(data);
    }
    setLoading(false);
  };

  const handleAddVariant = async () => {
    if (!selectedProduct || !newVariant.name.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa wariantu jest wymagana",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("product_variants").insert({
      product_id: selectedProduct,
      name: newVariant.name,
      unit: newVariant.unit,
      value: newVariant.value,
      price: newVariant.price,
      display_order: newVariant.display_order,
      is_active: newVariant.is_active,
    });

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się dodać wariantu",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sukces",
        description: "Wariant został dodany",
      });
      setIsAdding(false);
      setNewVariant({
        name: "",
        unit: "ml",
        value: 0,
        price: 0,
        display_order: 0,
        is_active: true,
      });
      fetchVariants(selectedProduct);
    }
  };

  const handleDeleteVariant = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten wariant?")) return;

    const { error } = await supabase.from("product_variants").delete().eq("id", id);

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć wariantu",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sukces",
        description: "Wariant został usunięty",
      });
      if (selectedProduct) {
        fetchVariants(selectedProduct);
      }
    }
  };

  const handleToggleActive = async (variant: Variant) => {
    const { error } = await supabase
      .from("product_variants")
      .update({ is_active: !variant.is_active })
      .eq("id", variant.id);

    if (!error && selectedProduct) {
      fetchVariants(selectedProduct);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warianty produktów</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label>Wybierz produkt</Label>
            <Select value={selectedProduct || ""} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz produkt" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding || !selectedProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj wariant
          </Button>
        </div>

        {isAdding && (
          <div className="p-4 bg-secondary/50 rounded-xl space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Nazwa *</Label>
                <Input
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  placeholder="np. Mały"
                />
              </div>
              <div className="space-y-2">
                <Label>Jednostka</Label>
                <Select
                  value={newVariant.unit}
                  onValueChange={(value) => setNewVariant({ ...newVariant, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="szt">szt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Wartość</Label>
                <Input
                  type="number"
                  value={newVariant.value}
                  onChange={(e) => setNewVariant({ ...newVariant, value: parseFloat(e.target.value) || 0 })}
                  placeholder="np. 500"
                />
              </div>
              <div className="space-y-2">
                <Label>Cena (PLN)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
                  placeholder="np. 15.00"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddVariant}>
                <Save className="w-4 h-4 mr-2" />
                Zapisz
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4 mr-2" />
                Anuluj
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : variants.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {selectedProduct ? "Brak wariantów dla tego produktu" : "Wybierz produkt, aby zobaczyć warianty"}
          </p>
        ) : (
          <div className="space-y-2">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className={`flex items-center gap-4 p-3 bg-background rounded-lg border ${
                  !variant.is_active ? "opacity-50" : ""
                }`}
              >
                <div className="flex-1">
                  <span className="font-medium">{variant.name}</span>
                  <span className="text-muted-foreground ml-2">
                    ({variant.value} {variant.unit})
                  </span>
                </div>
                <span className="font-semibold text-primary">
                  {formatPrice(variant.price)}
                </span>
                <Switch
                  checked={variant.is_active}
                  onCheckedChange={() => handleToggleActive(variant)}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteVariant(variant.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
