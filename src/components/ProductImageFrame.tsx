import { cn } from "@/lib/utils";

interface ProductImageFrameProps {
  src?: string | null;
  alt: string;
  aspectClassName?: string;
  className?: string;
}

/**
 * Shows the full product photo (object-contain) while keeping the frame filled
 * using a blurred background derived from the same image.
 */
export function ProductImageFrame({
  src,
  alt,
  aspectClassName = "aspect-[4/5]",
  className,
}: ProductImageFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card",
        aspectClassName,
        className,
      )}
    >
      {src ? (
        <>
          {/* Blurred fill background */}
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-60 transition-transform duration-700 group-hover:scale-[1.15]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-background/35"
          />

          {/* Foreground image (no cropping) */}
          <img
            src={src}
            alt={alt}
            className="relative z-[1] h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          Brak zdjęcia
        </div>
      )}
    </div>
  );
}
