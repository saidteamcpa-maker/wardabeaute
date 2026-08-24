'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const MESSAGES = ['Announcement.msg1', 'Announcement.msg2', 'Announcement.msg3'] as const;

export default function AnnouncementBar() {
  const t = useTranslations();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-profond text-center text-xs font-medium tracking-wide text-white py-2 px-4">
      <p key={index} className="animate-fadein">
        {t(MESSAGES[index])}
      </p>
    </div>
  );
}
