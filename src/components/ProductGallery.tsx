import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

interface ProductGalleryProps {
  productId: string;
  productName: string;
  fallbackImage?: string | null;
  overlayImageUrl?: string | null;
  overlayAlt?: string;
}

export function ProductGallery({
  productId,
  productName,
  fallbackImage,
  overlayImageUrl,
  overlayAlt,
}: ProductGalleryProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from("product_images")
        .select("id, image_url, display_order, is_primary")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setImages(data);
        // Find primary image index
        const primaryIndex = data.findIndex((img) => img.is_primary);
        if (primaryIndex !== -1) {
          setSelectedIndex(primaryIndex);
        }
      }
      setLoading(false);
    }

    fetchImages();
  }, [productId]);

  // If no gallery images, show fallback
  if (!loading && images.length === 0) {
    return (
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-hover bg-secondary/30">
        {fallbackImage ? (
          <img src={fallbackImage} alt={productName} className="w-full h-full object-cover object-center" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            Brak zdjęcia
          </div>
        )}

        {overlayImageUrl && (
          <div key={overlayImageUrl} className="absolute inset-0">
            <img
              src={overlayImageUrl}
              alt={overlayAlt ?? "Zdjęcie sekcji"}
              loading="lazy"
              className="w-full h-full object-cover animate-fade-in"
            />
          </div>
        )}
      </div>
    );
  }
    <div className="space-y-4">
      {/* Main Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-hover bg-gradient-to-br from-secondary/60 via-secondary/30 to-background">
        <img
          src={images[selectedIndex]?.image_url}
          alt={`${productName} - zdjęcie ${selectedIndex + 1}`}
          className="w-full h-full object-contain p-6 md:p-10"
        />

        {overlayImageUrl && (
          <div key={overlayImageUrl} className="absolute inset-0">
            <img
              src={overlayImageUrl}
              alt={overlayAlt ?? "Zdjęcie sekcji"}
              loading="lazy"
              className="w-full h-full object-cover animate-fade-in"
            />
          </div>
        )}
      </div>

            />
          </div>
        )}
      </div>

      {/* Thumbnails Carousel */}
      {images.length > 1 && (
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem key={image.id} className="pl-2 basis-1/4 md:basis-1/5">
                <button
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    selectedIndex === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  )}
                >
                  <img
                    src={image.image_url}
                    alt={`${productName} - miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 4 && (
            <>
              <CarouselPrevious className="-left-3" />
              <CarouselNext className="-right-3" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
}

// Helper hook to get primary image for product lists
export function useProductPrimaryImage(productId: string, fallbackUrl?: string | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(fallbackUrl || null);

  useEffect(() => {
    async function fetchPrimaryImage() {
      const { data, error } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", productId)
        .eq("is_primary", true)
        .maybeSingle();

      if (!error && data?.image_url) {
        setImageUrl(data.image_url);
      } else if (fallbackUrl) {
        setImageUrl(fallbackUrl);
      }
    }

    fetchPrimaryImage();
  }, [productId, fallbackUrl]);

  return imageUrl;
}
