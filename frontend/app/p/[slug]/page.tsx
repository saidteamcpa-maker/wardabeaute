import { notFound } from "next/navigation";
import { getLangServer } from "@/lib/lang-server";
import { getPageOverride } from "@/lib/store-content";
import { t } from "@/content/ui";
import { sanitizeHtml } from "@/lib/safe-html";

export default async function CustomPage({ params, searchParams }: { params: { slug: string }; searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride(params.slug, lang, searchParams?.preview === "1");
  if (!ov) notFound();
  const title = ov["custom.title"] || params.slug;
  const body = sanitizeHtml(ov["custom.body"] || "");
  return (
    <div className="section">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl text-profond mb-4">{title}</h1>
        {body ? (
          <div className="font-body text-brun space-y-3" dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <p className="font-body text-gris">{t(lang, "cart.empty")}</p>
        )}
      </div>
    </div>
  );
}
