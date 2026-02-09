import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ScrollReveal } from "@/components/ScrollReveal";

const Contact = () => {
  const { toast } = useToast();
  const { content, loading } = useSiteContent("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const title = content.title || "Porozmawiajmy! 💬";
  const subtitle = content.subtitle || "Masz pytania? Chcesz złożyć zamówienie? Napisz lub zadzwoń — odpowiadamy szybko i z uśmiechem!";
  const phone = content.phone || "+48 123 456 789";
  const email = content.email || "kontakt@rodzinnesmaki.pl";
  const address = content.address || "Odbiór osobisty po wcześniejszym umówieniu";
  const orderTitle = content.order_title || "💡 Jak zamówić?";
  const orderDescription = content.order_description || "Dodaj produkty do koszyka i przejdź do płatności. Po opłaceniu zamówienia skontaktujemy się, aby ustalić szczegóły dostawy lub odbioru osobistego.";

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

  if (loading) {
    return (
      <section id="kontakt" className="section-padding bg-secondary/40 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="kontakt" className="section-padding bg-secondary/40 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-honey/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <ScrollReveal variant="fade-right" delay={100}>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Telefon</h3>
                  <p className="text-muted-foreground">{phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">{email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Adres</h3>
                  <p className="text-muted-foreground">{address}</p>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl shadow-soft border border-primary/20">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {orderTitle}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {orderDescription}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal variant="fade-left" delay={200}>
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
