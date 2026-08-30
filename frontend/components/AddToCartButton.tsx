"use client";

import { ShoppingBag, Package } from "lucide-react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/pixels";
import { unitPrice, localize } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";

export function AddToCartButton({
  slug,
  withTier = false,
  bundleSlugs,
  ctaLabel,
  defaultQty,
}: {
  slug: string;
  withTier?: boolean;
  bundleSlugs?: string[];
  ctaLabel?: string;
  defaultQty?: number;
}) {
  const { lang } = useLang();
  const catalog = useCatalog();
  const raw = catalog[slug];
  if (!raw) return null;
  const p = localize(raw, lang);
  const defaultTier = slug === "kit-collagene" ? 1 : slug === "silkstop" ? 3 : 2;
  const tier = useCart((s) => s.selectedTier[slug] ?? defaultTier);
  const setTier = useCart((s) => s.setTier);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);

  const onClick = () => {
    if (bundleSlugs && bundleSlugs.length) {
      bundleSlugs.forEach((s) => {
        add({ slug: s, qty: 1 });
        track("AddToCart", {
          content_ids: [s],
          value: unitPrice(s, 1, catalog),
          currency: "MAD",
        });
      });
      openCart();
      return;
    }
    const qty = withTier ? tier : defaultQty ?? 1;
    add({ slug, qty });
    track("AddToCart", {
      content_ids: [slug],
      value: unitPrice(slug, qty, catalog),
      currency: "MAD",
    });
    openCart();
  };

  return (
    <div id="product-cta" className="w-full">
      {withTier && (
        <div className="flex flex-col gap-2 mb-3">
          {p.offers.map((o) => (
            <button
              key={o.qty}
              type="button"
              onClick={() => setTier(slug, o.qty)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                tier === o.qty
                  ? "border-profond bg-profond text-white"
                  : "border-brume bg-white text-brun hover:border-warda active:scale-[0.98]"
              }`}
            >
              <span className={`flex items-center gap-0.5 ${tier === o.qty ? "text-or-doux" : "text-warda"}`}>
                {Array.from({ length: o.qty }).map((_, i) => (
                  <Package key={i} className="w-5 h-5" strokeWidth={1.6} />
                ))}
              </span>
              <span className="flex-1 font-body">
                <span className="font-medium">{o.qty === 1 ? "1 pièce" : `${o.qty} pièces`}</span>
              </span>
              <span className="text-right">
                <span className="font-medium">{o.price} MAD</span>
                {o.save ? (
                  <span className="block text-xs opacity-80">-{p.price * o.qty - o.price} MAD</span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      )}
      <button onClick={onClick} className="btn-primary w-full btn-glow flex items-center justify-center gap-2">
        <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
        {bundleSlugs && bundleSlugs.length ? (ctaLabel ?? "Ajouter au panier") : p.hero.cta}
      </button>
    </div>
  );
}
