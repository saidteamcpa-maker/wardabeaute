"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import { t } from "@/content/ui";

const KEYS = ["announce.1", "announce.2", "announce.3"];

export function AnnouncementBar() {
  const { lang } = useLang();
  const [i, setI] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setI((x) => (x + 1) % KEYS.length), 4000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-gradient-to-r from-profond via-warda to-profond text-petal text-center text-sm py-2 px-4 font-body overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          {t(lang, KEYS[i])}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
