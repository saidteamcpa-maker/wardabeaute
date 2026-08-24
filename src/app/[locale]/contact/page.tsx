'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import SiteShell from '@/components/SiteShell';
import { Link } from '@/i18n/routing';

export default function ContactPage() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const [sent, setSent] = useState(false);

  return (
    <SiteShell>
      <section className="bg-gradient-to-b from-petal/40 to-sand">
        <div className="container-wb py-14 text-center">
          <p className="eyebrow">{t('help')}</p>
          <h1 className="text-4xl font-bold text-profond sm:text-5xl">
            {locale === 'ar' ? 'تواصلي معنا' : 'Contactez-nous'}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/70">
            {locale === 'ar'
              ? 'فريق Warda Beauté يردّ عليك بسرعة عبر واتساب أو البريد.'
              : 'L’équipe Warda Beauté vous répond rapidement sur WhatsApp ou par e-mail.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-wb grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="card-wb flex items-center gap-4 p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white">💬</div>
              <div>
                <p className="font-semibold text-profond">WhatsApp</p>
                <p className="text-sm text-ink/60">+212 6 00 00 00 00 · réponse {'<'} 1h</p>
              </div>
            </a>
            <div className="card-wb flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warda text-2xl text-white">✉️</div>
              <div>
                <p className="font-semibold text-profond">E-mail</p>
                <p className="text-sm text-ink/60">hello@wardabeaute.com</p>
              </div>
            </div>
            <div className="card-wb flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-profond text-2xl text-white">🇲🇦</div>
              <div>
                <p className="font-semibold text-profond">{locale === 'ar' ? 'العنوان' : 'Adresse'}</p>
                <p className="text-sm text-ink/60">Casablanca, Maroc</p>
              </div>
            </div>
            <Link href="/faq" className="btn-secondary w-full justify-center">
              {locale === 'ar' ? 'الأسئلة الشائعة' : 'Voir la FAQ'}
            </Link>
          </div>

          <div className="card-wb p-6">
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-3xl text-white">✓</div>
                <p className="mt-3 font-semibold text-profond">
                  {locale === 'ar' ? 'تم إرسال رسالتك!' : 'Message envoyé !'}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-3"
              >
                <input className="input-wb" placeholder={locale === 'ar' ? 'الاسم' : 'Nom'} required />
                <input type="email" className="input-wb" placeholder="E-mail" required />
                <textarea className="input-wb min-h-[120px]" placeholder={locale === 'ar' ? 'رسالتك' : 'Votre message'} required />
                <button type="submit" className="btn-primary w-full">
                  {locale === 'ar' ? 'إرسال' : 'Envoyer'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
