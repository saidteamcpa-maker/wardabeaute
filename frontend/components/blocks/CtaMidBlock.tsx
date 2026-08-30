"use client";

type Lang = "fr" | "ar";

interface CtaMidBlockProps {
  ctaLabel: string;
  trust?: string;
  lang?: Lang;
}

export function CtaMidBlock({ ctaLabel, trust, lang = "fr" }: CtaMidBlockProps) {
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const arrow = lang === "ar" ? "←" : "→";

  const scrollToOrder = () => {
    const el = document.getElementById("order");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = "#order";
  };

  return (
    <section dir={dir} className="py-8 md:py-12 bg-white">
      <div className="container-page flex flex-col items-center text-center gap-3">
        <button type="button" onClick={scrollToOrder} className="btn-primary btn-glow px-8 text-base gap-2" aria-label={ctaLabel}>
          {ctaLabel}
          <span aria-hidden="true">{arrow}</span>
        </button>
        {trust && <p className={`font-body text-gris text-xs md:text-sm ${lang === "ar" ? "font-arabic" : ""}`}>{trust}</p>}
      </div>
    </section>
  );
}
