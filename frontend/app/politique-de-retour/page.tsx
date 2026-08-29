import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";
import { sanitizeHtml } from "@/lib/safe-html";
import Image from "next/image";

export default async function PolitiqueRetour({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride("retour", lang, searchParams?.preview === "1");
  const T = (k: string, fk?: string) => ov?.[k] ?? t(lang, fk ?? k);
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
        عند Warda Beauté، رضا الزبونة هو الأولوية ديالنا. المنتوجات ديالنا مصنوعين فالمغرب ومجرّبين ديرماتولوجياً. ها هادي الشروط ديالنا للتبديل، الرجوع، والرجوع ديال الفلوس.
      </p>
      <section>
        <h2 className="text-2xl text-profond mb-2">كيف توصلك الكوماندة</h2>
        <p>
          كننصحو الزبونة تشوف الكوماندة ديالها وقت التوصيل، <strong>قبل ما تخلص</strong> (الخلاص 100% عند الاستلام).
        </p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">الضمان ديالنا 4 سيمان</h2>
        <p>
          ما عجبكش من بعد الاستعمال اليومي لمدة <strong>4 سيمان (28 نهار)</strong>؟ كنرجعو ليك الفلوس بلا حتى سؤال. هادي هي الالتزام ديالنا: نتائج باينين، ولا فلوسك ترجع ليك.
        </p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">طلب التبديل ولا الرجوع</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>الزبونة خاصها تتصل بـ Warda Beauté فأجل <strong>28 نهار من بعد التوصيل</strong> ديال الكوماندة.</li>
          <li>المنتوجات المعطاة بالخاوة ولا المشراة فالبروموسيون ما كيترجعش ليهوم الفلوس.</li>
          <li>مدة معالجة التبديل هي <strong>7 لـ 14 نهار</strong>.</li>
          <li>مدة معالجة الرجوع ديال الفلوس هي <strong>14 لـ 20 نهار</strong>.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">التبديل</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>كان المنتوج تضرر فالتوصيل ولا غلطة من عند Warda Beauté، التبديل مجاني (خاص الإثبات).</li>
          <li>كان التبديل بسبب غلطة ديال الزبونة، مصاريف الرجوع عليها.</li>
          <li>كان المنتوج نقص فالستوك، كنعطيو كود بريمو بنفس <strong>القيمة</strong>، صالح لمدة <strong>6 شهور</strong>.</li>
          <li>كان التبديل بمنتوج أرخص، الفرق كيرجع كود بريمو بنفس القيمة، صالح 6 شهور.</li>
          <li>عدد التبديلات المسموحة محدود فـ <strong>جوج فالكوماندة</strong>.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">الرجوع والرجوع ديال الفلوس</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>المنتوج خاص يكون سالم، مفتوحش (مسرّ)، ومرجع فالتغليف ديالو الأصلي.</li>
          <li>البوستا كيجمع المنتوج، من بعد كيتفحص قبل ما نأكدو الرجوع ديال الفلوس.</li>
          <li>مصاريف الرجوع كيتخصمو من مبلغ الرجوع.</li>
          <li>الرجوع ديال الفلوس كيتأدى <strong>بالكاش</strong> ولا بتحويل لالحساب البنكي اللي عطاتيه الزبونة.</li>
          <li>طلب الرجوع مكيتقبلش كان مافماش تبديل قبل منها.</li>
          <li>Warda Beauté كتحفتظ بالحق باش ترفض أي رجوع كان المنتوج مضرور، ناقص، ولا فيه علامات استعمال.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">التوصيل</h2>
        <p>
          🚚 التوصيل بالخاوة فكل المغرب فأقل من <strong>24 لـ 48 ساعة</strong>. 💳 الخلاص 100% عند الاستلام —
          ما كتخلصي غير كيف توصلك. 🌹 منتوجات مصنوعة فالمغرب، مجرّبة ديرماتولوجياً.
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
