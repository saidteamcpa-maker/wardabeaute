"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { localize } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { t } from "@/content/ui";

export function ProductCard({
  slug,
  horizontal = false,
}: {
  slug: string;
  horizontal?: boolean;
}) {
  const { lang } = useLang();
  const catalog = useCatalog();
  const p = useMemo(() => localize(catalog[slug], lang), [catalog, slug, lang]);

  const delivery = useMemo(() => (
    <p className="text-center text-xs text-gris mt-2 flex items-center justify-center gap-1">
      <span>🚚</span> {t(lang, "paymentCOD")} · {t(lang, "freeShipping")}
    </p>
  ), [lang]);

  if (horizontal) {
    return (
      <div className="rounded-2xl bg-white border border-brume p-4 flex gap-4 shadow-soft card-hover">
        <Link href={`/${slug}`} className="shrink-0 w-1/3 max-w-[170px]">
          <div className="overflow-hidden rounded-xl relative">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(max-width: 768px) 100vw, 170px"
              className="w-full aspect-video object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <div className="flex flex-col flex-1 min-w-0">
          <Link href={`/${slug}`} className="flex flex-col flex-1">
            <span className="badge-pill self-start mb-2">{p.badge}</span>
            <h3 className="font-display text-2xl text-profond hover:text-warda">
              {p.name}
            </h3>
            {lang === "ar" && <p className="font-arabic text-gris text-sm">{p.arSub}</p>}
            <p className="text-sm text-brun mt-2 line-clamp-2">{p.benefits[0]}</p>
            <div className="flex items-center gap-2 mt-2 text-champagne text-sm">
              {"★".repeat(5)}{" "}
              <span className="text-gris">
                {p.stars} ({p.reviews} {t(lang, "reviews")})
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-brume/60">
              <span className="text-profond font-body font-medium text-lg">
                {p.price} MAD
              </span>{" "}
              <span className="text-gris line-through text-sm">
                {p.oldPrice} MAD
              </span>
            </div>
          </Link>
          <div className="mt-3">
            <AddToCartButton slug={slug} />
          </div>
          {delivery}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-brume p-4 flex flex-col shadow-soft card-hover">
        <Link href={`/${slug}`} className="flex flex-col flex-1">
          <span className="badge-pill self-start mb-2">{p.badge}</span>
          <div className="overflow-hidden rounded-xl relative">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="w-full aspect-square object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        <h3 className="font-display text-2xl text-profond mt-3 hover:text-warda">
          {p.name}
        </h3>
        {lang === "ar" && <p className="font-arabic text-gris text-sm">{p.arSub}</p>}
        <p className="text-sm text-brun mt-2 line-clamp-2">{p.benefits[0]}</p>
        <div className="flex items-center gap-2 mt-2 text-champagne text-sm">
          {"★".repeat(5)}{" "}
          <span className="text-gris">
            {p.stars} ({p.reviews} {t(lang, "reviews")})
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-brume/60">
          <span className="text-profond font-body font-medium text-lg">
            {p.price} MAD
          </span>{" "}
          <span className="text-gris line-through text-sm">
            {p.oldPrice} MAD
          </span>
        </div>
      </Link>
      <div className="mt-4">
        <AddToCartButton slug={slug} />
      </div>
      {delivery}
    </div>
  );
}
