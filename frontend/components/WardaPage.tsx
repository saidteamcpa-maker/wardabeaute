import { getLangServer } from "@/lib/lang-server";
import { getPageOverride } from "@/lib/store-content";
import { WARDAPages, getWardaPage } from "@/content/wardaContent";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { ProblemBlock } from "@/components/blocks/ProblemBlock";
import { TimelineBlock } from "@/components/blocks/TimelineBlock";
import { CtaMidBlock } from "@/components/blocks/CtaMidBlock";
import { Section } from "@/components/Section";
import { IngredientTable } from "@/components/IngredientTable";
import { Faq } from "@/components/Faq";
import { TestimonialGrid } from "@/components/TestimonialGrid";
import { AssuranceBlock } from "@/components/AssuranceBlock";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Check } from "lucide-react";
import { LinkedPricingCards } from "@/components/blocks/LinkedPricingCards";

const HERO_IMAGES: Record<string, string> = {
  velvastretch: "/images/velvastretch.png",
  silkstop: "/images/silkstop.png",
  collaglow: "/images/collaglow.png",
  "kit-collagene": "/kit-collagene-hero.png",
  kit: "/kit-collagene-hero.png",
};

export async function WardaPage({ slug, preview = false }: { slug: string; preview?: boolean }) {
  const lang = getLangServer();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const ov = await getPageOverride(slug, lang, preview);
  const data = getWardaPage(slug);
  if (!data) return null;
  const c = lang === "ar" ? data.ar : data.fr;
  const imageKey = slug === "kit-collagene" ? "kit" : "product";
  const heroImage = (ov?.[imageKey === "kit" ? "kit.heroImage" : "pp.heroImage"] as string) || HERO_IMAGES[slug] || "/images/velvastretch.png";
  const problemImage = ov?.[imageKey === "kit" ? "kit.scienceImage" : "pp.descImage"] as string | undefined;
  const ingredientsImage = ov?.[imageKey === "kit" ? "kit.ingredientsImage" : "pp.ingredientsImage"] as string | undefined;
  const ritualImage = ov?.[imageKey === "kit" ? "kit.ritualImage" : "pp.howToImage"] as string | undefined;

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
        imageSrc={heroImage}
        lang={lang}
      />

      {/* 02 Offers / bundle selector — directly below the hero */}
      <section dir={dir} id="order" className="section bg-petal/30 scroll-mt-6">
        <div className="container-page">
          <Reveal>
            <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{c.pricing.eyebrow}</p>
            <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-8 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{c.pricing.h2}</h2>
          </Reveal>
          <LinkedPricingCards slug={slug} cards={c.pricing.cards as any} dir={dir} lang={lang} />
          <p className="font-body text-gris text-xs text-center mt-4">{c.pricing.trust}</p>
        </div>
      </section>

      {/* 03 Problem */}
      <ProblemBlock eyebrow={c.problem.eyebrow} h2={c.problem.h2} para={c.problem.para} bullets={c.problem.bullets} imageSrc={problemImage} lang={lang} />

      {/* 04 Ingredients */}
      <Section eyebrow={c.ingredients.eyebrow} title={c.ingredients.h2} imageLabel="Ingrédients" imageSrc={ingredientsImage} imageSide="left">
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

      {/* 05 Ritual */}
      <Section eyebrow={lang === "ar" ? undefined : "Le rituel"} title={c.ritual.h2} imageLabel="Rituel" imageSrc={ritualImage} imageSide="right">
        <ol className="space-y-3">
          {c.ritual.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-profond text-white grid place-items-center text-sm font-medium shrink-0">{i + 1}</span>
              <span className="font-body text-brun text-sm leading-relaxed pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 06 Timeline */}
      <TimelineBlock eyebrow={c.timeline.eyebrow} h2={c.timeline.h2} milestones={c.timeline.milestones} callouts={c.timeline.callouts} disclaimer={c.timeline.disclaimer} lang={lang} />

      {/* 07 CTA Mid #1 */}
      <CtaMidBlock ctaLabel={c.ctaMid.cta} trust={c.ctaMid.trust} lang={lang} />

      {/* 08 Values */}
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

      {/* 09 Testimonials */}
      <section dir={dir} className="section">
        <div className="container-page">
          <Reveal>
            {c.testimonials.eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{c.testimonials.eyebrow}</p>}
            <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-6 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{c.testimonials.h2}</h2>
          </Reveal>
          <TestimonialGrid items={c.testimonials.items.map((t) => ({ text: t.quote, name: `${t.name} — ${t.city}`, stars: t.stars }))} />
        </div>
      </section>

      {/* 10 CTA Mid #2 */}
      <CtaMidBlock ctaLabel={c.ctaMid2.cta} trust={c.ctaMid2.trust} lang={lang} />

      {/* 11 FAQ */}
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
