import { Faq } from "@/components/Faq";
import { localize } from "@/content/products";
import { getLangServer } from "@/lib/lang-server";
import { getCatalog } from "@/lib/catalog";
import { t } from "@/content/ui";

export default async function FaqPage() {
  const lang = getLangServer();
  const catalog = await getCatalog();
  const all = Object.values(catalog).flatMap((p) => localize(p, lang).faq);
  return (
    <div className="section">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl text-profond mb-2">{t(lang, "faqPage.title")}</h1>
        <p className="font-body text-brun mb-6">{t(lang, "faqPage.sub")}</p>
        <Faq items={all} />
      </div>
    </div>
  );
}
