import type { Metadata } from "next";
import "./globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutPopup } from "@/components/CheckoutPopup";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SocialProofToast } from "@/components/SocialProofToast";
import { MetaPixel } from "@/components/pixels/MetaPixel";
import { TikTokPixel } from "@/components/pixels/TikTokPixel";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Warda Beauté | وردة بيوتي — Produits Beauté Naturels au Maroc | Paiement à la Livraison",
  description:
    "Warda Beauté — سيروم علامات التمدد، زيت إيقاف نمو الشعر، وعلكات الكولاجين. مصنوع في المغرب. الدفع عند الاستلام. توصيل 24-48 ساعة.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Cairo:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <MetaPixel />
        <TikTokPixel />
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <CartDrawer />
        <CheckoutPopup />
        <SocialProofToast />
        <Toaster />
      </body>
    </html>
  );
}
