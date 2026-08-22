import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Za krótkie hasło", description: "Hasło musi mieć minimum 6 znaków", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Hasła się różnią", description: "Wpisz dwa razy to samo hasło", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Hasło zmienione", description: "Możesz już korzystać z konta." });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5] px-4">
      <SEO
        title="Ustaw nowe hasło"
        description="Ustaw nowe hasło do swojego konta w sklepie Zdrowotnia."
        canonical="/reset-password"
        noindex
      />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Nowe hasło</CardTitle>
          <CardDescription>
            {ready
              ? "Wpisz nowe hasło do swojego konta"
              : "Otwórz tę stronę z linku, który wysłaliśmy Ci mailem"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nowe hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting || !ready}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Powtórz hasło</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={submitting || !ready}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting || !ready}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Zapisz nowe hasło
            </Button>
          </form>
          <div className="mt-6 text-center">
            <a href="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Wróć do logowania
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
