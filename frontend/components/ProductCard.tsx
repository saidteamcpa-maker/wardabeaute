import Link from "next/link";
import { SampleImage } from "./SampleImage";
import { AddToCartButton } from "./AddToCartButton";
import { products } from "@/content/products";

export function ProductCard({ slug }: { slug: string }) {
  const p = products[slug];
  return (
      <div className="rounded-2xl bg-white border border-brume p-4 flex flex-col shadow-soft card-hover">
      <span className="badge-pill self-start mb-2">{p.badge}</span>
      <SampleImage label={p.name} />
      <Link href={`/${slug}`}>
        <h3 className="font-display text-2xl text-profond mt-3 hover:text-warda">{p.name}</h3>
      </Link>
      <p className="font-arabic text-gris text-sm">{p.arSub}</p>
      <p className="text-sm text-brun mt-2 line-clamp-2">{p.benefits[0]}</p>
      <div className="flex items-center gap-2 mt-2 text-champagne text-sm">
        {"★".repeat(5)}{" "}
        <span className="text-gris">{p.stars} ({p.reviews} avis)</span>
      </div>
      <div className="mt-2">
        <span className="text-profond font-body font-medium text-lg">{p.price} MAD</span>{" "}
        <span className="text-gris line-through text-sm">{p.oldPrice} MAD</span>
      </div>
      <div className="mt-4">
        <AddToCartButton slug={slug} />
      </div>
      <p className="text-center text-xs text-gris mt-2 flex items-center justify-center gap-1">
        <span>🚚</span> الدفع عند الاستلام — مجاني
      </p>
    </div>
  );
}
