import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import SiteShell from '@/components/SiteShell';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Notre histoire',
    description: 'Warda Beauté — soins botaniques fabriqués au Maroc pour la peau maghrébine.',
    alternates: { languages: { fr: '/fr/notre-histoire', ar: '/ar/notre-histoire' } },
  };
}

export default async function StoryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const isAr = locale === 'ar';

  const values = [
    { icon: '🌿', fr: 'Nature marocaine', ar: 'طبيعة مغربية', frB: 'Argan, figue de barbarie et safran au cœur de chaque formule.', arB: 'الأركان والصبار والزعفران في قلب كل تركيبة.' },
    { icon: '🧪', fr: 'Efficacité prouvée', ar: 'فعالية مُثبتة', frB: 'Des actifs dosés selon des études, pas des promesses.', arB: 'مكونات فعّالة بجرعات مبنية على دراسات.' },
    { icon: '💳', fr: 'Zéro risque', ar: 'بلا مخاطرة', frB: 'Paiement à la livraison et garantie 30 jours.', arB: 'الدفع عند الاستلام وضمان 30 يوماً.' },
    { icon: '👩', fr: 'Pensé pour elle', ar: 'مصمّم لها', frB: 'Des soins adaptés à la peau et à la vie des Marocaines.', arB: 'عناية ملائمة لبشرة وحياة المغربيات.' },
  ];

  return (
    <SiteShell>
      {/* HERO */}
      <section className="bg-gradient-to-b from-petal/40 to-sand">
        <div className="container-wb grid items-center gap-10 py-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{t('storyEyebrow')}</p>
            <h1 className="text-4xl font-bold text-profond sm:text-5xl">{t('storyTitle')}</h1>
            <p className="mt-4 text-lg text-ink/75">{t('storyBody')}</p>
            <p className="mt-3 text-ink/75">
              {isAr
                ? 'نؤمن بأن الجمال يبدأ من الطبيعة. كل مستحضر يُصنع بشغف في المغرب.'
                : 'Nous croyons que la beauté commence par la nature. Chaque soin est façonné avec passion au Maroc.'}
            </p>
            <Link href="/produits" className="btn-primary mt-6">{t('finalCtaButton')}</Link>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-xl2 bg-petal/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/about.svg" alt={t('storyTitle')} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-profond text-white">
        <div className="container-wb grid grid-cols-2 gap-6 py-10 text-center sm:grid-cols-4">
          {[
            { v: '2021', l: isAr ? 'تأسست' : 'Fondée' },
            { v: '12 000+', l: isAr ? 'زبونة' : 'clientes' },
            { v: '4.8/5', l: isAr ? 'التقييم' : 'note moyenne' },
            { v: '🇲🇦', l: isAr ? 'صنع في المغرب' : 'Fabriqué au Maroc' },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-3xl font-bold text-gold">{s.v}</p>
              <p className="mt-1 text-xs text-white/80">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY BODY */}
      <section className="section bg-white">
        <div className="container-wb max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-profond">
            {isAr ? 'لماذا Warda Beauté؟' : 'Pourquoi Warda Beauté ?'}
          </h2>
          <p className="mt-4 text-lg text-ink/75">
            {isAr
              ? 'وُلدت Warda Beauté من رغبة بسيطة: منتجات مغربية أصيلة، شفافة وفعّالة، متاحة للجميع بفضل الدفع عند الاستلام. لا إعلانات مضللة، فقط مكونات نعرف أصلها ونثق بها.'
              : 'Warda Beauté est née d’un constat simple : des produits marocains authentiques, transparents et efficaces, accessibles à toutes grâce au paiement à la livraison. Pas de promesses trompeuses, juste des ingrédients dont nous connaissons l’origine.'}
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <div className="container-wb">
          <h2 className="text-center text-3xl font-bold text-profond">
            {isAr ? 'قيمنا' : 'Nos valeurs'}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.fr} className="card-wb p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-petal text-2xl">
                  {v.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-profond">
                  {isAr ? v.ar : v.fr}
                </h3>
                <p className="mt-2 text-sm text-ink/70">{isAr ? v.arB : v.frB}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="section bg-petal/30">
        <div className="container-wb grid gap-6 text-center sm:grid-cols-3">
          <div><div className="text-3xl">🇲🇦</div><p className="mt-2 font-semibold text-profond">{isAr ? 'صنع في المغرب' : 'Fabriqué au Maroc'}</p></div>
          <div><div className="text-3xl">💳</div><p className="mt-2 font-semibold text-profond">{isAr ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}</p></div>
          <div><div className="text-3xl">↩️</div><p className="mt-2 font-semibold text-profond">{isAr ? 'مُستردة المال 30 يوماً' : 'Satisfait ou remboursé 30j'}</p></div>
        </div>
      </section>
    </SiteShell>
  );
}
