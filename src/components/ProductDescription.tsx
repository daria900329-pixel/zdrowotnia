import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  content: string;
  showInMenu: boolean;
}

interface ProductDescriptionProps {
  description: string;
}

/**
 * Parses long description text and extracts sections based on headers.
 * Headers with [menu] prefix will appear in navigation menu.
 * 
 * Examples:
 * - "[menu] Składniki" → appears in menu as "Składniki"
 * - "## [menu] O produkcie" → appears in menu as "O produkcie"  
 * - "## Uwagi" → section header, but NOT in menu
 * - "**[menu] Sposób użycia:**" → appears in menu
 */
function parseDescriptionIntoSections(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let contentLines: string[] = [];

  // Pattern to detect [menu] marker and extract title
  const menuMarkerPattern = /\[menu\]\s*/i;

  const headerPatterns = [
    /^##\s+(.+)$/,           // ## Header
    /^\*\*(.+?):\*\*\s*$/,   // **Header:**
    /^\*\*(.+?)\*\*\s*$/,    // **Header**
    /^([A-ZŁŚŻŹĆĄĘÓŃ][a-ząęółśżźćń\s]+):$/,  // Header: (Polish capitalized)
    /^\[menu\]\s*(.+)$/i,    // [menu] Header (standalone)
  ];

  const isHeader = (line: string): { title: string; showInMenu: boolean } | null => {
    const trimmed = line.trim();
    
    for (const pattern of headerPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        let title = match[1].replace(/:$/, "").trim();
        let showInMenu = false;
        
        // Check if [menu] marker is present
        if (menuMarkerPattern.test(title)) {
          showInMenu = true;
          title = title.replace(menuMarkerPattern, "").trim();
        } else if (menuMarkerPattern.test(trimmed)) {
          showInMenu = true;
        }
        
        return { title, showInMenu };
      }
    }
    return null;
  };

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[ąàáâãäå]/g, "a")
      .replace(/[ćç]/g, "c")
      .replace(/[ęèéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[łľĺ]/g, "l")
      .replace(/[ńñ]/g, "n")
      .replace(/[óòôõö]/g, "o")
      .replace(/[ś]/g, "s")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y")
      .replace(/[żźž]/g, "z")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  for (const line of lines) {
    const headerInfo = isHeader(line);
    
    if (headerInfo) {
      // Save previous section
      if (currentSection) {
        currentSection.content = contentLines.join("\n").trim();
        if (currentSection.content || currentSection.showInMenu) {
          sections.push(currentSection);
        }
      }
      
      // Start new section
      currentSection = {
        id: slugify(headerInfo.title),
        title: headerInfo.title,
        content: "",
        showInMenu: headerInfo.showInMenu,
      };
      contentLines = [];
    } else if (currentSection) {
      contentLines.push(line);
    } else {
      // Content before first header - create intro section (not in menu by default)
      if (line.trim()) {
        if (!currentSection) {
          currentSection = {
            id: "wprowadzenie",
            title: "O produkcie",
            content: "",
            showInMenu: false,
          };
        }
        contentLines.push(line);
      }
    }
  }

  // Don't forget the last section
  if (currentSection) {
    currentSection.content = contentLines.join("\n").trim();
    if (currentSection.content || currentSection.showInMenu) {
      sections.push(currentSection);
    }
  }

  return sections;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const menuSections = sections.filter(s => s.showInMenu);

  useEffect(() => {
    const parsed = parseDescriptionIntoSections(description);
    setSections(parsed);
    const firstMenuSection = parsed.find(s => s.showInMenu);
    if (firstMenuSection) {
      setActiveSection(firstMenuSection.id);
    }
  }, [description]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of menuSections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuSections]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 180; // Increased to account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  if (sections.length === 0) {
    // Fallback for unstructured text
    return (
      <div className="prose prose-stone max-w-none">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
          O produkcie
        </h3>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {description}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Menu - only show if there are menu sections */}
      {menuSections.length > 1 && (
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
            id={section.id}
            ref={(el) => (sectionRefs.current[section.id] = el)}
            className="scroll-mt-32"
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
              {section.title}
            </h3>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
