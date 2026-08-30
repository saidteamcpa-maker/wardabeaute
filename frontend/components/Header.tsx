"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { useCart } from "@/lib/cart";
import { useLang } from "@/components/LangProvider";
import { LangToggle } from "@/components/LangToggle";
import { t } from "@/content/ui";
import { useSiteContent, navOverride } from "@/lib/use-site-content";

type MenuChild = { label: string; key?: string; href: string; icon?: ComponentType<{ className?: string }> };
type MenuItem = { label: string; key?: string; href?: string; children?: MenuChild[] };

const MENU: MenuItem[] = [
  { label: "Notre Histoire", key: "nav.notreHistoire", href: "/notre-histoire" },
  {
    label: "Nos Produits",
    key: "nav.products",
    children: [
      { label: "VelvaStretch™", href: "/velvastretch" },
      { label: "SilkStop™", href: "/silkstop" },
      { label: "CollaGlow™", href: "/collaglow" },
      { label: "Kit Collagène Inside & Outside", href: "/kit-collagene" },
    ],
  },
  {
    label: "Nous contacter",
    key: "nav.contact",
    children: [
      { label: "WhatsApp", key: "nav.whatsapp", href: "/contact", icon: FaWhatsapp },
      { label: "Email", key: "nav.email", href: "/contact", icon: FaEnvelope },
      { label: "Instagram", key: "nav.instagram", href: "/contact", icon: FaInstagram },
      { label: "TikTok", key: "nav.tiktok", href: "/contact", icon: FaTiktok },
    ],
  },
  { label: "Politique de retour", key: "nav.retour", href: "/politique-de-retour" },
  { label: "Suivi commande", key: "nav.suivi", href: "/suivi-commande" },
  { label: "Livraison", key: "nav.livraison", href: "/politique-de-retour" },
  { label: "Conditions d'utilisation", key: "nav.conditions", href: "/politique-de-confidentialite" },
];

export function Header() {
  const { lang } = useLang();
  const site = useSiteContent();
  const logoUrl = site?.header?.logoUrl;
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const labelOf = (key?: string, fallback: string = "") =>
    (key && navOverride(site, key, lang)) || (key ? t(lang, key) : fallback);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-350 ease-out-expo ${
        scrolled ? "glass shadow-elevated" : "bg-petal border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-16 gap-2">
        <button
          className="order-1 text-profond hover:text-warda hover:bg-brume/40 active:scale-95 transition-all duration-200 p-2 rounded-xl focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none"
          aria-label={t(lang, "menu")}
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="w-6 h-6" strokeWidth={1.6} />
        </button>

        <Link
          href="/"
          dir="ltr"
          style={{ fontFamily: '"Cairo", "Playfair Display", Georgia, serif' }}
          className="order-2 mx-auto flex items-center gap-2 font-display text-2xl text-profond hover:text-warda transition-colors duration-300 rounded-xl px-2 py-1 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none"
        >
          <Image src={logoUrl || "/header-logo.png"} alt="Warda Beauté" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
          <span className="whitespace-nowrap leading-none">Warda Beauté</span>
        </Link>

        <div className="flex items-center gap-1.5 order-3">
          <LangToggle />
          <button onClick={openCart} aria-label={t(lang, "cartAria")} className="relative text-profond hover:text-warda hover:bg-brume/40 active:scale-95 transition-all duration-200 p-2 rounded-xl focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none">
            <ShoppingCart className="w-6 h-6" strokeWidth={1.6} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-profond text-white text-[11px] font-medium rounded-full w-5 h-5 grid place-items-center shadow-glow">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-brun/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-petal p-6 shadow-drawer overflow-y-auto animate-[fadeIn_0.3s_ease]">
              <div className="flex justify-end">
                <button onClick={() => setMenuOpen(false)} aria-label={t(lang, "close")} className="p-2 -mr-2 rounded-xl text-profond hover:text-warda hover:bg-brume/40 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col mt-4 font-body text-[15px] text-brun">
                {MENU.map((m) =>
                  m.children ? (
                    <div key={m.label} className="border-b border-brume/50">
                      <button
                        type="button"
                        onClick={() => setOpenMenus((s) => ({ ...s, [m.label]: !s[m.label] }))}
                        className="flex w-full items-center justify-between py-3 hover:text-warda transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none rounded-lg -mx-1 px-1"
                        aria-expanded={!!openMenus[m.label]}
                      >
                        <span className="font-medium">{labelOf(m.key, m.label)}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ease-out-expo ${openMenus[m.label] ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openMenus[m.label] && (
                        <div className="flex flex-col gap-2 pb-3 pl-3 text-base">
                          {m.children.map((c) => (
                            <Link
                              key={c.label}
                              href={c.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2 hover:text-warda transition-colors duration-200"
                            >
                              {c.icon && <c.icon className="w-4 h-4" aria-hidden />}
                               <span>{labelOf(c.key, c.label)}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={m.label}
                      href={m.href!}
                      onClick={() => setMenuOpen(false)}
                      className="py-3 border-b border-brume/50 hover:text-warda transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none rounded-lg -mx-1 px-1"
                    >
                      {labelOf(m.key, m.label)}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
