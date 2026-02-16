import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, X } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  media_type: "image" | "video";
}

const AboutGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { content } = useSiteContent("about_page");

  const galleryTitle = content.gallery_title || "Nasza Codzienność";
  const gallerySubtitle = content.gallery_subtitle || "Zajrzyj za kulisy naszej pracy";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("about_gallery")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setItems(data as GalleryItem[]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {galleryTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {gallerySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
                onClick={() => setSelectedItem(item)}
              >
                {item.media_type === "video" ? (
                  <>
                    <video
                      src={item.image_url}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.image_url}
                      alt={item.caption || ""}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  </>
                )}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.media_type === "video" ? (
              <video
                src={selectedItem.image_url}
                className="w-full max-h-[85vh] object-contain rounded-lg"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={selectedItem.image_url}
                alt={selectedItem.caption || ""}
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}
            {selectedItem.caption && (
              <p className="text-white text-center mt-4 text-lg">
                {selectedItem.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AboutGallery;
