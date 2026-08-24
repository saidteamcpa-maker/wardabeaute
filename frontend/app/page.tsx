import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadges } from "@/components/TrustBadges";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { IconBadge } from "@/components/ui/IconBadge";
import { LogoImage } from "@/components/LogoImage";
import { Leaf, MapPin, CreditCard, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { products, bundle } from "@/content/products";

export default function HomePage() {
  const featured = Object.keys(products);
  const allTestimonials = Object.values(products).flatMap((p) => p.testimonials).slice(0, 8);
  const why = [
    { i: Leaf, t: "100% Ingrédients Naturels", d: "Chaque formule est construite autour d'ingrédients que tu connais." },
    { i: MapPin, t: "Fabriqué au Maroc", d: "Formulé et fabriqué au Maroc. Aucun intermédiaire." },
    { i: ShieldCheck, t: "Testé Dermatologiquement", d: "Formules testées sur peau sensible marocaine." },
    { i: CreditCard, t: "الدفع عند الاستلام", d: "Tu ne paies qu'à la livraison. Aucun risque." },
    { i: Truck, t: "Livraison 24–48h", d: "On livre partout au Maroc." },
    { i: RotateCcw, t: "Garantie 4 semaines", d: "Résultats pas visibles? On rembourse." },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="section relative overflow-hidden">
        <FloatingPetals />
        <div className="container-page grid md:grid-cols-2 gap-8 items-center relative">
          <Reveal delay={0.15} className="order-first md:order-2">
            <LogoImage alt="Warda Beauté — Hero" containerClassName="aspect-[4/5]" />
          </Reveal>
          <Reveal className="md:order-1">
            <div>
              <p className="text-champagne text-sm font-body mb-2">✦ ماركة مغربية · 100% طبيعي · الدفع عند الاستلام ✦</p>
              <h1 className="text-5xl md:text-6xl leading-tight">
                La beauté authentique, <span className="text-gradient">née au Maroc</span>
              </h1>
              <p className="font-arabic text-2xl text-warda mt-3">جمالك يستاهل الأحسن — مصنوعة هنا، لبشرتك أنتِ</p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link href="/collection" className="btn-primary btn-glow">Découvrir nos produits</Link>
                <Link href="/notre-histoire" className="btn-outline">Notre histoire</Link>
              </div>
              <p className="text-sm text-gris mt-3 flex items-center gap-2">
                🚚 Livraison gratuite · 💳 Paiement à la livraison · ↩️ Retour 30 jours
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="container-page -mt-6">
        <Reveal>
          <TrustBadges />
        </Reveal>
      </section>

      {/* BRAND STORY */}
      <Section eyebrow="Notre Histoire" title="Née d'une conviction marocaine" imageLabel="Cuisine Casablanca" imageSrc="/logo.png" imageSide="left">
        <p>Warda Beauté est née dans une cuisine à Casablanca. Sa fondatrice cherchait une solution aux vergetures après sa grossesse et ne trouvait que des produits importés chers ou sans transparence.</p>
        <p>Elle a formulé ses propres solutions — avec des ingrédients sourcés au Maroc, testés sur sa peau, sur celle de ses amies, de sa sœur, de sa mère.</p>
        <p className="font-arabic text-warda text-xl">"هدفنا واحد — كل امرأة مغربية تحس بجمالها بدون ما تخبي جسمها"</p>
      </Section>

      {/* FEATURED */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <p className="text-champagne text-sm font-body uppercase">Nos Produits</p>
            <h2 className="text-4xl text-profond mb-6">Trois solutions. Un seul objectif : te sentir belle.</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((s, idx) => (
              <Reveal key={s} delay={idx * 0.1}>
                <ProductCard slug={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-4xl text-profond mb-8 text-center">Comment commander? C'est simple.</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { i: "📱", t: "Choisis ton produit", d: "Sélectionne ton produit. Pas de compte, pas de carte." },
              { i: "📝", t: "Laisse tes coordonnées", d: "Nom + téléphone. On t'appelle pour confirmer." },
              { i: "📦", t: "Reçois et paie", d: "Tu reçois en 24–48h. Tu paies cash au livreur." },
            ].map((s, idx) => (
              <Reveal key={s.t} delay={idx * 0.1}>
                <div className="rounded-2xl border border-brume p-6 card-hover">
                  <div className="text-4xl mb-2">{s.i}</div>
                  <h3 className="font-display text-2xl text-profond">{s.t}</h3>
                  <p className="font-body text-brun text-sm mt-2">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-center font-arabic text-gris mt-6">الدفع عند الاستلام — مكتعطيش درهم حتى توصلك السلعة في يديك</p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section overflow-hidden">
        <div className="container-page">
          <Reveal>
            <h2 className="text-4xl text-profond mb-2 text-center">
              Plus de <CountUp to={2400} suffix=" femmes marocaines" className="text-gradient font-display" /> satisfaites
            </h2>
          </Reveal>
        </div>
        <div className="mt-6">
          <Marquee speed={38}>
            {allTestimonials.map((t, i) => (
              <div key={i} className="w-80 shrink-0 rounded-2xl bg-white border border-brume p-5 shadow-soft">
                <div className="text-champagne text-sm mb-2">{"★".repeat(t.stars)}</div>
                <p className="font-body text-brun text-sm">“{t.text}”</p>
                <p className="font-body text-gris text-xs mt-3">— {t.name}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* WHY US */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-4xl text-profond mb-8 text-center">Pourquoi des milliers de Marocaines nous font confiance?</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {why.map((w, idx) => (
              <Reveal key={w.t} delay={(idx % 3) * 0.1}>
                <div className="rounded-2xl border border-brume p-5 flex gap-3 items-start card-hover">
                  <IconBadge icon={w.i} tone={idx % 2 ? "profond" : "warda"} />
                  <div>
                    <h3 className="font-display text-xl text-profond">{w.t}</h3>
                    <p className="font-body text-brun text-sm mt-1">{w.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLE */}
      <section className="section">
        <Reveal>
          <div className="container-page text-center">
            <h2 className="text-4xl text-profond mb-2">Le Kit Complet — <span className="text-gradient">Body Confidence Kit</span></h2>
            <p className="font-body text-brun mb-4">Les 3 produits ensemble — parce que ta beauté mérite tout.</p>
            <div className="inline-flex flex-wrap justify-center gap-3 mb-4">
              {bundle.contents.map((s) => <span key={s} className="badge-pill">{products[s].name}</span>)}
            </div>
            <div className="text-2xl font-display text-profond mb-2">{bundle.price} MAD <span className="line-through text-gris text-base">{bundle.oldPrice} MAD</span></div>
            <p className="text-champagne text-sm mb-4">Vous économisez {bundle.save} MAD (21%) · {bundle.urgency}</p>
            <Link href="/collection" className="btn-primary btn-glow">Commander le Kit Complet</Link>
          </div>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-gradient-to-br from-profond to-warda text-petal text-center relative overflow-hidden">
        <FloatingPetals count={8} />
        <div className="container-page relative">
          <Reveal>
            <h2 className="text-4xl font-display">أنتِ تستحقي — ابدأي اليوم</h2>
            <p className="font-body mt-3 max-w-xl mx-auto">Chaque jour que tu attends est un jour de plus à cacher ton corps. Warda Beauté est là, formulée pour toi, livrée chez toi, payée à la livraison.</p>
            <div className="mt-5 flex gap-3 justify-center flex-wrap">
              <Link href="/collection" className="btn-primary btn-glow">Découvrir nos produits</Link>
              <Link href="/collection" className="btn-outline !text-petal !border-petal">Voir le Kit Complet</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
