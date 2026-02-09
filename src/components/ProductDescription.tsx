import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface DbSection {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  display_order: number | null;
  show_in_menu: boolean | null;
}

interface DisplaySection {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  display_order: number;
  show_in_menu: boolean;
}

export interface ActiveSection {
  id: string;
  title: string;
  image_url: string | null;
}

interface ProductDescriptionProps {
  productId: string;
  fallbackDescription?: string | null;
  onActiveSectionChange?: (section: ActiveSection | null) => void;
}

type ParsedSection = { title: string; content: string };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function boolDefaultTrue(value: boolean | null | undefined) {
  return value !== false;
}

function parseMenuSections(text: string): ParsedSection[] {
  const normalized = (text ?? "").replace(/\r\n/g, "\n");
  const trimmed = normalized.trim();
  if (!trimmed) return [];

  const hasMenu = /\[menu\]/i.test(trimmed);
  if (!hasMenu) {
    return [{ title: "Opis szczegółowy", content: trimmed }];
  }

  const lines = trimmed.split("\n");
  const raw: Array<{ title: string; body: string[] }> = [];
  let current: { title: string; body: string[] } | null = null;

  const pushCurrent = () => {
    if (!current) return;
    const content = current.body.join("\n").trim();
    const title = current.title.trim();

    if (title || content) {
      raw.push({ title, body: content ? content.split("\n") : [] });
    }
    current = null;
  };

  for (const line of lines) {
    const match = line.match(/^\s*\[menu\]\s*(.*)\s*$/i);
    if (match) {
      pushCurrent();
      current = { title: (match[1] ?? "").trim(), body: [] };
      continue;
    }

    if (!current) current = { title: "", body: [] };
    current.body.push(line);
  }

  pushCurrent();

  const sections = raw
    .map((s, idx) => {
      const title = s.title || (idx === 0 ? "O produkcie" : `Sekcja ${idx + 1}`);
      const content = s.body.join("\n").trim();
      return { title, content };
    })
    .filter((s) => s.title.trim().length > 0 || s.content.trim().length > 0);

  return sections.length ? sections : [{ title: "Opis szczegółowy", content: trimmed }];
}

export function ProductDescription({ productId, fallbackDescription, onActiveSectionChange }: ProductDescriptionProps) {
  const [dbSections, setDbSections] = useState<DbSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    let isCancelled = false;

    async function fetchSections() {
      const { data, error } = await supabase
        .from("product_description_sections")
        .select("id, title, content, image_url, display_order, show_in_menu")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      if (!isCancelled) {
        if (!error && data) setDbSections(data);
        setLoading(false);
      }
    }

    fetchSections();
    return () => {
      isCancelled = true;
    };
  }, [productId]);

  const parsedSections = useMemo(() => {
    if (!isNonEmptyString(fallbackDescription)) return [];
    return parseMenuSections(fallbackDescription);
  }, [fallbackDescription]);

  const displaySections = useMemo<DisplaySection[]>(() => {
    if (parsedSections.length === 0 && dbSections.length === 0) return [];

    const result: DisplaySection[] = [];

    // 1. Always show parsed sections (from long_description) first, as-is
    for (let idx = 0; idx < parsedSections.length; idx++) {
      const p = parsedSections[idx];
      result.push({
        id: `parsed-${idx}`,
        title: p.title,
        content: p.content.trim().length ? p.content : null,
        image_url: null,
        display_order: idx,
        show_in_menu: false, // parsed intro sections don't go in nav menu
      });
    }

    // 2. Then append ALL DB sections (these are the navigable menu sections)
    const sortedDb = dbSections
      .slice()
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    for (let i = 0; i < sortedDb.length; i++) {
      const s = sortedDb[i];
      result.push({
        id: s.id,
        title: s.title,
        content: s.content,
        image_url: s.image_url,
        display_order: parsedSections.length + i,
        show_in_menu: boolDefaultTrue(s.show_in_menu),
      });
    }

    return result;
  }, [dbSections, parsedSections]);

  const menuSections = useMemo(
    () => displaySections.filter((s) => s.show_in_menu),
    [displaySections]
  );

  // Ensure we always have an active section (for menu highlighting)
  useEffect(() => {
    if (activeSection && menuSections.some((s) => s.id === activeSection)) return;
    const first = menuSections[0];
    if (!first) return;

    setActiveSection(first.id);
    onActiveSectionChange?.({
      id: first.id,
      title: first.title,
      image_url: first.image_url,
    });
  }, [menuSections, activeSection, onActiveSectionChange]);

  useEffect(() => {
    if (menuSections.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of menuSections) {
        const element = sectionRefs.current[section.id];
        if (!element) continue;

        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          if (activeSection !== section.id) {
            setActiveSection(section.id);
            // Notify parent about active section change
            if (onActiveSectionChange) {
              onActiveSectionChange({
                id: section.id,
                title: section.title,
                image_url: section.image_url,
              });
            }
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuSections, activeSection, onActiveSectionChange]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (!element) return;

    const offset = 180;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
    
    // Find the section and notify parent
    const section = displaySections.find(s => s.id === sectionId);
    if (section && onActiveSectionChange) {
      onActiveSectionChange({
        id: section.id,
        title: section.title,
        image_url: section.image_url,
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded-xl w-3/4" />
        <div className="h-24 bg-muted rounded-lg" />
      </div>
    );
  }

  if (displaySections.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Navigation Menu */}
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

      {/* Sections Content - single column, images handled by parent */}
      <div className="space-y-10">
        {displaySections.map((section) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            ref={(el) => (sectionRefs.current[section.id] = el)}
            className="scroll-mt-48"
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
              {section.title}
            </h3>
            {section.content && (
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

// Hook to get DB sections for external use (admin/tools)
export function useProductSections(productId: string) {
  const [sections, setSections] = useState<DbSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      const { data, error } = await supabase
        .from("product_description_sections")
        .select("id, title, content, image_url, display_order, show_in_menu")
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

