import { Leaf, MapPin, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { IconBadge } from "./ui/IconBadge";

const BADGES = [
  { icon: Leaf, label: "100% Ingrédients Naturels" },
  { icon: MapPin, label: "Fabriqué au Maroc" },
  { icon: CreditCard, label: "الدفع عند الاستلام" },
  { icon: ShieldCheck, label: "Testé Dermatologiquement" },
  { icon: Truck, label: "Livraison 24–48h" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {BADGES.map((b) => (
        <div
          key={b.label}
          className="rounded-xl bg-white/70 border border-brume px-3 py-4 flex flex-col items-center gap-2 text-center hover:border-warda transition"
        >
          <IconBadge icon={b.icon} tone="warda" />
          <span className="text-sm font-body text-brun leading-tight">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
