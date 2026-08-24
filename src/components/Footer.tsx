import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { CATALOG, BUNDLE } from '@/lib/data/catalog';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-profond text-white/90">
      <div className="container-wb grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="font-display text-2xl font-bold text-white">Warda Beauté</p>
          <p className="mt-3 max-w-xs text-sm text-white/70">{t('Footer.tagline')}</p>
          <p className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            {t('Footer.madeInMorocco')}
          </p>
          <div className="mt-4 flex gap-2 text-xs font-medium text-white/80">
            <span>🇲🇦 Fabriqué au Maroc</span>
            <span>💳 Paiement à la livraison</span>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">{t('Footer.shop')}</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/produits" className="hover:text-white">{t('Nav.collection')}</Link></li>
            {CATALOG.map((p) => (
              <li key={p.sku}>
                <Link href={`/${p.slug}`} className="hover:text-white">{p.nameFr}</Link>
              </li>
            ))}
            <li><Link href={`/${BUNDLE.slug}`} className="hover:text-white">{BUNDLE.nameFr}</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">{t('Footer.company')}</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/notre-histoire" className="hover:text-white">{t('Nav.story')}</Link></li>
            <li><Link href="/faq" className="hover:text-white">{t('Nav.faq')}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{t('Nav.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">{t('Footer.help')}</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/suivi-commande" className="hover:text-white">{t('Nav.track')}</Link></li>
            <li><a href="https://wa.me/212600000000" className="hover:text-white">WhatsApp</a></li>
            <li><a href="mailto:hello@wardabeaute.com" className="hover:text-white">E-mail</a></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">{t('Footer.legal')}</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/infos" className="hover:text-white">{locale === 'ar' ? 'شروط البيع' : 'CGV'}</Link></li>
            <li><Link href="/infos" className="hover:text-white">{locale === 'ar' ? 'التوصيل والإرجاع' : 'Livraison & retours'}</Link></li>
            <li><Link href="/infos" className="hover:text-white">{locale === 'ar' ? 'الخصوصية' : 'Confidentialité'}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {year} Warda Beauté. {t('Footer.rights')}
      </div>
    </footer>
  );
}
