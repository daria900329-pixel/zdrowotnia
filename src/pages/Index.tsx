import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
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
        description="Zdrowotnia to rodzinna manufaktura naturalnego jedzenia. Kombucha, ocet owocowy, chleb na zakwasie i mięso z własnej hodowli. 100% naturalnie."
        canonical="/"
        jsonLd={[localBusinessJsonLd, faqJsonLd]}
      />
      <Header />
      <main>
        <Hero />
        <Products />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
