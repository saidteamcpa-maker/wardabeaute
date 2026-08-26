import { Section } from "@/components/Section";
import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";

export default function NotreHistoirePage() {
  const lang = getLangServer();
  return (
    <div>
      <section className="section">
        <div className="container-page grid md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[3/4] w-full max-w-md rounded-2xl bg-brume mx-auto" />
          <div className="text-center md:text-left">
            <h1 className="text-5xl text-profond mb-4">{t(lang, "story.title")}</h1>
            {lang === "ar" && <p className="font-arabic text-xl text-warda mb-6">{t(lang, "story.quote")}</p>}
            <p className="font-body text-brun mb-4">{t(lang, "story.p1")}</p>
            <p className="font-body text-brun mb-4">{t(lang, "story.p2")}</p>
          </div>
        </div>
      </section>
      <Section eyebrow={t(lang, "story.secEyebrow")} title={t(lang, "story.secTitle")} imageLabel="Lab Casablanca" imageSide="right">
        <p>{t(lang, "story.sec1")}</p>
        <p>{t(lang, "story.sec2")}</p>
      </Section>
    </div>
  );
}
