import { setRequestLocale } from 'next-intl/server';
import SiteShell from '@/components/SiteShell';
import CheckoutForm from '@/components/CheckoutForm';

export default async function CheckoutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <SiteShell>
      <CheckoutForm locale={locale} />
    </SiteShell>
  );
}
