import { useEffect, useMemo, useRef, useState } from "react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Heart } from "lucide-react";
import heroImage from "@/assets/hero-products.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const HERO_IMAGE_POS_X_KEY = "rodzinne-smaki.hero-image-pos-x";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const Hero = () => {
  const { content } = useSiteContent("hero");
  const { ref: heroRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
  
  // translateX range: -50% to +50% of image width (gives much more movement)
  const [translateX, setTranslateX] = useState<number>(0);
  const [scale, setScale] = useState<number>(150);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTranslateRef = useRef(0);

  useEffect(() => {
    try {
      const rawX = localStorage.getItem(HERO_IMAGE_POS_X_KEY);
      const rawScale = localStorage.getItem("rodzinne-smaki.hero-image-scale");
      if (rawX) {
        const parsed = Number(rawX);
        if (Number.isFinite(parsed)) setTranslateX(clamp(parsed, -50, 50));
      }
      if (rawScale) {
        const parsed = Number(rawScale);
        if (Number.isFinite(parsed)) setScale(clamp(parsed, 100, 250));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HERO_IMAGE_POS_X_KEY, String(translateX));
      localStorage.setItem("rodzinne-smaki.hero-image-scale", String(scale));
    } catch {
      // ignore
    }
  }, [translateX, scale]);

  const imageStyle = useMemo(() => ({
    transform: `translateX(${translateX}%) scale(${scale / 100})`,
    transformOrigin: 'center center',
  }), [translateX, scale]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAdjusting) return;
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startTranslateRef.current = translateX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAdjusting || !draggingRef.current) return;
    const el = frameRef.current;
    if (!el) return;
    const deltaX = e.clientX - startXRef.current;
    const pctDelta = (deltaX / el.getBoundingClientRect().width) * 100;
    setTranslateX(clamp(startTranslateRef.current + pctDelta, -50, 50));
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div
        ref={frameRef}
        className={cn(
          "absolute inset-0 z-0 overflow-hidden transition-all duration-1000",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: isAdjusting ? "none" : "auto" }}
      >
        <img
          src={heroImage}
          alt="Domowe produkty naturalne"
          className="min-w-full min-h-full object-cover"
          style={imageStyle}
        />
        {/* Mobile: bottom-up gradient; Desktop: right-side gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent md:bg-gradient-to-l md:from-background/90 md:via-transparent md:to-transparent" />
        {isAdjusting && (
          <div className="absolute inset-0 ring-2 ring-primary/20" aria-hidden="true" />
        )}
      </div>

      {/* Decorative star */}
      <div className={cn(
        "absolute top-32 left-20 text-honey/30 hidden lg:block transition-all duration-1000 delay-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      )}>
        <svg width="80" height="80" viewBox="0 0 120 120" fill="currentColor" className="animate-pulse">
          <path d="M60 10 L65 45 L100 50 L65 55 L60 90 L55 55 L20 50 L55 45 Z" />
        </svg>
      </div>

      {/* Content: full-width on mobile, right-aligned card on desktop */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-end md:items-center md:justify-end pb-20 md:pb-0 min-h-[80vh] md:min-h-0">
        <div className={cn(
          "w-full md:max-w-md lg:max-w-lg md:bg-background/85 md:backdrop-blur-sm md:p-8 md:rounded-3xl md:shadow-warm transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 md:translate-x-0" : "opacity-0 translate-y-8 md:translate-x-12"
        )}>
          <span 
            className={cn(
              "inline-flex items-center gap-2 text-primary font-semibold mb-3 bg-primary/15 px-3 py-1.5 rounded-full text-sm transition-all duration-700 delay-100",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <span>🌾</span> {content.badge || "Z serca • Dla rodziny • Z miłością"}
          </span>
          
          <h1 
            className={cn(
              "font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 drop-shadow-sm transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {content.title || "Domowe smaki prosto z serca"}
          </h1>
          
          <p 
            className={cn(
              "text-base lg:text-lg text-muted-foreground mb-6 leading-relaxed transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {content.subtitle || "Witaj w naszej rodzinnej spiżarni! ❤️ Tworzymy zdrowe, domowe produkty — tak jak robiły nasze babcie."}
          </p>
          
          <div 
            className={cn(
              "flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-[400ms]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
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

      {/* Manual image positioning */}
      <div className="absolute top-24 right-4 sm:right-6 z-20 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1.5 text-sm font-medium text-foreground hover:bg-background/90 transition-colors"
            onClick={() => setIsAdjusting((v) => !v)}
          >
            {isAdjusting ? "Zakończ kadrowanie" : "Kadruj zdjęcie"}
          </button>
          <button
            type="button"
            className="rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1.5 text-sm font-medium text-foreground hover:bg-background/90 transition-colors"
            onClick={() => { setTranslateX(0); setScale(150); }}
          >
            Reset
          </button>
        </div>

        {isAdjusting && (
          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur px-3 py-2 space-y-3">
            <p className="text-xs text-muted-foreground">
              Przeciągnij palcem/myszą po zdjęciu, aby przesunąć.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16">Pozycja:</span>
              <input
                aria-label="Pozycja zdjęcia"
                type="range" min={-50} max={50}
                value={Math.round(translateX)}
                onChange={(e) => setTranslateX(Number(e.target.value))}
                className="w-28 sm:w-32"
              />
              <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                {Math.round(translateX)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16">Zoom:</span>
              <input
                aria-label="Skala zdjęcia"
                type="range" min={100} max={250}
                value={Math.round(scale)}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-28 sm:w-32"
              />
              <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                {Math.round(scale)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-all duration-700 delay-700",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        <a href="#produkty" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <span className="text-sm font-medium">Chodźmy dalej</span>
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
