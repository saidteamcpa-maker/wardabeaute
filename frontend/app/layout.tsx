import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { Cormorant_Garamond, DM_Sans, Cairo, Amiri } from "next/font/google";
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

const PixelDebug = dynamicImport(() => import("@/components/pixels/PixelDebug").then((m) => m.PixelDebug), { ssr: false });

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"], display: "swap", variable: "--font-cormorant" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], display: "swap", variable: "--font-dm-sans" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700"], display: "swap", variable: "--font-cairo" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], display: "swap", variable: "--font-amiri" });

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
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      apple: "/apple-touch-icon.png",
      other: [
        { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Warda Beauté",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLangServer();
  const [catalog, pixels] = await Promise.all([
    getCatalog(),
    seedPixelsFromEnv().then(() => getEnabledPixels()),
  ]);
  const metaPixels = pixels.filter((p) => p.type === "meta");
  const tiktokPixels = pixels.filter((p) => p.type === "tiktok");
  const gtmPixels = pixels.filter((p) => p.type === "gtm");
  return (
    <html lang={lang === "ar" ? "ar-MA" : "fr"} dir={dirFor(lang)} className={`${cormorant.variable} ${dmSans.variable} ${cairo.variable} ${amiri.variable}`}>
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
