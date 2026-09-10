"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { t } from "@/content/ui";
import { useSiteContent, announcementOverride } from "@/lib/use-site-content";

const KEYS = ["announce.1", "announce.2", "announce.3"];

export function AnnouncementBar() {
  const { lang } = useLang();
  const site = useSiteContent();
  const override = announcementOverride(site, lang);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (override) return;
    const timer = setInterval(() => setI((x) => (x + 1) % KEYS.length), 4000);
    return () => clearInterval(timer);
  }, [override]);
  const text = override ?? t(lang, KEYS[i]);
  return (
    <div className="bg-gradient-to-r from-profond via-warda to-champagne/80 text-petal text-center text-sm py-2.5 px-4 font-body overflow-hidden relative tracking-wide">
      <p
        key={override ? "override" : i}
        className="font-medium leading-relaxed"
        style={{
          animation: "annFadeSlide 0.36s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {text}
      </p>
    </div>
  );
}
