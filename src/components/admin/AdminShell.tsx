'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Admin');

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace(`/${locale}/admin/login`);
  };

  return (
    <div className="min-h-screen bg-sand">
      <header className="flex items-center justify-between border-b border-petal bg-white px-6 py-3">
        <span className="font-display text-xl font-bold text-warda">Warda Beauté · Admin</span>
        <button onClick={logout} className="text-sm font-medium text-ink/70 hover:text-warda">
          {t('logout')}
        </button>
      </header>
      <div className="container-wb py-8">{children}</div>
    </div>
  );
}
