'use client';

import { useTranslations, useLocale } from 'next-intl';
import SiteShell from '@/components/SiteShell';

const FAQS = [
  { q: 'Quels sont les délais de livraison ?', a: 'Livraison en 24-48h dans les grandes villes, 2-4 jours ailleurs au Maroc.' },
  { q: 'Comment se passe le paiement ?', a: 'Paiement à la livraison (cash on delivery). Aucun paiement en avance.' },
  { q: 'Les produits sont-ils naturels ?', a: 'Oui, formulés à base d’ingrédients marocains (argan, figue de barbarie, safran).' },
  { q: 'Puis-je suivre ma commande ?', a: 'Oui, via la page Suivi de commande avec votre numéro et téléphone.' },
];

export default function FaqPage() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  return (
    <SiteShell>
      <div className="container-wb max-w-3xl py-16">
        <h1 className="text-center font-display text-4xl font-bold text-profond">{t('faq')}</h1>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <details key={i} className="card-wb group p-5" open={i === 0}>
              <summary className="cursor-pointer font-semibold text-profond">{f.q}</summary>
              <p className="mt-2 text-sm text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
