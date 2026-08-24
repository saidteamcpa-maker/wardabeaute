"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, Flower2 } from "lucide-react";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/collection", label: "Produits" },
  { href: "/notre-histoire", label: "Notre Histoire" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "glass border-b border-brume shadow-soft" : "bg-petal border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-16 gap-2">
        {/* Left: hamburger (mobile only) */}
        <button
          className="md:hidden order-1 text-2xl text-profond"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="w-7 h-7" strokeWidth={1.6} />
        </button>

        {/* Logo: center on mobile, left on desktop */}
        <Link
          href="/"
          className="order-2 md:order-1 mx-auto md:mx-0 flex items-center gap-2 font-display text-2xl text-profond"
        >
          <Flower2 className="w-6 h-6 text-warda" strokeWidth={1.5} />
          Warda Beauté
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden md:flex gap-7 order-3 md:order-2 font-body text-brun">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-warda transition relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-warda after:transition-all">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right: CTA + cart */}
        <div className="flex items-center gap-3 order-4 md:order-3">
          <Link href="/collection" className="btn-primary !px-4 !py-2 text-sm hidden md:inline-flex btn-glow">
            🌸 Commander — 279 MAD
          </Link>
          <button onClick={openCart} aria-label="Panier" className="relative text-2xl text-profond hover:scale-110 transition">
            <ShoppingCart className="w-7 h-7" strokeWidth={1.6} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-profond text-white text-xs rounded-full w-5 h-5 grid place-items-center animate-pulseSoft">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-brun/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-petal p-6 shadow-soft">
            <div className="flex justify-end">
              <button onClick={() => setMenuOpen(false)} aria-label="Fermer">
                <X className="w-7 h-7 text-profond" />
              </button>
            </div>
            <nav className="flex flex-col gap-5 mt-6 font-body text-lg text-brun">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="hover:text-warda">
                  {n.label}
                </Link>
              ))}
              <Link href="/collection" onClick={() => setMenuOpen(false)} className="btn-primary mt-2">
                🌸 Commander
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
