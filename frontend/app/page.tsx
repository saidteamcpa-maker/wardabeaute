import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadges } from "@/components/TrustBadges";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Marquee } from "@/components/ui/Marquee";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { IconBadge } from "@/components/ui/IconBadge";
import { LogoImage } from "@/components/LogoImage";
import { AssuranceBlock } from "@/components/AssuranceBlock";
import { Leaf, MapPin, CreditCard, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { bundle, localize } from "@/content/products";
import { getLangServer } from "@/lib/lang-server";
import { getCatalog, getBundleFromCatalog } from "@/lib/catalog";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";

export default async function HomePage({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const preview = searchParams?.preview === "1";
  const ov = await getPageOverride("home", lang, preview);
  const T = (k: string) => ov?.[k] ?? t(lang, k);
  const catalog = await getCatalog();
  const { price: bundlePrice, oldPrice: bundleOld, save: bundleSave } = getBundleFromCatalog(catalog);
  const featured = Object.keys(catalog).filter((s) => s !== "kit-collagene");
  const allTestimonials = Object.values(catalog)
    .flatMap((p) => localize(p, lang).testimonials)
    .slice(0, 8);
  const why = [
    { i: Leaf, t: T("home.why1t"), d: T("home.why1d") },
    { i: MapPin, t: T("home.why2t"), d: T("home.why2d") },
    { i: ShieldCheck, t: T("home.why3t"), d: T("home.why3d") },
    { i: CreditCard, t: T("home.why4t"), d: T("home.why4d") },
    { i: Truck, t: T("home.why5t"), d: T("home.why5d") },
    { i: RotateCcw, t: T("home.why6t"), d: T("home.why6d") },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="section relative overflow-hidden">
        <FloatingPetals />
        <div className="container-page grid md:grid-cols-2 gap-8 items-center relative">
          <Reveal immediate className="order-first md:order-2">
            {ov?.["home.heroImage"] ? (
          <div className="relative overflow-hidden rounded-2xl bg-brume card-hover aspect-[4/5]">
            <Image src={ov["home.heroImage"]} alt="Warda Beauté — Hero" fill sizes="(max-width: 768px) 100vw, 50vw" priority className="absolute inset-0 h-full w-full object-cover" />
          </div>
        ) : (
          <LogoImage alt="Warda Beauté — Hero" containerClassName="aspect-[4/5]" />
        )}
          </Reveal>
          <Reveal immediate className="md:order-1">
            <div>
              <p className="text-champagne text-sm font-body mb-2">{T("home.heroEyebrow")}</p>
              <h1 className="text-5xl md:text-6xl leading-tight">
                {T("home.heroH1")}
              </h1>
              {lang === "ar" && <p className="font-arabic text-2xl text-warda mt-3">{T("home.heroAr")}</p>}
              <div className="mt-6 flex gap-3 flex-wrap">
                <Link href="/collection" className="btn-primary btn-glow">{T("home.discover")}</Link>
                <Link href="/notre-histoire" className="btn-outline">{T("home.story")}</Link>
              </div>
              <p className="text-sm text-gris mt-3 flex items-center gap-2">
                {T("home.heroFooter")}
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

      {/* PROBLEM / EMPATHY */}
      <section className="container-page pt-16 md:pt-24">
        <Reveal>
          <div className="bg-profond text-petal rounded-3xl p-8 md:p-12 text-center">
            <p className="font-display text-3xl mb-4">{T("home.problemTitle")}</p>
            <p className="font-body text-petal/90 max-w-2xl mx-auto">{T("home.problemBody")}</p>
            {lang === "ar" && <p className="font-arabic text-2xl text-or-doux mt-4">{T("home.problemMicro")}</p>}
          </div>
        </Reveal>
      </section>

      {/* BRAND STORY */}
        <Section eyebrow={T("home.storyEyebrow")} title={T("home.storyTitle")} imageLabel="Cuisine Casablanca" imageSrc={ov?.["home.storyImage"] || "/logo.png"} imageSide="left">
        <p>{T("home.story1")}</p>
        <p>{T("home.story2")}</p>
        {lang === "ar" && <p className="font-arabic text-warda text-xl">{T("home.storyQuote")}</p>}
      </Section>

      {/* FEATURED */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <p className="text-champagne text-sm font-body uppercase">{T("home.featuredEyebrow")}</p>
            <h2 className="text-4xl text-profond mb-6">{T("home.featuredTitle")}</h2>
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

      {/* SCIENCE / WHY OUR ACTIVES WORK */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <p className="text-champagne text-sm font-body uppercase text-center">{T("home.scienceEyebrow")}</p>
            <h2 className="text-4xl text-profond mb-8 text-center">{T("home.scienceTitle")}</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { i: "🌿", t: T("home.sci1t"), d: T("home.sci1d") },
              { i: "🌊", t: T("home.sci2t"), d: T("home.sci2d") },
              { i: "🍊", t: T("home.sci3t"), d: T("home.sci3d") },
            ].map((s, idx) => (
              <Reveal key={s.t} delay={idx * 0.1}>
                <div className="rounded-2xl border border-brume p-6 card-hover h-full">
                  <div className="text-4xl mb-3">{s.i}</div>
                  <h3 className="font-display text-xl text-profond mb-2">{s.t}</h3>
                  <p className="font-body text-brun text-sm">{s.d}</p>
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
            <h2 className="text-4xl text-profond mb-2">{T("home.bundleTitle")}</h2>
            <p className="font-body text-brun mb-4">{T("home.bundleSub")}</p>
            <Link href="/kit-collagene" className="block max-w-md mx-auto mb-6 overflow-hidden rounded-3xl card-hover shadow-lg relative aspect-[4/5]">
              <Image
                src={ov?.["home.bundleImage"] || "/kit-collagene-hero.png"}
                alt="Kit Collagène Inside & Outside — VelvaStretch™ + CollaGlow™"
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover"
              />
            </Link>
            <div className="inline-flex flex-wrap justify-center gap-3 mb-4">
              {bundle.contents.map((s) => <span key={s} className="badge-pill">{catalog[s].name}</span>)}
            </div>
            <div className="text-2xl font-display text-profond mb-2">{bundlePrice} MAD <span className="line-through text-gris text-base">{bundleOld} MAD</span></div>
            <p className="text-champagne text-sm mb-4">{t(lang, "kit.save")} {bundleSave} MAD · {t(lang, "kit.urgency")}</p>
            <Link href="/kit-collagene" className="btn-primary btn-glow">{T("home.bundleCta")}</Link>
          </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-4xl text-profond mb-8 text-center">{T("home.howTitle")}</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { i: "📱", t: T("home.how1t"), d: T("home.how1d") },
              { i: "📝", t: T("home.how2t"), d: T("home.how2d") },
              { i: "📦", t: T("home.how3t"), d: T("home.how3d") },
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
          {lang === "ar" && (
            <p className="text-center font-arabic text-gris mt-6">الدفع عند الاستلام — مكتعطيش درهم حتى توصلك السلعة في يديك</p>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section overflow-hidden">
        <div className="container-page">
          <Reveal>
            <h2 className="text-4xl text-profond mb-2 text-center">
              Plus de <CountUp to={2400} suffix={T("home.socialSuffix")} className="text-gradient font-display" /> satisfaites
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {["Casablanca", "Rabat", "Marrakech", "Agadir", "Fès", "Tanger"].map((c) => (
                <span key={c} className="badge-pill">📍 {c}</span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="mt-6">
          {lang === "ar" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              {allTestimonials.slice(0, 4).map((tm, i) => (
                <div key={i} dir="rtl" className="w-full rounded-2xl bg-white border border-brume p-5 shadow-soft">
                  <div className="text-champagne text-sm mb-2">{"★".repeat(tm.stars)}</div>
                  <p className="font-body text-brun text-sm">“{tm.text}”</p>
                  <p className="font-body text-gris text-xs mt-3">— {tm.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <Marquee speed={38}>
              {allTestimonials.map((tm, i) => (
                <div key={i} className="w-80 shrink-0 rounded-2xl bg-white border border-brume p-5 shadow-soft">
                  <div className="text-champagne text-sm mb-2">{"★".repeat(tm.stars)}</div>
                  <p className="font-body text-brun text-sm">“{tm.text}”</p>
                  <p className="font-body text-gris text-xs mt-3">— {tm.name}</p>
                </div>
              ))}
            </Marquee>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-4xl text-profond mb-8 text-center">{T("home.whyTitle")}</h2>
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

      <AssuranceBlock />

      {/* FINAL CTA */}
      <section className="section bg-gradient-to-br from-profond to-warda text-petal text-center relative overflow-hidden">
        <FloatingPetals count={8} />
        <div className="container-page relative">
          <Reveal>
            <h2 className="text-4xl font-display">{T("home.finalTitle")}</h2>
            <p className="font-body mt-3 max-w-xl mx-auto">{T("home.finalBody")}</p>
            <div className="mt-5 flex gap-3 justify-center flex-wrap">
              <Link href="/collection" className="btn-primary btn-glow">{T("home.finalCta1")}</Link>
              <Link href="/kit-collagene" className="btn-outline !text-petal !border-petal">{T("home.finalCta2")}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
