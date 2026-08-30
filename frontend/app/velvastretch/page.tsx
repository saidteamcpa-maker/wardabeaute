import { WardaPage } from "@/components/WardaPage";
import { getLangServer } from "@/lib/lang-server";
import { getWardaPage } from "@/content/wardaContent";

export async function generateMetadata() {
  const lang = getLangServer();
  const data = getWardaPage("velvastretch");
  const c = lang === "ar" ? data?.ar : data?.fr;
  const title = c?.hero.h1 ?? "VelvaStretch — Warda Beauté";
  const description = c?.hero.sub ?? "VelvaStretch crème anti-vergetures";
  return {
    title,
    description,
    openGraph: { title, description, locale: lang === "ar" ? "ar_MA" : "fr_FR", type: "website" },
    alternates: { languages: { fr: "/velvastretch", ar: "/velvastretch" } },
  };
}

export default function Page() {
  return <WardaPage slug="velvastretch" />;
}
