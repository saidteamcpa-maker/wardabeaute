import { Faq } from "@/components/Faq";
import { products } from "@/content/products";

export default function FaqPage() {
  const all = Object.values(products).flatMap((p) => p.faq);
  return (
    <div className="section">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl text-profond mb-6">FAQ</h1>
        <Faq items={all} />
      </div>
    </div>
  );
}
