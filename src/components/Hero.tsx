import { useEffect, useMemo, useRef, useState } from "react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Heart } from "lucide-react";
import heroImage from "@/assets/hero-products.jpg";

const HERO_IMAGE_POS_X_KEY = "rodzinne-smaki.hero-image-pos-x";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const Hero = () => {
  const [objectX, setObjectX] = useState<number>(30);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HERO_IMAGE_POS_X_KEY);
      if (!raw) return;
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) setObjectX(clamp(parsed, 0, 100));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HERO_IMAGE_POS_X_KEY, String(objectX));
    } catch {
      // ignore
    }
  }, [objectX]);

  const objectPosition = useMemo(() => `${objectX}% center`, [objectX]);

  const setFromClientX = (clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setObjectX(clamp(pct, 0, 100));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAdjusting) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAdjusting || !draggingRef.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div
        ref={frameRef}
        className="absolute inset-0 z-0"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: isAdjusting ? "none" : "auto" }}
      >
        <img
          src={heroImage}
          alt="Domowe produkty naturalne"
          className="w-full h-full object-cover"
          style={{ objectPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/90 via-transparent to-transparent" />
        {isAdjusting && (
          <div
            className="absolute inset-0 ring-2 ring-primary/20"
            aria-hidden="true"
          />
        )}
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

      {/* Manual image positioning */}
      <div className="absolute top-24 right-6 z-20 flex flex-col items-end gap-2">
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
            onClick={() => setObjectX(30)}
          >
            Reset
          </button>
        </div>

        {isAdjusting && (
          <div className="rounded-2xl border border-border bg-background/80 backdrop-blur px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Przeciągnij palcem/myszą po zdjęciu, aby ustawić kadr.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                aria-label="Pozycja zdjęcia"
                type="range"
                min={0}
                max={100}
                value={Math.round(objectX)}
                onChange={(e) => setObjectX(Number(e.target.value))}
                className="w-44"
              />
              <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                {Math.round(objectX)}%
              </span>
            </div>
          </div>
        )}
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
