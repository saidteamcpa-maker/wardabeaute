import { cn } from "@/lib/cn";
import Image from "next/image";
import { Reveal } from "./ui/Reveal";

// Text + image section. Desktop alternates sides; mobile always image-top.
export function Section({
  eyebrow,
  title,
  children,
  imageLabel,
  imageSrc,
  imageSide = "right",
  id,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  imageLabel: string;
  imageSrc?: string;
  imageSide?: "left" | "right";
  id?: string;
}) {
  return (
    <section className="section" id={id}>
      <Reveal>
        <div className="container-page grid md:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className={cn(imageSide === "right" ? "md:order-2" : "md:order-1")}>
            {imageSrc ? (
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-brume shadow-elevated">
                <Image src={imageSrc} alt={imageLabel} fill sizes="(max-width: 768px) 100vw, 50vw" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.03]" />
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-brume via-petal to-warda/30 aspect-[4/5] flex items-center justify-center text-center font-display text-2xl text-brun/70 px-6 shadow-subtle">
                {imageLabel}
              </div>
            )}
          </div>
          <div className={cn(imageSide === "right" ? "md:order-1" : "md:order-2")}>
            {eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-3">{eyebrow}</p>}
            {title && <h2 className="text-3xl md:text-4xl leading-[1.15] text-profond mb-4 text-balance">{title}</h2>}
            <div className="font-body text-brun space-y-4 leading-relaxed">{children}</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
