import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";
import { sanitizeHtml } from "@/lib/safe-html";
import Image from "next/image";

export default async function PolitiqueRetour({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride("retour", lang, searchParams?.preview === "1");
  const T = (k: string, fk?: string) => ov?.[k] || t(lang, fk ?? k);
  const bodyHtml = ov?.["policy.body"];
  const fr = (
    <>
      <p className="mt-2">
        Chez Warda Beauté, la satisfaction de la cliente est notre priorité. Nos produits sont fabriqués au Maroc
        et testés dermatologiquement. Voici nos conditions d&apos;échange, de retour et de remboursement.
      </p>
      <section>
        <h2 className="text-2xl text-profond mb-2">À la réception de la commande</h2>
        <p>
          Il est recommandé à la cliente de vérifier sa commande au moment de la livraison,{" "}
          <strong>avant de procéder au paiement</strong> (paiement 100% à la livraison).
        </p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Notre garantie 4 semaines</h2>
        <p>
          Vous n&apos;êtes pas satisfaite après un usage quotidien pendant <strong>4 semaines (28 jours)</strong> ?
          Nous remboursons, sans questions. C&apos;est notre promesse : des résultats visibles, ou votre argent
          vous est rendu.
        </p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Demande d&apos;échange ou de retour</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>La cliente doit contacter Warda Beauté dans un délai de <strong>28 jours suivant la réception</strong> de la commande.</li>
          <li>Les articles offerts gratuitement ou achetés en promotion ne sont pas éligibles au remboursement.</li>
          <li>Le délai de traitement des échanges est de <strong>7 à 14 jours</strong>.</li>
          <li>Le délai de traitement des remboursements est de <strong>14 à 20 jours</strong>.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Échange</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Si l&apos;article est endommagé à la réception ou en cas d&apos;erreur de Warda Beauté, l&apos;échange est gratuit (preuves requises).</li>
          <li>Si l&apos;échange est demandé suite à une erreur de la cliente, les frais de retour seront à la charge de la cliente.</li>
          <li>Si l&apos;article est en rupture de stock, un code promo de la <strong>même valeur</strong> sera attribué, valable <strong>6 mois</strong>.</li>
          <li>Si l&apos;échange concerne un article de moindre valeur, la différence sera remboursée sous forme de code promo, valable 6 mois.</li>
          <li>Le nombre d&apos;échanges autorisé est limité à <strong>deux par commande</strong>.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Retour &amp; remboursement</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>L&apos;article doit être intact, non ouvert (scellé), et retourné dans son emballage d&apos;origine.</li>
          <li>L&apos;article sera récupéré par un livreur, puis inspecté avant validation du remboursement.</li>
          <li>Des frais de retour seront déduits du montant du remboursement.</li>
          <li>Le remboursement sera réglé en <strong>espèces</strong> ou par virement sur le compte bancaire communiqué.</li>
          <li>La demande de remboursement ne sera acceptée que si aucun échange n&apos;a été accordé au préalable.</li>
          <li>Warda Beauté se réserve le droit de refuser tout remboursement si l&apos;article retourné est endommagé, incomplet ou utilisé.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Livraison</h2>
        <p>
          🚚 Livraison gratuite partout au Maroc sous <strong>24–48h</strong>. 💳 Paiement 100% à la livraison —
          vous ne payez qu&apos;à réception. 🌹 Produits fabriqués au Maroc, testés dermatologiquement.
        </p>
      </section>
    </>
  );
  const ar = (
    <>
      <p className="mt-2">
        فـ Warda Beauté، رضا الزبونة وثقتها هما أولويتنا الأولى. المنتجات ديالنا مصنوعة فالمغرب بمكونات طبيعية ومجربة ديرماتولوجياً. هادو هما الشروط الواضحة ديالنا للتبديل، الإرجاع، واسترداد الأموال.
      </p>
      <section>
        <h2 className="text-2xl text-profond mb-2">عند استلام الطلب</h2>
        <p>
          كننصحو كل زبونة تعاين وتراقب الطلب ديالها وقت التوصيل مع الموزع، <strong>قبل ما تخلص</strong> (الدفع 100% عند الاستلام).
        </p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">ضمان الرضا لمدة 4 سيمانات</h2>
        <p>
          إيلا استعملتي المنتج بانتظام يومياً لمدة <strong>4 سيمانات (28 يوم)</strong> وما كنتيش راضية على النتيجة، كنرجعو ليك فلوسك كاملة بلا نقاش. هادا هو وعدنا الصادق: نتائج واضحة، ولا فلوسك ترجع ليك.
        </p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">طلب التبديل أو الإرجاع</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>الزبونة كتقدر تتواصل مع فريق Warda Beauté فأجل أقصاه <strong>28 يوم من تاريخ استلام</strong> الطلب.</li>
          <li>الهدايا الترويجية المجانية غير قابلة للاسترجاع النقدي.</li>
          <li>مدة معالجة وتبديل المنتج هي من <strong>7 إلى 14 يوم عمل</strong>.</li>
          <li>مدة معالجة واسترجاع الأموال هي من <strong>14 إلى 20 يوم عمل</strong>.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">شروط التبديل</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>إيلا وصلك المنتج متضرر أو وقع خطأ من طرف Warda Beauté، فالتبديل كيكون مجاني وفابور 100% (مع إرسال صورة توضيحية).</li>
          <li>إيلا كان التبديل بطلب وتغيير رأي من الزبونة، فمصاريف شحن الإرجاع كتكون على حساب الزبونة.</li>
          <li>فـ حالة نفاذ المخزون للمنتج المراد استبداله، كنعطيو كود تخفيض بنفس <strong>القيمة المالية</strong> صالح لمدة <strong>6 أشهر</strong>.</li>
          <li>إيلا تم التبديل بمنتج أقل ثمناً، فالفرق كيرجع على شكل كود تخفيض صالح لمدة 6 أشهر.</li>
          <li>عدد مرات التبديل المسموح بها هو <strong>مرتين كحد أقصى لكل طلب</strong>.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">الإرجاع واسترداد الأموال</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>المنتج خاصو يكون سليم، غير مفتوح، ومغلق بإحكام فـ التغليف والعلبة الأصلية ديالو.</li>
          <li>عامل التوصيل كيتسلم المنتج، ومن بعد كيتفحص من طرف الفريق قبل تأكيد إرجاع المبلغ.</li>
          <li>مصاريف خدمة التوصيل للإرجاع كتتخصم من المبلغ المسترد.</li>
          <li>استرداد المبلغ كيكون إما <strong>نقداً (كاش)</strong> أو عبر تحويل بنكي للحساب المعتمد.</li>
          <li>طلب استرجاع الأموال كيكون متاح فـ حالة عدم الاستفادة من تبديل مسبق لنفس الطلب.</li>
          <li>Warda Beauté كتحتافظ بحق رفض استرجاع أي منتج مستعمل، مفتوح، أو متضرر من طرف الزبونة.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">التوصيل</h2>
        <p>
          🚚 توصيل فابور وسريع لجميع مدن ومناطق المغرب فـ <strong>24 إلى 48 ساعة</strong>. 💳 الدفع 100% عند الاستلام —
          ما كتخلصي حتى كتوصلك طلبيتك ليدك. 🌹 منتجات مصنوعة فالمغرب بعناية ومجربة عند أطباء الجلد.
        </p>
      </section>
    </>
  );
  return (
    <div className="section">
      {ov?.["policy.bannerImage"] && (
        <div className="container-page mb-6">
          <div className="relative w-full aspect-[21/9]">
            <Image src={ov["policy.bannerImage"]} alt="" fill sizes="(max-width: 768px) 100vw, 1000px" className="object-cover rounded-3xl" />
          </div>
        </div>
      )}
      <div className="container-page max-w-3xl font-body text-brun space-y-6">
        <div>
          <h1 className="text-4xl leading-snug text-profond">{T("policy.title", "returnPage.title")}</h1>
          {bodyHtml ? (
            <div className="space-y-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(bodyHtml) }} />
          ) : lang === "ar" ? ar : fr}
        </div>
      </div>
    </div>
  );
}
