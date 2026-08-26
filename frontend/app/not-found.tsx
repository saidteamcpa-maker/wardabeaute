import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getLangServer } from "@/lib/lang-server";
import { getCatalog } from "@/lib/catalog";
import { t } from "@/content/ui";

export default async function NotFound() {
  const lang = getLangServer();
  const catalog = await getCatalog();
  return (
    <div className="section">
      <div className="container-page text-center">
        <h1 className="text-5xl text-profond mb-2">404</h1>
        <p className="font-body text-brun mb-6">{t(lang, "notFound.sub")}</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          {Object.keys(catalog).map((s) => <ProductCard key={s} slug={s} />)}
        </div>
        <Link href="/" className="btn-outline mt-8 inline-flex">{t(lang, "notFound.cta")}</Link>
      </div>
    </div>
  );
}
