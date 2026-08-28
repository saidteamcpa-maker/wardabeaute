"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import dynamic from "next/dynamic";
const CheckoutPopup = dynamic(() => import("@/components/CheckoutPopup").then((m) => m.CheckoutPopup), { ssr: false });
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

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
