import { useTranslations } from 'next-intl';

const REVIEWS = [
  { name: 'Fatima', city: 'Casablanca', stars: 5, fr: 'Mes vergetures ont nettement diminué en 3 semaines. Je recommande !', ar: 'قلّت علامات التمدد لديّ بشكل ملحوظ في 3 أسابيع. أنصح به!' },
  { name: 'Salma', city: 'Rabat', stars: 5, fr: 'SilkStop a vraiment ralenti la repousse. Produit magique.', ar: 'سيلك ستوب بطّأ نمو الشعر فعلاً. منتج سحري.' },
  { name: 'Khadija', city: 'Marrakech', stars: 5, fr: 'CollaGlow pour la peau et les ongles, résultat visible.', ar: 'كولا غلو للبشرة والأظافر، نتيجة ملحوظة.' },
  { name: 'Amina', city: 'Fès', stars: 4, fr: 'Livraison rapide et emballage soigné. Merci Warda.', ar: 'توصيل سريع وتغليف أنيق. شكراً وردة.' },
];

export default function Testimonials({ locale }: { locale: string }) {
  const t = useTranslations();
  return (
    <section className="section bg-petal/30">
      <div className="container-wb">
        <h2 className="text-center text-3xl font-bold text-profond sm:text-4xl">
          {t('Home.testimonialsTitle')}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="card-wb p-5">
              <div className="text-gold">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
              <p className="mt-3 text-sm text-ink/80">{locale === 'ar' ? r.ar : r.fr}</p>
              <p className="mt-4 text-sm font-semibold text-profond">
                {r.name} · {r.city}
              </p>
              <p className="mt-1 text-xs font-medium text-warda">✓ Avis vérifié</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
