import { Heart, Leaf, Award, Users } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Naturalne",
    description: "Bez sztucznych dodatków, konserwantów i GMO.",
  },
  {
    icon: Heart,
    title: "Robione z Pasją",
    description: "Każdy produkt tworzymy ręcznie z miłością do rzemiosła.",
  },
  {
    icon: Award,
    title: "Sprawdzona Jakość",
    description: "Testowane receptury i najlepsze składniki.",
  },
  {
    icon: Users,
    title: "Dla Zdrowia",
    description: "Produkty wspierające zdrowy styl życia.",
  },
];

const About = () => {
  return (
    <section id="o-nas" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <span className="text-accent font-medium mb-2 inline-block">O Nas</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Tradycja i pasja w każdym produkcie
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Jesteśmy rodziną, która wierzy w moc naturalnego jedzenia. 
                Od lat tworzymy produkty, które sami jemy i którymi chętnie dzielimy się z innymi.
              </p>
              <p>
                Nasza przygoda z fermentacją zaczęła się od prostej kombuchy. 
                Dziś oferujemy szeroki wybór domowych wyrobów — od napojów probiotycznych, 
                przez tradycyjny chleb na zakwasie, aż po mięso z naszej hodowli królików.
              </p>
              <p>
                Wierzymy, że zdrowe jedzenie nie musi być nudne ani drogie. 
                Chcemy, abyś mógł cieszyć się smakiem natury bez kompromisów.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
