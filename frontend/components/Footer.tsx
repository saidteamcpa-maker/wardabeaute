"use client";

import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { useLang } from "@/components/LangProvider";
import { t } from "@/content/ui";

const COLS = [
  {
    titleKey: "nav.products",
    items: [
      { href: "/notre-histoire", labelKey: "nav.notreHistoire" },
      { href: "/politique-de-retour", labelKey: "nav.retour" },
      { href: "/politique-de-retour", labelKey: "nav.livraison" },
      { href: "/politique-de-confidentialite", labelKey: "nav.conditions" },
      { href: "/suivi-commande", labelKey: "nav.suivi" },
    ],
    badgeKey: "footer.badge",
  },
  {
    titleKey: "nav.products",
    items: [
      { href: "/velvastretch", label: "VelvaStretch™" },
      { href: "/silkstop", label: "SilkStop™" },
      { href: "/collaglow", label: "CollaGlow™" },
      { href: "/kit-collagene", label: "Kit Collagène Inside & Outside" },
    ],
  },
  {
    titleKey: "nav.contact",
    items: [
      { href: "/contact", labelKey: "nav.whatsapp", icon: FaWhatsapp },
      { href: "/contact", labelKey: "nav.email", icon: FaEnvelope },
      { href: "/contact", labelKey: "nav.instagram", icon: FaInstagram },
      { href: "/contact", labelKey: "nav.tiktok", icon: FaTiktok },
    ],
  },
];

export function Footer() {
  const { lang } = useLang();
  const label = (it: { label?: string; labelKey?: string }) =>
    it.labelKey ? t(lang, it.labelKey) : it.label!;

  return (
    <footer className="bg-brun text-petal mt-12">
      <div className="container-page py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLS.map((c, ci) => {
          const isContact = c.titleKey === "nav.contact";
          return (
            <div
              key={ci}
              className={isContact ? "col-span-2 md:col-span-1 text-center md:text-left" : ""}
            >
              <h4 className={`font-body font-medium text-ordoux mb-3 ${isContact ? "text-center md:text-left" : ""}`}>
                {t(lang, c.titleKey)}
              </h4>
              <ul
                className={`space-y-2 text-sm ${isContact ? "flex flex-row flex-nowrap items-center justify-between w-full gap-x-1 text-[11px] md:block md:text-sm md:space-y-2" : ""}`}
              >
                {c.items.map((it, idx) => (
                  <li key={idx} className={isContact ? "whitespace-nowrap" : ""}>
                    <Link
                      href={it.href}
                      aria-label={label(it)}
                      className="hover:text-warda transition flex items-center gap-1"
                    >
                      {"icon" in it && it.icon ? (
                        <>
                          <it.icon className="w-4 h-4 shrink-0" aria-hidden />
                          <span>{label(it)}</span>
                        </>
                      ) : (
                        label(it)
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              {"badgeKey" in c && c.badgeKey && (
                <p className="mt-3 text-champagne text-sm">{t(lang, c.badgeKey)}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t border-petal/20 text-center text-xs py-4 text-petal/70">
        {t(lang, "footer.copy")}
      </div>
    </footer>
  );
}
