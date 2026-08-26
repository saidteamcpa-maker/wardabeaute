"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { unitPrice, localize } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { t } from "@/content/ui";
import { track } from "@/lib/pixels";

export function CartDrawer() {
  const { lang } = useLang();
  const catalog = useCatalog();
  const { items, isCartOpen, closeCart, openCheckout, remove } = useCart();
  const subtotal = items.reduce((s, i) => s + unitPrice(i.slug, i.qty, catalog), 0);
  const cross = Object.keys(catalog).filter((s) => !items.find((i) => i.slug === s)).slice(0, 3);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-brun/50" onClick={closeCart} />
      <div className="relative bg-petal w-full max-w-[420px] h-full overflow-y-auto p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-2xl text-profond">{t(lang, "cart.title")}</h3>
          <button onClick={closeCart} aria-label={t(lang, "close")} className="text-2xl">✕</button>
        </div>

        {items.length === 0 && <p className="font-body text-gris">{t(lang, "cart.empty")}</p>}

        {items.map((i) => {
          const p = localize(catalog[i.slug], lang);
          return (
            <div key={i.slug} className="flex gap-3 border-b border-brume py-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-brume shrink-0">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-body font-medium text-profond">{p.name}</p>
                <p className="text-sm text-brun mt-1">{t(lang, "quantity")} {i.qty}</p>
                <p className="text-sm text-brun">{unitPrice(i.slug, i.qty, catalog)} MAD</p>
                <button onClick={() => remove(i.slug)} className="flex items-center gap-1 text-xs text-gris underline">
                  <Trash2 className="w-3.5 h-3.5" />
                  {t(lang, "remove")}
                </button>
              </div>
            </div>
          );
        })}

        {items.length > 0 && (
          <>
            <div className="mt-4">
              <p className="text-sm text-gris mb-2">{t(lang, "cart.youMayLike")}</p>
              <div className="grid grid-cols-3 gap-2">
                {cross.map((s) => (
                  <Link key={s} href={`/${s}`} onClick={closeCart} className="rounded-lg border border-brume p-2 text-center text-xs font-body text-brun hover:border-warda">
                    <div className="w-full aspect-square rounded-md overflow-hidden bg-brume mb-1">
                      <img src={catalog[s].image} alt={catalog[s].name} className="w-full h-full object-cover" />
                    </div>
                    {catalog[s].name}
                    <div className="text-profond font-medium">{catalog[s].price} MAD</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between font-body text-brun">
              <span>{t(lang, "cart.subtotal")}</span>
              <span className="font-medium">{subtotal} MAD</span>
            </div>
            <p className="text-xs text-gris">🚚 {t(lang, "freeShipping")} · 💳 {t(lang, "paymentCOD")}</p>

            <button
              onClick={() => {
                track("InitiateCheckout", { value: subtotal, currency: "MAD" });
                openCheckout();
              }}
              className="btn-primary w-full mt-3"
            >
              {t(lang, "cart.checkout")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
