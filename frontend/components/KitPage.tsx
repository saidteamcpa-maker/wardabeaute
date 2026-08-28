import Link from "next/link";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { TrustBadges } from "@/components/TrustBadges";
import { TestimonialGrid } from "@/components/TestimonialGrid";
import { IngredientTable } from "@/components/IngredientTable";
import { Faq } from "@/components/Faq";
import { IconBadge } from "@/components/ui/IconBadge";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StickyCTA } from "@/components/StickyCTA";
import { AssuranceBlock } from "@/components/AssuranceBlock";
import { ComparisonTable } from "@/components/ComparisonTable";
import { products, localize } from "@/content/products";
import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";
import {
  Check,
  Sparkles,
  FlaskConical,
  Truck,
  ShieldCheck,
  Heart,
  Microscope,
  Award,
} from "lucide-react";

const BENEFIT_ICONS = [Check, Sparkles, FlaskConical, Truck, ShieldCheck, Heart];

export async function KitPage({ preview = false }: { preview?: boolean }) {
  const lang = getLangServer();
  const ov = await getPageOverride("kit-collagene", lang, preview);
  const T = (k: string) => ov?.[k] ?? t(lang, k);
  const kit = localize(products["kit-collagene"], lang);
  const testimonials = [
    ...localize(products.velvastretch, lang).testimonials,
    ...localize(products.collaglow, lang).testimonials,
  ].slice(0, 6);

  return (
    <div className="pb-24 md:pb-0">
      {/* HERO */}
      <section className="section relative overflow-hidden">
        <FloatingPetals />
        <div className="container-page grid md:grid-cols-2 gap-8 items-center relative">
          <Reveal className="md:order-1">
            <div>
              <p className="text-champagne text-sm font-body mb-2">{kit.hero.eyebrow}</p>
              <h1 className="text-4xl md:text-5xl leading-tight">
                <span className="text-gradient">{kit.hero.h1}</span>
              </h1>
              {lang === "ar" && (
                <p className="font-arabic text-2xl text-warda mt-2">{kit.hero.h1Ar}</p>
              )}
              <p className="font-body text-brun mt-4">{kit.hero.sub}</p>

              <div className="my-4 flex items-center gap-3">
                <span className="text-3xl font-display text-profond">{kit.price} MAD</span>
                <span className="line-through text-gris">{kit.oldPrice} MAD</span>
                <span className="text-champagne text-sm">
                  ★ {kit.stars} ({kit.reviews})
                </span>
              </div>
              <p className="text-warda font-medium text-sm mb-4">
                {T("kit.save")} {kit.oldPrice - kit.price} MAD · {T("kit.urgency")}
              </p>

              <TrustBadges />
              <div className="mt-5 max-w-md">
                <AddToCartButton slug="kit-collagene" />
              </div>
              <p className="text-xs text-gris mt-2">{kit.hero.micro}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="order-first md:order-2">
            <div className="overflow-hidden rounded-3xl card-hover shadow-lg">
              <img
                src={ov?.["kit.heroImage"] || "/kit-collagene-hero.png"}
                alt="Kit Collagène Inside & Outside — VelvaStretch™ + CollaGlow™"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <p className="text-center text-xs text-gris mt-2">
              VelvaStretch™ (extérieur) + CollaGlow™ (intérieur)
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM / EMPATHY */}
      <section className="container-page">
        <Reveal>
          <div className="bg-profond text-petal rounded-3xl p-8 md:p-12 text-center">
            <p className="font-display text-3xl mb-4">{T("kit.problemTitle")}</p>
            <p className="font-body text-petal/90 max-w-2xl mx-auto">{T("kit.problemBody")}</p>
            <p className="font-arabic text-2xl text-or-doux mt-4">{T("kit.problemMicro")}</p>
          </div>
        </Reveal>
      </section>

      {/* WHY IT WORKS — SCIENCE + LOGIC */}
      <Section eyebrow={T("kit.scienceEyebrow")} title={T("kit.scienceTitle")} imageLabel="Labo Casablanca" imageSrc={ov?.["kit.scienceImage"]} imageSide="right">
        <p className="font-body text-brun mb-4">{T("kit.sci1")}</p>
        <p className="font-body text-brun mb-4">
          {T("kit.sci2")}
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl border border-brume p-4">
            <p className="font-display text-xl text-profond mb-1">{T("kit.extTitle")}</p>
            <p className="text-sm text-brun">{T("kit.extBody")}</p>
          </div>
          <div className="rounded-2xl border border-brume p-4">
            <p className="font-display text-xl text-profond mb-1">{T("kit.intTitle")}</p>
            <p className="text-sm text-brun">{T("kit.intBody")}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-or-doux p-5">
          <p className="font-body text-brun mb-2">
            <strong className="text-profond">{lang === "ar" ? "البحث واضح :" : "La recherche est claire :"}</strong>{" "}
            {T("kit.sci3")}
          </p>
          <div className="flex items-start gap-3 mt-3">
            <IconBadge icon={Microscope} tone="warda" />
            <p className="text-sm text-brun">{T("kit.synergy")}</p>
          </div>
        </div>
      </Section>

      {/* AUTHORITY / CERTIFICATIONS */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-6 text-center">{T("kit.authorityTitle")}</h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <span key={n} className="badge-pill">{t(lang, `kit.badge${n}` as any)}</span>
            ))}
          </div>
          <p className="text-center text-gris text-sm mt-4">
            {lang === "ar"
              ? "ماركة مغربية، للنساء المغربيات. بلا استيراد، بلا وسيط."
              : "Une marque marocaine, pour des femmes marocaines. Pas d'importation, pas d'intermédiaire."}
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <Section eyebrow={T("kit.insideEyebrow")} title={T("kit.insideTitle")} imageLabel="Ingrédients" imageSrc={ov?.["kit.ingredientsImage"]} imageSide="left">
        <p className="font-body text-brun mb-3">{T("kit.insideBody")}</p>
        <IngredientTable items={kit.ingredients} />
        <details className="mt-3">
          <summary className="font-body text-warda cursor-pointer">{t(lang, "pp.viewInci")}</summary>
          <p className="text-sm text-gris mt-2">{kit.inci}</p>
        </details>
      </Section>

      {/* BENEFITS */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-6">{T("kit.benefitsTitle")}</h2>
          </Reveal>
          <ul className="grid md:grid-cols-2 gap-3 font-body text-brun">
            {kit.benefits.map((b, i) => (
              <Reveal key={i} delay={(i % 2) * 0.08}>
                <li className="flex items-start gap-3 rounded-xl border border-brume p-3 card-hover">
                  <IconBadge icon={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} tone="warda" size="sm" />
                  <span>{b}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section bg-petal/40">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-4">{t(lang, "pp.comparisonTitle")}</h2>
          </Reveal>
          <ComparisonTable slug="kit-collagene" />
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-3 text-center">{T("kit.socialTitle")}</h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[1, 2, 3].map((n) => (
              <span key={n} className="badge-pill">{t(lang, `kit.social${n}` as any)}</span>
            ))}
          </div>
          <TestimonialGrid items={testimonials} />
        </div>
      </section>

      {/* RITUAL */}
      <Section eyebrow={T("kit.ritualEyebrow")} title={T("kit.ritualTitle")} imageLabel="Application" imageSrc={ov?.["kit.ritualImage"]} imageSide="right">
        <ol className="list-decimal list-inside space-y-2 font-body text-brun">
          {kit.howTo.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ol>
        <div className="mt-4 rounded-2xl bg-or-doux p-4">
          <p className="font-body text-profond">{T("kit.ritualNote")}</p>
        </div>
      </Section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-6">{T("kit.faqTitle")}</h2>
          </Reveal>
          <Faq items={kit.faq} />
        </div>
      </section>

      <AssuranceBlock />

      {/* RISK REVERSAL */}
      <section className="section">
        <div className="container-page text-center">
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-profond to-warda text-petal p-8 max-w-2xl mx-auto">
              <Award className="w-10 h-10 mx-auto mb-3" />
              <h2 className="font-display text-3xl mb-2">{T("kit.riskTitle")}</h2>
              <p className="font-body text-petal/90">{T("kit.riskBody")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-white">
        <div className="container-page text-center">
          <Reveal>
            <h2 className="text-4xl font-display text-profond mb-2">
              {T("kit.finalTitle")} <span className="text-gradient">Inside &amp; Outside</span>
            </h2>
            <p className="font-body text-brun mb-3">{T("kit.finalSub")}</p>
            <div className="text-3xl font-display text-profond mb-1">
              {kit.price} MAD{" "}
              <span className="line-through text-gris text-lg">{kit.oldPrice} MAD</span>
            </div>
            <p className="text-champagne text-sm mb-4">
              {T("kit.save")} {kit.oldPrice - kit.price} MAD · {T("kit.urgency")}
            </p>
            <div className="max-w-xs mx-auto">
              <AddToCartButton slug="kit-collagene" />
            </div>
            <p className="text-xs text-gris mt-2">{kit.hero.micro}</p>
            <Link href="/collection" className="btn-outline mt-4 inline-flex">
              {T("kit.viewAll")}
            </Link>
          </Reveal>
        </div>
      </section>

      <StickyCTA slug="kit-collagene" />
    </div>
  );
}
