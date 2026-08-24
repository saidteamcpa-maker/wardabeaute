'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useCart } from '@/components/cart/CartProvider';
import { CATALOG, BUNDLE } from '@/lib/data/catalog';

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { count, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-petal/60 bg-sand/90 backdrop-blur">
      <nav className="container-wb flex h-16 items-center justify-between gap-4">
        <ul className="hidden items-center gap-7 text-sm font-medium lg:flex">
          <li
            className="relative"
            onMouseEnter={() => setShowProducts(true)}
            onMouseLeave={() => setShowProducts(false)}
          >
            <button className="flex items-center gap-1 py-2 hover:text-warda">
              {t('Nav.products')}
            </button>
            {showProducts && (
              <div className="absolute left-0 top-full w-64 rounded-xl2 bg-white p-3 shadow-soft">
                {CATALOG.map((p) => (
                  <Link
                    key={p.sku}
                    href={`/${p.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-petal/40"
                  >
                    <span className="font-semibold">{p.nameFr}</span>
                    <span className="block text-xs text-ink/60">{p.nameAr}</span>
                  </Link>
                ))}
                <Link
                  href={`/${BUNDLE.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-petal/40"
                >
                  <span className="font-semibold">{BUNDLE.nameFr}</span>
                </Link>
              </div>
            )}
          </li>
          <li><Link href="/notre-histoire" className="hover:text-warda">{t('Nav.story')}</Link></li>
          <li><Link href="/faq" className="hover:text-warda">{t('Nav.faq')}</Link></li>
          <li><Link href="/suivi-commande" className="hover:text-warda">{t('Nav.track')}</Link></li>
          <li><Link href="/contact" className="hover:text-warda">{t('Nav.contact')}</Link></li>
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            <Link href="/produits" className="rounded-full px-3 py-1 text-sm font-medium hover:text-warda">
              {t('Nav.collection')}
            </Link>
          </div>
          <div className="flex overflow-hidden rounded-full border border-warda text-xs font-semibold">
            <button
              onClick={() => router.replace(pathname, { locale: 'fr' })}
              className="px-2 py-1 text-warda hover:bg-petal/40"
              aria-label="Français"
            >
              FR
            </button>
            <button
              onClick={() => router.replace(pathname, { locale: 'ar' })}
              className="px-2 py-1 text-warda hover:bg-petal/40"
              aria-label="العربية"
            >
              ع
            </button>
          </div>

          <button
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-warda text-white"
            aria-label="Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-profond px-1 text-xs text-white">
                {count}
              </span>
            )}
          </button>

          <button
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={t('Nav.menu')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href="/" className="font-display text-2xl font-bold text-warda lg:text-right">
            Warda<span className="text-profond">Beauté</span>
          </Link>
        </div>
      </nav>

      {open && (
        <div className="border-t border-petal/60 bg-sand lg:hidden">
          <ul className="container-wb flex flex-col gap-1 py-3 text-sm font-medium">
            {CATALOG.map((p) => (
              <li key={p.sku}>
                <Link href={`/${p.slug}`} className="block py-2" onClick={() => setOpen(false)}>
                  {p.nameFr}
                </Link>
              </li>
            ))}
            <li><Link href={`/${BUNDLE.slug}`} className="block py-2" onClick={() => setOpen(false)}>{BUNDLE.nameFr}</Link></li>
            <li><Link href="/produits" className="block py-2" onClick={() => setOpen(false)}>{t('Nav.collection')}</Link></li>
            <li><Link href="/notre-histoire" className="block py-2" onClick={() => setOpen(false)}>{t('Nav.story')}</Link></li>
            <li><Link href="/faq" className="block py-2" onClick={() => setOpen(false)}>{t('Nav.faq')}</Link></li>
            <li><Link href="/suivi-commande" className="block py-2" onClick={() => setOpen(false)}>{t('Nav.track')}</Link></li>
            <li><Link href="/contact" className="block py-2" onClick={() => setOpen(false)}>{t('Nav.contact')}</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
