import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SiteShell from '@/components/SiteShell';
import { getAllSellables, formatMAD } from '@/lib/data/catalog';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Tous nos soins',
    description: 'Découvrez la gamme Warda Beauté : VelvaStretch™, SilkStop™, CollaGlow™ et le Body Confidence Kit.',
    alternates: { languages: { fr: '/fr/produits', ar: '/ar/produits' } },
  };
}

export default async function CollectionPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations();
  const items = getAllSellables();
  const isAr = locale === 'ar';

  return (
    <SiteShell>
      <section className="bg-gradient-to-b from-petal/40 to-sand">
        <div className="container-wb py-12 text-center">
          <p className="eyebrow">{t('Nav.collection')}</p>
          <h1 className="text-4xl font-bold text-profond sm:text-5xl">
            {isAr ? 'كل منتجاتنا' : 'Tous nos soins'}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-ink/70">
            {isAr
              ? 'صُنعت في المغرب للبشرة المغاربية. الدفع عند الاستلام وضمان 30 يوماً.'
              : 'Fabriqués au Maroc pour la peau maghrébine. Paiement à la livraison, garantie 30 jours.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-wb grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.sku} className="card-wb flex flex-col overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden bg-petal/30">
                {p.badge && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-warda px-3 py-1 text-xs font-semibold text-white">
                    {p.badge}
                  </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.heroImage} alt={p.nameFr} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-xl font-semibold text-profond">
                  {isAr ? p.nameAr : p.nameFr}
                </h2>
                <div className="mt-1 text-gold text-sm">★★★★★ <span className="text-xs text-ink/60">({p.reviewCount})</span></div>
                <p className="mt-2 flex-1 text-sm text-ink/70">{isAr ? p.shortAr : p.shortFr}</p>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {p.offers.map((o) => (
                    <div key={o.id} className="rounded-lg bg-petal/40 px-1 py-2">
                      <p className="text-[11px] font-semibold text-profond">{isAr ? o.labelAr : o.labelFr}</p>
                      <p className="text-sm font-bold text-warda">{formatMAD(o.price, locale)}</p>
                    </div>
                  ))}
                </div>

                <Link href={`/${p.slug}`} className="btn-primary mt-4 w-full">
                  {isAr ? 'اكتشفي العروض' : 'Découvrir les offres'}
                </Link>
                <span className="mt-2 inline-block rounded-full bg-petal px-3 py-1 text-center text-xs font-medium text-profond">
                  {t('Product.freeShipping')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
