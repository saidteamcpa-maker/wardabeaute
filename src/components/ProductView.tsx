'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import StockCounter from '@/components/StockCounter';
import Testimonials from '@/components/Testimonials';
import { useCart } from '@/components/cart/CartProvider';
import toast from 'react-hot-toast';
import {
  CATALOG,
  formatMAD,
  type CatalogProduct,
  type ProductOffer,
  type Sellable,
} from '@/lib/data/catalog';

type Props = { product: Sellable; upsell?: CatalogProduct; locale: string };

function offerLine(
  p: Sellable,
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

function Stars({ rating, locale }: { rating: number; locale: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="text-gold" dir="ltr">
      {'★'.repeat(full)}
      {half ? '⯨' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span className="ml-1 text-xs font-medium text-ink/60">
        {rating.toFixed(1)} {locale === 'ar' ? '· ممتاز' : '· excellent'}
      </span>
    </span>
  );
}

export default function ProductView({ product, upsell, locale }: Props) {
  const t = useTranslations();
  const { addOffer, openCart } = useCart();
  const [selected, setSelected] = useState(1);

  const isAr = locale === 'ar';
  const name = isAr ? product.nameAr : product.nameFr;
  const short = isAr ? product.shortAr : product.shortFr;
  const long = isAr ? product.longAr : product.longFr;
  const ingredients = 'ingredientsFr' in product ? (isAr ? product.ingredientsAr : product.ingredientsFr) : [];
  const howTo = 'howToFr' in product ? (isAr ? product.howToAr : product.howToFr) : short;
  const benefits = 'benefitsFr' in product ? (isAr ? product.benefitsAr : product.benefitsFr) : [];
  const results = 'resultsFr' in product ? (isAr ? product.resultsAr : product.resultsFr) : [];
  const faqs = 'faqsFr' in product ? (isAr ? product.faqsAr : product.faqsFr) : [];
  const scarcity = 'scarcityFr' in product ? (isAr ? product.scarcityAr : product.scarcityFr) : '';

  const offer = product.offers[selected];
  const selectedPrice = offer.price;
  const selectedSave = offer.save ?? 0;

  const addSelected = () => {
    addOffer(offerLine(product, offer));
    openCart();
    toast.success(t('Product.addToCart'));
  };

  const gallery = product.gallery ?? [product.heroImage];
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="pb-28 sm:pb-0">
      {/* HERO */}
      <section className="container-wb py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* gallery */}
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-xl2 bg-petal/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gallery[activeImg]}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    activeImg === i ? 'border-warda' : 'border-transparent'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div>
            {product.badge && (
              <span className="inline-block rounded-full bg-warda px-3 py-1 text-xs font-semibold text-white">
                {product.badge}
              </span>
            )}
            <h1 className="mt-3 font-display text-4xl font-bold text-profond">{name}</h1>
            <div className="mt-2">
              <Stars rating={product.rating} locale={locale} />
              <span className="ml-2 text-xs text-ink/60">
                ({product.reviewCount} {t('Product.reviews')})
              </span>
            </div>

            <p className="mt-4 text-lg text-ink/80">{short}</p>

            {/* OFFERS */}
            <div className="mt-5 space-y-2">
              {product.offers.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => setSelected(i)}
                  className={`flex w-full items-center justify-between rounded-xl2 border-2 px-4 py-3 text-left transition ${
                    selected === i
                      ? 'border-warda bg-petal/30'
                      : 'border-petal bg-white hover:border-warda/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selected === i ? 'border-warda bg-warda text-white' : 'border-ink/30'
                      }`}
                    >
                      {selected === i ? '✓' : ''}
                    </span>
                    <span>
                      <span className="font-semibold text-profond">
                        {isAr ? o.labelAr : o.labelFr}
                      </span>
                      {o.badgeFr && (
                        <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-profond">
                          {isAr ? o.badgeAr : o.badgeFr}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="font-bold text-warda">{formatMAD(o.price, locale)}</span>
                    <span className="block text-xs text-ink/50 line-through">
                      {formatMAD(o.original, locale)}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {selectedSave > 0 && (
              <p className="mt-2 text-sm font-semibold text-green-700">
                💰 {isAr ? 'وفّري' : 'Vous économisez'} {formatMAD(selectedSave, locale)}
              </p>
            )}

            <button onClick={addSelected} className="btn-primary mt-4 w-full text-base">
              {t('Product.buyNow')} · {formatMAD(selectedPrice, locale)}
            </button>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-petal px-3 py-1 font-medium text-profond">
                {t('Product.freeShipping')}
              </span>
              <span className="rounded-full bg-petal px-3 py-1 font-medium text-profond">
                {t('Product.cashOnDelivery')}
              </span>
              <span className="rounded-full bg-petal px-3 py-1 font-medium text-profond">
                {t('Product.guarantee')}
              </span>
              <span className="rounded-full bg-petal px-3 py-1 font-medium text-profond">
                {t('Product.madeInMorocco')}
              </span>
            </div>

            <div className="mt-3">
              <StockCounter sku={product.sku} />
            </div>
            {scarcity && (
              <p className="mt-2 text-xs font-medium text-warda">🔥 {scarcity}</p>
            )}
          </div>
        </div>
      </section>

      {/* LONG DESC + BENEFITS */}
      <section className="section bg-white">
        <div className="container-wb">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-profond">
              {isAr ? 'لماذا ستحبينه' : 'Pourquoi vous allez l’adorer'}
            </h2>
            <p className="mt-4 text-lg text-ink/75">{long}</p>
          </div>

          {benefits.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {benefits.map((b, i) => (
                <div key={i} className="card-wb p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-petal text-2xl">
                    {['🌿', '✨', '💧', '🛡️', '🌸', '⭐'][i % 6]}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-profond">
                    {isAr ? b.titleAr : b.titleFr}
                  </h3>
                  <p className="mt-2 text-sm text-ink/70">
                    {isAr ? b.bodyAr : b.bodyFr}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RESULTS */}
      {results.length > 0 && (
        <section className="section">
          <div className="container-wb grid gap-8 rounded-xl2 bg-profond px-8 py-10 text-center text-white sm:grid-cols-3">
            {results.map((r, i) => (
              <div key={i}>
                <p className="font-display text-4xl font-bold text-gold">{r.value}</p>
                <p className="mt-1 text-sm text-white/80">
                  {isAr ? r.labelAr : r.labelFr}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INGREDIENTS / HOW TO (alternating) */}
      <section className="section bg-white">
        <div className="container-wb space-y-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-xl2 bg-petal/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[1] ?? gallery[0]} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-profond">
                {t('Product.ingredients')}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ingredients.map((ing) => (
                  <li key={ing} className="rounded-full bg-petal px-3 py-1 text-sm font-medium text-profond">
                    {ing}
                  </li>
                ))}
              </ul>
              <h2 className="mt-6 font-display text-2xl font-bold text-profond">
                {t('Product.howTo')}
              </h2>
              <p className="mt-2 text-ink/75">{howTo}</p>
            </div>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="lg:order-2">
              <h2 className="font-display text-2xl font-bold text-profond">
                {isAr ? 'نتائج visibles' : 'Des résultats visibles'}
              </h2>
              <p className="mt-3 text-ink/75">
                {isAr
                  ? 'مع الاستخدام المنتظم، تلاحظين الفرق من أول الأسابيع.'
                  : 'Avec un usage régulier, vous remarquez la différence dès les premières semaines.'}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                {(isAr
                  ? ['تطبيق سهل يومي', 'مناسب لجميع أنواع البشرة', 'نتائج ملحوظة']
                  : ['Application quotidienne facile', 'Convient à tous les types de peau', 'Résultats visibles']
                ).map((pt) => (
                  <li key={pt} className="flex items-center gap-2">
                    <span className="text-warda">✓</span> {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl2 bg-petal/30 lg:order-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[2] ?? gallery[0]} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials locale={locale} />

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="section bg-white">
          <div className="container-wb max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-profond">
              {t('Product.faq')}
            </h2>
            <div className="mt-8 space-y-3">
              {faqs.map((f, i) => (
                <details key={i} className="card-wb p-5" open={i === 0}>
                  <summary className="cursor-pointer font-semibold text-profond">
                    {isAr ? f.qAr : f.qFr}
                  </summary>
                  <p className="mt-2 text-sm text-ink/75">{isAr ? f.aAr : f.aFr}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CROSS SELL */}
      {upsell && (
        <section className="section">
          <div className="container-wb">
            <h2 className="text-center text-3xl font-bold text-profond">
              {t('Product.upsellTitle')}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {CATALOG.filter((p) => p.sku !== product.sku && p.sku !== upsell.sku).map((p) => {
                const o = p.offers[1];
                return (
                  <div key={p.sku} className="card-wb overflow-hidden">
                    <div className="aspect-[4/3] bg-petal/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.heroImage} alt={p.nameFr} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-xl font-semibold text-profond">
                        {isAr ? p.nameAr : p.nameFr}
                      </h3>
                      <p className="text-sm text-ink/70">{isAr ? p.shortAr : p.shortFr}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-warda">{formatMAD(o.price, locale)}</span>
                        <button
                          onClick={() => {
                            addOffer(offerLine(p, o));
                            openCart();
                            toast.success(t('Product.addToCart'));
                          }}
                          className="btn-secondary px-4 py-2 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* GUARANTEE */}
      <section className="section bg-petal/30">
        <div className="container-wb grid gap-6 text-center sm:grid-cols-3">
          <div>
            <div className="text-3xl">🇲🇦</div>
            <p className="mt-2 font-semibold text-profond">{t('Product.madeInMorocco')}</p>
          </div>
          <div>
            <div className="text-3xl">💳</div>
            <p className="mt-2 font-semibold text-profond">{t('Product.cashOnDelivery')}</p>
          </div>
          <div>
            <div className="text-3xl">↩️</div>
            <p className="mt-2 font-semibold text-profond">{t('Product.guarantee')}</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-profond text-white">
        <div className="container-wb text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{name}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">{short}</p>
          <button onClick={addSelected} className="btn-primary mt-6 bg-white text-profond hover:bg-petal">
            {t('Product.buyNow')} · {formatMAD(selectedPrice, locale)}
          </button>
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-petal bg-white/95 p-3 backdrop-blur sm:hidden">
        <div className="container-wb flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-warda">
            {formatMAD(selectedPrice, locale)}
          </span>
          <button onClick={addSelected} className="btn-primary flex-1">
            {t('Product.buyNow')}
          </button>
        </div>
      </div>
    </div>
  );
}
