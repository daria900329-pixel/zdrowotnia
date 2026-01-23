import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2, Save, X, Edit, ArrowUp, ArrowDown } from "lucide-react";

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

interface ProductVariantsInlineProps {
  productId: string;
  productName: string;
}

export function ProductVariantsInline({ productId, productName }: ProductVariantsInlineProps) {
  const { toast } = useToast();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Variant>>({});
  const [newVariant, setNewVariant] = useState({
    name: "",
    unit: "ml",
    value: 0,
    price: 0,
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchVariants();
    }
  }, [isOpen, productId]);

  const fetchVariants = async () => {
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

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  const handleAddVariant = async () => {
    if (!newVariant.name.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa wariantu jest wymagana",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("product_variants").insert({
      product_id: productId,
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
      toast({ title: "Sukces", description: "Wariant został dodany" });
      setIsAdding(false);
      setNewVariant({
        name: "",
        unit: "ml",
        value: 0,
        price: 0,
        display_order: 0,
        is_active: true,
      });
      fetchVariants();
    }
  };

  const handleUpdateVariant = async (id: string) => {
    const { error } = await supabase
      .from("product_variants")
      .update(editForm)
      .eq("id", id);

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować wariantu",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sukces", description: "Wariant został zaktualizowany" });
      setEditingId(null);
      setEditForm({});
      fetchVariants();
    }
  };

  const handleToggleActive = async (variant: Variant) => {
    const { error } = await supabase
      .from("product_variants")
      .update({ is_active: !variant.is_active })
      .eq("id", variant.id);

    if (!error) {
      fetchVariants();
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
      toast({ title: "Sukces", description: "Wariant został usunięty" });
      fetchVariants();
    }
  };

  const handleMoveVariant = async (variantId: string, direction: "up" | "down") => {
    const currentIndex = variants.findIndex((v) => v.id === variantId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= variants.length) return;

    const currentVariant = variants[currentIndex];
    const targetVariant = variants[targetIndex];

    // Swap display_order values
    const updates = [
      supabase
        .from("product_variants")
        .update({ display_order: targetVariant.display_order })
        .eq("id", currentVariant.id),
      supabase
        .from("product_variants")
        .update({ display_order: currentVariant.display_order })
        .eq("id", targetVariant.id),
    ];

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      toast({
        title: "Błąd",
        description: "Nie udało się zmienić kolejności",
        variant: "destructive",
      });
    } else {
      fetchVariants();
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-secondary/30">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/50 transition-colors">
        <span className="font-medium text-sm">
          Warianty produktu ({variants.length})
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Existing Variants */}
            {variants.map((variant) => (
              <div
                key={variant.id}
                className={`p-3 rounded-lg border bg-background ${!variant.is_active ? "opacity-50" : ""}`}
              >
                {editingId === variant.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Nazwa</Label>
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Jednostka</Label>
                        <Select
                          value={editForm.unit}
                          onValueChange={(value) => setEditForm({ ...editForm, unit: value })}
                        >
                          <SelectTrigger className="h-8 text-sm">
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
                      <div className="space-y-1">
                        <Label className="text-xs">Wartość</Label>
                        <Input
                          type="number"
                          value={editForm.value || 0}
                          onChange={(e) => setEditForm({ ...editForm, value: parseFloat(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Cena (PLN)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editForm.price || 0}
                          onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateVariant(variant.id)}>
                        <Save className="w-3 h-3 mr-1" />
                        Zapisz
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditForm({}); }}>
                        <X className="w-3 h-3 mr-1" />
                        Anuluj
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Order controls */}
                    <div className="flex flex-col gap-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5"
                        onClick={() => handleMoveVariant(variant.id, "up")}
                        disabled={variants.findIndex((v) => v.id === variant.id) === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5"
                        onClick={() => handleMoveVariant(variant.id, "down")}
                        disabled={variants.findIndex((v) => v.id === variant.id) === variants.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">{variant.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({variant.value} {variant.unit})
                      </span>
                    </div>
                    <span className="font-semibold text-primary text-sm">
                      {formatPrice(variant.price)}
                    </span>
                    <Switch
                      checked={variant.is_active}
                      onCheckedChange={() => handleToggleActive(variant)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingId(variant.id);
                        setEditForm(variant);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteVariant(variant.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Add New Variant Form */}
            {isAdding ? (
              <div className="p-3 rounded-lg border bg-background space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nazwa *</Label>
                    <Input
                      value={newVariant.name}
                      onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                      placeholder="np. Mały"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Jednostka</Label>
                    <Select
                      value={newVariant.unit}
                      onValueChange={(value) => setNewVariant({ ...newVariant, unit: value })}
                    >
                      <SelectTrigger className="h-8 text-sm">
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
                  <div className="space-y-1">
                    <Label className="text-xs">Wartość</Label>
                    <Input
                      type="number"
                      value={newVariant.value}
                      onChange={(e) => setNewVariant({ ...newVariant, value: parseFloat(e.target.value) || 0 })}
                      placeholder="np. 500"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cena (PLN)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
                      placeholder="np. 15.00"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddVariant}>
                    <Save className="w-3 h-3 mr-1" />
                    Dodaj
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="w-3 h-3 mr-1" />
                    Anuluj
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAdding(true)}
                className="w-full"
              >
                <Plus className="w-3 h-3 mr-1" />
                Dodaj wariant
              </Button>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
