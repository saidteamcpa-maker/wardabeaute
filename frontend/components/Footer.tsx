"use client";

import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { useLang } from "@/components/LangProvider";
import { t } from "@/content/ui";
import { useSiteContent } from "@/lib/use-site-content";
import type { SiteContentData } from "@/lib/page-schema";

function pick(obj: { fr?: string; ar?: string } | undefined, lang: "fr" | "ar"): string {
  if (!obj) return "";
  return (obj[lang] || obj.fr || "").trim();
}

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
  const site = useSiteContent();
  const footer = site?.footer;
  const label = (it: { label?: string; labelKey?: string }) =>
    it.labelKey ? t(lang, it.labelKey) : it.label!;

  const description = pick(footer?.description, lang);
  const copyright = pick(footer?.copyright, lang) || t(lang, "footer.copy");
  const email = footer?.email || "contact@wardabeaute.com";
  const phone = footer?.phone || "212779754660";
  const social = footer?.social || {
    whatsapp: "212779754660",
    instagram: "https://instagram.com/wardabeaute.ma",
    tiktok: "https://tiktok.com/@wardabeaute.ma",
  };

  return (
    <footer className="bg-gradient-to-b from-brun to-[#2a151c] text-petal mt-16">
      <div className="container-page pt-10 lg:pt-12">
        {description && (
          <div className="max-w-xl mb-10">
            <p className="font-display text-2xl mb-3 text-ordoux">Warda Beauté</p>
            <p className="font-body text-petal/75 text-sm leading-relaxed">{description}</p>
            {(email || phone) && (
              <p className="font-body text-petal/60 text-sm mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {email && (
                  <a href={`mailto:${email}`} className="hover:text-warda transition-colors duration-250 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none rounded">
                    {email}
                  </a>
                )}
                {phone && <span className="tabular-nums">{phone}</span>}
              </p>
            )}
            {(social.instagram || social.facebook || social.tiktok || social.whatsapp) && (
              <div className="flex gap-3 mt-5 text-petal/70">
                {social.whatsapp && (
                  <a href={`https://wa.me/${social.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 grid place-items-center rounded-xl bg-petal/10 hover:bg-petal/15 hover:text-warda hover:scale-105 active:scale-95 transition-all duration-250 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none" aria-label="WhatsApp">💬</a>
                )}
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 grid place-items-center rounded-xl bg-petal/10 hover:bg-petal/15 hover:text-warda hover:scale-105 active:scale-95 transition-all duration-250 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none" aria-label="Instagram">📸</a>
                )}
                {social.tiktok && (
                  <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 grid place-items-center rounded-xl bg-petal/10 hover:bg-petal/15 hover:text-warda hover:scale-105 active:scale-95 transition-all duration-250 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none" aria-label="TikTok">🎵</a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 grid place-items-center rounded-xl bg-petal/10 hover:bg-petal/15 hover:text-warda hover:scale-105 active:scale-95 transition-all duration-250 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none" aria-label="Facebook">📘</a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="container-page pb-10 lg:pb-12 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {COLS.map((c, ci) => {
          const isContact = c.titleKey === "nav.contact";
          return (
            <div
              key={ci}
              className={isContact ? "col-span-2 md:col-span-1 text-center md:text-left" : ""}
            >
              <h4 className={`font-body font-medium text-ordoux mb-4 text-sm tracking-wide ${isContact ? "text-center md:text-left" : ""}`}>
                {t(lang, c.titleKey)}
              </h4>
              <ul
                className={`space-y-3 text-sm ${isContact ? "flex flex-row flex-wrap items-center justify-center md:justify-start w-full gap-x-4 gap-y-2 md:block md:space-y-3" : ""}`}
              >
                {c.items.map((it, idx) => (
                  <li key={idx} className={isContact ? "whitespace-nowrap" : ""}>
                    <Link
                      href={it.href}
                      aria-label={label(it)}
                      className="hover:text-warda transition-colors duration-250 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none rounded-lg -mx-1 px-1 py-0.5"
                    >
                      {"icon" in it && it.icon ? (
                        <>
                          <it.icon className="w-3.5 h-3.5 shrink-0" aria-hidden />
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
                <p className="mt-5 text-champagne text-sm font-medium">{t(lang, c.badgeKey)}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t border-petal/10 text-center text-xs py-5 text-petal/55">
        {copyright}
      </div>
    </footer>
  );
}
