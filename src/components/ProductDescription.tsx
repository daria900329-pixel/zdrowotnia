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

interface ProductDescriptionProps {
  productId: string;
  fallbackDescription?: string | null;
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

export function ProductDescription({ productId, fallbackDescription }: ProductDescriptionProps) {
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

    const byOrder = new Map<number, DbSection>();
    for (const s of dbSections) {
      const order = typeof s.display_order === "number" ? s.display_order : 0;
      byOrder.set(order, s);
    }

    // Prefer sections parsed from the "Opis szczegółowy" field (fallbackDescription)
    // and overlay images/overrides from the database.
    const base = parsedSections.length > 0 ? parsedSections : null;

    if (base) {
      const merged: DisplaySection[] = base.map((p, idx) => {
        const db = byOrder.get(idx);
        const title = isNonEmptyString(db?.title) ? db!.title : p.title;
        const content = isNonEmptyString(db?.content) ? db!.content : p.content;

        return {
          id: db?.id ?? `parsed-${idx}`,
          title,
          content: content.trim().length ? content : null,
          image_url: db?.image_url ?? null,
          display_order: idx,
          show_in_menu: boolDefaultTrue(db?.show_in_menu),
        };
      });

      // Append any extra DB sections that don't exist in the parsed description
      const extras = dbSections
        .filter((s) => (s.display_order ?? 0) >= base.length)
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((s, i) => ({
          id: s.id,
          title: s.title,
          content: s.content,
          image_url: s.image_url,
          display_order: base.length + i,
          show_in_menu: boolDefaultTrue(s.show_in_menu),
        }));

      return [...merged, ...extras];
    }

    return dbSections
      .slice()
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((s, idx) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        image_url: s.image_url,
        display_order: typeof s.display_order === "number" ? s.display_order : idx,
        show_in_menu: boolDefaultTrue(s.show_in_menu),
      }));
  }, [dbSections, parsedSections]);

  const menuSections = useMemo(
    () => displaySections.filter((s) => s.show_in_menu),
    [displaySections]
  );

  // Ensure we always have an active section (for menu highlighting)
  useEffect(() => {
    if (activeSection && menuSections.some((s) => s.id === activeSection)) return;
    const first = menuSections[0];
    if (first) setActiveSection(first.id);
  }, [menuSections, activeSection]);

  useEffect(() => {
    if (menuSections.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of menuSections) {
        const element = sectionRefs.current[section.id];
        if (!element) continue;

        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection((prev) => (prev === section.id ? prev : section.id));
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuSections]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (!element) return;

    const offset = 180;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
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

      {/* Sections Content */}
      <div className="space-y-10">
        {displaySections.map((section) => (
          <section
            key={section.id}
            id={`section-${section.id}`}
            ref={(el) => (sectionRefs.current[section.id] = el)}
            className="scroll-mt-48"
          >
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
              {/* Section image (left column, same side as main product gallery) */}
              <div className={cn(section.image_url ? "block" : "hidden lg:block")}>
                {section.image_url && (
                  <div className="rounded-2xl overflow-hidden border border-border/50 shadow-soft bg-card h-full min-h-56">
                    <img
                      src={section.image_url}
                      alt={section.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Text content (right column) */}
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
            </div>
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

