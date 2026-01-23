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
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border/30">
      <Link 
        to={isFallback ? "#" : `/product/${id}`}
        className="block relative aspect-square overflow-hidden bg-secondary/30 flex items-center justify-center"
      >
        <img
          src={displayImage}
          alt={name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-accent to-primary text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-soft">
            {badge}
          </span>
        )}
        <div className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-background hover:scale-110">
          <Heart className="w-5 h-5 text-accent" />
        </div>
      </Link>
      
      <div className="p-6">
        <Link to={isFallback ? "#" : `/product/${id}`}>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
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
