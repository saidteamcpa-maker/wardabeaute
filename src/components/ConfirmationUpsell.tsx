'use client';

import { useCart } from '@/components/cart/CartProvider';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { CATALOG, formatMAD } from '@/lib/data/catalog';
import toast from 'react-hot-toast';

export default function ConfirmationUpsell() {
  const { add } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Product');

  const addAndCheckout = (sku: string) => {
    const p = CATALOG.find((x) => x.sku === sku);
    if (!p) return;
    add({ sku: p.sku, slug: p.slug, nameFr: p.nameFr, nameAr: p.nameAr, price: p.price, image: p.heroImage });
    toast.success(t('addToCart'));
    router.push('/checkout');
  };

  return (
    <div className="container-wb mt-10">
      <h2 className="text-center font-display text-2xl font-bold text-profond">
        {t('upsellTitle')}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {CATALOG.map((p) => (
          <div key={p.sku} className="card-wb overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.heroImage} alt={p.nameFr} className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-profond">
                {locale === 'ar' ? p.nameAr : p.nameFr}
              </h3>
              <p className="mt-1 text-sm text-ink/60">{formatMAD(p.price, locale)}</p>
              <button onClick={() => addAndCheckout(p.sku)} className="btn-secondary mt-3 w-full">
                {t('addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
