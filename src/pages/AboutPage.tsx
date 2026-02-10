import { Heart, Sparkles, Home, Users, Leaf, Clock, Award, MapPin, Loader2, Star, ShieldCheck, Flame, Droplets, Sun, Wheat, TreePine, type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutGallery from "@/components/AboutGallery";
import { SEO } from "@/components/SEO";

const ICON_MAP: Record<string, LucideIcon> = {
  Clock, Users, Leaf, Award, Heart, Sparkles, Home, MapPin, Star, ShieldCheck, Flame, Droplets, Sun, Wheat, TreePine,
};

const defaultValues = [
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

const valueIcons = [Sparkles, Heart, Home, Users];
const defaultStatIcons = ["Clock", "Users", "Leaf", "Award"];

const AboutPage = () => {
  const { content, loading } = useSiteContent("about_page");
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("about_gallery")
      .select("image_url")
      .eq("is_hero", true)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.image_url) setHeroImageUrl(data.image_url);
      });
  }, []);

  // Hero
  const heroTitle = content.hero_title || "Witaj w naszym domu!";
  const heroBadge = content.hero_badge || "Nasza Historia";
  const heroParagraph = content.hero_paragraph1 || "Jesteśmy zwykłą rodziną, która odkryła magię domowego jedzenia.";

  // Story
  const storyTitle = content.story_title || "Nasza Droga do Zdrowotni";
  const storyHighlight = content.story_highlight || "✨ Wierzymy, że dobre jedzenie łączy ludzi. Zapraszamy Cię do naszego stołu!";
  
  // Dynamically collect all story paragraphs (story_paragraph1, story_paragraph2, ...)
  const storyParagraphs: string[] = [];
  const defaultParagraphs = [
    "Króliki hodujemy sami, chleb pieczyemy na zakwasie.",
    "Wszystko zaczęło się od prostej potrzeby — chcieliśmy wiedzieć, co jemy.",
    "Dziś nasza kuchnia to prawdziwa manufaktura.",
  ];
  for (let i = 1; i <= 20; i++) {
    const val = content[`story_paragraph${i}`];
    if (val) {
      storyParagraphs.push(val);
    } else if (i <= defaultParagraphs.length && Object.keys(content).filter(k => k.startsWith("story_paragraph")).length === 0) {
      storyParagraphs.push(defaultParagraphs[i - 1]);
    }
  }
  if (storyParagraphs.length === 0) {
    defaultParagraphs.forEach(p => storyParagraphs.push(p));
  }

  // Stats
  const stats = [
    { value: content.stat1_value || "6+", label: content.stat1_label || "Lat Doświadczenia", icon: ICON_MAP[content.stat1_icon || defaultStatIcons[0]] || Clock },
    { value: content.stat2_value || "1000+", label: content.stat2_label || "Zadowolonych Klientów", icon: ICON_MAP[content.stat2_icon || defaultStatIcons[1]] || Users },
    { value: content.stat3_value || "100%", label: content.stat3_label || "Naturalne Składniki", icon: ICON_MAP[content.stat3_icon || defaultStatIcons[2]] || Leaf },
    { value: content.stat4_value || "3+", label: content.stat4_label || "Lata Naszego Zakwasu", icon: ICON_MAP[content.stat4_icon || defaultStatIcons[3]] || Award },
  ];

  // Values
  const values = [
    { icon: valueIcons[0], title: content.value1_title || defaultValues[0].title, description: content.value1_desc || defaultValues[0].description },
    { icon: valueIcons[1], title: content.value2_title || defaultValues[1].title, description: content.value2_desc || defaultValues[1].description },
    { icon: valueIcons[2], title: content.value3_title || defaultValues[2].title, description: content.value3_desc || defaultValues[2].description },
    { icon: valueIcons[3], title: content.value4_title || defaultValues[3].title, description: content.value4_desc || defaultValues[3].description },
  ];

  // Timeline
  const timelineTitle = content.timeline_title || "Nasza Historia";
  const timelineSubtitle = content.timeline_subtitle || "Od pierwszego słoika kombuchy do pełnoprawnej manufaktury — oto nasza droga.";
  const timeline = [
    { year: content.timeline1_year || "2018", title: content.timeline1_title || "Pierwsze Eksperymenty", description: content.timeline1_desc || "Zaczęliśmy od fermentacji pierwszej kombuchy w domowej kuchni." },
    { year: content.timeline2_year || "2020", title: content.timeline2_title || "Rozwój Hodowli", description: content.timeline2_desc || "Założyliśmy własną hodowlę królików." },
    { year: content.timeline3_year || "2022", title: content.timeline3_title || "Powiększenie Asortymentu", description: content.timeline3_desc || "Do oferty dołączyły octy owocowe, chleb na zakwasie i przetwory." },
    { year: content.timeline4_year || "2024", title: content.timeline4_title || "Zdrowotnia Online", description: content.timeline4_desc || "Uruchomiliśmy sklep internetowy." },
  ];

  // Location
  const locationTitle = content.location_title || "Gdzie Nas Znajdziesz?";
  const locationDescription = content.location_description || "Działamy z małej miejscowości na Mazurach.";
  const locationCta = content.location_cta || "Skontaktuj się z Nami";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="O nas"
        description="Poznaj historię Zdrowotni — rodzinnej manufaktury naturalnego jedzenia z Mazur. Dowiedz się, jak powstają nasze produkty."
        canonical="/o-nas"
      />
      <Header />
      
      {/* Hero Section with Image */}
      <section className="relative min-h-[75vh] flex items-end pt-20 overflow-hidden">
        {heroImageUrl ? (
          <>
            <img
              src={heroImageUrl}
              alt="O nas"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background">
            <div className="absolute top-20 right-10 w-96 h-96 bg-honey/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          </div>
        )}
        
        <div className="container mx-auto px-6 relative pb-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-medium mb-4 bg-accent/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              <Heart className="w-4 h-4" /> {heroBadge}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 drop-shadow-sm">
              {heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {heroParagraph}
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
                {storyTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {storyParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
                <p className="text-foreground font-medium bg-secondary/50 p-4 rounded-xl border-l-4 border-primary">
                  {storyHighlight}
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

      {/* Gallery Section */}
      <AboutGallery />

      {/* Timeline Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {timelineTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {timelineSubtitle}
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
              {locationTitle}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {locationDescription}
            </p>
            <Link
              to="/#kontakt"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
              onClick={() => {
                // After navigation, scroll to the contact section
                setTimeout(() => {
                  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <Heart className="w-4 h-4" />
              {locationCta}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;