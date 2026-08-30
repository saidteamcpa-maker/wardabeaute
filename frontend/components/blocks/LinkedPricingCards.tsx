"use client";

import { useCart } from "@/lib/cart";
import { Reveal } from "@/components/ui/Reveal";

type Card = {
  title: string;
  price: number;
  size: string;
  duration: string;
  badge?: string;
  cta: string;
  isFeatured?: boolean;
  isPlaceholder?: boolean;
};

export function LinkedPricingCards({
  slug,
  cards,
  dir = "ltr",
}: {
  slug: string;
  cards: Card[];
  dir?: "ltr" | "rtl";
  lang?: string;
}) {
  const defaultTier = slug === "kit-collagene" ? 1 : slug === "silkstop" ? 3 : 2;
  const setTier = useCart((s) => s.setTier);
  const selectedTier = useCart((s) => s.selectedTier[slug] ?? defaultTier);

  const handleClick = (idx: number) => {
    // Infer qty from card title/position: 1st -> 1, 2nd -> 2, 3rd -> 3
    // For velvastretch/silkstop/collaglow this matches offers qty 1/2/3
    const qty = idx + 1;
    setTier(slug, qty);
    // scroll to order (top AddToCart)
    const el = document.getElementById("order");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = "#order";
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const qty = i + 1;
        const isActive = selectedTier === qty;
        const featured = !!(card as any).isFeatured;
        return (
          <Reveal key={i} delay={i * 0.06}>
            <div
              className={`relative rounded-2xl border-2 p-5 flex flex-col gap-3 h-full ${
                isActive ? "border-profond bg-profond text-white shadow-elevated scale-[1.02]" : "border-brume bg-white text-brun"
              }`}
            >
              {(card as any).badge && (
                <span
                  className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-semibold shadow-subtle ${dir === "rtl" ? "left-4" : "right-4"} ${
                    featured ? "bg-or-doux text-profond border border-champagne/20" : "bg-champagne text-white"
                  }`}
                >
                  {(card as any).badge}
                </span>
              )}
              <h3 className={`font-display text-lg ${isActive ? "text-white" : "text-profond"}`}>{card.title}</h3>
              <div>
                <div className={`font-display text-2xl ${isActive ? "text-white" : "text-profond"}`}>{card.price} MAD</div>
                <div className={`font-body text-xs ${isActive ? "text-white/80" : "text-gris"}`}>
                  {card.size} · {card.duration}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleClick(i)}
                className={`mt-auto w-full rounded-full px-5 py-3 text-sm font-semibold text-center transition-all ${
                  isActive ? "bg-white text-profond hover:bg-or-doux shadow-glow" : "bg-profond text-white hover:brightness-110"
                }`}
              >
                {card.cta}
              </button>
              {(card as any).isPlaceholder && <p className="text-[10px] text-center opacity-60">TODO: prix à confirmer</p>}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
