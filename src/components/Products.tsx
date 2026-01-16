import ProductCard from "@/components/ProductCard";
import kombuchaImg from "@/assets/product-kombucha.jpg";
import vinegarImg from "@/assets/product-vinegar.jpg";
import breadImg from "@/assets/product-bread.jpg";
import rabbitImg from "@/assets/product-rabbit.jpg";
import { Sparkles } from "lucide-react";

const products = [
  {
    name: "Kombucha",
    description: "Nasz rodzinny eliksir zdrowia! Fermentowany napój pełen dobrych bakterii. Mama robi ją od 5 lat. 🫖",
    image: kombuchaImg,
    price: "od 15 zł",
    badge: "Ulubiona!",
  },
  {
    name: "Ocet Jabłkowy",
    description: "Z polskich jabłuszek, fermentowany miesiącami. Babciny przepis na zdrowie i urodę! 🍎",
    image: vinegarImg,
    price: "od 18 zł",
  },
  {
    name: "Chleb na Zakwasie",
    description: "Pieczony z miłością, na 3-letnim zakwasie. Aromat, który wypełnia cały dom. 🍞",
    image: breadImg,
    price: "od 12 zł",
    badge: "Ciepły!",
  },
  {
    name: "Mięso z Królika",
    description: "Z naszej domowej hodowli. Króliki mają imiona i jedzą zioła z ogrodu. Chude i delikatne. 🐰",
    image: rabbitImg,
    price: "od 45 zł/kg",
  },
];

const Products = () => {
  return (
    <section id="produkty" className="section-padding bg-secondary/40 relative">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-accent font-medium mb-3 bg-accent/10 px-3 py-1 rounded-full text-sm">
            <Sparkles className="w-4 h-4" /> Prosto z Naszej Kuchni
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Co dziś dla Ciebie przygotowaliśmy? 🥰
          </h2>
          <p className="text-muted-foreground">
            Każdy produkt robimy ręcznie, w małych partiach. Dokładnie tak, 
            jak byśmy przygotowywali je dla własnej rodziny — bo tak właśnie jest!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-card border border-primary/20 rounded-2xl px-8 py-6 shadow-soft">
            <p className="text-foreground font-medium mb-2">
              🌟 <strong>Wkrótce w naszej spiżarni:</strong>
            </p>
            <p className="text-muted-foreground">
              Pasztet z królika • Kurczaki z wolnego wybiegu • Jajka od szczęśliwych kurek • Oliwa z Włoch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
