import ProductCard from "@/components/ProductCard";
import kombuchaImg from "@/assets/product-kombucha.jpg";
import vinegarImg from "@/assets/product-vinegar.jpg";
import breadImg from "@/assets/product-bread.jpg";
import rabbitImg from "@/assets/product-rabbit.jpg";

const products = [
  {
    name: "Kombucha",
    description: "Fermentowany napój herbaciany pełen probiotyków. Wspomaga trawienie i wzmacnia odporność.",
    image: kombuchaImg,
    price: "od 15 zł",
    badge: "Bestseller",
  },
  {
    name: "Ocet Jabłkowy",
    description: "Naturalnie fermentowany ocet z polskich jabłek. Idealna baza do dressingów i napojów zdrowotnych.",
    image: vinegarImg,
    price: "od 18 zł",
  },
  {
    name: "Chleb na Zakwasie",
    description: "Tradycyjny chleb pieczony na naturalnym zakwasie. Bez drożdży i konserwantów.",
    image: breadImg,
    price: "od 12 zł",
    badge: "Świeży!",
  },
  {
    name: "Mięso z Królika",
    description: "Delikatne, chude mięso z własnej hodowli. Króliki karmione naturalną paszą i ziołami.",
    image: rabbitImg,
    price: "od 45 zł/kg",
  },
];

const Products = () => {
  return (
    <section id="produkty" className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-accent font-medium mb-2 inline-block">Nasza Oferta</span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Produkty prosto z natury
          </h2>
          <p className="text-muted-foreground">
            Każdy produkt przygotowujemy ręcznie, z najwyższą dbałością o jakość i smak. 
            Używamy tylko sprawdzonych, naturalnych składników.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            🚀 <strong>Wkrótce w ofercie:</strong> Pasztet z królika, kury z wolnego wybiegu, 
            jaja od kurek, oliwa z Włoch
          </p>
        </div>
      </div>
    </section>
  );
};

export default Products;
