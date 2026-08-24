import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import SiteShell from '@/components/SiteShell';
import ProductView from '@/components/ProductView';
import { CATALOG, BUNDLE, getSellable } from '@/lib/data/catalog';

export function generateStaticParams() {
  return [
    ...CATALOG.map((p) => ({ slug: p.slug })),
    { slug: BUNDLE.slug },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const product = getSellable(params.slug);
  if (!product) return {};
  const name = product.nameFr;
  const desc = product.shortFr;
  return {
    title: name,
    description: desc,
    openGraph: { title: name, description: desc, locale: params.locale },
    alternates: {
      languages: {
        fr: `/fr/${params.slug}`,
        ar: `/ar/${params.slug}`,
      },
    },
  };
}

export default async function ProductPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);

  const product = getSellable(slug);
  if (!product) notFound();

  const upsell =
    product.sku !== BUNDLE.sku && 'upsellSku' in product && product.upsellSku
      ? CATALOG.find((p) => p.sku === product.upsellSku)
      : undefined;

  return (
    <SiteShell>
      <ProductView product={product} upsell={upsell} locale={locale} />
    </SiteShell>
  );
}
