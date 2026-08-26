import { ProductCard } from "@/components/ProductCard";
import { localize } from "@/content/products";
import Link from "next/link";
import { getLangServer } from "@/lib/lang-server";
import { getCatalog, getBundleFromCatalog } from "@/lib/catalog";
import { t } from "@/content/ui";

export default async function CollectionPage() {
  const lang = getLangServer();
  const catalog = await getCatalog();
  const { price: kitPrice, oldPrice: kitOld } = getBundleFromCatalog(catalog);
  const kit = localize(catalog["kit-collagene"], lang);
  return (
    <div className="section">
      <div className="container-page">
        <h1 className="text-4xl text-profond mb-2">{t(lang, "collection.title")}</h1>
        <p className="font-body text-brun mb-6">{t(lang, "collection.sub")}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.keys(catalog).map((s) => <ProductCard key={s} slug={s} />)}
        </div>
        <div className="mt-10 text-center bg-white rounded-2xl border border-brume p-8">
          <h2 className="text-3xl text-profond mb-2">{kit.name}</h2>
          {lang === "ar" && <p className="font-arabic text-gris mb-3">{kit.arSub}</p>}
          <p className="text-2xl font-display text-profond">{kitPrice} MAD <span className="line-through text-gris text-base">{kitOld} MAD</span></p>
          <Link href="/kit-collagene" className="btn-primary mt-4 inline-flex">{t(lang, "home.bundleCta")}</Link>
        </div>
      </div>
    </div>
  );
}
