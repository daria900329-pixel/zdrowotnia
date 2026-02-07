import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface ProductDescriptionProps {
  description: string;
}

/**
 * Parses long description text and extracts sections based on headers.
 * Supports formats: "## Header", "**Header:**", "Header:" at line start
 */
function parseDescriptionIntoSections(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let contentLines: string[] = [];

  const headerPatterns = [
    /^##\s+(.+)$/,           // ## Header
    /^\*\*(.+?):\*\*\s*$/,   // **Header:**
    /^\*\*(.+?)\*\*\s*$/,    // **Header**
    /^([A-ZŁŚŻŹĆĄĘÓŃ][a-ząęółśżźćń\s]+):$/,  // Header: (Polish capitalized)
  ];

  const isHeader = (line: string): string | null => {
    const trimmed = line.trim();
    for (const pattern of headerPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        return match[1].replace(/:$/, "").trim();
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
    const headerTitle = isHeader(line);
    
    if (headerTitle) {
      // Save previous section
      if (currentSection) {
        currentSection.content = contentLines.join("\n").trim();
        if (currentSection.content) {
          sections.push(currentSection);
        }
      }
      
      // Start new section
      currentSection = {
        id: slugify(headerTitle),
        title: headerTitle,
        content: "",
      };
      contentLines = [];
    } else if (currentSection) {
      contentLines.push(line);
    } else {
      // Content before first header - create intro section
      if (line.trim()) {
        if (!currentSection) {
          currentSection = {
            id: "wprowadzenie",
            title: "O produkcie",
            content: "",
          };
        }
        contentLines.push(line);
      }
    }
  }

  // Don't forget the last section
  if (currentSection) {
    currentSection.content = contentLines.join("\n").trim();
    if (currentSection.content) {
      sections.push(currentSection);
    }
  }

  return sections;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const parsed = parseDescriptionIntoSections(description);
    setSections(parsed);
    if (parsed.length > 0) {
      setActiveSection(parsed[0].id);
    }
  }, [description]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
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
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 120;
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
      {/* Navigation Menu */}
      {sections.length > 1 && (
        <nav className="flex flex-wrap gap-2 p-4 bg-secondary/50 rounded-xl border border-border/50">
          {sections.map((section) => (
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
