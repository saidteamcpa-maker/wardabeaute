import { getLangServer } from "@/lib/lang-server";
import { WARDAPages, getWardaPage } from "@/content/wardaContent";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ProblemBlock } from "@/components/blocks/ProblemBlock";
import { TimelineBlock } from "@/components/blocks/TimelineBlock";
import { CtaMidBlock } from "@/components/blocks/CtaMidBlock";
import { GalleryBlock } from "@/components/blocks/GalleryBlock";
import { OrderFormBlock } from "@/components/blocks/OrderFormBlock";
import { Section } from "@/components/Section";
import { IngredientTable } from "@/components/IngredientTable";
import { Faq } from "@/components/Faq";
import { TestimonialGrid } from "@/components/TestimonialGrid";
import { AssuranceBlock } from "@/components/AssuranceBlock";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Check } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";

export async function WardaPage({ slug }: { slug: string }) {
  const lang = getLangServer();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const data = getWardaPage(slug);
  if (!data) return null;
  const c = lang === "ar" ? data.ar : data.fr;

  // SEO handled via generateMetadata in page.tsx

  return (
    <div dir={dir} className={lang === "ar" ? "font-arabic" : ""}>
      {/* Skip link */}
      <a href="#order" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-profond focus:text-white focus:px-4 focus:py-2 focus:rounded-full">
        {lang === "ar" ? "اذهبي إلى الاستمارة" : "Aller au formulaire"}
      </a>

      {/* 01 Hero */}
      <HeroBlock
        eyebrow={c.hero.label}
        h1={c.hero.h1}
        sub={c.hero.sub}
        pills={c.hero.pills}
        ctaLabel={c.hero.cta}
        trust={c.hero.trust}
        lang={lang}
      />

      {/* 02 Problem */}
      <ProblemBlock eyebrow={c.problem.eyebrow} h2={c.problem.h2} para={c.problem.para} bullets={c.problem.bullets} lang={lang} />

      {/* 03 Ingredients */}
      <Section eyebrow={c.ingredients.eyebrow} title={c.ingredients.h2} imageLabel="Ingrédients" imageSide="left">
        <p className="font-body text-brun mb-4">{c.ingredients.para}</p>
        <div className="space-y-3">
          {c.ingredients.items.map((it) => (
            <div key={it.num} className="flex gap-3 rounded-xl border border-brume p-4 bg-white">
              <span className="font-display text-champagne text-xl leading-none pt-1">{it.num}</span>
              <div>
                <p className="font-body text-profond font-medium text-sm">{it.name}</p>
                <p className="font-body text-brun text-sm leading-relaxed">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 04 Ritual */}
      <Section eyebrow={lang === "ar" ? undefined : "Le rituel"} title={c.ritual.h2} imageLabel="Rituel" imageSide="right">
        <ol className="space-y-3">
          {c.ritual.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-profond text-white grid place-items-center text-sm font-medium shrink-0">{i + 1}</span>
              <span className="font-body text-brun text-sm leading-relaxed pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 05 Timeline */}
      <TimelineBlock eyebrow={c.timeline.eyebrow} h2={c.timeline.h2} milestones={c.timeline.milestones} callouts={c.timeline.callouts} disclaimer={c.timeline.disclaimer} lang={lang} />

      {/* 06 CTA Mid #1 */}
      <CtaMidBlock ctaLabel={c.ctaMid.cta} trust={c.ctaMid.trust} lang={lang} />

      {/* 07 Values */}
      <section dir={dir} className="section bg-white">
        <div className="container-page">
          <Reveal>
            {c.values.eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{c.values.eyebrow}</p>}
            <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-8 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{c.values.h2}</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {c.values.pillars.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="rounded-2xl border border-brume p-5 bg-gradient-to-b from-white to-petal/30 h-full">
                  <h3 className="font-display text-lg text-profond mb-2">{p.title}</h3>
                  <p className="font-body text-brun text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {c.values.badges.map((b, i) => (
              <span key={i} className="badge-pill text-xs">
                ✦ {b}
              </span>
            ))}
          </div>
          <AssuranceBlock />
        </div>
      </section>

      {/* 08 Testimonials */}
      <section dir={dir} className="section">
        <div className="container-page">
          <Reveal>
            {c.testimonials.eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{c.testimonials.eyebrow}</p>}
            <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-6 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{c.testimonials.h2}</h2>
          </Reveal>
          <TestimonialGrid items={c.testimonials.items.map((t) => ({ text: t.quote, name: `${t.name} — ${t.city}`, stars: t.stars }))} />
        </div>
      </section>

      {/* 09 CTA Mid #2 */}
      <CtaMidBlock ctaLabel={c.ctaMid2.cta} trust={c.ctaMid2.trust} lang={lang} />

      {/* 10 Pricing */}
      <section dir={dir} className="section bg-petal/30">
        <div className="container-page">
          <Reveal>
            <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{c.pricing.eyebrow}</p>
            <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-8 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{c.pricing.h2}</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {c.pricing.cards.map((card, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  className={`relative rounded-2xl border-2 p-5 flex flex-col gap-3 h-full ${
                    (card as any).isFeatured ? "border-profond bg-profond text-white shadow-elevated scale-[1.02]" : "border-brume bg-white text-brun"
                  }`}
                >
                  {(card as any).badge && (
                    <span className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-semibold shadow-subtle ${dir === "rtl" ? "left-4" : "right-4"} ${(card as any).isFeatured ? "bg-or-doux text-profond" : "bg-champagne text-white"}`}>
                      {(card as any).badge}
                    </span>
                  )}
                  <h3 className={`font-display text-lg ${ (card as any).isFeatured ? "text-white" : "text-profond"}`}>{card.title}</h3>
                  <div>
                    <div className={`font-display text-2xl ${(card as any).isFeatured ? "text-white" : "text-profond"}`}>{card.price} MAD</div>
                    <div className={`font-body text-xs ${(card as any).isFeatured ? "text-white/80" : "text-gris"}`}>{card.size} · {card.duration}</div>
                  </div>
                  <a href="#order" className={`mt-auto w-full rounded-full px-5 py-3 text-sm font-semibold text-center transition-all ${ (card as any).isFeatured ? "bg-white text-profond hover:bg-or-doux" : "bg-profond text-white hover:brightness-110"}`}>
                    {card.cta}
                  </a>
                  {(card as any).isPlaceholder && <p className="text-[10px] text-center opacity-60">TODO: prix à confirmer</p>}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="font-body text-gris text-xs text-center mt-4">{c.pricing.trust}</p>
        </div>
      </section>

      {/* 11 Gallery */}
      <GalleryBlock images={c.gallery} lang={lang} />

      {/* Sticky mobile bar is global via StickyCTA, but we also ensure OrderForm is next */}
      {/* 12 Order Form */}
      <OrderFormBlock slug={slug} eyebrow={c.orderForm.eyebrow} h2={c.orderForm.h2} badges={c.orderForm.badges} lang={lang} whatsappNumber={WHATSAPP_NUMBER} />

      {/* 13 FAQ */}
      <section dir={dir} className="section bg-white">
        <div className="container-page max-w-3xl">
          <Reveal>
            <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-6 text-center ${lang === "ar" ? "font-arabic" : ""}`}>FAQ</h2>
          </Reveal>
          <Faq items={c.faq.map((f) => ({ q: f.q, r: f.a }))} />
        </div>
      </section>
    </div>
  );
}
