"use client";

import { Leaf, MapPin, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { IconBadge } from "./ui/IconBadge";
import { useLang } from "@/components/LangProvider";
import { t } from "@/content/ui";

const KEYS = ["tb.natural", "tb.madein", "tb.cod", "tb.derma", "tb.ship"] as const;
const ICONS = [Leaf, MapPin, CreditCard, ShieldCheck, Truck];

export function TrustBadges() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {KEYS.map((k, i) => {
        const Icon = ICONS[i];
        return (
          <div
            key={k}
            className="rounded-xl bg-white/70 border border-brume px-3 py-4 flex flex-col items-center gap-2 text-center hover:border-warda transition"
          >
            <IconBadge icon={Icon} tone="warda" />
            <span className="text-sm font-body text-brun leading-tight">{t(lang, k)}</span>
          </div>
        );
      })}
    </div>
  );
}
