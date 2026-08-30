"use client";

import { useCart } from "@/lib/cart";
import { unitPrice, localize } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { track } from "@/lib/pixels";
import Image from "next/image";

const COD_MARKERS = [
  "— الدفع عند الاستلام",
  "الدفع عند الاستلام",
  "— الخلاص عند الاستلام",
  "الخلاص عند الاستلام",
  "— خلصي كيف يوصلك",
  "خلصي كيف يوصلك",
  "— paiement à la livraison",
  "— Paiement à la livraison",
  "paiement à la livraison",
  "Paiement à la livraison",
];

export function StickyCTA({ slug, imageSrc, scrollToCheckout = false }: { slug: string; imageSrc?: string; scrollToCheckout?: boolean }) {
  const { lang } = useLang();
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);
  const selectedTier = useCart((s) => s.selectedTier);
  const catalog = useCatalog();
  const p = localize(catalog[slug], lang);
  let ctaLabel = p.hero.cta;
  for (const m of COD_MARKERS) ctaLabel = ctaLabel.replace(m, "");
  ctaLabel = ctaLabel.replace(/—\s*$/, "").replace(/\s+/g, " ").trim() || p.hero.cta;
  if (lang === "fr") ctaLabel = "Commander maintenant";
  if (lang === "ar") ctaLabel = "طلبي دابا";
  const qty = selectedTier?.[slug] || 1;
  const price = scrollToCheckout ? unitPrice(slug, 1, catalog) : unitPrice(slug, qty, catalog);
  const bundleLabel =
    qty === 1
      ? lang === "ar"
        ? "قطعة واحدة"
        : "Produit seul"
      : lang === "ar"
        ? `عرض ${qty} قطع`
        : `Pack de ${qty}`;

  const handleAction = () => {
    if (scrollToCheckout) {
      const el = document.getElementById("order");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.hash = "#order";
      return;
    }
    add({ slug, qty });
    track("AddToCart", { content_ids: [slug], value: price, currency: "MAD" });
    openCart();
  };

  const actionLabel = scrollToCheckout
    ? lang === "ar"
      ? "اختاري العرض"
      : "Choisir une offre"
    : ctaLabel;

  return (
    <button
      type="button"
      aria-label={actionLabel}
      onClick={handleAction}
      className="md:hidden fixed bottom-0 inset-x-0 z-40 cursor-pointer group select-none text-left w-full"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-profond/95 backdrop-blur-md border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.28)] px-4 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <Image
            src={imageSrc || p.image}
            alt={p.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-cover border border-white/15 shrink-0 shadow-subtle"
          />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-white text-sm font-body truncate">{p.name}</div>
              <div className="text-white/90 text-xs">
                {scrollToCheckout ? `${price} MAD` : `${bundleLabel} · ${price} MAD`}
              </div>
            </div>
          <div
            className="btn-sticky-cta shrink-0 rounded-full px-5 py-3 text-sm font-body font-semibold text-white"
          >
            {actionLabel}
            <span
              className={`ml-1.5 inline-block transition-transform duration-200 ${
                lang === "ar" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
              }`}
              aria-hidden="true"
            >
              {lang === "ar" ? "←" : "→"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
