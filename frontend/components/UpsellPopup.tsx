"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { t } from "@/content/ui";
import type { UpsellType } from "@/lib/upsell";
import { BUNDLE_DISCOUNT } from "@/lib/upsell";

const TIMER_SECONDS = 18;

interface UpsellPopupProps {
  info: Extract<UpsellType, { eligible: true }>;
  productName: string;
  productImage: string;
  onAccept: () => void;
  onReject: () => void;
}

export function UpsellPopup({ info, productName, productImage, onAccept, onReject }: UpsellPopupProps) {
  const { lang } = useLang();
  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closedRef = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAccept = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    onAccept();
  };

  const handleReject = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    onReject();
  };

  const isAddMissing = info.type === "add_missing";
  const saveAmount = BUNDLE_DISCOUNT;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-brun/60" onClick={handleReject} />
      <div className="relative bg-petal w-full max-w-[480px] max-h-[95vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-5 shadow-2xl">
        {/* Timer bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brume rounded-t-2xl md:rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-warda transition-all duration-1000 ease-linear"
            style={{ width: `${(seconds / TIMER_SECONDS) * 100}%` }}
          />
        </div>

        <button onClick={handleReject} className="absolute top-3 right-4 text-2xl text-brun z-10">
          ✕
        </button>

        <div className="mt-3 text-center">
          {/* Badge */}
          <span className="inline-block bg-warda/10 text-warda text-xs font-semibold px-3 py-1 rounded-full mb-3">
            🌹 {lang === "ar" ? "عرض خاص" : "Offre spéciale"}
          </span>

          {/* Product image */}
          <div className="flex justify-center mb-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-brume shadow-md">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Headline */}
          <h3 className="font-display text-xl text-profond mb-2">
            {isAddMissing
              ? lang === "ar"
                ? `زيدي ${productName} ووفّري ${saveAmount} MAD`
                : `Ajoutez ${productName} · −${saveAmount} MAD`
              : lang === "ar"
                ? ` كتوفّري ${saveAmount} MAD على الدوو`
                : `Vous économisez ${saveAmount} MAD sur le duo`}
          </h3>

          {/* Body */}
          <p className="text-sm text-gris mb-4">
            {isAddMissing
              ? lang === "ar"
                ? "الجمال من الداخل + من لبراني. مع بعض، كتوفّري 49 MAD."
                : t(lang, "co.upsellBody")
              : lang === "ar"
                ? "عندك الدو كامل — كنهاديو ليك −49 MAD على الطلب ديالك."
                : t(lang, "co.upsellBoth").replace("{discount}", String(saveAmount))}
          </p>

          {/* Pricing */}
          <div className="bg-warda/5 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center text-sm text-gris mb-1">
              <span>{lang === "ar" ? "الثمن الأصلي" : "Prix original"}</span>
              <span className="line-through">{info.originalTotal} MAD</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-warda">
              <span>{lang === "ar" ? "الثمنていき مع العرض" : "Prix promotionnel"}</span>
              <span>{info.bundleTotal} MAD</span>
            </div>
            <div className="mt-2 text-center text-sm font-semibold text-warda">
              {lang === "ar" ? `كترشدي ${saveAmount} MAD` : `Économisez ${saveAmount} MAD`}
            </div>
          </div>

          {/* Product info for add_missing */}
          {isAddMissing && (
            <p className="text-sm text-brun mb-4">
              {lang === "ar"
                ? `${productName} — الثمن: ${info.type === "add_missing" ? (info.bundleTotal - 279) : 319} MAD`
                : `${productName} — ${info.bundleTotal - 279} MAD`}
            </p>
          )}

          {/* Countdown */}
          <p className="text-xs text-gris mb-4">
            {lang === "ar"
              ? `كيغبر فـ ${seconds} ثانية`
              : t(lang, "co.upsellSave")
                  .replace("{discount}", String(saveAmount))
                  .replace("{sec}", String(seconds))}
          </p>

          {/* CTAs */}
          <button
            onClick={handleAccept}
            className="btn-primary w-full mb-2 text-base"
          >
            {isAddMissing
              ? lang === "ar"
                ? `زيدي ${productName}`
                : t(lang, "co.upsellAdd")
                    .replace("{name}", productName)
                    .replace("{discount}", String(saveAmount))
              : lang === "ar"
                ? `طبّقي −${saveAmount} MAD`
                : t(lang, "co.upsellApply").replace("{discount}", String(saveAmount))}
          </button>

          <button
            onClick={handleReject}
            className="w-full text-sm text-gris hover:text-brun py-2 transition-colors"
          >
            {t(lang, "co.upsellNo")}
          </button>
        </div>
      </div>
    </div>
  );
}
