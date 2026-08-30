"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/pixels";
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
  imageSrc,
}: {
  slug: string;
  cards: Card[];
  dir?: "ltr" | "rtl";
  lang?: string;
  imageSrc?: string;
}) {
  const defaultTier = slug === "kit-collagene" ? 1 : 2;
  const setTier = useCart((s) => s.setTier);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);
  const selectedTier = useCart((s) => s.selectedTier[slug] ?? defaultTier);

  const handleSelect = (idx: number) => {
    // Infer qty from card title/position: 1st -> 1, 2nd -> 2, 3rd -> 3
    // For velvastretch/silkstop/collaglow this matches offers qty 1/2/3
    const qty = idx + 1;
    setTier(slug, qty);
  };

  const handleAdd = (idx: number, price: number) => {
    const qty = idx + 1;
    setTier(slug, qty);
    add({ slug, qty });
    track("AddToCart", { content_ids: [slug], value: price, currency: "MAD" });
    openCart();
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
              role="radio"
                aria-checked={isActive}
                tabIndex={0}
                onClick={() => handleSelect(i)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect(i);
                  }
                }}
                className={`relative rounded-2xl border-2 p-5 flex flex-col gap-3 min-h-[190px] h-full ${
                  isActive ? "border-profond bg-profond text-white shadow-elevated scale-[1.02]" : "border-brume bg-white text-brun"
                }`}
              >
                {imageSrc && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 overflow-hidden rounded-xl bg-petal/60 border border-brume/60">
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={imageSrc ? "pr-32" : ""}>
                  {(card as any).badge && (
                    <span
                      className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-semibold shadow-subtle ${dir === "rtl" ? "left-4" : "right-4"} ${
                        featured ? "bg-ordoux text-profond border border-champagne/20" : "bg-champagne text-white"
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
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAdd(i, card.price);
                    }}
                    className={`mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold text-center transition-all ${
                      isActive ? "bg-white text-profond hover:bg-ordoux shadow-glow" : "bg-profond text-white hover:brightness-110"
                    }`}
                  >
                    {card.cta}
                  </button>
                </div>
                {(card as any).isPlaceholder && <p className="text-[10px] text-center opacity-60">TODO: prix à confirmer</p>}
              </div>
            </Reveal>
          );
        })}
      </div>
  );
}
