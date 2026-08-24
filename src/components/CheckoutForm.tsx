'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useCart } from '@/components/cart/CartProvider';
import { MOROCCO_CITIES } from '@/lib/data/cities';
import { formatMAD } from '@/lib/data/catalog';

const schema = z.object({
  customerName: z.string().min(2),
  phone: z.string().regex(/^(06|07|05)\d{8}$/),
  city: z.string().min(1),
  address: z.string().min(5),
  postalCode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutForm({ locale }: { locale: string }) {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { items, total, clear, loaded } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (loaded && items.length === 0) {
      router.replace('/');
    }
  }, [loaded, items.length, router]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            sku: i.sku,
            nameFr: i.nameFr,
            nameAr: i.nameAr,
            price: i.price,
            qty: i.qty,
          })),
          source: 'web',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      clear();
      router.push(`/confirmation?order=${json.orderNumber}`);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setSubmitting(false);
    }
  };

  if (!loaded || items.length === 0) return null;

  return (
    <div className="container-wb grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="font-display text-3xl font-bold text-profond">{t('title')}</h1>

        <div>
          <label className="mb-1 block text-sm font-medium">{t('name')}</label>
          <input {...register('customerName')} className="input-wb" />
          {errors.customerName && <p className="mt-1 text-xs text-red-600">⚠</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">{t('phone')}</label>
          <input {...register('phone')} placeholder="0612345678" className="input-wb" dir="ltr" />
          {errors.phone && <p className="mt-1 text-xs text-red-600">06/07/05 + 8 chiffres</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">{t('city')}</label>
          <select {...register('city')} className="input-wb" defaultValue="">
            <option value="" disabled>{t('selectCity')}</option>
            {MOROCCO_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-600">⚠</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">{t('address')}</label>
          <textarea {...register('address')} rows={3} className="input-wb" />
          {errors.address && <p className="mt-1 text-xs text-red-600">⚠</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">{t('postal')}</label>
          <input {...register('postalCode')} className="input-wb" dir="ltr" />
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? t('submitting') : t('submit')}
        </button>
      </form>

      <aside className="card-wb h-fit p-5 lg:sticky lg:top-20">
        <h2 className="font-display text-xl font-semibold text-profond">Panier</h2>
        <ul className="mt-3 space-y-3">
          {items.map((i) => (
            <li key={i.sku} className="flex justify-between gap-2 text-sm">
              <span>{locale === 'ar' ? i.nameAr : i.nameFr} × {i.qty}</span>
              <span className="font-medium">{formatMAD(i.price * i.qty, locale)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-petal pt-3 font-semibold">
          <span>Total</span>
          <span className="text-warda">{formatMAD(total, locale)}</span>
        </div>
        <p className="mt-3 text-xs text-ink/60">{t('title')}</p>
      </aside>
    </div>
  );
}
