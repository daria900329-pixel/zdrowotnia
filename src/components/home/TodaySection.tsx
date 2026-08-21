import { t } from "@/lib/pageText";

const TodaySection = () => {
  return (
    <section className="bg-secondary/35 py-20 md:py-32">
      <div className="max-w-[1150px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-16 items-start">
          {/* LEWA KOLUMNA */}
          <div>
            <p className="font-handwritten text-lg text-primary mb-4">
              {t("bez magazynu. i dobrze.")}
            </p>
            <h2 className="font-serif text-[2rem] leading-[1.08] sm:text-4xl lg:text-[3rem] text-foreground mb-8 break-words">
              {t("Nie wszystko czeka na półce.")}
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                {t(
                  "Zdrowotnia działa trochę inaczej niż zwykły sklep. Nie produkujemy na zapas tylko po to, żeby wszystko przez cały czas miało zieloną kropkę «dostępne»."
                )}
              </p>
              <p>
                {t(
                  "Chleb pieczemy. Kombuchę i ocet fermentujemy. Jajka zbieramy. A część rzeczy powstaje wtedy, kiedy natura i czas mówią, że są gotowe."
                )}
              </p>
              <p>
                {t("I właśnie dlatego nie zawsze wszystko mamy od ręki.")}
              </p>
            </div>
          </div>

          {/* PRAWA KOLUMNA */}
          <div className="space-y-10 md:space-y-12 md:pt-4">
            <div className="flex gap-5 md:gap-6">
              <span className="font-serif text-[3rem] md:text-[3.5rem] leading-none text-primary/20">
                01
              </span>
              <div>
                <h3 className="font-serif text-xl text-foreground mb-1">
                  {t("Ty wybierasz")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("Zamawiasz po prostu to, na co masz ochotę.")}
                </p>
              </div>
            </div>

            <div className="flex gap-5 md:gap-6">
              <span className="font-serif text-[3rem] md:text-[3.5rem] leading-none text-primary/20">
                02
              </span>
              <div>
                <h3 className="font-serif text-xl text-foreground mb-1">
                  {t("My sprawdzamy")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "Jeśli wszystko mamy — działamy. Jeśli czegoś akurat zabrakło, odezwiemy się do Ciebie."
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-5 md:gap-6">
              <span className="font-serif text-[3rem] md:text-[3.5rem] leading-none text-primary/20">
                03
              </span>
              <div>
                <h3 className="font-serif text-xl text-foreground mb-1">
                  {t("Ustalamy termin")}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "Powiesz nam, czy chcesz poczekać, odebrać resztę wcześniej czy ustalić inny dogodny termin."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FINAŁ SEKCJI */}
        <div className="mt-20 md:mt-28 text-center max-w-3xl mx-auto">
          {(() => {
            const text = t("Dobre jedzenie czasem wymaga chwili. Nie poganiamy go.");
            const [firstSentence, secondSentence] = text.split(". ");
            return (
              <p className="font-serif text-2xl md:text-3xl lg:text-[2.25rem] text-foreground leading-snug">
                {firstSentence}.
                <span className="whitespace-nowrap"> {secondSentence}</span>
              </p>
            );
          })()}
        </div>
      </div>
    </section>
  );
};

export default TodaySection;
