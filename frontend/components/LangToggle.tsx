"use client";

import { useLang } from "@/components/LangProvider";
import type { Lang } from "@/lib/lang-client";

// France: vertical tricolor
const FR_FLAG =
  "linear-gradient(90deg, #0055A4 0 33.33%, #FFFFFF 33.33% 66.66%, #EF4135 66.66% 100%)";
// Morocco: red field with a green five-pointed star
const MA_FLAG = "#C1272D";
const MA_STAR =
  "11,3 12.88,8.41 18.61,8.53 14.04,11.99 15.70,17.47 11,14.2 6.30,17.47 7.96,11.99 3.39,8.53 9.12,8.41";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      dir="ltr"
      className="relative flex shrink-0 items-stretch h-7 rounded-full overflow-hidden shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* AR — Moroccan flag fills the entire left half */}
      <button
        type="button"
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        aria-label="العربية"
        title="العربية"
        className="relative w-8 h-7 min-h-0 p-0 flex items-center justify-center transition"
        style={{ background: MA_FLAG }}
      >
        <svg
          viewBox="0 0 22 22"
          aria-hidden
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <polygon points={MA_STAR} fill="#006233" />
        </svg>
        <span className="relative z-10 text-[10px] font-bold leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          AR
        </span>
      </button>

      {/* FR — French flag fills the entire right half */}
      <button
        type="button"
        onClick={() => setLang("fr")}
        aria-pressed={lang === "fr"}
        aria-label="Français"
        title="Français"
        className="relative w-8 h-7 min-h-0 p-0 flex items-center justify-center border-l border-white/50 transition"
        style={{ backgroundImage: FR_FLAG }}
      >
        <span className="relative z-10 text-[10px] font-bold leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          FR
        </span>
      </button>

      {/* Dynamic sliding active indicator */}
      <span
        aria-hidden
        className={`pointer-events-none absolute top-0 bottom-0 left-0 w-1/2 rounded-full ring-2 ring-white/80 z-20 transition-transform duration-300 ease-out ${
          lang === "ar" ? "translate-x-0" : "translate-x-full"
        }`}
      />
    </div>
  );
}
