import type { Metadata } from "next";
import "./globals.css";
import { StorefrontHeader, StorefrontFooterArea } from "@/components/StorefrontChrome";
import { MetaPixel } from "@/components/pixels/MetaPixel";
import { TikTokPixel } from "@/components/pixels/TikTokPixel";
import { GoogleTag } from "@/components/pixels/GoogleTag";
import { Toaster } from "react-hot-toast";
import { LangProvider } from "@/components/LangProvider";
import { getLangServer } from "@/lib/lang-server";
import { dirFor } from "@/lib/i18n-shared";
import { getCatalog } from "@/lib/catalog";
import { CatalogProvider } from "@/lib/catalog-context";
import { getEnabledPixels, seedPixelsFromEnv } from "@/lib/pixels";
import { PixelDebug } from "@/components/pixels/PixelDebug";

// Render dynamically: catalog/pixels come from the live Postgres DB at request
// time, so we must not statically prerender (which would query the DB at build).
export const dynamic = "force-dynamic";

const META = {
  fr: {
    title: "Warda Beauté | Soins beauté naturels au Maroc | Paiement à la livraison",
    description:
      "Warda Beauté — sérums anti-vergetures, huile ralentisseuse de repousse et gummies au collagène. Fabriqué au Maroc. Livraison 24-48h, paiement à la livraison.",
  },
  ar: {
    title: "Warda Beauté | دوايات تجميل طبيعية فالمغرب | الخلاص عند الاستلام",
    description:
      "Warda Beauté — سيروم لعلامات التمدد، وزيت بغي بطّأ رجوع الشعر، وعلكات الكولاجين. مصنوعة فالمغرب. التوصيل 24-48 ساعة، والخلاص عند الاستلام.",
  },
};

export function generateMetadata(): Metadata {
  const lang = getLangServer();
  const m = META[lang];
  return {
    title: m.title,
    description: m.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLangServer();
  const catalog = await getCatalog();
  await seedPixelsFromEnv();
  const pixels = await getEnabledPixels();
  const metaPixels = pixels.filter((p) => p.type === "meta");
  const tiktokPixels = pixels.filter((p) => p.type === "tiktok");
  const gtmPixels = pixels.filter((p) => p.type === "gtm");
  return (
    <html lang={lang === "ar" ? "ar-MA" : "fr"} dir={dirFor(lang)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Cairo:wght@400;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        {gtmPixels.map((p) => (
          <GoogleTag key={p.id} id={p.pixelId} scriptId={`gtm-${p.id}`} />
        ))}
        {metaPixels.map((p) => (
          <MetaPixel key={p.id} id={p.pixelId} scriptId={`fb-${p.id}`} />
        ))}
        {tiktokPixels.map((p) => (
          <TikTokPixel key={p.id} id={p.pixelId} scriptId={`tt-${p.id}`} />
        ))}
        <LangProvider initialLang={lang}>
          <CatalogProvider catalog={catalog}>
            <StorefrontHeader />
            <main>{children}</main>
            <StorefrontFooterArea />
          </CatalogProvider>
        </LangProvider>
        <Toaster />
        <PixelDebug />
      </body>
    </html>
  );
}
