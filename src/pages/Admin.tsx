import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Edit, Save, X, LogOut, Upload } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  badge: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: "",
    badge: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && user && !isAdmin) {
      toast({
        title: "Brak uprawnień",
        description: "Nie masz uprawnień administratora.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, adminLoading, user, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać produktów",
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
    setLoadingProducts(false);
  };

  const handleUpload = async (file: File, productId?: string) => {
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać zdjęcia",
        variant: "destructive",
      });
      setUploading(false);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setUploading(false);
    return publicUrl.publicUrl;
  };

  const handleAddProduct = async () => {
    if (!newProduct.name?.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa produktu jest wymagana",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("products").insert({
      name: newProduct.name,
      description: newProduct.description || null,
      price: newProduct.price || null,
      badge: newProduct.badge || null,
      image_url: newProduct.image_url || null,
      display_order: newProduct.display_order || 0,
      is_active: newProduct.is_active ?? true,
    });

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się dodać produktu",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sukces",
        description: "Produkt został dodany",
      });
      setIsAdding(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        badge: "",
        image_url: "",
        display_order: 0,
        is_active: true,
      });
      fetchProducts();
    }
  };

  const handleUpdateProduct = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update(editForm)
      .eq("id", id);

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować produktu",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sukces",
        description: "Produkt został zaktualizowany",
      });
      setEditingId(null);
      setEditForm({});
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć produktu",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sukces",
        description: "Produkt został usunięty",
      });
      fetchProducts();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Panel Administracyjny
            </h1>
            <p className="text-muted-foreground">
              Zarządzaj produktami na stronie
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/">← Strona główna</a>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Wyloguj
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj produkt
          </Button>
        </div>

        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nowy produkt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nazwa *</Label>
                  <Input
                    value={newProduct.name || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Nazwa produktu"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cena</Label>
                  <Input
                    value={newProduct.price || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    placeholder="np. od 15 zł"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Opis</Label>
                <Textarea
                  value={newProduct.description || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  placeholder="Opis produktu..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Odznaka (badge)</Label>
                  <Input
                    value={newProduct.badge || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, badge: e.target.value })
                    }
                    placeholder="np. Nowość!"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kolejność wyświetlania</Label>
                  <Input
                    type="number"
                    value={newProduct.display_order || 0}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Zdjęcie produktu</Label>
                <div className="flex gap-2">
                  <Input
                    value={newProduct.image_url || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image_url: e.target.value })
                    }
                    placeholder="URL zdjęcia lub prześlij plik"
                  />
                  <label className="cursor-pointer">
                    <Button variant="outline" asChild disabled={uploading}>
                      <span>
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleUpload(file);
                          if (url) {
                            setNewProduct({ ...newProduct, image_url: url });
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                {newProduct.image_url && (
                  <img
                    src={newProduct.image_url}
                    alt="Podgląd"
                    className="w-24 h-24 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={newProduct.is_active ?? true}
                  onCheckedChange={(checked) =>
                    setNewProduct({ ...newProduct, is_active: checked })
                  }
                />
                <Label>Aktywny (widoczny na stronie)</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddProduct}>
                  <Save className="w-4 h-4 mr-2" />
                  Zapisz
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewProduct({
                      name: "",
                      description: "",
                      price: "",
                      badge: "",
                      image_url: "",
                      display_order: 0,
                      is_active: true,
                    });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Anuluj
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loadingProducts ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Brak produktów. Dodaj pierwszy produkt powyżej.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id} className={!product.is_active ? "opacity-60" : ""}>
                <CardContent className="py-4">
                  {editingId === product.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nazwa *</Label>
                          <Input
                            value={editForm.name || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cena</Label>
                          <Input
                            value={editForm.price || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, price: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Opis</Label>
                        <Textarea
                          value={editForm.description || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Odznaka</Label>
                          <Input
                            value={editForm.badge || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, badge: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Kolejność</Label>
                          <Input
                            type="number"
                            value={editForm.display_order || 0}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                display_order: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Zdjęcie</Label>
                        <div className="flex gap-2">
                          <Input
                            value={editForm.image_url || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                image_url: e.target.value,
                              })
                            }
                          />
                          <label className="cursor-pointer">
                            <Button variant="outline" asChild disabled={uploading}>
                              <span>
                                {uploading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleUpload(file, product.id);
                                  if (url) {
                                    setEditForm({ ...editForm, image_url: url });
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        {editForm.image_url && (
                          <img
                            src={editForm.image_url}
                            alt="Podgląd"
                            className="w-24 h-24 object-cover rounded-lg mt-2"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editForm.is_active ?? true}
                          onCheckedChange={(checked) =>
                            setEditForm({ ...editForm, is_active: checked })
                          }
                        />
                        <Label>Aktywny</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateProduct(product.id)}>
                          <Save className="w-4 h-4 mr-2" />
                          Zapisz
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({});
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Anuluj
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                          ?
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          {product.badge && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {product.badge}
                            </span>
                          )}
                          {!product.is_active && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              Ukryty
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {product.price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(product.id);
                            setEditForm(product);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
