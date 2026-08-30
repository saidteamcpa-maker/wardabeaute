import { WardaPage } from "@/components/WardaPage";
import { getLangServer } from "@/lib/lang-server";
import { getWardaPage } from "@/content/wardaContent";

export async function generateMetadata() {
  const lang = getLangServer();
  const data = getWardaPage("silkstop");
  const c = lang === "ar" ? data?.ar : data?.fr;
  const title = c?.hero.h1 ?? "SilkStop — Warda Beauté";
  const description = c?.hero.sub ?? "SilkStop sérum anti-repousse";
  return {
    title,
    description,
    openGraph: { title, description, locale: lang === "ar" ? "ar_MA" : "fr_FR", type: "website" },
    alternates: { languages: { fr: "/silkstop", ar: "/silkstop" } },
  };
}

export default function Page({ searchParams }: { searchParams?: { preview?: string } }) {
  return <WardaPage slug="silkstop" preview={searchParams?.preview === "1"} />;
}
