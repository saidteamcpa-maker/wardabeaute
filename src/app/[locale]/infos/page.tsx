import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import SiteShell from '@/components/SiteShell';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Informations légales',
    alternates: { languages: { fr: '/fr/infos', ar: '/ar/infos' } },
  };
}

export default async function InfosPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const isAr = locale === 'ar';

  const sections = [
    {
      title: isAr ? 'شروط البيع' : 'Conditions générales de vente',
      body: isAr
        ? 'Les commandes sont payées à la livraison. La propriété des produits est transférée après paiement. Les prix sont indiqués en dirhams marocains (MAD).'
        : 'Les commandes sont payées à la livraison. La propriété des produits est transférée après paiement. Les prix sont indiqués en dirhams marocains (MAD).',
    },
    {
      title: isAr ? 'التوصيل والإرجاع' : 'Livraison & retours',
      body: isAr
        ? 'Livraison gratuite en 24-48h partout au Maroc. Garantie satisfait ou remboursé sous 30 jours sur les produits non entamés.'
        : 'Livraison gratuite en 24-48h partout au Maroc. Garantie satisfait ou remboursé sous 30 jours sur les produits non entamés.',
    },
    {
      title: isAr ? 'الخصوصية' : 'Confidentialité',
      body: isAr
        ? 'Vos données sont utilisées uniquement pour le traitement de votre commande et ne sont jamais revendues à des tiers.'
        : 'Vos données sont utilisées uniquement pour le traitement de votre commande et ne sont jamais revendues à des tiers.',
    },
  ];

  return (
    <SiteShell>
      <section className="section">
        <div className="container-wb max-w-3xl">
          <h1 className="text-3xl font-bold text-profond">
            {isAr ? 'المعلومات القانونية' : 'Informations légales'}
          </h1>
          <div className="mt-8 space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-xl font-semibold text-profond">{s.title}</h2>
                <p className="mt-2 text-ink/75">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
