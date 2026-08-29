import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { ShieldCheck, Stethoscope, Truck, BadgeCheck, RotateCcw, HeartHandshake } from "lucide-react";
import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";

export function AssuranceBlock() {
  const lang = getLangServer();
  return (
    <section className="section bg-white">
      <div className="container-page">
        <Reveal>
          <h2 className="text-3xl text-profond mb-2 text-center">{t(lang, "ab.title")}</h2>
          <p className="font-body text-gris text-center mb-8">{t(lang, "ab.sub")}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          <Reveal>
            <div className="rounded-2xl border border-brume p-5 card-hover h-full">
              <div className="flex items-center gap-3 mb-3">
                <IconBadge icon={Stethoscope} tone="warda" size="sm" />
                <h3 className="font-display text-lg text-profond">{t(lang, "ab.safeTitle")}</h3>
              </div>
              <p className="font-body text-brun text-sm leading-relaxed">{t(lang, "ab.safeBody")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-brume p-5 card-hover h-full">
              <div className="flex items-center gap-3 mb-3">
                <IconBadge icon={BadgeCheck} tone="warda" size="sm" />
                <h3 className="font-display text-lg text-profond">{t(lang, "ab.halalTitle")}</h3>
              </div>
              <p className="font-body text-brun text-sm leading-relaxed">{t(lang, "ab.halalBody")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="rounded-2xl border border-brume p-5 card-hover h-full">
              <div className="flex items-center gap-3 mb-3">
                <IconBadge icon={ShieldCheck} tone="warda" size="sm" />
                <h3 className="font-display text-lg text-profond">{t(lang, "ab.guaranteeTitle")}</h3>
              </div>
              <p className="font-body text-brun text-sm leading-relaxed">{t(lang, "ab.guaranteeBody")}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-5 rounded-2xl bg-gradient-to-r from-petal to-ordoux/30 border border-brume/70 p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <IconBadge icon={Truck} tone="warda" size="sm" />
              <span className="font-display text-profond">{t(lang, "ab.codTitle")}</span>
            </div>
            <p className="font-body text-brun text-sm flex-1 leading-relaxed">{t(lang, "ab.codBody")}</p>
            <div className="flex items-center gap-2 text-warda font-body text-sm font-medium">
              <HeartHandshake className="w-4 h-4" />
              <RotateCcw className="w-4 h-4" />
              <span>{t(lang, "ab.trust")}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
