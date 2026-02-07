import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  display_order: number;
  show_in_menu: boolean;
}

interface ProductDescriptionProps {
  productId: string;
  fallbackDescription?: string | null;
}

export function ProductDescription({ 
  productId, 
  fallbackDescription
}: ProductDescriptionProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const menuSections = sections.filter(s => s.show_in_menu);

  useEffect(() => {
    async function fetchSections() {
      const { data, error } = await supabase
        .from("product_description_sections")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setSections(data);
        if (data.length > 0) {
          const firstMenu = data.find(s => s.show_in_menu);
          if (firstMenu) {
            setActiveSection(firstMenu.id);
          }
        }
      }
      setLoading(false);
    }

    fetchSections();
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of menuSections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuSections, activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 180;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded-xl w-3/4"></div>
        <div className="h-24 bg-muted rounded-lg"></div>
      </div>
    );
  }

  // No sections - show fallback description
  if (sections.length === 0) {
    if (!fallbackDescription) return null;
    
    return (
      <div className="prose prose-stone max-w-none">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
          O produkcie
        </h3>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {fallbackDescription}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Menu - show even for single section */}
      {menuSections.length > 0 && (
        <nav className="flex flex-wrap gap-2 p-4 bg-secondary/50 rounded-xl border border-border/50">
          {menuSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-background hover:bg-primary/10 text-muted-foreground hover:text-foreground"
              )}
            >
              {section.title}
            </button>
          ))}
        </nav>
      )}

      {/* Sections Content */}
      <div className="space-y-8">
        {sections.map((section) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            ref={(el) => (sectionRefs.current[section.id] = el)}
            className="scroll-mt-48"
          >
            <div className={cn(
              "grid gap-6",
              section.image_url ? "lg:grid-cols-[1fr_300px]" : ""
            )}>
              {/* Text content */}
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h3>
                {section.content && (
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                )}
              </div>
              
              {/* Section image - displayed to the right of content */}
              {section.image_url && (
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-soft">
                  <img
                    src={section.image_url}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// Hook to get sections for external use
export function useProductSections(productId: string) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      const { data, error } = await supabase
        .from("product_description_sections")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setSections(data);
      }
      setLoading(false);
    }

    fetchSections();
  }, [productId]);

  return { sections, loading };
}
