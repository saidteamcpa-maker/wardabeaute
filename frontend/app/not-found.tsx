import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/content/products";

export default function NotFound() {
  return (
    <div className="section">
      <div className="container-page text-center">
        <h1 className="text-5xl text-profond mb-2">404</h1>
        <p className="font-body text-brun mb-6">Cette page n'existe pas. Découvrez nos produits 👇</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          {Object.keys(products).map((s) => <ProductCard key={s} slug={s} />)}
        </div>
        <Link href="/" className="btn-outline mt-8 inline-flex">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
