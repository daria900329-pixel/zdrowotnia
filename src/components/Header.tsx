import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Package } from "lucide-react";
import { CartSheet } from "./CartSheet";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { HandwrittenLabel } from "./HandwrittenLabel";
import logoStamp from "@/assets/logo-stamp.png";
import logoStampDark from "@/assets/logo-stamp-dark.png";
import { useTheme } from "next-themes";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { resolvedTheme } = useTheme();

  const navLinks = [
    { label: "Produkty", href: "/#produkty" },
    { label: "Blog", href: "/blog" },
    { label: "O nas", href: "/o-nas" },
    { label: "Kontakt", href: "/#kontakt" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="dark:bg-[#c9c0ae] dark:py-2 dark:px-4 dark:-my-2 dark:-mx-4 dark:rounded-lg">
              <img 
                src={resolvedTheme === "dark" ? logoStampDark : logoStamp} 
                alt="Zdrowotnia - prawdziwe jedzenie z prostych powodów" 
                className="h-32 transition-transform group-hover:scale-105"
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            
            <CartSheet />
            
            <div className="relative">
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap flex flex-col items-center">
                <HandwrittenLabel text="desktop" className="text-earth dark:text-honey -rotate-2" />
                <svg 
                  className="w-6 h-6 text-earth dark:text-honey mt-0.5 rotate-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  style={{ strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.5 }}
                >
                  <path d="M12 5c0 0 -1 4 -1 8c0 2 0.5 4 0.5 4" />
                  <path d="M8 14c1.5 1.5 3 3 4 4c1-1 2.5-2.5 4-4" />
                </svg>
              </div>
              <ThemeToggle />
            </div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href="/moje-zamowienia" className="flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    <span className="hidden lg:inline">Zamówienia</span>
                  </a>
                </Button>
                <Button variant="ghost" size="icon" onClick={signOut}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <a href="/auth">
                  <User className="w-4 h-4 mr-2" />
                  Zaloguj
                </a>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <CartSheet />
            <ThemeToggle />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <a href="/moje-zamowienia" onClick={() => setIsMenuOpen(false)}>
                      <Package className="w-4 h-4 mr-2" />
                      Moje zamówienia
                    </a>
                  </Button>
                  <Button variant="ghost" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Wyloguj
                  </Button>
                </div>
              ) : (
                <Button variant="default" asChild>
                  <a href="/auth">
                    <User className="w-4 h-4 mr-2" />
                    Zaloguj się
                  </a>
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
