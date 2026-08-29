"use client";

import { CheckCircle2, Package, Truck, MapPin, Home } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { useLang } from "@/components/LangProvider";

const STEPS_FR = [
  { icon: CheckCircle2, label: "Commande confirmée" },
  { icon: Package, label: "En préparation" },
  { icon: Truck, label: "Expédiée" },
  { icon: MapPin, label: "Livraison imminente" },
  { icon: Home, label: "Livrée" },
];

const STEPS_AR = [
  { icon: CheckCircle2, label: "الكوماندة تأكدات" },
  { icon: Package, label: "قيد التحضير" },
  { icon: Truck, label: "تشحنت" },
  { icon: MapPin, label: "التوصيل قريب" },
  { icon: Home, label: "وصلت" },
];

export default function SuiviCommande() {
  const { lang } = useLang();
  const STEPS = lang === "ar" ? STEPS_AR : STEPS_FR;

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent(
    "سلام 🌹 Je souhaite suivre ma commande Warda Beauté"
  )}`;

  return (
    <div className="section relative overflow-hidden">
      <FloatingPetals />
      <div className="container-page max-w-2xl font-body text-brun relative">
        <h1 className="text-4xl leading-snug text-profond mb-2">{lang === "ar" ? "متبوع الكوماندة 🌹" : "Suivi de commande 🌹"}</h1>
        <p className="mb-5">
          {lang === "ar"
            ? "هاك كيفاش كتمشي التوصيل ديال الكوماندة ديالك، من الكليك حتال الباب ديالك."
            : "Voici comment se déroule la livraison de votre commande, du clic à votre porte."}
        </p>
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-or-doux px-4 py-2 text-profond font-medium">
          {lang === "ar" ? "⏱ التوصيل 24 لـ 48 ساعة فكل المغرب" : "⏱ Livraison 24h – 48h partout au Maroc"}
        </p>

        <div className="rounded-2xl border border-brume p-5 bg-white shadow-soft animate-[fadeIn_0.5s_ease]">
          <ol className="space-y-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.label} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-warda text-white">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-lg text-profond font-medium">{s.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-white font-medium py-3 px-5 hover:scale-[1.02] transition"
        >
          <FaWhatsapp className="w-6 h-6" />
          {lang === "ar" ? "عونة؟ تواصلي معانا على واتساب" : "Besoin d'aide ? Contactez-nous sur WhatsApp"}
        </a>

        <p className="mt-4 text-sm text-gris">
          {lang === "ar" ? "الجواب فأقل من ساعة · الدار البيضاء، المغرب" : "Réponse rapide sous 1h · Casablanca, Maroc"}
        </p>
      </div>
    </div>
  );
}
