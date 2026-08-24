'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/components/cart/CartProvider';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SocialProofToast from '@/components/SocialProofToast';
import Pixels from '@/components/Pixels';
import CartDrawer from '@/components/CartDrawer';
import CheckoutPopup from '@/components/CheckoutPopup';

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <WhatsAppButton />
      <SocialProofToast />
      <Pixels />
      <CartDrawer />
      <CheckoutPopup />
    </CartProvider>
  );
}
