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
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/85 to-background/50" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-32 right-20 text-honey/30 hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="currentColor" className="animate-pulse">
          <path d="M60 10 L65 45 L100 50 L65 55 L60 90 L55 55 L20 50 L55 45 Z" />
        </svg>
      </div>
      <div className="absolute bottom-40 left-10 text-accent/20 hidden lg:block rotate-12">
        <Heart className="w-16 h-16" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl bg-background/80 backdrop-blur-sm p-8 rounded-3xl shadow-warm">
          <span className="inline-flex items-center gap-2 text-primary font-semibold mb-4 animate-fade-up bg-primary/15 px-4 py-2 rounded-full">
            <span className="text-lg">🌾</span> Z serca • Dla rodziny • Z miłością
          </span>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up drop-shadow-sm" style={{ animationDelay: '0.1s' }}>
            Domowe smaki <br />
            <span className="text-primary">prosto z serca</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Witaj w naszej rodzinnej spiżarni! ❤️ Od lat z pasją tworzymy zdrowe,
            domowe produkty — tak jak robiły nasze babcie. Kombucha, zakwas, 
            chleb i więcej. Wszystko robione z miłością, dla Ciebie i Twojej rodziny.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="default" size="xl" asChild className="group">
              <a href="#produkty">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Zobacz nasze produkty
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#o-nas">Poznaj naszą rodzinę</a>
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
