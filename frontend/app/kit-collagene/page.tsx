import { KitPage } from "@/components/KitPage";

export default function Page({ searchParams }: { searchParams?: { preview?: string } }) {
  return <KitPage preview={searchParams?.preview === "1"} />;
}
