import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SampleImage } from "@/components/SampleImage";
import { IconBadge } from "@/components/ui/IconBadge";
import { Check } from "lucide-react";

type Lang = "fr" | "ar";

interface ProblemBlockProps {
  eyebrow?: string;
  h2: string;
  para: string;
  bullets?: [string, string, string] | string[];
  imageSrc?: string;
  lang?: Lang;
}

export function ProblemBlock({
  eyebrow = "On se comprend",
  h2,
  para,
  bullets = [],
  imageSrc,
  lang = "fr",
}: ProblemBlockProps) {
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const displayBullets = bullets.slice(0, 3);

  return (
    <section dir={dir} className="section bg-white">
      <div className="container-page">
        <Reveal>
          {eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center md:text-left">{eyebrow}</p>}
          <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-8 text-center md:text-left ${lang === "ar" ? "font-arabic" : ""}`}>{h2}</h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Reveal className="order-first">
            {imageSrc ? (
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-brume shadow-elevated">
                <Image
                  src={imageSrc}
                  alt={h2}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
            ) : (
              <SampleImage label={h2} ratio="aspect-[4/5]" />
            )}
          </Reveal>

          <Reveal delay={0.08}>
            <div className={lang === "ar" ? "font-arabic" : ""}>
              <p className="font-body text-brun leading-relaxed mb-6">{para}</p>

              {displayBullets.length > 0 && (
                <ul className="space-y-3 mb-8">
                  {displayBullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <IconBadge icon={Check} tone="warda" size="sm" className="mt-0.5 shrink-0" />
                      <span className="font-body text-brun text-sm md:text-[15px] leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-brume/50">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-brume grid place-items-center shrink-0 p-1.5">
                  <Image src="/favicon-32x32.png" alt="Warda Beauté" width={32} height={32} className="w-full h-full object-contain" />
                </div>
                <span className="font-display text-profond text-sm tracking-wide">Warda Beauté — Casablanca</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
