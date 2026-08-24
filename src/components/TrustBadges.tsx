import { useTranslations } from 'next-intl';

const BADGES = [
  { icon: '🚚', key: 'Product.freeShipping' },
  { icon: '💳', key: 'Product.cashOnDelivery' },
  { icon: '🌿', key: 'Footer.madeInMorocco' },
  { icon: '⭐', key: 'Home.testimonialsTitle' },
  { icon: '🔒', key: 'Nav.track' },
];

export default function TrustBadges() {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {BADGES.map((b) => (
        <div key={b.key} className="flex items-center gap-2 rounded-xl2 bg-white p-3 shadow-card">
          <span className="text-2xl">{b.icon}</span>
          <span className="text-xs font-medium text-ink/80">{t(b.key)}</span>
        </div>
      ))}
    </div>
  );
}
