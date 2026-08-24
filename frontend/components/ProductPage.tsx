import { Section } from "@/components/Section";
import { TrustBadges } from "@/components/TrustBadges";
import { TestimonialGrid } from "@/components/TestimonialGrid";
import { IngredientTable } from "@/components/IngredientTable";
import { Faq } from "@/components/Faq";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StickyCTA } from "@/components/StickyCTA";
import { SampleImage } from "@/components/SampleImage";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { IconBadge } from "@/components/ui/IconBadge";
import { Check, Sparkles, FlaskConical, Truck, ShieldCheck } from "lucide-react";
import { products } from "@/content/products";

const BENEFIT_ICONS = [Check, Sparkles, FlaskConical, Truck, ShieldCheck, Check];

export function ProductPage({ slug }: { slug: string }) {
  const p = products[slug];
  return (
    <div className="pb-24 md:pb-0">
      {/* HERO */}
      <section className="section relative overflow-hidden">
        <FloatingPetals />
        <div className="container-page grid md:grid-cols-2 gap-8 items-center relative">
          <Reveal className="md:order-1">
            <div>
              <p className="text-champagne text-sm font-body mb-2">{p.hero.eyebrow}</p>
              <h1 className="text-4xl md:text-5xl leading-tight">
                <span className="text-gradient">{p.hero.h1}</span>
              </h1>
              <p className="font-arabic text-2xl text-warda mt-2">{p.hero.h1Ar}</p>
              <p className="font-body text-brun mt-4">{p.hero.sub}</p>
              <p className="font-arabic text-gris mt-1">{p.hero.subAr}</p>

              <div className="my-4 flex items-center gap-3">
                <span className="text-2xl font-display text-profond">{p.price} MAD</span>
                <span className="line-through text-gris">{p.oldPrice} MAD</span>
                <span className="text-champagne text-sm">★ {p.stars} ({p.reviews})</span>
              </div>

              <TrustBadges />
              <div className="mt-5 max-w-md">
                <AddToCartButton slug={slug} withTier />
              </div>
              <p className="text-xs text-gris mt-2">{p.hero.micro}</p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="order-first md:order-2">
            <SampleImage label={`${p.name} — ${p.arSub}`} className="card-hover" />
          </Reveal>
        </div>
      </section>

      {/* HOOK */}
      <section className="container-page">
        <p className="font-body text-brun text-lg italic border-r-4 border-warda pr-4">{p.hook}</p>
      </section>

      {/* DESCRIPTION */}
      <Section eyebrow="Ce que ça fait" title={`${p.name} pour toi`} imageLabel="Texture / Lifestyle" imageSide="right">
        {p.description.map((d, i) => <p key={i}>{d}</p>)}
      </Section>

      {/* BENEFITS */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-6">Pourquoi tu vas l'aimer</h2>
          </Reveal>
          <ul className="grid md:grid-cols-2 gap-3 font-body text-brun">
            {p.benefits.map((b, i) => (
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

      {/* INGREDIENTS */}
      <Section eyebrow="La science" title="Les ingrédients" imageLabel="Ingrédients" imageSide="left">
        <IngredientTable items={p.ingredients} />
        <details className="mt-3">
          <summary className="font-body text-warda cursor-pointer">Voir la liste INCI complète</summary>
          <p className="text-sm text-gris mt-2">{p.inci}</p>
        </details>
      </Section>

      {/* HOW TO */}
      <Section eyebrow="Comment utiliser" title="En 5 étapes" imageLabel="Application" imageSide="right">
        <ol className="list-decimal list-inside space-y-1">
          {p.howTo.map((h, i) => <li key={i}>{h}</li>)}
        </ol>
        <div className="mt-3">
          <p className="font-medium text-profond">Pour toi si :</p>
          <ul>{p.whoFor.map((w, i) => <li key={i}>• {w}</li>)}</ul>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-6">Elles témoignent</h2>
          </Reveal>
          <TestimonialGrid items={p.testimonials} />
        </div>
      </section>

      {/* UPSELL */}
      <section className="section bg-white">
        <Reveal>
          <div className="container-page text-center">
            <h2 className="text-3xl text-profond mb-3">Encore plus de résultats</h2>
            <p className="font-body text-brun mb-4">{p.upsellCopy}</p>
            <div className="max-w-xs mx-auto">
              <AddToCartButton slug={p.crossSell.slug} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* CROSS-SELL */}
      <section className="section">
        <Reveal>
          <div className="container-page">
            <h2 className="text-3xl text-profond mb-3">Les femmes qui ont pris {p.name} ont aussi pris</h2>
            <div className="rounded-2xl border border-brume p-4 flex flex-col sm:flex-row items-center justify-between gap-4 card-hover">
              <div>
                <p className="font-display text-xl text-profond">{products[p.crossSell.slug].name}</p>
                <p className="font-arabic text-gris text-sm">{products[p.crossSell.slug].arSub}</p>
                <p className="text-sm text-gris mt-1">{p.crossSell.copy}</p>
              </div>
              <div className="min-w-[200px]">
                <AddToCartButton slug={p.crossSell.slug} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-3xl text-profond mb-6">Questions fréquentes</h2>
          </Reveal>
          <Faq items={p.faq} />
        </div>
      </section>

      <StickyCTA slug={slug} />
    </div>
  );
}
