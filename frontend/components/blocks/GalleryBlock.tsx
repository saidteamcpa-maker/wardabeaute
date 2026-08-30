import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SampleImage } from "@/components/SampleImage";

type Lang = "fr" | "ar";

interface GalleryBlockProps {
  images?: string[];
  lang?: Lang;
  eyebrow?: string;
  h2?: string;
}

export function GalleryBlock({ images = [], lang = "fr", eyebrow, h2 }: GalleryBlockProps) {
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const items = images.slice(0, 8);
  const padded: (string | null)[] = [...items];
  while (padded.length < 6) padded.push(null);

  return (
    <section dir={dir} className="section bg-petal/30">
      <div className="container-page">
        {(eyebrow || h2) && (
          <Reveal>
            {eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{eyebrow}</p>}
            {h2 && <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-8 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{h2}</h2>}
          </Reveal>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {padded.map((src, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05}>
              {src ? (
                <div className="relative overflow-hidden rounded-2xl aspect-square bg-brume shadow-subtle group">
                  <Image
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
              ) : (
                <SampleImage label={`Image ${i + 1}`} ratio="aspect-square" className="shadow-subtle" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
