"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SampleImage } from "@/components/SampleImage";

type Lang = "fr" | "ar";

interface HeroBlockProps {
  eyebrow?: string;
  h1: string;
  sub: string;
  pills?: [string, string, string] | string[];
  ctaLabel: string;
  trust?: string;
  imageSrc?: string;
  videoSrc?: string;
  floatingImageSrc?: string;
  lang?: Lang;
}

export function HeroBlock({
  eyebrow,
  h1,
  sub,
  pills = [],
  ctaLabel,
  trust,
  imageSrc,
  videoSrc,
  floatingImageSrc,
  lang = "fr",
}: HeroBlockProps) {
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const arrow = lang === "ar" ? "←" : "→";

  const scrollToOrder = () => {
    const el = document.getElementById("order");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = "#order";
  };

  const displayPills = pills.slice(0, 3);
  const floatingSrc = floatingImageSrc || imageSrc;

  return (
    <section dir={dir} className="section relative overflow-hidden bg-gradient-to-b from-petal via-white to-petal/40">
      <div className="container-page grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Text */}
        <Reveal className={lang === "ar" ? "md:order-2" : "md:order-1"}>
          <div className={lang === "ar" ? "font-arabic" : ""}>
            {eyebrow && <p className="badge-pill mb-3 inline-block">{eyebrow}</p>}
            <h1 className="text-4xl md:text-5xl leading-[1.05] text-profond mb-4">
              <span className="text-gradient">{h1}</span>
            </h1>
            <p className="font-body text-brun leading-relaxed text-[15px] md:text-base mb-5">{sub}</p>

            {displayPills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {displayPills.map((pill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-profond text-white border border-profond px-4 py-1.5 text-sm font-body font-medium shadow-subtle"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={scrollToOrder}
              className="btn-primary btn-glow w-full sm:w-auto gap-2 text-base px-8"
              aria-label={ctaLabel}
            >
              {ctaLabel}
              <span aria-hidden="true" className="transition-transform duration-200">
                {arrow}
              </span>
            </button>

            {trust && (
              <p className="font-body text-gris text-xs md:text-sm mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulseSoft" aria-hidden="true" />
                {trust}
              </p>
            )}
          </div>
        </Reveal>

        {/* Media */}
        <Reveal delay={0.12} className={lang === "ar" ? "md:order-1 order-first" : "md:order-2 order-first"}>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-brume shadow-elevated">
              {videoSrc ? (
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-label={h1}
                />
              ) : imageSrc ? (
                <Image src={imageSrc} alt={h1} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              ) : (
                <SampleImage label={h1} ratio="aspect-[4/5]" className="rounded-none" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-profond/10 via-transparent to-transparent" />
            </div>

            {floatingSrc ? (
              <div
                className={`absolute -bottom-5 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-elevated bg-white hidden sm:block ${
                  dir === "rtl" ? "left-3 md:left-4" : "right-3 md:right-4"
                }`}
                aria-hidden="true"
              >
                <Image src={floatingSrc} alt="" fill sizes="160px" className="object-cover" />
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
