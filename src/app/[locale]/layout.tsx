import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://wardabeaute.com';
  return {
    metadataBase: new URL(base),
    title: {
      default: 'Warda Beauté — La beauté naturelle, fabriquée au Maroc',
      template: '%s · Warda Beauté',
    },
    description: 'Soins botaniques marocains livrés au Maroc. Paiement à la livraison.',
    openGraph: {
      title: 'Warda Beauté',
      description: 'Soins botaniques marocains livrés au Maroc.',
      locale: params.locale,
      type: 'website',
    },
    alternates: {
      languages: { fr: '/fr', ar: '/ar' },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster position={dir === 'rtl' ? 'top-left' : 'top-right'} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
