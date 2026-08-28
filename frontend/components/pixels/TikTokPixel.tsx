"use client";

import Script from "next/script";

export function TikTokPixel({ id, enabled, scriptId = "tt-pixel" }: { id?: string; enabled?: boolean; scriptId?: string }) {
  const finalId = id || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (enabled === false || !finalId) return null;
  return (
    <Script id={scriptId} strategy="lazyOnload">
      {`
        !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
        ttq.methods=['page','track','identify','instance','init'];
        ttq.methods.forEach(function(m){ttq[m]=function(){ttq.push([m].concat(
        Array.prototype.slice.call(arguments)))}});
        ttq.load=function(i){ttq._i=ttq._i||{};ttq._i[i]={};ttq.loaded=1};
        ttq.init('${finalId}');ttq.page();}(window,document,'ttq');
      `}
    </Script>
  );
}
