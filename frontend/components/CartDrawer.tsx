"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { unitPrice, products } from "@/content/products";
import { track } from "@/lib/pixels";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, openCheckout, remove, setQty } = useCart();
  const subtotal = items.reduce((s, i) => s + unitPrice(i.slug, i.qty), 0);
  const cross = Object.keys(products).filter((s) => !items.find((i) => i.slug === s)).slice(0, 3);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-brun/50" onClick={closeCart} />
      <div className="relative bg-petal w-full max-w-[420px] h-full overflow-y-auto p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-2xl text-profond">Panier</h3>
          <button onClick={closeCart} aria-label="Fermer" className="text-2xl">✕</button>
        </div>

        {items.length === 0 && <p className="font-body text-gris">Votre panier est vide.</p>}

        {items.map((i) => {
          const p = products[i.slug];
          return (
            <div key={i.slug} className="flex gap-3 border-b border-brume py-3">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brume to-warda/30" />
              <div className="flex-1">
                <p className="font-body font-medium text-profond">{p.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQty(i.slug, q)}
                      className={`text-xs rounded px-2 py-1 border ${i.qty === q ? "border-profond bg-profond text-white" : "border-brume"}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-brun mt-1">{unitPrice(i.slug, i.qty)} MAD</p>
                <button onClick={() => remove(i.slug)} className="text-xs text-gris underline">retirer</button>
              </div>
            </div>
          );
        })}

        {items.length > 0 && (
          <>
            <div className="mt-4">
              <p className="text-sm text-gris mb-2">💡 Vous aimerez aussi (même prix d'origine) :</p>
              <div className="grid grid-cols-3 gap-2">
                {cross.map((s) => (
                  <Link key={s} href={`/${s}`} onClick={closeCart} className="rounded-lg border border-brume p-2 text-center text-xs font-body text-brun hover:border-warda">
                    {products[s].name}
                    <div className="text-profond font-medium">{products[s].price} MAD</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between font-body text-brun">
              <span>Sous-total</span>
              <span className="font-medium">{subtotal} MAD</span>
            </div>
            <p className="text-xs text-gris">🚚 Livraison gratuite · 💳 الدفع عند الاستلام</p>

            <button
              onClick={() => {
                track("InitiateCheckout", { value: subtotal, currency: "MAD" });
                openCheckout();
              }}
              className="btn-primary w-full mt-3"
            >
              Commander
            </button>
          </>
        )}
      </div>
    </div>
  );
}
