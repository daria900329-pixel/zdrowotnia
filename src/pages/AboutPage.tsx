import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AboutLanding } from "@/components/about/AboutLanding";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="O nas"
        description="Zdrowotnia nie zaczęła się od biznesplanu. Pokazujemy, czym karmimy zwierzęta, jak przygotowujemy produkty i ile na nie czekamy."
        canonical="/o-nas"
        jsonLd={breadcrumbJsonLd([
          { name: "Strona główna", url: "/" },
          { name: "O nas", url: "/o-nas" },
        ])}
      />
      <Header />
      <AboutLanding />
      <Footer />
    </div>
  );
};

export default AboutPage;
