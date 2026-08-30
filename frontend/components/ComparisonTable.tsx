import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { Check, X } from "lucide-react";
import { productsAr } from "@/content/productsAr";
import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";

type Row = { criterion: string; warda: string; other: string };

const DATA: Record<string, { vs: string; rows: Row[] }> = {
  velvastretch: {
    vs: "vs les crèmes / huiles classiques en pharmacie",
    rows: [
      { criterion: "Mode d'action", warda: "Collagène marin + Centella, agit dans le derme", other: "Reste en surface (huiles / minéraux)" },
      { criterion: "Pendant grossesse & allaitement", warda: "Oui — formule sans retinol", other: "Souvent au retinol (déconseillé)" },
      { criterion: "Naturel & sans paraben", warda: "Oui, certifié halal & vegan", other: "Composition variable" },
      { criterion: "Prix", warda: "Juste, marque marocaine", other: "Produits importés souvent plus chers" },
    ],
  },
  silkstop: {
    vs: "vs les crèmes dépilatoires chimiques",
    rows: [
      { criterion: "Action", warda: "Ralentit la repousse, apaise la peau", other: "Brûle le poil, irrite" },
      { criterion: "Peau sensible / méditerranéenne", warda: "Pensé pour calmer rougeurs & poils incarnés", other: "Souvent responsable de rougeurs" },
      { criterion: "Texture", warda: "Non grasse, parfumée (lavande & jasmin)", other: "Odeur forte, résidu" },
      { criterion: "Usage", warda: "Après chaque épilation, naturel", other: "Dépilation chimique agressive" },
    ],
  },
  collaglow: {
    vs: "vs une crème au collagène",
    rows: [
      { criterion: "Absorption", warda: "Collagène marin hydrolysé, absorbé (biodisponible)", other: "Molécule trop grande, ne traverse pas la peau" },
      { criterion: "Vitamine C", warda: "Cofacteur inclus pour la synthèse", other: "Absente" },
      { criterion: "Halal & vegan", warda: "Base pectine, sans gélatine animale", other: "Souvent gélatine animale" },
      { criterion: "Cible", warda: "Peau + cheveux + ongles, de l'intérieur", other: "Surface seulement" },
    ],
  },
  "kit-collagene": {
    vs: "vs un seul produit ou le laser",
    rows: [
      { criterion: "Fronts d'action", warda: "Extérieur + intérieur, en synergie", other: "Un seul côté à la fois" },
      { criterion: "Sécurité", warda: "Sans retinol, halal & vegan", other: "Laser coûteux, retinol déconseillé enceinte" },
      { criterion: "Prix", warda: "549 MAD les deux produits", other: "Séances laser : milliers de MAD" },
      { criterion: "Engagement", warda: "Garantie 4 semaines ou remboursé", other: "Laser : aucun remboursement" },
    ],
  },
};

export function ComparisonTable({ slug }: { slug: string }) {
  const lang = getLangServer();
  const data =
    lang === "ar"
      ? productsAr[slug]?.comparison
      : DATA[slug];
  if (!data) return null;
  return (
    <div className="mt-5">
      <p className="text-sm text-gris italic mb-3 leading-relaxed">{data.vs}</p>
      <div className="overflow-hidden rounded-2xl border border-brume shadow-subtle">
        <div className="grid grid-cols-3 bg-gradient-to-r from-brume/50 to-petal text-profond font-display text-sm">
          <div className="p-3.5 font-medium leading-tight">{t(lang, "cmp.criterion")}</div>
          <div className="p-3.5 text-warda font-medium leading-tight">Warda Beauté</div>
          <div className="p-3.5 font-medium leading-tight">{t(lang, "cmp.alt")}</div>
        </div>
        {data.rows.map((r, i) => (
          <div key={r.criterion} className={`grid grid-cols-3 text-sm border-t border-brume/50 transition-colors duration-150 hover:bg-petal/40 ${i % 2 ? "bg-white" : "bg-petal/20"}`}>
            <div className="p-3.5 font-medium text-brun leading-snug">{r.criterion}</div>
            <div className="p-3.5 text-brun flex items-start gap-2.5">
              <IconBadge icon={Check} tone="warda" size="sm" className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">{r.warda}</span>
            </div>
            <div className="p-3.5 text-gris flex items-start gap-2.5">
              <IconBadge icon={X} tone="profond" size="sm" className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">{r.other}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
