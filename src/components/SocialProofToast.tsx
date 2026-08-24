'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Oujda'];
const NAMES = ['Fatima', 'Salma', 'Khadija', 'Amina', 'Nour', 'Imane', 'Sara', 'Yasmine'];

export default function SocialProofToast() {
  const t = useTranslations();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      toast(
        <span className="text-sm">
          <strong>{name}</strong> {t('SocialProof.justOrdered')} · {city}
        </span>,
        { id: 'social-proof', duration: 4000 }
      );
    }, 12000);
    return () => clearInterval(id);
  }, [enabled, t]);

  return null;
}
