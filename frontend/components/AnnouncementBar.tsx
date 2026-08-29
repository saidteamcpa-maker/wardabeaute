"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence mode="wait">
        <motion.p
          key={override ? "override" : i}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-medium"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
