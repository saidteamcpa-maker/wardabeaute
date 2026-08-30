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
  const setTier = useCart((s) => s.setTier);

  const handleClick = (idx: number) => {
    const qty = idx + 1; // 1->1, 2->2, 3->3 ; for kit 2 cards => 1,2
    // kit has only 2 cards but qty mapping still works (1 and 2)
    setTier(slug, qty);
    // scroll to order (top AddToCart)
    const el = document.getElementById("order");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = "#order";
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <Reveal key={i} delay={i * 0.06}>
          <div
            className={`relative rounded-2xl border-2 p-5 flex flex-col gap-3 h-full ${
              (card as any).isFeatured ? "border-profond bg-profond text-white shadow-elevated scale-[1.02]" : "border-brume bg-white text-brun"
            }`}
          >
            {(card as any).badge && (
              <span
                className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-semibold shadow-subtle ${dir === "rtl" ? "left-4" : "right-4"} ${
                  (card as any).isFeatured ? "bg-or-doux text-profond" : "bg-champagne text-white"
                }`}
              >
                {(card as any).badge}
              </span>
            )}
            <h3 className={`font-display text-lg ${(card as any).isFeatured ? "text-white" : "text-profond"}`}>{card.title}</h3>
            <div>
              <div className={`font-display text-2xl ${(card as any).isFeatured ? "text-white" : "text-profond"}`}>{card.price} MAD</div>
              <div className={`font-body text-xs ${(card as any).isFeatured ? "text-white/80" : "text-gris"}`}>
                {card.size} · {card.duration}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleClick(i)}
              className={`mt-auto w-full rounded-full px-5 py-3 text-sm font-semibold text-center transition-all ${
                (card as any).isFeatured ? "bg-white text-profond hover:bg-or-doux" : "bg-profond text-white hover:brightness-110"
              }`}
            >
              {card.cta}
            </button>
            {(card as any).isPlaceholder && <p className="text-[10px] text-center opacity-60">TODO: prix à confirmer</p>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
