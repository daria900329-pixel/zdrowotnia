import { Button } from "@/components/ui/button";
import { ArrowDown, Heart } from "lucide-react";
import heroImage from "@/assets/hero-products.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Domowe produkty naturalne"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-32 left-20 text-honey/30 hidden lg:block">
        <svg width="80" height="80" viewBox="0 0 120 120" fill="currentColor" className="animate-pulse">
          <path d="M60 10 L65 45 L100 50 L65 55 L60 90 L55 55 L20 50 L55 45 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex justify-end">
        <div className="max-w-md lg:max-w-lg bg-background/85 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-warm">
          <span className="inline-flex items-center gap-2 text-primary font-semibold mb-3 animate-fade-up bg-primary/15 px-3 py-1.5 rounded-full text-sm">
            <span>🌾</span> Z serca • Dla rodziny • Z miłością
          </span>
          
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 animate-fade-up drop-shadow-sm" style={{ animationDelay: '0.1s' }}>
            Domowe smaki <br />
            <span className="text-primary">prosto z serca</span>
          </h1>
          
          <p className="text-base lg:text-lg text-muted-foreground mb-6 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Witaj w naszej rodzinnej spiżarni! ❤️ Tworzymy zdrowe, domowe produkty — tak jak robiły nasze babcie.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="default" size="lg" asChild className="group">
              <a href="#produkty">
                <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Zobacz produkty
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#o-nas">O nas</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#produkty" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <span className="text-sm font-medium">Zapraszamy niżej</span>
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
