import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Clock3, Sparkles, ShieldCheck, Info, HeartHandshake } from "lucide-react";

type Lang = "fr" | "ar";

interface Milestone {
  label: string;
  desc: string;
}

interface TimelineBlockProps {
  eyebrow?: string;
  h2: string;
  milestones?: Milestone[];
  callouts?: [string, string] | string[];
  disclaimer?: string;
  afterImageSrc?: string;
  lang?: Lang;
}

const MILESTONE_ICONS = [Clock3, Sparkles, ShieldCheck] as const;

export function TimelineBlock({
  eyebrow,
  h2,
  milestones = [],
  callouts = [],
  disclaimer,
  afterImageSrc,
  lang = "fr",
}: TimelineBlockProps) {
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const displayMilestones = milestones.slice(0, 3);
  const displayCallouts = callouts.slice(0, 2);

  return (
    <section dir={dir} className="section bg-petal/40">
      <div className="container-page">
        <Reveal>
          {eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{eyebrow}</p>}
          <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-8 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{h2}</h2>
        </Reveal>

        {displayMilestones.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {displayMilestones.map((m, i) => {
              const Icon = MILESTONE_ICONS[i % MILESTONE_ICONS.length];
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="rounded-2xl bg-white border border-brume p-5 shadow-subtle card-hover h-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3 justify-center md:justify-start">
                      <IconBadge icon={Icon} tone="warda" size="sm" />
                      <h3 className={`font-display text-lg text-profond leading-tight ${lang === "ar" ? "font-arabic" : ""}`}>{m.label}</h3>
                    </div>
                    <p className="font-body text-brun text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {afterImageSrc ? (
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[21/9] bg-brume mb-6 shadow-subtle">
              <Image src={afterImageSrc} alt={h2} fill sizes="(max-width: 768px) 100vw, 1200px" className="object-cover" loading="lazy" />
            </div>
          </Reveal>
        ) : null}

        {displayCallouts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {displayCallouts.map((c, i) => {
              const Icon = i === 0 ? Info : HeartHandshake;
              return (
                <Reveal key={i} delay={0.1 + i * 0.06}>
                  <div className="rounded-xl bg-white border border-brume/70 p-4 flex gap-3 items-start shadow-card">
                    <IconBadge icon={Icon} tone={i === 0 ? "champagne" : "brume"} size="sm" className="shrink-0 mt-0.5" />
                    <p className={`font-body text-brun text-sm leading-relaxed ${lang === "ar" ? "font-arabic" : ""}`}>{c}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {disclaimer && (
          <Reveal delay={0.14}>
            <p className="font-body text-gris text-xs leading-relaxed text-center md:text-left border-t border-brume/40 pt-4 mt-2">{disclaimer}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
