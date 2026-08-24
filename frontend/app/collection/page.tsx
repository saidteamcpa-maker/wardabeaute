import { ProductCard } from "@/components/ProductCard";
import { products, bundle } from "@/content/products";
import Link from "next/link";

export default function CollectionPage() {
  return (
    <div className="section">
      <div className="container-page">
        <h1 className="text-4xl text-profond mb-2">Nos Produits</h1>
        <p className="font-body text-brun mb-6">Trois solutions scientifiques, fabriquées au Maroc, payées à la livraison.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.keys(products).map((s) => <ProductCard key={s} slug={s} />)}
        </div>
        <div className="mt-10 text-center bg-white rounded-2xl border border-brume p-8">
          <h2 className="text-3xl text-profond mb-2">{bundle.name}</h2>
          <p className="font-arabic text-gris mb-3">{bundle.arSub}</p>
          <p className="text-2xl font-display text-profond">{bundle.price} MAD <span className="line-through text-gris text-base">{bundle.oldPrice} MAD</span></p>
          <Link href="/collection" className="btn-primary mt-4 inline-flex">Commander le Kit</Link>
        </div>
      </div>
    </div>
  );
}
