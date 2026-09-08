"use client";

import Script from "next/script";

export function ContentSquarePixel({
  tagId,
  enabled = true,
}: {
  tagId?: string;
  enabled?: boolean;
}) {
  const finalId = tagId || process.env.NEXT_PUBLIC_CONTENTSQUARE_TAG_ID;
  if (enabled === false || !finalId) return null;
  return (
    <Script
      id={`cs-${finalId}`}
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(c,s,q,u,a,r,e){
  c[e]=c[e]||function(){(c[e].q=c[e].q||[]).push(arguments)};
  var t=s.createElement(q);t.async=1;t.src="https://t.contentsquare.net/uxa/"+a+".js";
  var y=s.getElementsByTagName(q)[0];y.parentNode.insertBefore(t,y);
})(window,document,"script","https://t.contentsquare.net/uxa/${finalId}.js","${finalId}","cs");
        `.trim(),
      }}
    />
  );
}
