'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function StockCounter({ sku }: { sku: string }) {
  const t = useTranslations('Product');
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/products/${sku}`)
      .then((r) => r.json())
      .then((d) => {
        if (active) setStock(typeof d.stock === 'number' ? d.stock : 50);
      })
      .catch(() => active && setStock(50));
    return () => {
      active = false;
    };
  }, [sku]);

  const label =
    stock !== null && stock <= 12
      ? t('lowStock')
      : t('inStock');

  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-profond">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warda opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warda" />
      </span>
      {label}
      {stock !== null && (
        <span className="text-ink/60">· {stock} unités restantes</span>
      )}
    </span>
  );
}
