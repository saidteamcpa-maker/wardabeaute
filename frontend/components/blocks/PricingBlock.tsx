"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { unitPrice } from "@/content/products";
import { useCatalog } from "@/lib/catalog-context";
import { useLang } from "@/components/LangProvider";
import { Package } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

type Lang = "fr" | "ar";

interface Offer {
  qty: number;
  price: number;
  save?: number;
}

interface PricingBlockProps {
  slug: string;
  offers?: Offer[];
  lang?: Lang;
  title?: string;
  eyebrow?: string;
}

export function PricingBlock({ slug, offers: propOffers, lang: propLang, title, eyebrow }: PricingBlockProps) {
  const { lang: ctxLang } = useLang();
  const lang = propLang ?? ctxLang;
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const catalog = useCatalog();
  const raw = catalog[slug];
  const offers = propOffers ?? raw?.offers ?? [];
  const displayOffers = offers.slice(0, 3);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);
  const setStoreTier = useCart((s) => s.setTier);
  const selectedTier = useCart((s) => s.selectedTier[slug]);
  const [localQty, setLocalQty] = useState<number>(selectedTier ?? displayOffers[0]?.qty ?? 1);

  const activeQty = selectedTier ?? localQty;

  const handleSelect = (qty: number) => {
    setLocalQty(qty);
    setStoreTier(slug, qty);
  };

  const handleAdd = (qty: number) => {
    setLocalQty(qty);
    setStoreTier(slug, qty);
    add({ slug, qty });
    openCart();
  };

  if (!raw) return null;

  const basePrice: number = raw.price;

  const qtyLabel = (qty: number) => {
    if (lang === "ar") return qty === 1 ? "وحدة واحدة" : `${qty} قطع`;
    return qty === 1 ? "1 pièce" : `${qty} pièces`;
  };

  const bundleLabel = (qty: number) => {
    if (lang === "ar") return qty === 1 ? "فردي" : qty === 2 ? "ثنائي" : "ثلاثي";
    return qty === 1 ? "Solo" : qty === 2 ? "Duo" : "Trio";
  };

  return (
    <section dir={dir} className="section bg-white">
      <div className="container-page">
        {(eyebrow || title) && (
          <Reveal>
            {eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{eyebrow}</p>}
            {title && <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-8 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{title}</h2>}
          </Reveal>
        )}

        <div
          role="radiogroup"
          aria-label={lang === "ar" ? "اختر العرض" : "Choisir une offre"}
          className="grid md:grid-cols-3 gap-4"
        >
          {displayOffers.map((o: Offer) => {
            const isActive = activeQty === o.qty;
            const savings = o.save ?? (o.qty > 1 ? Math.max(0, basePrice * o.qty - o.price) : 0);
            const hasSavings = savings > 0;
            const unit = unitPrice(slug, o.qty, catalog);
            return (
              <Reveal key={o.qty}>
                <div
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={0}
                  onClick={() => handleSelect(o.qty)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(o.qty);
                    }
                  }}
                  className={`relative rounded-2xl border-2 p-5 flex flex-col gap-3 cursor-pointer transition-all duration-250 text-left focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none ${
                    isActive ? "border-profond bg-profond text-white shadow-elevated scale-[1.02]" : "border-brume bg-white text-brun hover:border-warda/40 hover:shadow-subtle"
                  }`}
                >
                  {hasSavings && (
                    <span
                      className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-body font-semibold shadow-subtle ${
                        dir === "rtl" ? "left-4" : "right-4"
                      } ${isActive ? "bg-or-doux text-profond border border-champagne/20" : "bg-champagne text-white"}`}
                    >
                      {lang === "ar" ? `وفّري ${savings} MAD` : `-${savings} MAD`}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-0.5 ${isActive ? "text-or-doux" : "text-warda"}`} aria-hidden="true">
                      {Array.from({ length: o.qty }).map((_, i) => (
                        <Package key={i} className="w-5 h-5" strokeWidth={1.6} />
                      ))}
                    </span>
                    <span className={`font-body text-sm font-semibold ${isActive ? "text-white" : "text-profond"}`}>
                      {bundleLabel(o.qty)} Â· {qtyLabel(o.qty)}
                    </span>
                    <span
                      className={`ml-auto w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 ${isActive ? "border-white bg-white" : "border-brume bg-white"}`}
                      aria-hidden="true"
                    >
                      {isActive && <span className="w-2.5 h-2.5 rounded-full bg-profond" />}
                    </span>
                  </div>

                  <div>
                    <div className={`font-display text-2xl leading-none ${isActive ? "text-white" : "text-profond"}`}>{o.price} MAD</div>
                    <div className={`font-body text-xs mt-1 ${isActive ? "text-white/80" : "text-gris"}`}>
                      {o.qty} × {unit} MAD
                      {o.qty === 1 ? (lang === "ar" ? " / وحدة" : " / unité") : lang === "ar" ? " للمجموع" : " total"}
                    </div>
                    {hasSavings ? (
                      <div className={`font-body text-xs font-medium mt-1 ${isActive ? "text-or-doux" : "text-champagne"}`}>
                        {lang === "ar" ? `توفير ${savings} MAD` : `Économisez ${savings} MAD`}
                      </div>
                    ) : (
                      o.qty > 1 && (
                        <div className={`font-body text-xs mt-1 ${isActive ? "text-white/70" : "text-gris"}`}>
                          {lang === "ar" ? "سعر عادي" : "Prix standard"}
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(o.qty);
                    }}
                    className={`w-full mt-1 rounded-full px-5 py-3 text-sm font-body font-semibold transition-all duration-250 ${
                      isActive ? "bg-white text-profond hover:bg-or-doux hover:shadow-glow" : "bg-profond text-white hover:brightness-110 hover:shadow-glow"
                    }`}
                  >
                    {lang === "ar" ? "اطلبي الآن" : "Commander"} — {o.price} MAD
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="font-body text-gris text-xs text-center mt-4">
          {lang === "ar" ? "🚚 التوصيل مجاني · 💳 الخلاص عند الاستلام" : "🚚 Livraison gratuite · 💳 Paiement à la livraison"}
        </p>
      </div>
    </section>
  );
}

