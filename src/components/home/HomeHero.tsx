import { Link } from "react-router-dom";
import heroTable from "@/assets/hero-products.jpg";

const HomeHero = () => {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      <img
        src={heroTable}
        alt="Stół Zdrowotni: chleb na zakwasie, jajka przepiórcze, zioła, kombucha i ocet jabłkowy"
        width={1920}
        height={1280}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent md:from-background/90 md:via-background/25 md:to-transparent" />
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-background/70 via-background/10 to-transparent" />


      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 pb-16 md:pb-24 pt-40">
        <div className="max-w-3xl">
          <p className="text-[0.62rem] sm:text-xs tracking-[0.45em] uppercase text-foreground/70 mb-8">
            Zdrowotnia
          </p>
          <h1 className="font-serif text-[2.7rem] leading-[1.03] sm:text-6xl lg:text-7xl xl:text-[5rem] text-foreground mb-8 break-words">
            Prawdziwe jedzenie.
            <span className="block text-primary">Z prostych powodów.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-12">
            Wiemy, czym karmimy. Wiemy, jak powstaje. Wiemy, co trafia na Twój stół.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <a
              href="#produkty"
              className="inline-flex items-center justify-center bg-foreground text-background text-[0.7rem] tracking-[0.25em] uppercase px-9 py-4 hover:bg-earth transition-colors"
            >
              Zobacz, co dziś mamy
            </a>
            <Link
              to="/o-nas"
              className="inline-flex items-center justify-center text-[0.7rem] tracking-[0.25em] uppercase text-foreground/80 hover:text-foreground border-b border-foreground/30 hover:border-foreground pb-1 self-start sm:self-auto transition-colors"
            >
              Poznaj Zdrowotnię
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
