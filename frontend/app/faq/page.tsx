import { Faq } from "@/components/Faq";
import { localize } from "@/content/products";
import { getLangServer } from "@/lib/lang-server";
import { getCatalog } from "@/lib/catalog";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";

export default async function FaqPage({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride("faq", lang, searchParams?.preview === "1");
  const T = (k: string) => ov?.[k] ?? t(lang, k);
  const catalog = await getCatalog();
  const all = Object.values(catalog).flatMap((p) => localize(p, lang).faq);
  return (
    <div className="section">
      {ov?.["faq.bannerImage"] && (
        <div className="container-page mb-6">
          <img src={ov["faq.bannerImage"]} alt="" className="w-full aspect-[21/9] object-cover rounded-3xl" />
        </div>
      )}
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl text-profond mb-2">{T("faqPage.title")}</h1>
        <p className="font-body text-brun mb-6">{T("faqPage.sub")}</p>
        <Faq items={all} />
      </div>
    </div>
  );
}
