import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { formatMAD, type CatalogProduct } from '@/lib/data/catalog';

export default function ProductCard({
  product,
  locale,
}: {
  product: CatalogProduct;
  locale: string;
}) {
  const t = useTranslations();
  const name = locale === 'ar' ? product.nameAr : product.nameFr;

  return (
    <Link href={`/${product.slug}`} className="card-wb group block overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-petal/30">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-warda px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.heroImage}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl font-semibold text-profond">{name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/70">
          {locale === 'ar' ? product.shortAr : product.shortFr}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-warda">{formatMAD(product.price, locale)}</span>
          <span className="text-sm text-ink/50 line-through">
            {formatMAD(product.originalPrice, locale)}
          </span>
        </div>
        <span className="mt-3 inline-block rounded-full bg-petal px-3 py-1 text-xs font-medium text-profond">
          {t('Product.freeShipping')}
        </span>
      </div>
    </Link>
  );
}
