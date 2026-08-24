'use client';

import { useCart } from '@/components/cart/CartProvider';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { CATALOG, BUNDLE, formatMAD, type ProductOffer } from '@/lib/data/catalog';

function offerLine(
  p: { sku: string; slug: string; nameFr: string; nameAr: string; heroImage: string },
  offer: ProductOffer
) {
  return {
    sku: p.sku,
    slug: p.slug,
    nameFr: p.nameFr,
    nameAr: p.nameAr,
    price: Math.round(offer.price / offer.qty),
    qty: offer.qty,
    image: p.heroImage,
    offerId: offer.id,
    offerLabelFr: offer.labelFr,
    offerLabelAr: offer.labelAr,
  };
}

export default function CartDrawer() {
  const { items, total, setQty, remove, open, closeCart, openCheckout, addOffer } = useCart();
  const locale = useLocale();
  const t = useTranslations();

  const inSkus = new Set(items.map((i) => i.sku));
  const crossSells = [...CATALOG, BUNDLE].filter((p) => !inSkus.has(p.sku)).slice(0, 2);

  const BONUS_THRESHOLD = 50000;
  const remaining = Math.max(0, BONUS_THRESHOLD - total);
  const bonusUnlocked = remaining === 0;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[9998] bg-black/40" onClick={closeCart} aria-hidden />
      )}
      <aside
        className={`fixed right-0 top-0 z-[9999] flex h-full w-full max-w-md flex-col bg-white shadow-soft transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-petal px-5 py-4">
          <h2 className="font-display text-xl font-bold text-profond">
            {t('Nav.products')} ({items.length})
          </h2>
          <button onClick={closeCart} aria-label="Fermer" className="text-2xl text-ink/60">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-ink/60">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt={i.nameFr} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-profond">
                      {locale === 'ar' ? i.nameAr : i.nameFr}
                    </p>
                    {i.offerLabelFr && (
                      <p className="text-xs text-warda">
                        {locale === 'ar' ? i.offerLabelAr : i.offerLabelFr}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.id, i.qty - 1)}
                        className="h-7 w-7 rounded-full border border-warda text-warda"
                      >
                        −
                      </button>
                      <span className="text-sm">{i.qty}</span>
                      <button
                        onClick={() => setQty(i.id, i.qty + 1)}
                        className="h-7 w-7 rounded-full border border-warda text-warda"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="ml-auto text-xs text-ink/50 hover:text-red-600"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatMAD(i.price * i.qty, locale)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {crossSells.length > 0 && items.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-warda">
                {t('Cart.complete')}
              </p>
              <div className="space-y-3">
                {crossSells.map((p) => {
                  const offer = p.offers[0];
                  return (
                    <div key={p.sku} className="flex items-center gap-3 rounded-xl2 border border-warda/30 bg-petal/20 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.heroImage} alt={p.nameFr} className="h-14 w-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-profond">
                          {locale === 'ar' ? p.nameAr : p.nameFr}
                        </p>
                        <p className="text-xs text-ink/60">dès {formatMAD(offer.price, locale)}</p>
                      </div>
                      <button
                        onClick={() => addOffer(offerLine(p, offer))}
                        className="btn-secondary px-3 py-2 text-xs"
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-petal px-5 py-4">
            <div className="mb-3">
              <p className="text-xs text-ink/70">
                {bonusUnlocked
                  ? '🎁 Cadeau débloqué — ajouté à votre commande !'
                  : `Plus que ${formatMAD(remaining, locale)} pour un cadeau offert 🎁`}
              </p>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-petal">
                <div
                  className="h-full rounded-full bg-warda transition-all"
                  style={{ width: `${Math.min(100, (total / BONUS_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-bold text-warda">{formatMAD(total, locale)}</span>
            </div>
            <button onClick={openCheckout} className="btn-primary mt-3 w-full">
              {t('Product.buyNow')}
            </button>
            <p className="mt-2 text-center text-xs text-ink/50">
              🔒 Paiement à la livraison · {t('Product.freeShipping')}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
