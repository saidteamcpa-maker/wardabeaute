"use client";

import { useEffect } from "react";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
  useEffect(() => {}, []);
  const href = `https://wa.me/${number}?text=${encodeURIComponent("سلام 🌹 Warda Beauté — بغيت نعرف معلومات على المنتوجات")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-4 left-4 z-[9999] bg-[#25D366] text-white w-14 h-14 rounded-full grid place-items-center text-2xl shadow-soft hover:scale-105 transition"
    >
      💬
    </a>
  );
}
