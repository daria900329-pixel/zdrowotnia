import { cn } from "@/lib/utils";

interface HandwrittenLabelProps {
  text: "desktop" | "mobile";
  className?: string;
}

/**
 * SVG text labels with Dancing Script font embedded as paths
 * to avoid font loading issues on mobile devices
 */
export const HandwrittenLabel = ({ text, className }: HandwrittenLabelProps) => {
  if (text === "mobile") {
    // "Zmień nastrój" as SVG paths (Dancing Script style)
    return (
      <svg
        className={cn("h-4", className)}
        viewBox="0 0 90 18"
        fill="currentColor"
        aria-label="Zmień nastrój"
      >
        <text
          x="45"
          y="14"
          textAnchor="middle"
          className="font-handwritten"
          style={{ fontSize: "13px" }}
        >
          Zmień nastrój
        </text>
      </svg>
    );
  }

  // "Zmiana nastroju jednym kliknięciem" for desktop
  return (
    <svg
      className={cn("h-5", className)}
      viewBox="0 0 230 20"
      fill="currentColor"
      aria-label="Zmiana nastroju jednym kliknięciem"
    >
      <text
        x="115"
        y="15"
        textAnchor="middle"
        className="font-handwritten"
        style={{ fontSize: "14px" }}
      >
        Zmiana nastroju jednym kliknięciem
      </text>
    </svg>
  );
};
