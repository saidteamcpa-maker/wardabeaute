import { WardaPage } from "@/components/WardaPage";
import { getLangServer } from "@/lib/lang-server";
import { getWardaPage } from "@/content/wardaContent";

export async function generateMetadata() {
  const lang = getLangServer();
  const data = getWardaPage("kit-collagene");
  const c = lang === "ar" ? data?.ar : data?.fr;
  const title = c?.hero.h1 ?? "Kit Collagène — Warda Beauté";
  const description = c?.hero.sub ?? "Kit Collagène Inside & Outside";
  return {
    title,
    description,
    openGraph: { title, description, locale: lang === "ar" ? "ar_MA" : "fr_FR", type: "website" },
    alternates: { languages: { fr: "/kit-collagene", ar: "/kit-collagene" } },
  };
}

export default function Page({ searchParams }: { searchParams?: { preview?: string } }) {
  return <WardaPage slug="kit-collagene" preview={searchParams?.preview === "1"} />;
}
