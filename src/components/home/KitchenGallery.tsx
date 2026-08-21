import { ScrollReveal } from "@/components/ScrollReveal";
import quails from "@/assets/quail/quails.jpg";
import eggInHand from "@/assets/quail/egg-in-hand.jpg";
import breadCut from "@/assets/home/bread-cut.jpg";
import feedMix from "@/assets/quail/feed-mix.jpg";
import freshEggs from "@/assets/quail/fresh-eggs.jpg";
import kombucha from "@/assets/home/kombucha-editorial.jpg";
import kitchenCorner from "@/assets/home/kitchen-corner.jpg";
import eatSoft from "@/assets/quail/eat-soft.jpg";
import heroTable from "@/assets/home/hero-table.jpg";

const SHOTS = [
  { img: quails, alt: "Nasze przepiórki", cls: "aspect-[4/5]" },
  { img: eggInHand, alt: "Jajko przepiórcze w dłoni", cls: "aspect-square mt-8" },
  { img: breadCut, alt: "Świeżo przekrojony chleb", cls: "aspect-[5/4]" },
  { img: feedMix, alt: "Nasza mieszanka paszy", cls: "aspect-[4/5] mt-10" },
  { img: freshEggs, alt: "Skrzynka świeżych jaj", cls: "aspect-square" },
  { img: kombucha, alt: "Butelki kombuchy", cls: "aspect-[4/5] mt-6" },
  { img: kitchenCorner, alt: "Zioła w naszej kuchni", cls: "aspect-[5/4]" },
  { img: eatSoft, alt: "Jajka na miękko", cls: "aspect-square mt-8" },
  { img: heroTable, alt: "Nasz stół", cls: "aspect-[5/4]" },
];

const KitchenGallery = () => {
  return (
    <section className="bg-secondary/40 py-20 md:py-32">
      <div className="px-6 md:px-10 lg:px-16">
        <ScrollReveal className="max-w-2xl mb-14 md:mb-20">
          <h2 className="font-serif text-[2rem] leading-[1.08] sm:text-4xl lg:text-[3rem] text-foreground mb-5 break-words">
            Zdrowotnia od kuchni.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Bez studia. Bez udawania. Tak to naprawdę wygląda.
          </p>
        </ScrollReveal>

        <div className="columns-2 md:columns-3 gap-4 sm:gap-6 [column-fill:_balance]">
          {SHOTS.map((s, i) => (
            <ScrollReveal key={s.alt} delay={(i % 3) * 90} className="mb-4 sm:mb-6 break-inside-avoid">
              <img
                src={s.img}
                alt={s.alt}
                loading="lazy"
                className={`w-full object-cover ${s.cls}`}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KitchenGallery;
