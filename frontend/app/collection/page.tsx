import { ProductCard } from "@/components/ProductCard";
import { localize } from "@/content/products";
import Link from "next/link";
import Image from "next/image";
import { getLangServer } from "@/lib/lang-server";
import { getCatalog, getBundleFromCatalog } from "@/lib/catalog";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";

export default async function CollectionPage({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride("collection", lang, searchParams?.preview === "1");
  const T = (k: string) => ov?.[k] || t(lang, k);
  const catalog = await getCatalog();
  const { price: kitPrice, oldPrice: kitOld } = getBundleFromCatalog(catalog);
  const kit = localize(catalog["kit-collagene"], lang);
  return (
    <div className="section">
      {ov?.["collection.bannerImage"] && (
        <div className="container-page mb-6">
          <div className="relative w-full aspect-[21/9]">
            <Image src={ov["collection.bannerImage"]} alt="" fill sizes="(max-width: 768px) 100vw, 1000px" className="object-cover rounded-3xl shadow-elevated" />
          </div>
        </div>
      )}
      <div className="container-page">
        <h1 className="text-4xl leading-[1.15] text-profond mb-3 text-balance">{T("collection.title")}</h1>
        <p className="font-body text-brun mb-8 leading-relaxed max-w-2xl">{T("collection.sub")}</p>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {Object.keys(catalog).map((s) => <ProductCard key={s} slug={s} />)}
        </div>
        <div className="mt-12 text-center bg-gradient-to-b from-white to-petal/50 rounded-2xl border border-brume p-8 lg:p-10 shadow-subtle">
          <h2 className="text-3xl leading-tight text-profond mb-2 text-balance">{kit.name}</h2>
          {lang === "ar" && <p className="font-arabic text-gris mb-3 leading-relaxed">{kit.arSub}</p>}
          <p className="text-2xl font-display text-profond tabular-nums">{kitPrice} MAD <span className="line-through text-gris text-base font-normal">{kitOld} MAD</span></p>
          <Link href="/kit-collagene" className="btn-primary btn-glow mt-6 inline-flex">{t(lang, "home.bundleCta")}</Link>
        </div>
      </div>
    </div>
  );
}
