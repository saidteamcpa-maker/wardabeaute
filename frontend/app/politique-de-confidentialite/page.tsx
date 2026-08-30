import { getLangServer } from "@/lib/lang-server";
import { t } from "@/content/ui";
import { getPageOverride } from "@/lib/store-content";
import { sanitizeHtml } from "@/lib/safe-html";
import Image from "next/image";

export default async function PolitiqueConfidentialite({ searchParams }: { searchParams?: { preview?: string } }) {
  const lang = getLangServer();
  const ov = await getPageOverride("privacy", lang, searchParams?.preview === "1");
  const T = (k: string, fk?: string) => ov?.[k] || t(lang, fk ?? k);
  const bodyHtml = ov?.["policy.body"];
  const fr = (
    <>
      <p className="mt-2">
        Bienvenue sur Warda Beauté ! Les termes « nous », « notre » et « nos » désignent Warda Beauté. Nous exploitons
        cette boutique et ce site web, y compris toutes les informations, le contenu, les fonctionnalités, les outils,
        les produits et les services connexes afin de vous offrir, en tant que cliente, une expérience d&apos;achat
        personnalisée (ci-après les « Services »).
      </p>
      <p className="mt-2">
        En visitant, en interagissant ou en utilisant nos Services, vous acceptez d&apos;être liée par les présentes
        Conditions d&apos;utilisation. Si vous ne les acceptez pas, vous ne devez pas utiliser nos Services.
      </p>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 1 – Accès et compte</h2>
        <p>En acceptant les présentes Conditions, vous déclarez avoir au moins l&apos;âge de la majorité dans votre pays de résidence et être seule responsable de la sécurité de vos identifiants et de toutes les activités de votre compte. Vous ne pouvez pas transférer, vendre ou céder votre compte à une autre personne.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 2 – Nos produits</h2>
        <p>Nous nous efforçons de représenter nos produits fidèlement. Toutefois, les couleurs ou l&apos;apparence peuvent différer de ce qui apparaît sur votre écran. Toutes les descriptions sont susceptibles d&apos;être modifiées à tout moment et sans préavis. Nous nous réservons le droit de retirer tout produit ou d&apos;en limiter les quantités.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 3 – Commandes</h2>
        <p>Lorsque vous passez une commande, vous faites une offre d&apos;achat. Warda Beauté se réserve le droit de l&apos;accepter ou de la refuser pour quelque raison que ce soit. Votre commande n&apos;est acceptée qu&apos;après notre confirmation. Vos achats sont destinés à un usage personnel et non à la revente. Les retours et échanges suivent notre <a href="/politique-de-retour" className="underline text-warda">Politique de retour &amp; livraison</a>.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 4 – Prix et paiement</h2>
        <p>Les prix et promotions peuvent être modifiés sans préavis ; le prix facturé est celui en vigueur au moment de la commande. Sauf indication contraire, les prix affichés ne comprennent pas les frais d&apos;expédition. Warda Beauté pratique le <strong>paiement 100% à la livraison</strong> : vous ne payez qu&apos;à réception de votre colis. Vous garantissez que les informations de commande fournies sont vraies et complètes.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 5 – Expédition et livraison</h2>
        <p>La livraison est gratuite partout au Maroc sous 24–48h. Les délais sont des estimations et ne sont pas garantis. Nous ne sommes pas responsables des retards causés par le transporteur ou des événements indépendants de notre volonté. Une fois le colis remis au transporteur, le risque de perte vous est transféré.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 6 – Propriété intellectuelle</h2>
        <p>Tous les contenus (marques, textes, images, vidéos, design) sont la propriété de Warda Beauté ou de ses concédants et sont protégés par les lois marocaines et internationales sur la propriété intellectuelle. L&apos;utilisation des Services est autorisée à des fins personnelles uniquement. Toute reproduction ou diffusion sans accord écrit préalable est interdite.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 7 – Liens vers des tiers</h2>
        <p>Les Services peuvent contenir des liens vers des sites tiers. Nous ne sommes pas responsables du contenu ou de l&apos;exactitude de ces sites. Tout achat sur un site tiers relève de votre seule responsabilité.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 8 – Utilisations interdites</h2>
        <p>Vous vous engagez à utiliser les Services à des fins licites et à ne pas violer la réglementation en vigueur, les droits de propriété intellectuelle d&apos;autrui, ou à ne pas transmettre de contenu illégal, diffamatoire ou malveillant. Nous pouvons suspendre votre accès en cas de violation des présentes Conditions.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 9 – Non-responsabilité des garanties</h2>
        <p>Sauf mention expresse, les Services et produits sont fournis « en l&apos;état » et « tels que disponibles », sans garantie d&apos;aucune sorte. Nous ne garantissons pas que l&apos;utilisation des Services sera ininterrompue ou exempte d&apos;erreurs.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 10 – Limitation de responsabilité</h2>
        <p>Dans la limite prévue par la loi, Warda Beauté ne saurait être tenue responsable des dommages indirects, accessoires ou consécutifs résultant de l&apos;utilisation des Services ou de tout produit obtenu.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 11 – Modifications</h2>
        <p>Nous nous réservons le droit de mettre à jour les présentes Conditions à tout moment. La version la plus récente est consultable sur cette page. L&apos;utilisation continue des Services après publication vaut acceptation des modifications.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">Section 12 – Coordonnées</h2>
        <p>Pour toute question relative aux présentes Conditions, contactez-nous sur <a href="mailto:contact@wardabeaute.com" className="underline text-warda">contact@wardabeaute.com</a> ou via WhatsApp. Warda Beauté — Casablanca, Maroc.</p>
      </section>
    </>
  );
  const ar = (
    <>
      <p className="mt-2">
        مرحباً بك فـ Warda Beauté ! المصطلحات « نحن » و« موقعنا » كتشير لـ Warda Beauté. كنديرو إدارة هاد المتجر والموقع الإلكتروني، بجميع المعلومات والمحتوى والخدمات المتاحة باش نوفروا ليك تجربة شراء مريحة وموثوقة (المشار إليها بـ « الخدمات »).
      </p>
      <p className="mt-2">
        بمجرد زيارتك للموقع أو إتمام أي طلب عبره، كتكوني قبلتي بهاد الشروط والأحكام وسياسة الخصوصية. إيلا ما كنتيش موافقة عليها، يرجى عدم استخدام خدماتنا.
      </p>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 1 – شروط الاستخدام والحساب</h2>
        <p>بالموافقة على هاد الشروط، كتأكدي بلي وصلتي للسن القانوني فبلد إقامتك، وأنك مسؤولة بالكامل على صحة المعلومات المدخلة وأمان بياناتك. لا يجوز تحويل أو بيع الحساب أو إساءة استخدام خدمات الموقع.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 2 – المنتجات والمعلومات</h2>
        <p>كنحرصو على تقديم صور ووصف دقيق وحقيقي لجميع منتجاتنا. ومع ذلك، قد تختلف درجات الألوان قليلاً حسب شاشتك. جميع الأوصاف والمكونات قابلة للتحديث الدوري لضمان أعلى جودة، ونحتفظ بالحق فتعديل أو إيقاف أي منتج عند نفاذ المخزون.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 3 – تسجيل وتأكيد الطلبات</h2>
        <p>ملي كتقومي بتسجيل طلبك، كيتعتبر رغبة فشراء المنتج. Warda Beauté كتحتافظ بالحق فـ قبول أو رفض أي طلب (مثلاً لأرقام هواتف غير صحيحة أو خارج المغرب). يتم تأكيد الطلب رسمياً بعد اتصال فريقنا الهاتفي بك. المشتريات مخصصة للاستعمال الشخصي فقط. وتخضع عمليات التبديل والإرجاع لـ <a href="/politique-de-retour" className="underline text-warda">سياسة التوصيل والإرجاع</a>.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 4 – الأسعار والدفع</h2>
        <p>الأسعار والعروض الترويجية واضحة ومحددة بالدرهم المغربي (MAD). Warda Beauté كتعمل بنظام <strong>الدفع 100% عند الاستلام (Cash On Delivery)</strong>: ما كتخلصي والو مسبقاً، والخلاص كيكون نقداً لعامل التوصيل ملي كتوصلك الطلبية ليدك.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 5 – الشحن والتوصيل</h2>
        <p>التوصيل مجاني وفابور لجميع مدن المغرب فـ مدة 24 إلى 48 ساعة. المدد المذكورة هي مدد تقريبية حسب كل مدينة. لسنا مسؤولين عن أي تأخير ناجم عن ظروف قاهرة خارجة عن إرادتنا أو عدم رد الزبونة على اتصالات الموزع.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 6 – الملكية الفكرية</h2>
        <p>جميع المحتويات (العلامات التجارية، الشعارات، النصوص، الصور، الفيديوهات، والتصاميم) هي ملكية حصرية لـ Warda Beauté ومحمية بالقوانين المغربية والدولية للملكية الفكرية. يُمنع منعاً باتاً نسخ أو إعادة نشر أي محتوى بدون موافقة خطية مسبقة.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 7 – حماية وسرية البيانات</h2>
        <p>كنحترمو خصوصيتك وسرية بياناتك (الاسم، الهاتف، العنوان). كنستعملو هاد المعلومات حصرياً لمعالجة وتوصيل طلبيتك وتقديم خدمة زبناء ممتازة، وما كنشاركو حتى معلومة مع أي طرف ثالث غير معني بالتوصيل.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 8 – الاستخدامات المحظورة</h2>
        <p>تتعهدين باستخدام الموقع لأغراض مشروعة وقانونية فقط، وعدم إدخال بيانات وهمية أو إرسال أي محتوى ضار أو مسيء، ويحق لنا إلغاء أي طلب أو حظر أي استخدام مسيء.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 9 – إخلاء المسؤولية</h2>
        <p>المنتجات والخدمات مقدمة بأعلى معايير الجودة والمراقبة. نتائج مستحضرات العناية قد تختلف من شخص لآخر حسب طبيعة ونوع البشرة، وكننصحو دائماً بالالتزام بطريقة الاستعمال والمواظبة.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 10 – التعديلات والتحديثات</h2>
        <p>نحتفظ بالحق فتحديث وتعديل هاد الشروط فأي وقت لمواكبة التطورات القانونية والتنظيمية. النسخة المحدثة كتكون متاحة دائماً فهاد الصفحة.</p>
      </section>
      <section>
        <h2 className="text-2xl text-profond mb-2">القسم 11 – خدمة الزبناء والتواصل</h2>
        <p>لأي استفسار بخصوص شروط الاستخدام أو الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني <a href="mailto:contact@wardabeaute.com" className="underline text-warda">contact@wardabeaute.com</a> أو عبر الواتساب. Warda Beauté — الدار البيضاء، المغرب.</p>
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
          <h1 className="text-4xl leading-snug text-profond">{T("policy.title", "privacy.title")}</h1>
          {bodyHtml ? (
            <div className="space-y-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(bodyHtml) }} />
          ) : lang === "ar" ? ar : fr}
        </div>
      </div>
    </div>
  );
}
