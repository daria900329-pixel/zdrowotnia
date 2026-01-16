import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  price?: string;
  badge?: string;
}

const ProductCard = ({ name, description, image, price, badge }: ProductCardProps) => {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          {price && (
            <span className="font-semibold text-lg text-primary">
              {price}
            </span>
          )}
          <Button variant="default" size="sm" className="ml-auto">
            Zamów
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
