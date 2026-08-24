import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import SiteShell from '@/components/SiteShell';
import ConfirmationView from '@/components/ConfirmationView';

export default async function ConfirmationPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <SiteShell>
      <Suspense>
        <ConfirmationView />
      </Suspense>
    </SiteShell>
  );
}
