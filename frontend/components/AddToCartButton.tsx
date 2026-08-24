"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/pixels";
import { unitPrice, products } from "@/content/products";

export function AddToCartButton({
  slug,
  withTier = false,
}: {
  slug: string;
  withTier?: boolean;
}) {
  const p = products[slug];
  const [tier, setTier] = useState(1);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);

  const onClick = () => {
    const qty = withTier ? tier : 1;
    add({ slug, qty });
    track("AddToCart", {
      content_ids: [slug],
      value: unitPrice(slug, qty),
      currency: "MAD",
    });
    openCart();
  };

  return (
    <div className="w-full">
      {withTier && (
        <div className="flex gap-2 mb-3">
          {p.offers.map((o) => (
            <button
              key={o.qty}
              type="button"
              onClick={() => setTier(o.qty)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-body transition ${
                tier === o.qty
                  ? "border-profond bg-profond text-white"
                  : "border-brume bg-white text-brun"
              }`}
            >
              {o.qty === 1 ? "1 pièce" : `${o.qty} pièces`}
              <div className="font-medium">{o.price} MAD</div>
              {o.save ? <div className="text-xs opacity-80">-{p.price * o.qty - o.price} MAD</div> : null}
            </button>
          ))}
        </div>
      )}
      <button onClick={onClick} className="btn-primary w-full btn-glow flex items-center justify-center gap-2">
        <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
        {p.hero.cta}
      </button>
    </div>
  );
}
