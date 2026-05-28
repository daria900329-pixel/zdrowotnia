import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductVariantSelect } from "./ProductVariantSelect";
import { useProductPrimaryImage } from "./ProductGallery";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  badge?: string;
}

const ProductCard = ({ id, name, description, image, badge }: ProductCardProps) => {
  const isFallback = id.startsWith("fallback-");
  const primaryImage = useProductPrimaryImage(id, image);
  const displayImage = primaryImage || image;
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border/30 flex flex-col">
      <Link 
        to={isFallback ? "#" : `/product/${id}`}
        className="block relative overflow-hidden bg-gradient-to-br from-secondary/60 via-secondary/30 to-background"
        style={{ aspectRatio: "1/1" }}
      >
        <img
          src={displayImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-accent to-primary text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-soft">
            {badge}
          </span>
        )}
        <div className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-background hover:scale-110">
          <Heart className="w-4 h-4 text-accent" />
        </div>
      </Link>
      
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <Link to={isFallback ? "#" : `/product/${id}`}>
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors leading-snug">
            {name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>
        
        <ProductVariantSelect
          productId={id}
          productName={name}
          imageUrl={displayImage}
        />
      </div>
    </div>
  );
};

export default ProductCard;
