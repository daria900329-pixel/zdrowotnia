import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";

const emailSchema = z.string().email("Nieprawidłowy adres email");
const passwordSchema = z.string().min(6, "Hasło musi mieć minimum 6 znaków");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: "Podaj swój adres email, żeby zresetować hasło" });
      return;
    }
    setResetting(true);
    const { error } = await resetPassword(email);
    setResetting(false);
    if (error) {
      toast({ title: "Błąd", description: error.message, variant: "destructive" });
      return;
    }
    setResetSent(true);
    toast({
      title: "Sprawdź skrzynkę",
      description: "Wysłaliśmy link do ustawienia nowego hasła.",
    });
  };


  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSubmitting(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Błąd logowania",
              description: "Nieprawidłowy email lub hasło",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Błąd",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Zalogowano!",
            description: "Witaj z powrotem 👋",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Konto już istnieje",
              description: "Ten email jest już zarejestrowany. Spróbuj się zalogować.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Błąd rejestracji",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Konto utworzone!",
            description: "Możesz się teraz zalogować.",
          });
          setIsLogin(true);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5] px-4">
      <SEO
        title="Logowanie i rejestracja"
        description="Zaloguj się lub załóż konto w sklepie Zdrowotnia, aby składać zamówienia i śledzić ich status."
        canonical="/auth"
        noindex
      />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">
            {isLogin ? "Logowanie" : "Rejestracja"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Zaloguj się do panelu administracyjnego"
              : "Utwórz nowe konto administratora"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? "Logowanie..." : "Rejestracja..."}
                </>
              ) : (
                isLogin ? "Zaloguj się" : "Zarejestruj się"
              )}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">lub</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={googleLoading || submitting}
            onClick={async () => {
              setGoogleLoading(true);
              try {
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) {
                  toast({
                    title: "Błąd logowania Google",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              } catch (err) {
                toast({
                  title: "Błąd",
                  description: "Nie udało się zalogować przez Google",
                  variant: "destructive",
                });
              } finally {
                setGoogleLoading(false);
              }
            }}
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Kontynuuj z Google
          </Button>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Nie masz konta? Zarejestruj się"
                : "Masz już konto? Zaloguj się"}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Wróć do strony głównej
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
