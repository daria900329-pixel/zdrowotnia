import type { EmailBlock } from "./EmailBlockEditor";

export function emailBlocksToHtml(blocks: EmailBlock[], wrapperBg = "#f8f7f5", contentBg = "#ffffff"): string {
  const inner = blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `<h1 style="font-size:${block.styles.fontSize || 24}px;color:${block.styles.color || "#3d2e22"};font-weight:${block.styles.fontWeight || "bold"};text-align:${block.styles.textAlign || "center"};font-family:${block.styles.fontFamily || "Georgia, serif"};margin:0 0 16px 0;line-height:1.3;">${block.content}</h1>`;

        case "text":
          return `<p style="font-size:${block.styles.fontSize || 15}px;color:${block.styles.color || "#5c4a3a"};text-align:${block.styles.textAlign || "left"};font-family:${block.styles.fontFamily || "Arial, sans-serif"};margin:0 0 16px 0;line-height:1.6;">${block.content.replace(/\n/g, "<br/>")}</p>`;

        case "button":
          return `<div style="text-align:${block.styles.textAlign || "center"};margin:20px 0;"><a href="${block.styles.href || "#"}" style="display:inline-block;background-color:${block.styles.backgroundColor || "#6b8e5e"};color:${block.styles.color || "#ffffff"};font-size:${block.styles.fontSize || 16}px;padding:${block.styles.padding || 12}px ${Number(block.styles.padding || 12) * 2}px;border-radius:${block.styles.borderRadius || 6}px;text-decoration:none;font-weight:600;font-family:Arial,sans-serif;">${block.content}</a></div>`;

        case "divider":
          return `<hr style="border:none;border-top:${block.styles.height || 1}px solid ${block.styles.color || "#e8e0d8"};margin:16px 0;" />`;

        case "spacer":
          return `<div style="height:${block.styles.height || 24}px;"></div>`;

        case "image":
          return `<div style="text-align:center;margin:16px 0;"><img src="${block.content}" style="max-width:${block.styles.width || 100}%;border-radius:${block.styles.borderRadius || 8}px;" alt="" /></div>`;

        case "items_placeholder":
          return `{{order_items}}`;

        default:
          return "";
      }
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:${wrapperBg};font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${wrapperBg};">
<tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:${contentBg};border-radius:12px;overflow:hidden;max-width:100%;">
<tr><td style="padding:32px 28px;">
${inner}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function htmlToBlocks(html: string): EmailBlock[] | null {
  // Simple heuristic: if it contains our structured blocks, parse them.
  // Otherwise return null to indicate raw HTML mode.
  if (!html || !html.includes("<td") || html.includes("{{order_items}}") === false && html.length > 200) {
    return null;
  }
  return null; // For existing templates, we keep raw HTML editing
}
