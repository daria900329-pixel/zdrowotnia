import Header from "@/components/Header";
import HomeHero from "@/components/home/HomeHero";
import Philosophy from "@/components/home/Philosophy";
import StoryProducts from "@/components/home/StoryProducts";
import TodaySection from "@/components/home/TodaySection";
import FeedSection from "@/components/home/FeedSection";
import JourneySection from "@/components/home/JourneySection";
import FromDaria from "@/components/home/FromDaria";
import NotPerfect from "@/components/home/NotPerfect";
import KitchenGallery from "@/components/home/KitchenGallery";
import ShopGrid from "@/components/home/ShopGrid";
import FinalStatement from "@/components/home/FinalStatement";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SEO, localBusinessJsonLd } from "@/components/SEO";


const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Czym jest kombucha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kombucha to naturalny napój fermentowany na bazie herbaty, bogaty w probiotyki i kwasy organiczne. Nasza kombucha powstaje z naturalnych składników, bez dodatku sztucznych aromatów.",
      },
    },
    {
      "@type": "Question",
      name: "Jak przechowywać ocet owocowy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ocet owocowy najlepiej przechowywać w ciemnym, chłodnym miejscu. Po otwarciu trzymaj w lodówce. Naturalny osad to oznaka żywej kultury bakterii — nie usuwaj go.",
      },
    },
    {
      "@type": "Question",
      name: "Czy wasze produkty są w pełni naturalne?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak, wszystkie produkty Zdrowotni powstają wyłącznie z naturalnych składników, bez konserwantów, sztucznych barwników i aromatów. Stosujemy tradycyjne metody fermentacji.",
      },
    },
    {
      "@type": "Question",
      name: "Jak długo trwa dostawa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zamówienia realizujemy w ciągu 2-3 dni roboczych. Wysyłka odbywa się kurierem na terenie całej Polski.",
      },
    },
  ],
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Prawdziwe jedzenie z rodzinnego gospodarstwa"
        description="Zdrowotnia — jaja przepiórcze, chleb na zakwasie, kombucha i ocet jabłkowy z rodzinnego gospodarstwa. Wiemy, czym karmimy i jak powstaje nasze jedzenie."
        canonical="/"
        jsonLd={[localBusinessJsonLd, faqJsonLd]}
      />
      <Header />
      <main>
        <HomeHero />
        <Philosophy />
        <StoryProducts />
        <TodaySection />
        <FeedSection />
        <JourneySection />
        <FromDaria />
        <NotPerfect />
        <KitchenGallery />
        <ShopGrid />
        <FinalStatement />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
