"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

const CheckoutPopup = dynamic(() => import("@/components/CheckoutPopup").then((m) => m.CheckoutPopup), { ssr: false });

function useIsAdmin() {
  const pathname = usePathname();
  return !!pathname?.startsWith("/admin");
}

export function StorefrontHeader() {
  if (useIsAdmin()) return null;
  return (
    <>
      <AnalyticsTracker />
      <AnnouncementBar />
      <Header />
    </>
  );
}

export function StorefrontFooterArea() {
  if (useIsAdmin()) return null;
  return (
    <>
      <Footer />
      <CartDrawer />
      <CheckoutPopup />
    </>
  );
}
