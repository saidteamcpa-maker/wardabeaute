"use client";

import { useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212779754660";
  useEffect(() => {}, []);
  const href = `https://wa.me/${number}?text=${encodeURIComponent("سلام 🌹 Warda Beauté — بغيت نعرف تفاصيل ومعلومات على المنتجات")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-4 left-4 z-[9999] bg-[#25D366] text-white w-14 h-14 rounded-full grid place-items-center text-2xl shadow-soft hover:scale-105 active:scale-95 transition-transform duration-200"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  );
}
