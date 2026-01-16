import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Wiadomość wysłana!",
      description: "Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="kontakt" className="section-padding bg-secondary/40 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-honey/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-accent font-medium mb-3 bg-accent/10 px-3 py-1 rounded-full text-sm">
            ☎️ Porozmawiajmy
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Chcesz pogadać? Jesteśmy tu dla Ciebie! 💬
          </h2>
          <p className="text-muted-foreground">
            Masz pytania o nasze produkty? Chcesz złożyć zamówienie? 
            Napisz lub zadzwoń — odpowiemy jak sąsiadowi przez płot! 🏡
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Telefon</h3>
                <p className="text-muted-foreground">+48 123 456 789</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground">kontakt@naturalnesmaki.pl</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Adres</h3>
                <p className="text-muted-foreground">
                  Odbiór osobisty po wcześniejszym umówieniu
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-soft border border-primary/20">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                💡 Jak zamówić?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To proste! Zadzwoń lub napisz, a ustalimy wszystko po sąsiedzku. 
                Możesz odebrać osobiście (zapraszamy na herbatę! ☕) lub umówimy dostawę.
                Płatność przy odbiorze lub przelewem — jak Ci wygodniej.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-card">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Imię i nazwisko
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jan Kowalski"
                  required
                  className="bg-background"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jan@przyklad.pl"
                  required
                  className="bg-background"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Wiadomość
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Opisz, które produkty Cię interesują..."
                  required
                  rows={5}
                  className="bg-background resize-none"
                />
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Wyślij wiadomość
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
