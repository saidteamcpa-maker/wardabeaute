import { Section } from "@/components/Section";
import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";

export default async function NotreHistoirePage({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride("notre-histoire", lang, searchParams?.preview === "1");
  const T = (k: string) => ov?.[k] ?? t(lang, k);
  return (
    <div>
      <section className="section">
        <div className="container-page grid md:grid-cols-2 gap-8 items-center">
          {ov?.["story.image"] ? (
            <img src={ov["story.image"]} alt="Warda Beauté" className="aspect-[3/4] w-full max-w-md rounded-2xl object-cover mx-auto" />
          ) : (
            <div className="aspect-[3/4] w-full max-w-md rounded-2xl bg-brume mx-auto" />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-5xl text-profond mb-4">{T("story.title")}</h1>
            {lang === "ar" && <p className="font-arabic text-xl text-warda mb-6">{T("story.quote")}</p>}
            <p className="font-body text-brun mb-4">{T("story.p1")}</p>
            <p className="font-body text-brun mb-4">{T("story.p2")}</p>
          </div>
        </div>
      </section>
      <Section eyebrow={T("story.secEyebrow")} title={T("story.secTitle")} imageLabel="Lab Casablanca" imageSide="right">
        <p>{T("story.sec1")}</p>
        <p>{T("story.sec2")}</p>
      </Section>
    </div>
  );
}
