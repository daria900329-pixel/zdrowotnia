import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Image,
  SeparatorHorizontal,
  AlignLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export interface EmailBlock {
  id: string;
  type: "header" | "text" | "button" | "divider" | "image" | "spacer" | "items_placeholder";
  content: string;
  styles: Record<string, string>;
}

interface EmailBlockEditorProps {
  blocks: EmailBlock[];
  onChange: (blocks: EmailBlock[]) => void;
}

const defaultStyles: Record<EmailBlock["type"], Record<string, string>> = {
  header: { fontSize: "24", color: "#3d2e22", fontWeight: "bold", textAlign: "center", fontFamily: "Georgia, serif" },
  text: { fontSize: "15", color: "#5c4a3a", textAlign: "left", fontFamily: "Arial, sans-serif" },
  button: { backgroundColor: "#6b8e5e", color: "#ffffff", fontSize: "16", borderRadius: "6", padding: "12", textAlign: "center" },
  divider: { color: "#e8e0d8", height: "1" },
  image: { width: "100", borderRadius: "8" },
  spacer: { height: "24" },
  items_placeholder: { fontSize: "14", color: "#5c4a3a" },
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function BlockStyleEditor({ block, onChange }: { block: EmailBlock; onChange: (b: EmailBlock) => void }) {
  const updateStyle = (key: string, value: string) => {
    onChange({ ...block, styles: { ...block.styles, [key]: value } });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
      {block.type !== "divider" && block.type !== "spacer" && block.type !== "items_placeholder" && (
        <>
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">Rozmiar czcionki</Label>
            <Input
              type="number"
              value={block.styles.fontSize || "14"}
              onChange={(e) => updateStyle("fontSize", e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-muted-foreground">Kolor tekstu</Label>
            <div className="flex gap-1">
              <input
                type="color"
                value={block.styles.color || "#333333"}
                onChange={(e) => updateStyle("color", e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <Input
                value={block.styles.color || "#333333"}
                onChange={(e) => updateStyle("color", e.target.value)}
                className="h-8 text-xs flex-1"
              />
            </div>
          </div>
        </>
      )}
      {block.type === "button" && (
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Kolor tła</Label>
          <div className="flex gap-1">
            <input
              type="color"
              value={block.styles.backgroundColor || "#6b8e5e"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <Input
              value={block.styles.backgroundColor || "#6b8e5e"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="h-8 text-xs flex-1"
            />
          </div>
        </div>
      )}
      {(block.type === "header" || block.type === "text") && (
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Wyrównanie</Label>
          <Select value={block.styles.textAlign || "left"} onValueChange={(v) => updateStyle("textAlign", v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Do lewej</SelectItem>
              <SelectItem value="center">Środek</SelectItem>
              <SelectItem value="right">Do prawej</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {(block.type === "divider" || block.type === "spacer") && (
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Wysokość (px)</Label>
          <Input
            type="number"
            value={block.styles.height || "1"}
            onChange={(e) => updateStyle("height", e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      )}
      {block.type === "divider" && (
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Kolor linii</Label>
          <div className="flex gap-1">
            <input
              type="color"
              value={block.styles.color || "#e8e0d8"}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <Input
              value={block.styles.color || "#e8e0d8"}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="h-8 text-xs flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const blockTypeLabels: Record<EmailBlock["type"], { label: string; icon: React.ReactNode }> = {
  header: { label: "Nagłówek", icon: <Type className="w-4 h-4" /> },
  text: { label: "Tekst", icon: <AlignLeft className="w-4 h-4" /> },
  button: { label: "Przycisk", icon: <span className="w-4 h-4 text-[10px] font-bold border rounded px-0.5">BTN</span> },
  divider: { label: "Linia", icon: <SeparatorHorizontal className="w-4 h-4" /> },
  image: { label: "Obrazek", icon: <Image className="w-4 h-4" /> },
  spacer: { label: "Odstęp", icon: <span className="w-4 h-4 border-y border-dashed" /> },
  items_placeholder: { label: "Pozycje zamówienia", icon: <span className="w-4 h-4 text-[9px] font-mono">{'{{…}}'}</span> },
};

export function EmailBlockEditor({ blocks, onChange }: EmailBlockEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addBlock = (type: EmailBlock["type"]) => {
    const newBlock: EmailBlock = {
      id: generateId(),
      type,
      content: type === "items_placeholder" ? "{{order_items}}" : type === "divider" || type === "spacer" ? "" : "",
      styles: { ...defaultStyles[type] },
    };
    onChange([...blocks, newBlock]);
    setExpandedId(newBlock.id);
  };

  const updateBlock = (updated: EmailBlock) => {
    onChange(blocks.map((b) => (b.id === updated.id ? updated : b)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newBlocks = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= newBlocks.length) return;
    [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Bloki treści</Label>
      
      {blocks.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground text-sm">
          Dodaj pierwszy blok treści poniżej
        </div>
      )}

      {blocks.map((block, index) => {
        const isExpanded = expandedId === block.id;
        const meta = blockTypeLabels[block.type];
        return (
          <Card key={block.id} className="p-3 relative">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium min-w-0">
                {meta.icon}
                <span>{meta.label}</span>
              </div>
              <div className="text-xs text-muted-foreground truncate flex-1">
                {block.content && block.type !== "items_placeholder" ? block.content.substring(0, 40) + (block.content.length > 40 ? "…" : "") : ""}
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                  <ChevronUp className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpandedId(isExpanded ? null : block.id)}>
                  <span className="text-[10px]">{isExpanded ? "▲" : "▼"}</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeBlock(block.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-2 border-t pt-3">
                {block.type !== "divider" && block.type !== "spacer" && (
                  <div className="space-y-1">
                    <Label className="text-xs">
                      {block.type === "image" ? "URL obrazka" : block.type === "items_placeholder" ? "Zmienna (nie zmieniaj)" : "Treść"}
                    </Label>
                    {block.type === "text" || block.type === "header" ? (
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock({ ...block, content: e.target.value })}
                        rows={block.type === "text" ? 4 : 2}
                        className="text-sm"
                        placeholder={block.type === "header" ? "Nagłówek wiadomości..." : "Treść akapitu... Możesz używać zmiennych {{order_id}} itp."}
                      />
                    ) : (
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlock({ ...block, content: e.target.value })}
                        className="text-sm"
                        placeholder={block.type === "button" ? "Tekst przycisku" : block.type === "image" ? "https://..." : ""}
                        disabled={block.type === "items_placeholder"}
                      />
                    )}
                  </div>
                )}
                {block.type === "button" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Link (URL)</Label>
                    <Input
                      value={block.styles.href || ""}
                      onChange={(e) => updateBlock({ ...block, styles: { ...block.styles, href: e.target.value } })}
                      className="text-sm"
                      placeholder="https://zdrowotnia.pl"
                    />
                  </div>
                )}
                <BlockStyleEditor block={block} onChange={updateBlock} />
              </div>
            )}
          </Card>
        );
      })}

      {/* Add block buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        {(Object.keys(blockTypeLabels) as EmailBlock["type"][]).map((type) => (
          <Button key={type} variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => addBlock(type)}>
            <Plus className="w-3 h-3" />
            {blockTypeLabels[type].label}
          </Button>
        ))}
      </div>
    </div>
  );
}
