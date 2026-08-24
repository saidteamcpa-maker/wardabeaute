'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SiteShell from '@/components/SiteShell';
import { formatMAD } from '@/lib/data/catalog';

type Tracked = {
  orderNumber: string;
  status: string;
  createdAt: string;
  total: number;
  city: string;
  products: { nameFr: string; qty: number }[];
};

export default function TrackView({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('Track');
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<Tracked | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true);
    setNotFound(false);
    setResult(null);
    const res = await fetch(
      `/api/orders/${encodeURIComponent(orderNumber)}?phone=${encodeURIComponent(phone)}`
    );
    const json = await res.json();
    setLoading(false);
    if (json.found) setResult(json.order as Tracked);
    else setNotFound(true);
  };

  return (
    <SiteShell>
      <div className="container-wb max-w-lg py-16">
        <h1 className="text-center font-display text-3xl font-bold text-profond">
          {t('title')}
        </h1>
        <div className="mt-6 space-y-3">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="#WB-123456"
            className="input-wb"
            dir="ltr"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0612345678"
            className="input-wb"
            dir="ltr"
          />
          <button onClick={lookup} disabled={loading} className="btn-primary w-full">
            {t('lookup')}
          </button>
        </div>

        {notFound && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{t('notFound')}</p>
        )}

        {result && (
          <div className="card-wb mt-6 p-5">
            <div className="flex justify-between">
              <span className="font-semibold">#{result.orderNumber}</span>
              <span className="rounded-full bg-petal px-3 py-1 text-xs font-medium text-profond">
                {result.status}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {result.products.map((p, i) => (
                <li key={i}>{p.nameFr} × {p.qty}</li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-petal pt-3 text-sm">
              <span>{t('title')}</span>
              <span className="font-semibold">{formatMAD(result.total, locale)}</span>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
