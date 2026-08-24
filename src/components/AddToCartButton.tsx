'use client';

import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useCart } from '@/components/cart/CartProvider';
import type { CatalogProduct } from '@/lib/data/catalog';

type Props = {
  product: CatalogProduct;
  variant?: 'primary' | 'secondary';
  label?: string;
  redirect?: boolean;
};

export default function AddToCartButton({
  product,
  variant = 'primary',
  label,
  redirect = true,
}: Props) {
  const t = useTranslations();
  const { add } = useCart();

  const handle = () => {
    add({
      sku: product.sku,
      slug: product.slug,
      nameFr: product.nameFr,
      nameAr: product.nameAr,
      price: product.price,
      image: product.heroImage,
    });
    toast.success(t('Product.addToCart'));
    if (redirect) {
      window.location.href = `/checkout`;
    }
  };

  return (
    <button
      onClick={handle}
      className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
    >
      {label ?? t('Product.buyNow')}
    </button>
  );
}
