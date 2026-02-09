import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SEO, localBusinessJsonLd } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        description="Zdrowotnia to rodzinna manufaktura naturalnego jedzenia. Kombucha, ocet owocowy, chleb na zakwasie i mięso z własnej hodowli. 100% naturalnie."
        canonical="/"
        jsonLd={localBusinessJsonLd}
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
