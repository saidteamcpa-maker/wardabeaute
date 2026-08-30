"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FaWhatsapp, FaPhoneAlt, FaShieldAlt, FaTruck } from "react-icons/fa";
import {
  PhoneCall,
  Package,
  Sparkles,
  Clock,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productList, bundle } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { usePageOverride } from "@/lib/use-page-override";

function Stars({ value }: { value: number }) {
  return (
    <span className="text-champagne">
      {"★".repeat(5)}
      <span className="sr-only">{value}</span>
    </span>
  );
}

export default function ConfirmationPage() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const upsell = params.get("upsell") === "1";
  const { lang } = useLang();
  const catalog = useCatalog();
  const ov = usePageOverride("confirmation");
  const C = (key: string, ar: string, fr: string) => {
    const o = ov?.[lang]?.[key];
    return o && o.trim() ? o : lang === "ar" ? ar : fr;
  };
  const A = (ar: string, fr: string) => (lang === "ar" ? ar : fr);
  const kitCat: any = catalog["kit-collagene"];
  const kitPrice = kitCat?.price ?? bundle.price;
  const kitOld = kitCat?.oldPrice ?? bundle.oldPrice;
  const kitSave = Math.max(0, (kitOld as number) - (kitPrice as number));

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lastOrder: any = mounted
    ? (() => {
        try {
          return JSON.parse(sessionStorage.getItem("warda-last-order") || "null");
        } catch {
          return null;
        }
      })()
    : null;

  const orderedSlugs: string[] = (lastOrder?.items || [])
    .map((i: any) => {
      const p =
        (i.slug && catalog[i.slug]) ||
        productList.find((x) => x.name === i.name) ||
        null;
      return p?.slug;
    })
    .filter(Boolean) as string[];

  const firstName =
    (lastOrder?.customer_name && lastOrder.customer_name.split(" ")[0]) ||
    (lang === "ar" ? "زبونة زوينة" : "belle cliente");
  const phone = lastOrder?.phone || "";

  const withinWindow = (() => {
    if (!mounted) return true;
    const hour = new Date().getHours();
    return hour >= 9 && hour < 22;
  })();

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212779754660";

  const buildMsg = () => {
    const lines = [A("🌹 سلام Warda Beauté، هادي متابعة للطلب ديالي", "🌹 Bonjour Warda Beauté, c'est suite à ma commande")];
    if (lastOrder?.id) lines.push(`🆔 ${A("رقم الطلب","Commande")} #${lastOrder.id}`);
    else if (id) lines.push(`🆔 ${A("رقم الطلب","Commande")} #${id}`);
    if (lastOrder) {
      lines.push(`👤 ${A("الاسم","Nom")}: ${lastOrder.customer_name}`);
      lines.push(`📱 ${A("الهاتف","Téléphone")}: ${lastOrder.phone}`);
      lines.push(`🏙️ ${A("المدينة","Ville")}: ${lastOrder.city}`);
      lines.push(`📍 ${A("العنوان","Adresse")}: ${lastOrder.address}`);
      lines.push(`🛒 ${A("المنتجات","Articles")}:`);
      lastOrder.items.forEach((it: any) =>
        lines.push(`- ${it.name} × ${it.qty} — ${it.price} MAD`)
      );
      lines.push(`💰 ${A("المجموع للدفع عند الاستلام","Total")}: ${lastOrder.total} MAD`);
    }
    if (upsell) lines.push(A("🎁 تم إضافة Kit Collagène بخصم (−49 درهم)", "🎁 Kit Collagène Inside & Outside ajouté (−49 MAD)"));
    return lines.join("\n");
  };

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(buildMsg())}`;

  if (!mounted) {
    return (
      <div className="section container-page text-center font-body text-brun">
        {A("جاري تحميل التأكيد ديالك…", "Chargement de votre confirmation…")}
      </div>
    );
  }

  const suggestions = productList.filter((p) => !orderedSlugs.includes(p.slug));
  const testimonials = orderedSlugs
    .flatMap((s) => catalog[s]?.testimonials || [])
    .slice(0, 3);
  const social =
    testimonials.length > 0 ? testimonials : productList[0].testimonials;

  return (
    <div className="section font-body text-brun">
      <div className="container-page max-w-3xl">
        {/* 1. BANNER — confirmation call promise */}
        <div className="rounded-2xl bg-profond text-white p-5 shadow-soft animate-pulseSoft">
          <p className="font-display text-2xl mb-1">
            {withinWindow ? (
              <>
                📞 {firstName}، {A("غادي نتصلو بيك فـ أقل من 10 دقائق !", "on vous appelle sous 10 minutes !")}
              </>
            ) : (
              <>{A("🌙 تم استلام طلبك — غادي نتصلو بيك غداً مع 9 صباحاً لتأكيده !", "🌙 Commande reçue — appel de confirmation demain dès 9h !")}</>
            )}
          </p>
          <p className="text-sm text-petal/90">
            {withinWindow
              ? A(
                  `غادي نتصلو بيك على ${phone} لتأكيد عنوان التوصيل.`,
                  `On vous appelle au ${phone} pour confirmer votre adresse ensemble.`
                )
              : A(
                  `غادي نتصلو بيك على الرقم ${phone} غداً صباحاً لتأكيد العنوان.`,
                  `Vous recevrez un appel au ${phone} demain matin pour confirmer votre adresse.`
                )}{" "}
            {A(
              "خلي هاتفك قريب منك 📱 · الرد على المكالمة = الشحن الفوري لطلبك.",
              "Gardez votre téléphone à portée de main 📱 · Répondre à l'appel = expédition immédiate."
            )}
          </p>
        </div>

        {/* 2. HERO */}
        <div className="text-center mt-8">
            {ov?.[lang]?.["confirm.bannerImage"] && (
              <div className="relative w-full aspect-[21/9] mb-6">
                <Image src={ov[lang]["confirm.bannerImage"]} alt="" fill sizes="(max-width: 768px) 100vw, 700px" className="object-cover rounded-3xl" />
              </div>
            )}
            <h1 className="font-display text-5xl leading-[1.1] text-profond mb-2">
              {C("confirm.title", "شكراً ليك", "Merci")} {firstName} ! 🌹
            </h1>
            <p className="text-lg">{C("confirm.message", "الطلب ديالك تسجل بنجاح.", "Votre commande est confirmée.")}</p>
            <p className="text-gris mt-1">{C("confirm.delivery", "التوصيل فـ 24 إلى 48 ساعة فكل مدن المغرب.", "Livraison 24–48h partout au Maroc.")}</p>
          <p className="text-lg">
            {A("الطلب ديالك", "Votre commande")}{" "}
            <span className="font-medium text-profond">
              #{lastOrder?.id || id || "—"}
            </span>{" "}
            {A("تسجل بنجاح.", "est bien enregistrée.")}
          </p>
          <p className="text-gris mt-1">
            📱 {A(`غادي نتصلو بيك على ${phone} لتأكيد العنوان قبل الشحن.`, `On vous appelle au ${phone} pour confirmer l'adresse avant l'expédition.`)}
          </p>
        </div>

        {/* 3. ORDER SUMMARY */}
        <div className="rounded-2xl bg-white border border-brume p-5 mt-6">
          <h2 className="font-display text-2xl leading-snug text-profond mb-3">
            {A("ملخص الطلب ديالك", "Votre commande")}
          </h2>
          <div className="divide-y divide-brume">
            {(lastOrder?.items || []).map((it: any, idx: number) => {
              const p =
                (it.slug && catalog[it.slug]) ||
                productList.find((x) => x.name === it.name) ||
                null;
              return (
                <div key={idx} className="flex items-center gap-3 py-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brume shrink-0">
                    {p ? (
                      <Image
                        src={p.image}
                        alt={it.name}
                        fill
                        sizes="56px"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-profond truncate">{it.name}</p>
                    <p className="text-sm text-gris">{A("الكمية :", "Quantité :")} {it.qty}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-profond font-medium">{it.price} MAD</p>
                  </div>
                </div>
              );
            })}
          </div>
          {(() => {
            const items = lastOrder?.items || [];
            const subtotalCalc = items.reduce(
              (s: number, it: any) => s + (it.price || 0),
              0
            );
            const discount = lastOrder?.upsellDiscount || 0;
            const totalCalc = subtotalCalc - discount;
            return (
              <div className="mt-3 pt-3 border-t border-brume space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gris">{A("المجموع الفرعي", "Sous-total")}</span>
                  <span>{subtotalCalc} MAD</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-warda">
                    <span>Kit Collagène Inside &amp; Outside (−{discount} MAD)</span>
                    <span>−{discount} MAD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gris">{A("التوصيل", "Livraison")}</span>
                  <span className="text-warda font-medium">{A("فابور مجاني 🚚", "Offerte 🚚")}</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-profond pt-1">
                  <span>{A("المجموع للدفع عند الاستلام", "Total à payer à la livraison")}</span>
                  <span>{totalCalc} MAD</span>
                </div>
              </div>
            );
          })()}
          <p className="text-xs text-gris mt-3 text-center">
            {A("💳 ما كتخلصي حتى كتوصلك الطلبية ليدك.", "💳 Vous ne payez que lorsque le colis arrive chez vous.")}
          </p>
        </div>

        {/* 4. TIMELINE — what happens now */}
        <div className="mt-8">
          <h2 className="font-display text-2xl leading-snug text-profond text-center mb-4">
            {A("المراحل القادمة لطلبك ✨", "Ce qui se passe maintenant ✨")}
          </h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-warda text-white">
                <PhoneCall className="w-5 h-5" />
              </span>
              <div>
                <p className="font-medium text-profond">
                  {withinWindow
                    ? A("مكالمة هاتفية للتأكيد فـ أقل من 10 دقائق", "Appel de confirmation sous 10 minutes")
                    : A("مكالمة هاتفية للتأكيد غداً ابتداءً من 9 صباحاً", "Appel de confirmation demain dès 9h")}
                </p>
                <p className="text-sm text-gris">
                  {A(
                    "كنأكدو معاك العنوان وكنجاوبوك على أي تساؤل. اتصال سريع باش توصلك طلبيتك فـ أحسن الظروف.",
                    "On vérifie votre adresse ensemble, on répond à vos questions. Pas de démarchage — juste pour livrer sans erreur."
                  )}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-warda text-white">
                <Package className="w-5 h-5" />
              </span>
              <div>
                <p className="font-medium text-profond">
                  {A("التحضير والتغليف فمختبراتنا فالدار البيضاء", "Préparation dans notre labo à Casablanca")}
                </p>
                <p className="text-sm text-gris">
                  {A(
                    "الطلب ديالك كيتغلف بكل عناية ونظافة ليكون جاهز للإرسال.",
                    "Votre commande est emballée avec soin, prête à partir."
                  )}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-warda text-white">
                <FaTruck className="w-4 h-4" />
              </span>
              <div>
                <p className="font-medium text-profond">
                  {A("الشحن السريع فـ 24 إلى 48 ساعة لجميع المدن", "Livraison 24–48h partout au Maroc")}
                </p>
                <p className="text-sm text-gris">
                  {A(
                    "كتخلصي نقداً للموزع ملي كتوصلك طلبيتك ليدك. ساهل وبلا حتى مخاطرة.",
                    "Vous payez le livreur à la réception. Simple et sans risque."
                  )}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-champagne text-white">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <p className="font-medium text-profond">
                  {A("بداية ظهور النتائج فـ 2 إلى 3 سيمانات", "Vos premiers résultats dès 2–3 semaines")}
                </p>
                <p className="text-sm text-gris">
                  {A(
                    "الأسبوع 2–3 : البشرة كتولي رطبة ومرنة. الأسبوع 4 : النتيجة كتولي واضحة. 🌹 متحمسين نشوفو إشراقتك وثقتك بنفسك !",
                    "Semaine 2–3 : la peau s'assouplit. Semaine 4 : le changement devient visible. 🌹 On hâte de vous revoir rayonnante !"
                  )}
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* 5. REASSURANCE TRIO */}
        <div className="grid sm:grid-cols-3 gap-3 mt-8">
          <div className="rounded-2xl bg-petal border border-brume p-4 text-center">
            <FaPhoneAlt className="w-6 h-6 text-warda mx-auto mb-2" />
            <p className="font-medium text-profond text-sm">{A("علاش كنتصلو بيك؟", "Pourquoi on appelle ?")}</p>
            <p className="text-xs text-gris mt-1">
              {A(
                "لتأكيد صحة العنوان وتفادي أي تأخير فالتوصيل.",
                "Pour confirmer votre adresse et éviter tout retard. Zéro spam."
              )}
            </p>
          </div>
          <div className="rounded-2xl bg-petal border border-brume p-4 text-center">
            <FaShieldAlt className="w-6 h-6 text-warda mx-auto mb-2" />
            <p className="font-medium text-profond text-sm">{A("الدفع عند الاستلام", "Paiement à la livraison")}</p>
            <p className="text-xs text-gris mt-1">
              {A(
                "ما كتخلصي حتى كتوصلك طلبيتك ليدك.",
                "Vous ne payez que quand le colis arrive chez vous."
              )}
            </p>
          </div>
          <div className="rounded-2xl bg-petal border border-brume p-4 text-center">
            <Clock className="w-6 h-6 text-warda mx-auto mb-2" />
            <p className="font-medium text-profond text-sm">{A("ضمان استرجاع 4 سيمانات", "Garantie 4 semaines")}</p>
            <p className="text-xs text-gris mt-1">
              {A(
                "ما عجباتكش النتيجة؟ كنرجعو ليك فلوسك كاملة بلا نقاش.",
                "Pas convaincue ? On rembourse, sans discussion."
              )}
            </p>
          </div>
        </div>

        {/* 6. SOCIAL PROOF */}
        <div className="mt-10">
          <h2 className="font-display text-2xl leading-snug text-profond text-center mb-2">
            {A("زبونات وثقو فـ Warda Beauté 🌹", "Elles ont dit oui à Warda 🌹")}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="badge-pill">{A("⭐ 4.9/5 من أكثر من 2600 تقييم", "⭐ 4.9/5 sur 2 662 avis")}</span>
            <span className="badge-pill">{A("🇲🇦 أكثر من 12000 زبونة", "🇲🇦 +12 000 clientes")}</span>
            <span className="badge-pill">{A("🚚 94% كيتوصلو فـ 48 ساعة", "🚚 94% livré en 48h")}</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {social.map((t: any, i: number) => (
              <div key={i} className="rounded-2xl bg-white border border-brume p-4">
                <Stars value={t.stars} />
                <p className="text-sm text-brun mt-2 italic">"{t.text}"</p>
                <p className="text-xs text-gris mt-2">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. CROSS-SELL — exclude ordered products */}
        {suggestions.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-2xl leading-snug text-profond text-center mb-1">
              {A("كمّلي الروتين ديالك 🌿", "Complétez votre rituel 🌿")}
            </h2>
            <p className="text-center text-gris text-sm mb-4">
              {A(
                "منتجات كيكملو روتين العناية بجمالك.",
                "Les clientes qui ont pris ça l'ont ajouté à leur routine."
              )}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {suggestions.map((p) => (
                <ProductCard key={p.slug} slug={p.slug} />
              ))}
            </div>
          </div>
        )}

        {suggestions.length === 0 && (
          <div className="mt-10 rounded-2xl bg-ordoux p-5 text-center">
            <h2 className="font-display text-2xl leading-snug text-profond mb-2">
              {A("الروتين الكامل : ", "Le rituel complet : ")}
              {bundle.name}
            </h2>
            {lang === "ar" && <p className="text-sm text-brun mb-3">{bundle.arSub}</p>}
            <p className="text-champagne font-medium mb-3">
              {kitPrice} MAD{" "}
              <span className="line-through text-gris text-sm">
                {kitOld} MAD
              </span>{" "}
              · {A("وفرتي", "économie")} {kitSave} MAD
            </p>
            <Link href="/kit-collagene" className="btn-primary inline-flex">
              {A("اكتشفي الباك", "Découvrir le kit")}
            </Link>
          </div>
        )}

        {/* 8. WHATSAPP CTA */}
        <div className="text-center mt-10">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FaWhatsapp className="w-5 h-5" /> {A("عندك سؤال؟ تواصلي معنا فالواتساب", "Une question ? WhatsApp")}
          </a>
          <div className="mt-4">
            <Link href="/collection" className="btn-outline inline-flex">
              {A("رجعي للمتجر", "Retour à la boutique")}
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky WhatsApp */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-4 left-4 z-[9999] bg-[#25D366] text-white w-14 h-14 rounded-full grid place-items-center shadow-soft hover:scale-105 transition"
      >
        <FaWhatsapp className="w-7 h-7" />
      </a>
    </div>
  );
}
