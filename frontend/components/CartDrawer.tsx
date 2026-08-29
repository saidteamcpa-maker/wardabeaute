"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, X } from "lucide-react";
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

  if (!isCartOpen) return null;

  const validItems = items.filter((i) => i && typeof i.slug === "string" && !!catalog[i.slug]);
  const subtotal = validItems.reduce((s, i) => s + unitPrice(i.slug, i.qty, catalog), 0);
  const cross = Object.keys(catalog).filter((s) => !validItems.find((i) => i.slug === s)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-brun/50 backdrop-blur-sm transition-opacity duration-300" onClick={closeCart} />
      <div className="drawer-panel">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-brume/50">
          <h3 className="font-display text-2xl text-profond">{t(lang, "cart.title")}</h3>
          <button onClick={closeCart} aria-label={t(lang, "close")} className="btn-ghost hover:text-warda">
            <X className="w-5 h-5" />
          </button>
        </div>

        {validItems.length === 0 && <p className="font-body text-gris text-center py-8">{t(lang, "cart.empty")}</p>}

        {validItems.map((i) => {
          const p = localize(catalog[i.slug], lang);
          if (!p) return null;
          return (
            <div key={i.slug} className="flex gap-3 border-b border-brume/50 py-4 transition-colors duration-200 hover:bg-petal/40 rounded-lg px-1 -mx-1">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brume shrink-0 shadow-subtle">
                <Image src={p.image} alt={p.name} fill sizes="64px" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-medium text-profond truncate">{p.name}</p>
                <p className="text-sm text-brun mt-1">{t(lang, "quantity")} {i.qty}</p>
                <p className="text-sm text-brun font-medium">{unitPrice(i.slug, i.qty, catalog)} MAD</p>
                <button onClick={() => remove(i.slug)} className="flex items-center gap-1 text-xs text-gris hover:text-rose-600 transition-colors duration-200 mt-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  {t(lang, "remove")}
                </button>
              </div>
            </div>
          );
        })}

        {validItems.length > 0 && (
          <>
            <div className="mt-5">
              <p className="text-sm text-gris mb-2 font-medium">{t(lang, "cart.youMayLike")}</p>
              <div className="grid grid-cols-3 gap-2">
                {cross.map((s) => (
                  <Link key={s} href={`/${s}`} onClick={closeCart} className="rounded-xl border border-brume p-2 text-center text-xs font-body text-brun hover:border-warda/50 hover:shadow-subtle transition-all duration-250">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-brume mb-1">
                      <Image src={catalog[s].image} alt={catalog[s].name} fill sizes="96px" className="w-full h-full object-cover" />
                    </div>
                    <span className="truncate block">{catalog[s].name}</span>
                    <div className="text-profond font-medium">{catalog[s].price} MAD</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-brume/50 flex justify-between font-body text-brun">
              <span className="font-medium">{t(lang, "cart.subtotal")}</span>
              <span className="font-medium text-profond">{subtotal} MAD</span>
            </div>
            <p className="text-xs text-gris mt-1.5">{t(lang, "freeShipping")} · {t(lang, "paymentCOD")}</p>

            <button
              onClick={() => {
                track("InitiateCheckout", { value: subtotal, currency: "MAD" });
                openCheckout();
              }}
              className="btn-primary w-full mt-4"
            >
              {t(lang, "cart.checkout")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
