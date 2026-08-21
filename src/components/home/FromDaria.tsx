import { ScrollReveal } from "@/components/ScrollReveal";
import dariaPhoto from "@/assets/home/daria.jpg";

const FromDaria = () => {
  return (
    <section className="bg-secondary/40">
      <div className="grid lg:grid-cols-2 items-center">
        <div>
          <img
            src={dariaPhoto}
            alt="Daria przy kuchennym stole podczas przygotowywania jedzenia"
            loading="lazy"
            width={1408}
            height={1760}
            className="w-full h-[55vh] lg:h-[92vh] object-cover"
          />
        </div>

        <div className="px-6 md:px-10 lg:px-16 py-20 lg:py-32">
          <ScrollReveal>
            <p className="text-[0.62rem] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8">
              Od Darii
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              Zdrowotnia zaczęła się od prostego pytania:
            </p>
            <blockquote className="font-serif text-[1.6rem] leading-[1.2] sm:text-3xl lg:text-[2.4rem] text-foreground mb-10 max-w-xl break-words">
              „A gdybyśmy po prostu zaczęli robić jedzenie tak, jak sami chcemy jeść?”
            </blockquote>
            <p className="text-muted-foreground leading-relaxed mb-5 max-w-lg">
              Bez wielkiej fabryki. Bez anonimowych dostawców. Bez udawania, że natura zawsze
              wygląda idealnie.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-lg">
              Za to z ogromną ciekawością tego, jak sposób chowu, karmienia i przygotowania wpływa
              na to, co ostatecznie trafia na talerz.
            </p>
            <p className="font-handwritten text-2xl text-primary">Daria Ciesielska</p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FromDaria;
