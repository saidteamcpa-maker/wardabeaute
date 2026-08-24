"use client";

import { useCart } from "@/lib/cart";
import { products } from "@/content/products";
import { track } from "@/lib/pixels";

// Sticky mobile CTA for product pages.
export function StickyCTA({ slug }: { slug: string }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);
  const p = products[slug];
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-profond text-white px-4 py-3 flex items-center justify-between">
      <div>
        <div className="text-sm font-body">{p.name}</div>
        <div className="text-xs">{p.price} MAD</div>
      </div>
      <button
        onClick={() => {
          add({ slug, qty: 1 });
          track("AddToCart", { content_ids: [slug], value: p.price, currency: "MAD" });
          openCart();
        }}
        className="bg-white text-profond rounded-full px-5 py-2 font-body font-medium"
      >
        {p.hero.cta}
      </button>
    </div>
  );
}
