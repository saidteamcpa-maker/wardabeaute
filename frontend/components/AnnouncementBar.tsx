"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "🚚 Livraison gratuite partout au Maroc — Paiement à la livraison",
  "🌹 مصنوع في المغرب | 100% طبيعي | نتائج مضمونة",
  "⭐ +2,400 femmes marocaines satisfaites ce mois-ci",
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MESSAGES.length), 4000);
    return () => clearInterval(t);
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
          {MESSAGES[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
