'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/components/cart/CartProvider';
import { formatMAD, getCheckoutUpsell } from '@/lib/data/catalog';
import { isValidMaPhone, normalizeMaPhone } from '@/lib/phone';

type Step = 'form' | 'upsell' | 'thanks';

export default function CheckoutPopup() {
  const { items, total, checkoutOpen, closeCheckout, addUpsell, clear } = useCart();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations();

  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [addedUpsell, setAddedUpsell] = useState(false);
  const [liveCount, setLiveCount] = useState(3);
  const [timer, setTimer] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const upsell = getCheckoutUpsell(items.map((i) => i.sku));

  useEffect(() => {
    if (checkoutOpen) {
      setStep('form');
      setSubmitting(false);
      setAddedUpsell(false);
      setPhoneError('');
      setTimer(15);
    }
  }, [checkoutOpen]);

  useEffect(() => {
    const id = setInterval(() => setLiveCount(2 + Math.floor(Math.random() * 6)), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!checkoutOpen) return null;

  const submit = async () => {
    if (name.trim().length < 2) {
      setPhoneError(t('Popup.nameRequired'));
      return;
    }
    if (!isValidMaPhone(phone)) {
      setPhoneError(t('Popup.invalidPhone'));
      return;
    }
    setPhoneError('');
    setStep('upsell');

    const countdown = { s: 15 };
    setTimer(countdown.s);
    timerRef.current = setInterval(() => {
      countdown.s -= 1;
      setTimer(countdown.s);
      if (countdown.s <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        finalize(false);
      }
    }, 1000);
  };

  const finalize = async (withUpsell: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);

    if (withUpsell && upsell) {
      addUpsell({
        sku: upsell.sku,
        slug: upsell.slug,
        nameFr: upsell.nameFr,
        nameAr: upsell.nameAr,
        price: upsell.price,
        qty: 1,
        image: upsell.image,
        offerId: 'upsell99',
        offerLabelFr: 'Offre exclusive',
        offerLabelAr: 'عرض حصري',
      });
      setAddedUpsell(true);
    }

    const orderItems = items.map((i) => ({
      sku: i.sku,
      nameFr: i.nameFr,
      nameAr: i.nameAr,
      price: i.price,
      qty: i.qty,
    }));

    if (withUpsell && upsell) {
      orderItems.push({
        sku: upsell.sku,
        nameFr: upsell.nameFr,
        nameAr: upsell.nameAr,
        price: upsell.price,
        qty: 1,
      });
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: normalizeMaPhone(phone),
          items: orderItems,
          source: 'popup',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setOrderNumber(data.orderNumber);
        setStep('thanks');
        clear();
      } else {
        setPhoneError(t('Popup.error'));
        setStep('form');
      }
    } catch {
      setPhoneError(t('Popup.error'));
      setStep('form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-soft sm:rounded-3xl">
        <button
          onClick={closeCheckout}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-10 text-2xl text-ink/50"
        >
          ×
        </button>

        {step === 'form' && (
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-warda">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
              {t('Popup.liveBuyers', { n: liveCount })}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-profond">
              {t('Popup.title')}
            </h2>

            <div className="mt-4 rounded-xl2 bg-petal/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-profond">
                {t('Popup.summary')}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between">
                    <span className="text-ink/80">
                      {locale === 'ar' ? i.nameAr : i.nameFr}
                      {i.offerLabelFr ? ` · ${locale === 'ar' ? i.offerLabelAr : i.offerLabelFr}` : ''} × {i.qty}
                    </span>
                    <span className="font-medium">{formatMAD(i.price * i.qty, locale)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-warda/20 pt-2 font-bold text-warda">
                <span>{t('Popup.total')}</span>
                <span>{formatMAD(total, locale)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <input
                className="input-wb"
                placeholder={t('Popup.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <input
                  className="input-wb"
                  placeholder={t('Popup.phonePlaceholder')}
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
              </div>
            </div>

            <button
              onClick={submit}
              disabled={submitting}
              className="btn-primary mt-4 w-full"
            >
              {submitting ? t('Popup.submitting') : t('Popup.submit')}
            </button>
            <p className="mt-2 text-center text-xs text-ink/50">{t('Popup.secure')}</p>
            <p className="mt-1 text-center text-xs font-medium text-warda">
              ✓ {t('Popup.socialProof')}
            </p>
          </div>
        )}

        {step === 'upsell' && (
          <div className="p-6 text-center">
            <span className="inline-block rounded-full bg-warda px-3 py-1 text-xs font-semibold text-white">
              {t('Popup.upsellTitle')}
            </span>
            {upsell && (
              <div className="mt-4 flex items-center gap-4 rounded-xl2 bg-petal/20 p-4 text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={upsell.image} alt={upsell.nameFr} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-display text-lg font-semibold text-profond">
                    {locale === 'ar' ? upsell.nameAr : upsell.nameFr}
                  </p>
                  <p className="text-sm text-ink/70">{t('Popup.upsellBody')}</p>
                  <p className="mt-1 text-lg font-bold text-warda">99 MAD</p>
                </div>
              </div>
            )}
            <p className="mt-3 text-xs text-ink/50">
              {t('Popup.upsellTimer', { s: timer })}
            </p>
            <button
              onClick={() => finalize(true)}
              className="btn-primary mt-3 w-full"
            >
              {t('Popup.upsellAdd')}
            </button>
            <button
              onClick={() => finalize(false)}
              className="mt-2 w-full text-sm text-ink/60 underline"
            >
              {t('Popup.upsellSkip')}
            </button>
          </div>
        )}

        {step === 'thanks' && (
          <div className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">
              ✓
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-profond">
              {t('Popup.thanks')}
            </h2>
            <p className="mt-2 text-sm text-ink/70">{t('Popup.thanksBody')}</p>
            <p className="mt-3 text-sm">
              {t('Popup.orderNumber')}: <span className="font-bold text-warda">{orderNumber}</span>
            </p>
            <button
              onClick={() => {
                closeCheckout();
                router.push(`/confirmation?order=${orderNumber}`);
              }}
              className="btn-primary mt-5 w-full"
            >
              {t('Popup.viewOrder')}
            </button>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-2 w-full"
            >
              {t('Popup.whatsapp')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
