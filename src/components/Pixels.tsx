'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/routing';

const FB = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const TT = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const GA = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
    gtag?: any;
    dataLayer?: any;
  }
}

export default function Pixels() {
  const pathname = usePathname();

  useEffect(() => {
    // Facebook Pixel
    if (FB && !window.fbq) {
      /* eslint-disable */
      const fbq: any = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = '2.0';
      window.fbq = fbq;
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
      window.fbq('init', FB);
      /* eslint-enable */
    }
    if (FB) window.fbq && window.fbq('track', 'PageView');

    // TikTok Pixel
    if (TT && !window.ttq) {
      /* eslint-disable */
      const ttq: any = (window as any).ttq = (window as any).ttq || [];
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq._q = [];
      ttq.methods.forEach(function (e: any) {
        ttq[e] = function () { ttq._q.push([e].concat(Array.prototype.slice.call(arguments))); };
      });
      ttq.load = function (id: any) {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://analytics.tiktok.com/i18n/event.js';
        s.id = id;
        const f = document.getElementsByTagName('script')[0];
        f.parentNode!.insertBefore(s, f);
      };
      ttq.load(TT);
      /* eslint-enable */
    }
    if (TT) window.ttq && window.ttq.page();

    // Google Analytics 4
    if (GA && !window.gtag) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA);
    }
  }, [pathname]);

  return null;
}
