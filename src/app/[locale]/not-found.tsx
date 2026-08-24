import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import SiteShell from '@/components/SiteShell';

export default function LocaleNotFound() {
  const t = useTranslations('Common');
  return (
    <SiteShell>
      <div className="container-wb py-24 text-center">
        <p className="font-display text-6xl font-bold text-warda">404</p>
        <p className="mt-3 text-ink/70">Page introuvable.</p>
        <Link href="/" className="btn-primary mt-6">{t('backHome')}</Link>
      </div>
    </SiteShell>
  );
}
