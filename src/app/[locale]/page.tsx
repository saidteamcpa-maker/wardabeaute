import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SiteShell from '@/components/SiteShell';
import Testimonials from '@/components/Testimonials';
import { CATALOG, BUNDLE, formatMAD } from '@/lib/data/catalog';

type Pillar = { icon: string; title: string; body: string };
type Faq = { q: string; a: string };

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  const heroBadges = t.raw('heroBadges') as string[];
  const pillars = t.raw('pillars') as Pillar[];
  const faqs = t.raw('faqs') as Faq[];
  const finalBadges = t.raw('finalBadges') as string[];

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-petal/40 to-sand">
        <div className="container-wb grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div className="animate-fadein">
            <div className="mb-4 flex flex-wrap gap-2">
              {heroBadges.map((b) => (
                <span key={b} className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-profond">
                  {b}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold leading-tight text-profond sm:text-6xl">
              {t('heroH1')}
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink/70">
              {t('heroSub')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/${CATALOG[0].slug}`} className="btn-primary">
                {t('heroCta')}
              </Link>
              <Link href={`/${BUNDLE.slug}`} className="btn-secondary">
                {t('heroSecondary')}
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-warda">
              ✓ {t('heroReassurance')}
            </p>
          </div>
          <div className="relative animate-floaty">
            <div className="aspect-square overflow-hidden rounded-full bg-white shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero.svg" alt="Warda Beauté" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / CERT STRIP */}
      <section className="border-y border-petal/50 bg-white py-5">
        <div className="container-wb flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm font-semibold text-profond">
          {[
            '🇲🇦 Fabriqué au Maroc',
            '🌿 100% naturel & végane',
            '🧪 Dermatologiquement testé',
            '💳 Paiement à la livraison',
            '↩️ Satisfait ou remboursé 30j',
          ].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="bg-profond text-white">
        <div className="container-wb grid grid-cols-2 gap-6 py-10 text-center sm:grid-cols-4">
          {[
            { v: '12 000+', l: 'clientes satisfaites' },
            { v: '4.8/5', l: 'note moyenne' },
            { v: '30 jours', l: 'garantie satisfait' },
            { v: '24-48h', l: 'livraison partout au Maroc' },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-3xl font-bold text-gold">{s.v}</p>
              <p className="mt-1 text-xs text-white/80">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT TRIO — Our Formulations */}
      <section className="section">
        <div className="container-wb">
          <h2 className="text-center text-3xl font-bold text-profond sm:text-4xl">
            {t('trioHeading')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-ink/60">
            {t('trioSub')}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATALOG.map((p) => (
              <Link
                key={p.sku}
                href={`/${p.slug}`}
                className="card-wb group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-petal/30">
                  {p.badge && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-warda px-3 py-1 text-xs font-semibold text-white">
                      {p.badge}
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.heroImage} alt={p.nameFr} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-warda">
                    {p.routineFr}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold text-profond">
                    {p.nameFr}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-ink/70">{p.shortFr}</p>
                  <p className="mt-3 text-xs text-ink/50">({p.reviewCount} avis)</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-warda">Dès {formatMAD(p.price, locale)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLE */}
      <section className="section">
        <div className="container-wb">
          <div className="card-wb overflow-hidden">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <span className="eyebrow">{BUNDLE.badge}</span>
                <h2 className="text-3xl font-bold text-profond">{BUNDLE.nameFr}</h2>
                <p className="mt-3 text-ink/70">{BUNDLE.shortFr}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-warda">{formatMAD(BUNDLE.price, locale)}</span>
                  <span className="text-ink/50 line-through">{formatMAD(BUNDLE.originalPrice, locale)}</span>
                </div>
                <Link href={`/${BUNDLE.slug}`} className="btn-primary mt-6">
                  {t('bundleCta')}
                </Link>
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl2 bg-petal/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BUNDLE.heroImage} alt={BUNDLE.nameFr} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WARDA — Why Nama */}
      <section className="section bg-white">
        <div className="container-wb">
          <h2 className="text-center text-3xl font-bold text-profond sm:text-4xl">
            {t('pillarsHeading')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-ink/60">
            {t('pillarsSub')}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="card-wb p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-petal text-2xl">
                  {p.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-profond">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFIED REVIEWS */}
      <Testimonials locale={locale} />

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container-wb">
          <h2 className="text-center text-3xl font-bold text-profond sm:text-4xl">
            {t('howTitle')}
          </h2>
          <p className="mt-2 text-center text-ink/60">{t('howSub')}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card-wb p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warda text-xl font-bold text-white">
                  {n}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-profond">
                  {t(`how${n}Title`)}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{t(`how${n}Body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container-wb max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-profond sm:text-4xl">
            {t('faqHeading')}
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="card-wb p-5" open={i === 0}>
                <summary className="cursor-pointer font-semibold text-profond">{f.q}</summary>
                <p className="mt-2 text-sm text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — Begin Your Ritual */}
      <section className="section bg-profond text-white">
        <div className="container-wb text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            {t('finalHeading')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            {t('finalSub')}
          </p>
          <Link href={`/${BUNDLE.slug}`} className="btn-primary mt-7 bg-white text-profond hover:bg-petal">
            {t('finalCtaButton')}
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-medium text-white/80">
            {finalBadges.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
