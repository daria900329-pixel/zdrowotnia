import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-products.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Domowe produkty naturalne"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block text-accent font-medium mb-4 animate-fade-up">
            🌿 Naturalne • Domowe • Zdrowe
          </span>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Smak natury prosto <br />
            <span className="text-primary">z naszego domu</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Ręcznie wytwarzane produkty dla osób ceniących jakość i zdrowie. 
            Kombucha, ocet jabłkowy, chleb na zakwasie i wiele więcej — 
            wszystko przygotowane z pasją i troską o Twoje zdrowie.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="default" size="xl" asChild>
              <a href="#produkty">Zobacz produkty</a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#o-nas">Poznaj naszą historię</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#produkty" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <span className="text-sm font-medium">Odkryj więcej</span>
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
