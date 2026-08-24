'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import ConfirmationUpsell from '@/components/ConfirmationUpsell';

export default function ConfirmationView() {
  const t = useTranslations();
  const params = useSearchParams();
  const order = params.get('order');

  return (
    <div className="container-wb py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warda text-3xl text-white">
        ✓
      </div>
      <h1 className="mt-5 font-display text-3xl font-bold text-profond">
        {t('Checkout.success')}
      </h1>
      {order && (
        <p className="mt-2 text-ink/70">
          #{order} · {t('Checkout.title')}
        </p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-primary">{t('Common.backHome')}</Link>
        <Link href="/suivi-commande" className="btn-secondary">{t('Nav.track')}</Link>
        </div>

        <ConfirmationUpsell />
      </div>
  );
}
