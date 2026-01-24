import { Instagram, Facebook, Heart } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import logoStamp from "@/assets/logo-stamp.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { content } = useSiteContent("footer");
  const { isAdmin } = useIsAdmin();

  const tagline = content.tagline || "Dziękujemy, że nas odwiedzasz! 🙏 Jesteśmy zwykłą rodziną, która kocha dobre jedzenie i chce się nim dzielić. Do zobaczenia przy stole!";

  return (
    <footer className="bg-earth text-earth-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img 
              src={logoStamp} 
              alt="Zdrowotnia - prawdziwe jedzenie z prostych powodów" 
              className="h-20"
            />
          </div>

          {/* Warm message */}
          <p className="max-w-md text-earth-foreground/80 leading-relaxed">
            {tagline}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center hover:bg-primary/50 transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center hover:bg-primary/50 transition-all hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-earth-foreground/20 w-full space-y-2">
            <p className="text-sm opacity-70 flex items-center justify-center gap-2">
              © {currentYear} Zdrowotnia • Robione z <Heart className="w-4 h-4 text-accent inline" /> w Polsce
            </p>
            {isAdmin && (
              <a 
                href="/admin" 
                className="text-xs opacity-50 hover:opacity-80 transition-opacity"
              >
                Panel administracyjny
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
