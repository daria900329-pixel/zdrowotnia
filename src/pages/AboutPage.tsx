import { Heart, Sparkles, Home, Users, Leaf, Clock, Award, MapPin, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Sparkles,
    title: "100% Naturalne",
    description: "Bez sztucznych dodatków, konserwantów czy barwników. Każdy składnik znamy z imienia.",
  },
  {
    icon: Heart,
    title: "Robione z Miłością",
    description: "Każdy słoik to kawałek naszego serca. Dbamy o każdy szczegół procesu.",
  },
  {
    icon: Home,
    title: "Rodzinna Tradycja",
    description: "Przepisy przekazywane z pokolenia na pokolenie, wzbogacone o naszą wiedzę.",
  },
  {
    icon: Users,
    title: "Dla Twojej Rodziny",
    description: "Produkty, które sami dajemy naszym dzieciom — bez kompromisów.",
  },
];

const timeline = [
  {
    year: "2018",
    title: "Pierwsze Eksperymenty",
    description: "Zaczęliśmy od fermentacji pierwszej kombuchy w domowej kuchni. To był początek wielkiej przygody.",
  },
  {
    year: "2020",
    title: "Rozwój Hodowli",
    description: "Założyliśmy własną hodowlę królików, stawiając na dobrostan zwierząt i jakość mięsa.",
  },
  {
    year: "2022",
    title: "Powiększenie Asortymentu",
    description: "Do oferty dołączyły octy owocowe, chleb na zakwasie i przetwory domowe.",
  },
  {
    year: "2024",
    title: "Zdrowotnia Online",
    description: "Uruchomiliśmy sklep internetowy, by dzielić się naszymi produktami z całą Polską.",
  },
];

const stats = [
  { value: "6+", label: "Lat Doświadczenia", icon: Clock },
  { value: "1000+", label: "Zadowolonych Klientów", icon: Users },
  { value: "100%", label: "Naturalne Składniki", icon: Leaf },
  { value: "3+", label: "Lata Naszego Zakwasu", icon: Award },
];

const AboutPage = () => {
  const { content, loading } = useSiteContent("about");

  const title = content.title || "Witaj w naszym domu! 🏡";
  const badge = content.badge || "Nasza Historia";
  const paragraph1 = content.paragraph1 || "Jesteśmy zwykłą rodziną, która odkryła magię domowego jedzenia. To, co zaczęło się jako pasja — fermentacja pierwszej kombuchy w kuchni — dziś stało się sposobem życia, którym chcemy się dzielić.";
  const paragraph2 = content.paragraph2 || "Nasze produkty powstają dokładnie tak, jak robiły to nasze babcie — bez pośpiechu, z sercem i z najlepszych składników. Króliki hodujemy sami, chleb pieczyemy na zakwasie, który ma już ponad 3 lata!";
  const highlight = content.highlight || "✨ Wierzymy, że dobre jedzenie łączy ludzi. Zapraszamy Cię do naszego stołu!";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-16 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-honey/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4 bg-accent/10 px-4 py-2 rounded-full text-sm">
              <Heart className="w-4 h-4" /> {badge}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {paragraph1}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-serif text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
                Nasza Droga do Zdrowotni
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{paragraph2}</p>
                <p>
                  Wszystko zaczęło się od prostej potrzeby — chcieliśmy wiedzieć, co jemy. 
                  Zmęczeni listami składników, których nie potrafimy wymówić, postanowiliśmy 
                  wrócić do korzeni. Do kuchni naszych babć, gdzie jedzenie było proste, 
                  prawdziwe i pełne smaku.
                </p>
                <p>
                  Dziś nasza kuchnia to prawdziwa manufaktura. Fermentujemy, kisimy, 
                  wędzimy i pieczemy — wszystko według tradycyjnych receptur, które 
                  udoskonalaliśmy przez lata.
                </p>
                <p className="text-foreground font-medium bg-secondary/50 p-4 rounded-xl border-l-4 border-primary">
                  {highlight}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 group hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-honey/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Nasza Historia
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Od pierwszego słoika kombuchy do pełnoprawnej manufaktury — oto nasza droga.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary/20" />
              
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="bg-card p-6 rounded-2xl shadow-soft border border-border/50">
                      <span className="inline-block text-primary font-bold text-lg mb-2">
                        {item.year}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Gdzie Nas Znajdziesz?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Działamy z małej miejscowości na Mazurach, gdzie czyste powietrze 
              i piękna natura inspirują nas każdego dnia. Nasze produkty wysyłamy 
              do całej Polski — świeże i starannie zapakowane.
            </p>
            <a
              href="/#kontakt"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Skontaktuj się z Nami
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
