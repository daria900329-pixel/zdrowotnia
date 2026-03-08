interface EmailPreviewProps {
  html: string;
  sampleVariables?: Record<string, string>;
}

const defaultSamples: Record<string, string> = {
  "{{customer_email}}": "jan@example.com",
  "{{order_id}}": "abc12345-6789-0000-1111-222233334444",
  "{{order_id_short}}": "ABC123",
  "{{order_total}}": "89,00 zł",
  "{{order_date}}": new Date().toLocaleDateString("pl-PL"),
  "{{order_items}}": `<div style="padding:12px 0;"><p style="color:#5c4a3a;margin:4px 0;"><strong>Ocet jabłkowy</strong> – Mały (250 ml) × 2 — 38,00 zł</p><p style="color:#5c4a3a;margin:4px 0;"><strong>Kombucha</strong> – Duży (500 ml) × 1 — 51,00 zł</p></div>`,
};

export function EmailPreview({ html, sampleVariables }: EmailPreviewProps) {
  const vars = { ...defaultSamples, ...sampleVariables };
  let preview = html;
  for (const [key, value] of Object.entries(vars)) {
    preview = preview.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "g"), value);
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-3 py-2 text-xs text-muted-foreground border-b flex items-center justify-between">
        <span>Podgląd z przykładowymi danymi</span>
        <span className="text-[10px]">600px szerokości</span>
      </div>
      <iframe
        srcDoc={preview}
        className="w-full h-[500px] bg-white"
        title="Email preview"
        sandbox=""
      />
    </div>
  );
}
