import Link from "next/link";

const COLS = [
  {
    title: "Warda Beauté",
    items: [
      { href: "/notre-histoire", label: "Notre Histoire" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
    badge: "🇲🇦 مصنوع في المغرب",
  },
  {
    title: "Nos Produits",
    items: [
      { href: "/velvastretch", label: "VelvaStretch™" },
      { href: "/silkstop", label: "SilkStop™" },
      { href: "/collaglow", label: "CollaGlow™" },
      { href: "/collection", label: "Body Confidence Kit" },
    ],
  },
  {
    title: "Informations",
    items: [
      { href: "/politique-de-retour", label: "Politique de retour" },
      { href: "/politique-de-retour", label: "Livraison & COD" },
      { href: "/politique-de-confidentialite", label: "Confidentialité" },
      { href: "/suivi-commande", label: "Suivi commande" },
    ],
  },
  {
    title: "Nous contacter",
    items: [
      { href: "/contact", label: "WhatsApp" },
      { href: "/contact", label: "Email" },
      { href: "/contact", label: "Instagram / TikTok" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brun text-petal mt-12">
      <div className="container-page py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-body font-medium text-ordoux mb-3">{c.title}</h4>
            <ul className="space-y-2 text-sm">
              {c.items.map((it, idx) => (
                <li key={idx}>
                  <Link href={it.href} className="hover:text-warda transition">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
            {"badge" in c && c.badge && (
              <p className="mt-3 text-champagne text-sm">{c.badge}</p>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-petal/20 text-center text-xs py-4 text-petal/70">
        © 2026 Warda Beauté — wardabeaute.com | 🇲🇦 Casablanca, Maroc | Paiement 100% à la livraison
      </div>
    </footer>
  );
}
