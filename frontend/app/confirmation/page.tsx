"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/content/products";

function ConfirmationInner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const upsell = params.get("upsell") === "1";
  const cross = Object.keys(products).slice(0, 3);

  return (
    <div className="section">
      <div className="container-page max-w-2xl text-center">
        <h1 className="text-4xl text-profond mb-2">شكراً! طلبيتك مسجلة 🌹</h1>
        {id && <p className="font-body text-brun">رقم طلبيتك: <span className="font-medium text-profond">#{id}</span></p>}
        <p className="font-body text-brun mt-3">
          غادي نتصلو بيك خلال ساعة واحدة باش نأكدو طلبيتك. التوصيل: 24–48 ساعة بعد التأكيد.
        </p>
        <div className="rounded-2xl bg-white border border-brume p-5 mt-5 text-left font-body text-brun">
          <p>💳 الدفع عند الاستلام</p>
          <p>🚚 التوصيل خلال 24–48 ساعة (86% de nos clientes confirment sous 4h)</p>
          <p>↩️ Garantie 4 semaines ou remboursé</p>
          {upsell && <p className="text-champagne mt-2">🎁 Mini Soin Warda ajouté à votre commande (+99 MAD)</p>}
        </div>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000"}?text=${encodeURIComponent("سلام 🌹 تأكيد الطلبية #" + id)}`}
          target="_blank"
          className="btn-primary mt-5 inline-flex"
        >
          مراسلتنا على واتساب
        </a>

        <h2 className="text-2xl text-profond mt-10 mb-4">النساء اللي شراو هاد المنتج شراو أيضاً</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
          {cross.map((s) => <ProductCard key={s} slug={s} />)}
        </div>
        <Link href="/collection" className="btn-outline mt-8 inline-flex">Retour à la boutique</Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="section container-page text-center">Chargement...</div>}>
      <ConfirmationInner />
    </Suspense>
  );
}
