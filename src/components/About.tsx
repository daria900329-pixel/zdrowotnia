import { Heart, Sparkles, Home, Users, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ScrollReveal";

const features = [
  {
    icon: Sparkles,
    title: "100% Naturalne",
    description: "Bez sztucznych dodatków — tak jak u babci.",
  },
  {
    icon: Heart,
    title: "Robione z Miłością",
    description: "Każdy słoik to kawałek naszego serca.",
  },
  {
    icon: Home,
    title: "Rodzinna Tradycja",
    description: "Przepisy przekazywane z pokolenia na pokolenie.",
  },
  {
    icon: Users,
    title: "Dla Twojej Rodziny",
    description: "Produkty, które sami dajemy naszym dzieciom.",
  },
];

const About = () => {
  const { content, loading } = useSiteContent("about");

  const title = content.title || "Witaj w naszym domu! 🏡";
  const badge = content.badge || "Nasza Historia";
  const paragraph1 = content.paragraph1 || "Jesteśmy zwykłą rodziną, która odkryła magię domowego jedzenia. To, co zaczęło się jako pasja — fermentacja pierwszej kombuchy w kuchni — dziś stało się sposobem życia, którym chcemy się dzielić.";
  const paragraph2 = content.paragraph2 || "Nasze produkty powstają dokładnie tak, jak robiły to nasze babcie — bez pośpiechu, z sercem i z najlepszych składników. Króliki hodujemy sami, chleb pieczyemy na zakwasie, który ma już ponad 3 lata!";
  const highlight = content.highlight || "✨ Wierzymy, że dobre jedzenie łączy ludzi. Zapraszamy Cię do naszego stołu!";

  if (loading) {
    return (
      <section id="o-nas" className="section-padding bg-background flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="o-nas" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-honey/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <ScrollReveal variant="fade-right">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-3 bg-accent/10 px-3 py-1 rounded-full text-sm">
              <Heart className="w-4 h-4" /> {badge}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              {title}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{paragraph1}</p>
              <p>{paragraph2}</p>
              <p className="text-foreground font-medium bg-secondary/50 p-4 rounded-xl border-l-4 border-primary">
                {highlight}
              </p>
            </div>
            
            <Button variant="default" size="lg" asChild className="mt-6 group">
              <Link to="/o-nas">
                Opowiedzieć Ci więcej?
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </ScrollReveal>

          {/* Features Grid */}
          <ScrollRevealGroup 
            className="grid grid-cols-2 gap-5"
            staggerDelay={150}
            variant="zoom-in"
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-honey/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </div>
    </section>
  );
};

export default About;
