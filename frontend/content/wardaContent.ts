/**
 * content/wardaContent.ts
 * =============================================================================
 * Structured content for Warda Beauté product pages.
 * Source: frontend/docs/warda-beaute-content.md (verbatim FR + Darija)
 * Style inspiré de nolea.ma — 13 blocs UX.
 *
 * EDITABLE VARS AT TOP — change prices/sizes/whatsapp here, not inside blocks.
 * All bracketed prices [ ... DH ] from the md are represented via PRICES vars.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// 0) EDITABLE CONFIG — single source of truth
// -----------------------------------------------------------------------------
/** WhatsApp contact — change once, used everywhere (also re-exported via lib/config.ts) */
export const WHATSAPP_NUMBER = "212779754660";

/** Prices in MAD — package prices (total price for selected pack) */
export const PRICES = {
  velvastretch: { single: 219, duo: 279, triple: 329 },
  silkstop: { single: 209, duo: 259, triple: 299 },
  collaglow: { single: 229, duo: 299, triple: 359 },
  kit: { duo: 329, duoXL: 449 },
} as const;

/** Savings computed from package prices */
export const SAVINGS = {
  velvastretchDuo: 159, // 2×219 - 279 = 159
  velvastretchTriple: 328, // 3×219 - 329 = 328
  silkstopDuo: 159, // 2×209 - 259 = 159
  silkstopTriple: 328, // 3×209 - 299 = 328
  collaglowDuo: 159, // 2×229 - 299 = 159
  collaglowTriple: 328, // 3×229 - 359 = 328
  kitDuo: 519, // 848 - 329 = 519
  kitDuoXL: 209, // 2×329 - 449 = 209
} as const;

/** Sizes / formats — edit here, used in pricing cards */
export const SIZES = {
  velvastretch: { single: "60 ml", duo: "2 × 60 ml", triple: "3 × 60 ml" },
  silkstop: { single: "30 ml", duo: "2 × 30 ml", triple: "3 × 30 ml" },
  collaglow: { single: "25 gummies", duo: "50 gummies", triple: "75 gummies" },
  kit: { duo: "1 CollaGlow (25) + 1 VelvaStretch (60 ml)", duoXL: "2 CollaGlow (50) + 2 VelvaStretch (120 ml)" },
} as const;

/** Durations / sub-labels under price */
export const DURATIONS = {
  velvastretch: { single: "environ 1 mois", duo: "cure complète de 2–3 mois", triple: "cure complète de 3–4 mois" },
  silkstop: { single: "environ 1 mois", duo: "cure complète de 2 mois", triple: "cure complète de 3 mois" },
  collaglow: { single: "cure d'1 mois", duo: "cure de 2 mois", triple: "cure de 3 mois" },
  kit: { duo: "cure d'1 mois Inside & Outside", duoXL: "2 cures, 2–3 mois" },
} as const;

/** Trust / delivery constants reused across blocks */
export const TRUST_LINE = {
  fr: "✓ Paiement à la livraison · Livraison 24–72h selon votre ville.",
  ar: "✓ الخلاص عند الاستلام · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
} as const;
export const TRUST_SHORT = {
  fr: "✓ Paiement à la livraison, partout au Maroc.",
  ar: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
} as const;

// -----------------------------------------------------------------------------
// 1) TYPES — keep simple, re-exportable
// -----------------------------------------------------------------------------
export type Lang = "fr" | "ar";

export interface HeroBlock {
  label: string;
  h1: string;
  sub: string;
  pills: [string, string, string];
  cta: string;
  trust: string;
}

export interface ProblemBlock {
  eyebrow: string;
  h2: string;
  para: string;
  bullets: [string, string, string];
}

export interface IngredientItem {
  num: string; // "01" .. "04"
  name: string;
  desc: string;
}
export interface IngredientsBlock {
  eyebrow: string;
  h2: string;
  para: string;
  items: IngredientItem[]; // 4
}

export interface RitualBlock {
  h2: string;
  steps: [string, string, string, string]; // 4 steps
}

export interface TimelineMilestone {
  label: string;
  desc: string;
}
export interface TimelineBlock {
  eyebrow: string;
  h2: string;
  milestones: [TimelineMilestone, TimelineMilestone, TimelineMilestone];
  callouts: string[]; // typically 2
  disclaimer: string;
}

export interface CtaMidBlock {
  cta: string;
  trust: string;
}

export interface ValuePillar {
  title: string;
  desc: string;
}
export interface ValuesBlock {
  eyebrow: string;
  h2: string;
  pillars: [ValuePillar, ValuePillar, ValuePillar];
  badges: [string, string, string, string];
}

export interface TestimonialItem {
  quote: string;
  name: string;
  city: string;
  stars: number;
}
export interface TestimonialsBlock {
  eyebrow: string;
  h2: string;
  items: [TestimonialItem, TestimonialItem, TestimonialItem];
}

export interface PricingCard {
  title: string;
  price: number;
  originalPrice?: number;
  size: string;
  duration: string;
  badge?: string;
  cta: string;
  isFeatured?: boolean;
  // TODO marker for placeholder tiers
  isPlaceholder?: boolean;
  savingText?: string;
}
export interface PricingBlock {
  eyebrow: string;
  h2: string;
  cards: PricingCard[]; // 2 in md, 3 with placeholder triple (see TODO)
  trust: string;
}

export interface OrderFormBlock {
  eyebrow: string;
  h2: string;
  para: string;
  fields: string[]; // e.g. ["Offre (radio)", "Nom complet", "Téléphone", "Ville & adresse de livraison"]
  badges: string[]; // e.g. ["✓ Paiement à la livraison", "🚚 Livraison 24–72h", "🔒 ..."]
  cta: string;
  whatsappCta: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// Full page = 13 blocks (hero, problem, ingredients, ritual, timeline, ctaMid, values, testimonials, ctaMid2, pricing, gallery, orderForm, faq)
export interface WardaPageBlocks {
  hero: HeroBlock;
  problem: ProblemBlock;
  ingredients: IngredientsBlock;
  ritual: RitualBlock;
  timeline: TimelineBlock;
  ctaMid: CtaMidBlock;
  ctaMid2: CtaMidBlock; // duplicate of ctaMid per UX (blocks 06 & 09)
  values: ValuesBlock;
  testimonials: TestimonialsBlock;
  pricing: PricingBlock;
  gallery: string[]; // 6-8 strings
  orderForm: OrderFormBlock;
  faq: [FaqItem, FaqItem, FaqItem, FaqItem, FaqItem, FaqItem]; // 6
}

export type WardaPages = Record<string, { fr: WardaPageBlocks; ar: WardaPageBlocks }>;

// -----------------------------------------------------------------------------
// 2) CONTENT — verbatim from docs/warda-beaute-content.md
// -----------------------------------------------------------------------------
export const WARDAPages: WardaPages = {
  // ========================================================================
  // 1️⃣ VELVASTRETCH — Crème anti-vergetures & fermeté
  // ========================================================================
  velvastretch: {
    fr: {
      hero: {
        label: "WARDA BEAUTÉ · Douceur & Élasticité",
        h1: "Redonnez à votre peau toute son élasticité, en douceur.",
        sub: "VelvaStretch associe le collagène marin, le beurre de karité pur et la centella asiatica pour stopper et masquer les vergetures.",
        pills: ["Collagène marin", "Beurre de karité", "Grossesse & silhouette"],
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison · Livraison 24–72h selon votre ville.",
      },
      problem: {
        eyebrow: "On se comprend",
        h2: "Grossesse, prise de poids, croissance rapide… la peau tire, et les marques s'installent ?",
        para: "Le ventre qui s'arrondit, une silhouette qui change vite, une croissance à l'adolescence : la peau s'étire plus vite qu'elle ne peut suivre, et les fibres de collagène se marquent. Ce n'est pas une fatalité — un geste régulier avec de vrais actifs aide la peau à rester souple.",
        bullets: [
          "Vergetures roses ou blanchâtres qui apparaissent",
          "Peau qui tiraille, sensation d'inconfort",
          "Manque de fermeté sur ventre, hanches, poitrine, cuisses",
        ],
      },
      ingredients: {
        eyebrow: "La formule",
        h2: "Des actifs reconnus pour la fermeté, une transparence totale.",
        para: "Une formule riche mais non grasse, pensée pour les peaux marocaines. Sans parabènes, non comédogène.",
        items: [
          { num: "01", name: "Collagène marin", desc: "Aide à soutenir l'élasticité naturelle de la peau et sa densité." },
          { num: "02", name: "Beurre de karité pur", desc: "Nourrit intensément et aide à renforcer la barrière cutanée." },
          { num: "03", name: "Centella asiatica", desc: "Reconnue pour aider à apaiser et favoriser le confort de la peau tiraillée." },
          { num: "04", name: "Huile d'argan & vitamine E", desc: "Nutrition profonde et protection antioxydante — notre signature marocaine." },
        ],
      },
      ritual: {
        h2: "Le rituel",
        steps: [
          "Matin et soir, sur peau propre, de préférence après la douche.",
          "Appliquez une noisette généreuse sur les zones concernées (ventre, hanches, poitrine, cuisses).",
          "Massez en mouvements circulaires jusqu'à absorption complète, en insistant sur les zones sèches.",
          "Pour les femmes enceintes : dès le 3e mois, appliquer quotidiennement pour accompagner l'étirement de la peau.",
        ],
      },
      timeline: {
        eyebrow: "Résultat progressif",
        h2: "La régularité est le vrai secret pour voir les résultats.",
        milestones: [
          { label: "Semaines 1–2", desc: "Une peau plus hydratée et plus souple, avec une sensation immédiate de confort et de douceur." },
          { label: "Semaines 2–3", desc: "Avec une utilisation quotidienne, les vergetures commencent à s'atténuer et deviennent moins visibles qu'au début." },
          { label: "Après 4 semaines", desc: "Une nette différence sur l'aspect et la fermeté de la peau, le teint s'unifie et les vergetures n'attirent plus le regard." },
        ],
        callouts: [
          "🧴 Avant la première utilisation, testez la crème 24h dans le pli du coude.",
          "☀️ En cas d'exposition au soleil, protégez les zones traitées.",
        ],
        disclaimer: "Résultats progressifs, variables selon les peaux. La régularité matin et soir est la clé.",
      },
      ctaMid: {
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      ctaMid2: {
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      values: {
        eyebrow: "Pourquoi WARDA BEAUTÉ",
        h2: "Une marque marocaine, des standards exigeants.",
        pillars: [
          { title: "Fait au Maroc", desc: "Formulé et conditionné au Maroc, pensé pour nos peaux et notre climat." },
          { title: "Formule transparente", desc: "Liste complète des ingrédients sur chaque boîte. Pas de promesses miracles." },
          { title: "Douceur d'abord", desc: "Non comédogène, sans parabènes, testé dermatologiquement." },
        ],
        badges: ["Testé dermatologiquement", "Non comédogène", "Sans parabènes", "Cruelty free"],
      },
      testimonials: {
        eyebrow: "Elles en parlent",
        h2: "Vos retours, notre fierté.",
        items: [
          {
            quote: "Depuis ma grossesse j'utilise VelvaStretch, ma peau reste souple et les marques sont beaucoup moins visibles.",
            name: "Fatima-Zahra",
            city: "Casablanca",
            stars: 5,
          },
          {
            quote: "Texture riche mais qui pénètre vite, aucun collant. Je le mets tous les soirs.",
            name: "Nawal",
            city: "Marrakech",
            stars: 5,
          },
          {
            quote: "Enfin une crème marocaine sérieuse, et le paiement à la livraison m'a rassurée.",
            name: "Sara",
            city: "Rabat",
            stars: 5,
          },
        ],
      },
      pricing: {
        eyebrow: "Votre cure",
        h2: "Choisissez votre offre.",
        cards: [
          {
            title: "1 sérum",
            price: PRICES.velvastretch.single,
            size: SIZES.velvastretch.single,
            duration: DURATIONS.velvastretch.single,
            cta: "Je commande",
          },
          {
            title: "2 sérums",
            price: PRICES.velvastretch.duo,
            size: SIZES.velvastretch.duo,
            duration: DURATIONS.velvastretch.duo,
            badge: "Économisez 159 DH",
            savingText: "Économisez 159 DH",
            cta: "Je commande",
            isFeatured: true,
          },
          {
            title: "3 sérums",
            price: PRICES.velvastretch.triple,
            size: SIZES.velvastretch.triple,
            duration: DURATIONS.velvastretch.triple,
            badge: "Économisez 328 DH",
            savingText: "Économisez 328 DH",
            cta: "Je commande",
            isPlaceholder: true,
          },
        ],
        trust: "✓ Paiement à la livraison, partout au Maroc · Livraison 24–72h selon votre ville.",
      },
      gallery: [
        "flatlay pot ouvert + texture",
        "packshot studio face",
        "pack duo",
        "texture crème sur peau (swatch)",
        "modèle appliquant sur ventre/hanche (cadrage pudique)",
        "zoom ingrédients naturels (karité/argan)",
        "photo lifestyle grossesse",
        "avant/après flouté",
      ],
      orderForm: {
        eyebrow: "Votre cure",
        h2: "Commandez votre VelvaStretch",
        para: "Remplissez le formulaire — nous vous appelons pour confirmer. Vous ne payez qu'à la réception.",
        fields: ["Offre (radio)", "Nom complet", "Téléphone", "Ville & adresse de livraison"],
        badges: ["✓ Paiement à la livraison", "🚚 Livraison 24–72h", "🔒 Vos informations restent confidentielles"],
        cta: "Commander — payez à la livraison",
        whatsappCta: "Commander sur WhatsApp",
      },
      faq: [
        {
          q: "Comment fonctionne le paiement à la livraison ?",
          a: "Vous commandez en 1 minute, nous vous appelons pour confirmer, puis vous payez le livreur en espèces à la réception. Aucun paiement en ligne.",
        },
        {
          q: "Quels sont les délais de livraison ?",
          a: "Généralement 24 à 72h selon votre ville, partout au Maroc.",
        },
        {
          q: "Quand vais-je voir des résultats ?",
          a: "La peau est plus souple dès la première semaine ; les vergetures disparaissent avec une utilisation régulière d'un mois.",
        },
        {
          q: "Puis-je l'utiliser enceinte ?",
          a: "Oui, formule pensée pour accompagner la grossesse. Par précaution, demandez toujours l'avis de votre médecin avant tout nouveau produit.",
        },
        {
          q: "Convient-il aux peaux sensibles ?",
          a: "Formule douce, non comédogène, sans parabènes. Faites un test 24h avant la première application.",
        },
        {
          q: "Et si le produit ne me convient pas ?",
          a: "Vérifiez le colis devant le livreur et refusez-le s'il est endommagé. Vous avez ensuite 7 jours pour nous signaler tout problème via WhatsApp — échange ou remboursement selon le cas.",
        },
      ],
    },
    ar: {
      hero: {
        label: "WARDA BEAUTÉ · نعومة ومرونة طبيعية",
        h1: "رجعي لبشرتك المرونة والنعومة ديالها، بلا ما تقلقي.",
        sub: "VelvaStretch كيجمع بين الكولاجين البحري، زبدة الكاريتي الطبيعية، والسنتيلا أسياتيكا باش يوقف ويخفي علامات التمدد.",
        pills: ["كولاجين بحري", "زبدة الكاريتي", "الحمل وتغيير الوزن"],
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك مزيان",
        h2: "الحمل، تبدل الوزن السريع، مرحلة البلوغ... الجلد كيتجبد والعلامات كتبان؟",
        para: "مع تمدد البطن، التغيرات السريعة فالوزن، ولا مرحلة النمو: الجلد كيتجبد بسرعة أكبر من قدرتو على التكيف، وألياف الكولاجين كتضرر. ولكن هادشي ماشي قدر محتوم — روتين يومي منتظم بمكونات فعالة كيعاون بشرتك تسترجع مرونتها ونعومتها.",
        bullets: ["علامات تمدد حمراء أو بيضاء ظاهرة", "إحساس بالشد وجفاف البشرة", "نقص فتماسك ومرونة البطن، الأرداف، الصدر، والفخذين"],
      },
      ingredients: {
        eyebrow: "التركيبة الطبيعية",
        h2: "مكونات فعالة ومثبتة، بشفافية تامة.",
        para: "تركيبة غنية وسريعة الامتصاص، مصممة خصيصاً للبشرة المغربية. بدون بارابين وبدون ما تسد المسام.",
        items: [
          { num: "01", name: "الكولاجين البحري", desc: "كيساعد على دعم المرونة الطبيعية وكثافة ونضارة الجلد." },
          { num: "02", name: "زبدة الكاريتي الطبيعية", desc: "كتغذي البشرة بعمق وكتساعد على تقوية الحاجز الواقي للجلد." },
          { num: "03", name: "سنتيلا أسياتيكا (Centella)", desc: "معروفة علمياً بتهدئة البشرة وتحفيز إنتاج الكولاجين فالعمق." },
          { num: "04", name: "زيت الأركان وفيتامين E", desc: "تغذية عميقة وحماية مضادة للأكسدة — لمسة مغربية أصيلة." },
        ],
      },
      ritual: {
        h2: "طريقة الاستعمال اليومية",
        steps: [
          "صباحاً ومساءً على بشرة نظيفة وجافة، من الأفضل بعد الحمام أو الدوش.",
          "حطي كمية كافية على المناطق المعنية (البطن، الأرداف، الصدر، الفخذين).",
          "دلكي بحركات دائرية خفيفة حتى يتشرب تماماً، مع التركيز على المناطق الجافة.",
          "للحوامل: ابتداءً من الشهر الثالث، استعمليه يومياً باش تعاوني بشرتك على التمدد بأمان.",
        ],
      },
      timeline: {
        eyebrow: "نتائج تدريجية ومضمونة",
        h2: "المداومة هي السر الحقيقي باش تبان النتيجة.",
        milestones: [
          { label: "السيمانة 1–2", desc: "بشرة رطبة ومرنة كثر، مع إحساس فوري بالراحة والنعومة." },
          { label: "السيمانة 2–3", desc: "مع الاستعمال كل نهار، علامات التمدد (les vergetures) كيبداو ينقصو ومكيبقاوش باينين بحال الأول." },
          { label: "من بعد 4 سيمانات", desc: "فرق واضح فمظهر البشرة والشدة ديالها، لون الجلد كيتوحد وعلامات التمدد مكيبقاوش." },
        ],
        callouts: ["🧴 قبل أول استعمال، جربي كمية صغيرة على ثنية الذراع للتأكد من عدم التحسس.", "☀️ فـ حالة التعرض للشمس، ديري واقي شمسي على المناطق المكشوفة."],
        disclaimer: "النتائج تدريجية وكتختلف حسب طبيعة كل بشرة. المواظبة صباحاً ومساءً هي مفتاح النجاح.",
      },
      ctaMid: {
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      ctaMid2: {
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية بمعايير جودة عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "مركب ومعبأ فالمغرب، مدروس خصيصاً للمناخ والبشرة المغربية." },
          { title: "تركيبة شفافة", desc: "لائحة المكونات كاملة وواضحة على كل علبة. بلا وعود كاذبة." },
          { title: "أمان ونعومة تامة", desc: "ما كيسدش المسام، خالي من البارابين، ومجرب عند أطباء الجلد." },
        ],
        badges: ["مجرب عند أطباء الجلد", "ما كيسدش المسام", "خالي من البارابين", "غير مجرب على الحيوانات"],
      },
      testimonials: {
        eyebrow: "شهادات حقيقية",
        h2: "آراء الزبونات ديالنا هي فخرنا.",
        items: [
          { quote: "من وقت الحمل وأنا كنستعمل VelvaStretch، بشرتي بقات رطبة ومرنة وعلامات التمدد خفّات بزاف.", name: "فاطمة الزهراء", city: "الدار البيضاء", stars: 5 },
          { quote: "القوام ديالو زوين بزاف ودغيا كيتشرب، ما كيلصقش وخفيف على البشرة. كنستعملو كل ليلة.", name: "نوال", city: "مراكش", stars: 5 },
          { quote: "أخيراً منتج مغربي احترافي، والدفع عند الاستلام كيعطي راحة بال كبيرة.", name: "سارة", city: "الرباط", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "العلاج ديالك",
        h2: "اختاري العرض المناسب ليك.",
        cards: [
          {
            title: "قرعة وحدة",
            price: PRICES.velvastretch.single,
            size: "60 مل",
            duration: "علاج ديال شهر تقريباً",
            cta: "بغيت نطلب",
          },
          {
            title: "2 قراعي",
            price: PRICES.velvastretch.duo,
            size: "2×60 مل",
            duration: "علاج متكامل ديال شهرين لـ 3 أشهر",
            badge: "وفّري 159 درهم",
            savingText: "وفّري 159 درهم",
            cta: "بغيت نطلب",
            isFeatured: true,
          },
          {
            title: "3 قراعي",
            price: PRICES.velvastretch.triple,
            size: "3×60 مل",
            duration: "علاج كامل ديال 3 لـ 4 أشهر",
            badge: "وفّري 328 درهم",
            savingText: "وفّري 328 درهم",
            cta: "بغيت نطلب",
          },
        ],
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      gallery: [
        "flatlay pot ouvert + texture",
        "packshot studio face",
        "pack duo",
        "texture crème sur peau (swatch)",
        "modèle appliquant sur ventre/hanche (cadrage pudique)",
        "zoom ingrédients naturels (karité/argan)",
        "photo lifestyle grossesse",
        "avant/après flouté",
      ],
      orderForm: {
        eyebrow: "العلاج ديالك",
        h2: "طلبي VelvaStretch ديالك دابا",
        para: "عمّري الاستمارة — غادي نتصلو بيك لتأكيد الطلب. ما كتخلصي حتى كتوصلك السلعة ليدك.",
        fields: ["العرض", "الاسم الكامل", "رقم الهاتف", "المدينة وعنوان التوصيل"],
        badges: ["✓ الدفع عند الاستلام", "🚚 التوصيل فـ 24–48 ساعة", "🔒 معلوماتك محمية وسرية"],
        cta: "طلبي دابا — الدفع عند الاستلام",
        whatsappCta: "طلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيدوز الدفع عند الاستلام؟", a: "كتطلبي فدقيقة، كنتصلو بيك لتأكيد الطلب والعنوان، وملي كيوصلك الكولي ليدك كتخلصي كاش للموزع." },
        { q: "شحال هي مدة التوصيل؟", a: "عادة من 24 إلى 48 ساعة حسب المدينة ديالك فالمغرب." },
        { q: "فوقاش كتبان النتيجة؟", a: "البشرة كتولي رطبة ومرنة من أول أسبوع؛ وعلامات التمدد كتمشي مع الاستعمال المنتظم ديال شهر." },
        { q: "واش نقدر نستعملو وأنا حاملة؟", a: "نعم، التركيبة آمنة وخالية من الريتينول ومصممة باش تعاون البشرة وقت الحمل. ومن باب الاحتياط استشيري طبيبك." },
        { q: "واش مناسب للبشرة الحساسة؟", a: "تركيبة لطيفة، ما كتسدش المسام، وبدون بارابين ومجربة عند أطباء الجلد." },
        { q: "إيلا ما عجبنيش المنتج؟", a: "راقبي الكولي ديالك مع الموزع. وعندك ضمان استرجاع وخدمة زبناء على الواتساب للمساعدة." },
      ],
    },
  },

  // ========================================================================
  // 2️⃣ SILKSTOP — Sérum anti-repousse & peau douce après épilation
  // ========================================================================
  silkstop: {
    fr: {
      hero: {
        label: "WARDA BEAUTÉ · Douceur qui dure",
        h1: "Une peau lisse plus longtemps, sans repousse gênante.",
        sub: "SilkStop associe extrait de papaye, acide glycolique doux et aloe vera pour aider à ralentir visiblement la repousse des poils et prévenir les poils incarnés.",
        pills: ["Extrait de papaye", "Anti-poils incarnés", "Peau douce 7 jours+"],
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison · Livraison 24–72h selon votre ville.",
      },
      problem: {
        eyebrow: "On se comprend",
        h2: "Poils qui repoussent trop vite, irritations et poils incarnés ?",
        para: "Rasage, épilation à la cire ou épilateur électrique… quelques jours après, les poils repoussent, la peau tiraille et de petits boutons rouges apparaissent. Un geste simple après chaque épilation peut faire toute la différence.",
        bullets: ["Repousse visible en quelques jours seulement", "Poils incarnés et petits boutons rouges", "Peau qui gratte et manque de douceur"],
      },
      ingredients: {
        eyebrow: "La formule",
        h2: "Des actifs ciblés, une transparence totale.",
        para: "Une formule légère, à absorption rapide, pensée pour toutes les zones du corps. Sans parabènes, non comédogène.",
        items: [
          { num: "01", name: "Extrait de papaye (papaïne)", desc: "Enzyme naturelle qui aide à affiner le poil et ralentir sa repousse visible." },
          { num: "02", name: "Acide glycolique doux", desc: "Exfoliant léger qui aide à prévenir les poils incarnés et lisser la peau." },
          { num: "03", name: "Aloe vera", desc: "Apaise immédiatement les zones fraîchement épilées et réduit les rougeurs." },
          { num: "04", name: "Huile de jojoba & vitamine E", desc: "Nourrit sans graisser et protège la peau durablement." },
        ],
      },
      ritual: {
        h2: "Le rituel",
        steps: [
          "Appliquez sur peau propre et sèche, juste après l'épilation ou le rasage.",
          "Vaporisez ou étalez 2–3 pressions sur les zones concernées.",
          "Massez légèrement jusqu'à absorption, sans rincer.",
          "Renouvelez tous les 2 jours pour un maximum d'efficacité.",
        ],
      },
      timeline: {
        eyebrow: "Résultat progressif",
        h2: "C'est la régularité qui fait toute la différence.",
        milestones: [
          { label: "Jours 1–3", desc: "Soulagement immédiat, la peau est apaisée et les rougeurs ainsi que les irritations du rasage ou de la cire disparaissent." },
          { label: "Semaines 1–2", desc: "Ralentit la repousse des poils, purifie la peau et élimine le problème des poils incarnés." },
          { label: "Après 3 semaines", desc: "Une douceur et une netteté qui durent plus longtemps, le poil repousse plus lentement, plus fin et discret." },
        ],
        callouts: [
          "🧴 Avant la première utilisation, testez le sérum 24h dans le pli du coude.",
          "☀️ Évitez l'exposition solaire directe juste après l'application sur zones fraîchement épilées.",
        ],
        disclaimer: "Résultats progressifs, variables selon les peaux et le type de poil.",
      },
      ctaMid: {
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      ctaMid2: {
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      values: {
        eyebrow: "Pourquoi WARDA BEAUTÉ",
        h2: "Une marque marocaine, des standards exigeants.",
        pillars: [
          { title: "Fait au Maroc", desc: "Formulé et conditionné au Maroc." },
          { title: "Formule transparente", desc: "Liste complète des ingrédients sur chaque boîte." },
          { title: "Douceur d'abord", desc: "Non comédogène, sans parabènes, testé dermatologiquement." },
        ],
        badges: ["Testé dermatologiquement", "Non comédogène", "Sans parabènes", "Cruelty free"],
      },
      testimonials: {
        eyebrow: "Elles en parlent",
        h2: "Vos retours, notre fierté.",
        items: [
          { quote: "Depuis que je l'utilise après épilation, plus aucun poil incarné !", name: "Khadija", city: "Fès", stars: 5 },
          { quote: "Le poil met beaucoup plus de temps à revenir, franchement bluffée.", name: "Meryem", city: "Tanger", stars: 5 },
          { quote: "Livraison rapide et paiement à la livraison, je recommande.", name: "Hind", city: "Agadir", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "Votre cure",
        h2: "Choisissez votre offre.",
        cards: [
          {
            title: "1 sérum",
            price: PRICES.silkstop.single,
            size: SIZES.silkstop.single,
            duration: DURATIONS.silkstop.single,
            cta: "Je commande",
          },
          {
            title: "2 sérums",
            price: PRICES.silkstop.duo,
            size: SIZES.silkstop.duo,
            duration: DURATIONS.silkstop.duo,
            badge: "Économisez 159 DH",
            savingText: "Économisez 159 DH",
            cta: "Je commande",
            isFeatured: true,
          },
          {
            title: "3 sérums",
            price: PRICES.silkstop.triple,
            size: SIZES.silkstop.triple,
            duration: DURATIONS.silkstop.triple,
            badge: "Économisez 328 DH",
            savingText: "Économisez 328 DH",
            cta: "Je commande",
          },
        ],
        trust: "✓ Paiement à la livraison, partout au Maroc · Livraison 24–72h selon votre ville.",
      },
      gallery: [
        "flatlay flacon spray + fleurs de papaye",
        "packshot studio",
        "pack duo",
        "texture sérum sur peau",
        "modèle appliquant sur jambe/aisselle (cadrage pudique)",
        "zoom embout spray",
        "photo lifestyle plage/été",
        "avant/après flouté",
      ],
      orderForm: {
        eyebrow: "Votre cure",
        h2: "Commandez votre SilkStop",
        para: "Remplissez le formulaire — nous vous appelons pour confirmer. Vous ne payez qu'à la réception.",
        fields: ["Offre (radio)", "Nom complet", "Téléphone", "Ville & adresse"],
        badges: ["✓ Paiement à la livraison", "🚚 Livraison 24–72h", "🔒 Confidentialité"],
        cta: "Commander — payez à la livraison",
        whatsappCta: "Commander sur WhatsApp",
      },
      faq: [
        { q: "Comment fonctionne le paiement à la livraison ?", a: "Commande en 1 minute, appel de confirmation, paiement en espèces au livreur." },
        { q: "Délais de livraison ?", a: "24 à 72h selon votre ville." },
        { q: "Quand voir les résultats ?", a: "Apaisement immédiat, repousse ralentie visible dès 1–2 semaines." },
        { q: "Convient-il à toutes les zones ?", a: "Oui, visage (zones autorisées), jambes, aisselles, maillot — évitez les muqueuses." },
        { q: "Puis-je l'utiliser enceinte ou allaitante ?", a: "Par précaution, demandez l'avis de votre médecin ou pharmacien." },
        { q: "Et si le produit ne me convient pas ?", a: "Vérifiez le colis devant le livreur, refusez-le si endommagé. 7 jours pour signaler un problème via WhatsApp." },
      ],
    },
    ar: {
      hero: {
        label: "WARDA BEAUTÉ · نعومة كتدوم",
        h1: "بشرة ناعمة لمدة أطول، بلا ما ينبت الشعر بسرعة.",
        sub: "SilkStop كيجمع بين إنزيمات البابايا الطبيعية، حمض الجليكوليك اللطيف، والألوفيرا باش يساعد يبطئ نمو الشعر ويقضي نهائياً على مشكل الشعر النابت تحت الجلد.",
        pills: ["خلاصة البابايا", "مضاد للشعر تحت الجلد", "نعومة كتدوم طويلاً"],
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك مزيان",
        h2: "الشعر كينبت بسرعة، حكة وحبوب وشعر نابت تحت الجلد؟",
        para: "الحلاقة، لاصير (الشمع)، أو آلة إزالة الشعر... غير كيدوزو يومين أو تلاتة، الشعر كيرجع ينبت، البشرة كتولي حرشة وحمراء، وكتبان حبوب مزعجة. عناية بسيطة من بعد كل إزالة كتقدر تبدل كلشي وتريحك.",
        bullets: ["الشعر كينبت بسرعة فمدة قصيرة", "شعر نابت تحت الجلد وحبوب حمراء مزعجة", "بشرة كتحس بالحكة والحرقة وناقصاها النعومة"],
      },
      ingredients: {
        eyebrow: "التركيبة الطبيعية",
        h2: "مكونات فعالة ومستهدفة، بشفافية تامة.",
        para: "تركيبة خفيفة وسريعة الامتصاص، مدروسة لجميع مناطق الجسم الحساسة. بدون بارابين وما كتسدش المسام.",
        items: [
          { num: "01", name: "خلاصة البابايا الطبيعية", desc: "إنزيم طبيعي كيساعد على إضعاف بصيلات الشعر وتبطئ نموه." },
          { num: "02", name: "حمض الجليكوليك اللطيف (AHA)", desc: "مقشر لطيف كيساعد على تنقية المسام ومنع نمو الشعر تحت الجلد." },
          { num: "03", name: "الألوفيرا النقية", desc: "كتلطف وتهدئ البشرة فوراً من بعد إزالة الشعر وكتمنع الاحمرار." },
          { num: "04", name: "زيت الجوجوبا وفيتامين E", desc: "ترطيب وتغذية خفيفة بدون أثر دهني، وحماية طويلة الأمد." },
        ],
      },
      ritual: {
        h2: "طريقة الاستعمال الصحيحة",
        steps: [
          "استعمليه على بشرة نظيفة وجافة، مباشرة من بعد إزالة الشعر أو الحلاقة.",
          "رشي أو دهني 2 إلى 3 قطرات على المناطق المعنية.",
          "دلكي بخفة حتى يتشرب مزيان، وبلا ما تغسليه بالماء.",
          "عاودي الاستعمال يومياً أو نهار بعد نهار لأفضل نتيجة مستمرة.",
        ],
      },
      timeline: {
        eyebrow: "نتائج تدريجية واضحة",
        h2: "المداومة هي اللي كدير الفرق كامل.",
        milestones: [
          { label: "الأيام 1–3", desc: "راحة فورية، البشرة كتهدن مكيبقاش داك الحمرار وتهييج الحلاقة ولا لاسير." },
          { label: "السيمانة 1–2", desc: "كيعطل الخلف ديال الشعر، كينقي البشرة وكيتهنى جلدك من مشكل الشعر اللي كينبت تحت الجلد." },
          { label: "من بعد 3 سيمانات", desc: "رطوبية ونقا كيدوم مدة أطول، والزغبة كتنبت معطلة، رقيقة وخفيفة مابايناش." },
        ],
        callouts: ["🧴 قبل أول استعمال، جربي كمية صغيرة على ثنية الذراع للتأكد من الملاءمة.", "☀️ تجنبي التعرض المباشر لأشعة الشمس القوية فوراً بعد إزالة الشعر."],
        disclaimer: "النتائج تدريجية وكتختلف حسب طبيعة وكثافة الشعر.",
      },
      ctaMid: {
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      ctaMid2: {
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية بمعايير جودة عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "مصنع ومعبأ فالمغرب بمعايير نظافة وجودة صارمة." },
          { title: "تركيبة شفافة", desc: "لائحة المكونات كاملة وواضحة على كل علبة." },
          { title: "أمان ونعومة فائقة", desc: "ما كيسدش المسام، خالي من البارابين، ومجرب عند أطباء الجلد." },
        ],
        badges: ["مجرب عند أطباء الجلد", "ما كيسدش المسام", "خالي من البارابين", "غير مجرب على الحيوانات"],
      },
      testimonials: {
        eyebrow: "شهادات حقيقية",
        h2: "آراء الزبونات ديالنا هي فخرنا.",
        items: [
          { quote: "من نهار بديت كنستعملو مور لاصير، تهنيت تماماً من مشكل الشعر تحت الجلد!", name: "خديجة", city: "فاس", stars: 5 },
          { quote: "الشعر كيتعطل بزاف باش يعاود ينبت، صراحة النتيجة فاجآتني بالزوين.", name: "مريم", city: "طنجة", stars: 5 },
          { quote: "التوصيل سريع والدفع عند الاستلام مريح، كنصح بيه أي وحدة.", name: "هند", city: "أكادير", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "العلاج ديالك",
        h2: "اختاري العرض المناسب ليك.",
        cards: [
          { title: "قرعة وحدة", price: PRICES.silkstop.single, size: "30 مل", duration: "استعمال ديال شهر تقريباً", cta: "بغيت نطلب" },
          { title: "2 قراعي", price: PRICES.silkstop.duo, size: "2×30 مل", duration: "علاج متكامل ديال شهرين", badge: "وفّري 159 درهم", savingText: "وفّري 159 درهم", cta: "بغيت نطلب", isFeatured: true },
          { title: "3 قراعي", price: PRICES.silkstop.triple, size: "3×30 مل", duration: "علاج كامل ديال 3 أشهر", badge: "وفّري 328 درهم", savingText: "وفّري 328 درهم", cta: "بغيت نطلب" },
        ],
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      gallery: [
        "flatlay flacon spray + fleurs de papaye",
        "packshot studio",
        "pack duo",
        "texture sérum sur peau",
        "modèle appliquant sur jambe/aisselle (cadrage pudique)",
        "zoom embout spray",
        "photo lifestyle plage/été",
        "avant/après flouté",
      ],
      orderForm: {
        eyebrow: "العلاج ديالك",
        h2: "طلبي SilkStop ديالك دابا",
        para: "عمّري الاستمارة — غادي نتصلو بيك لتأكيد الطلب. ما كتخلصي حتى كتوصلك السلعة ليدك.",
        fields: ["العرض", "الاسم الكامل", "رقم الهاتف", "المدينة والعنوان"],
        badges: ["✓ الدفع عند الاستلام", "🚚 التوصيل فـ 24–48 ساعة", "🔒 معلوماتك في سرية تامة"],
        cta: "طلبي دابا — الدفع عند الاستلام",
        whatsappCta: "طلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيدوز الدفع عند الاستلام؟", a: "كتطلبي فدقيقة، كنتصلو بيك لتأكيد العنوان، وكتخلصي كاش للموزع ملي كتوصلك الطلبية." },
        { q: "شحال هي مدة التوصيل؟", a: "من 24 إلى 48 ساعة حسب مدينتك فالمغرب." },
        { q: "فوقاش كتبان النتيجة؟", a: "راحة وتهدئة فورية للبشرة، ونمو الشعر كيبطئ بشكل ملحوظ ابتداءً من الأسبوع 1–2." },
        { q: "واش مناسب لجميع مناطق الجسم؟", a: "نعم، الوجه (المناطق المسموحة كالشوارب والذقن)، الساقين، الإبطين، ومنطقة البيكيني — مع تجنب الأغشية المخاطية." },
        { q: "واش نقدر نستعملو وأنا حاملة أو كنرضع؟", a: "من باب الاحتياط، استشيري الطبيب أو الصيدلي." },
        { q: "إيلا كان عندي أي استفسار؟", a: "خدمة الزبناء ديالنا متوفرة دائماً على الواتساب للمساعدة والمتابعة." },
      ],
    },
  },

  // ========================================================================
  // 3️⃣ COLLAGLOW — Collagène buvable — éclat & fermeté de l'intérieur
  // ========================================================================
  collaglow: {
    fr: {
      hero: {
        label: "WARDA BEAUTÉ · L'éclat qui vient de l'intérieur",
        h1: "Une peau repulpée et lumineuse, dès l'intérieur.",
        sub: "CollaGlow associe collagène marin hydrolysé, acide hyaluronique et vitamine C pour aider à soutenir la fermeté, l'hydratation et l'éclat naturel de votre peau.",
        pills: ["Collagène marin hydrolysé", "Vitamine C", "Cure 30 jours"],
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison · Livraison 24–72h selon votre ville.",
      },
      problem: {
        eyebrow: "On se comprend",
        h2: "Peau qui perd de sa fermeté, cheveux et ongles fragilisés ?",
        para: "Avec le temps, le stress, ou après une grossesse, la production naturelle de collagène ralentit. La peau devient plus fine, les cheveux et les ongles plus fragiles. Une cure régulière aide le corps à combler ce manque de l'intérieur.",
        bullets: ["Peau qui perd en fermeté et en éclat", "Premières ridules qui s'installent", "Cheveux et ongles cassants"],
      },
      ingredients: {
        eyebrow: "La formule",
        h2: "Des actifs reconnus, une transparence totale.",
        para: "Une formule concentrée, sans sucre ajouté, sans arôme artificiel.",
        items: [
          { num: "01", name: "Collagène marin hydrolysé", desc: "Peptides de petite taille, facilement assimilables par l'organisme." },
          { num: "02", name: "Acide hyaluronique", desc: "Aide à retenir l'hydratation au cœur de la peau." },
          { num: "03", name: "Vitamine C", desc: "Cofacteur essentiel à la synthèse naturelle du collagène, effet antioxydant." },
          { num: "04", name: "Biotine (vitamine B8)", desc: "Contribue au maintien de cheveux et d'ongles normaux." },
        ],
      },
      ritual: {
        h2: "Le rituel",
        steps: [
          "Un sachet/une dose par jour, de préférence le matin à jeun.",
          "Diluez dans un verre d'eau ou un jus de votre choix.",
          "Mélangez bien et buvez immédiatement.",
          "Poursuivez la cure sur 30 jours minimum pour de meilleurs résultats.",
        ],
      },
      timeline: {
        eyebrow: "Résultat progressif",
        h2: "La régularité est le vrai secret d'une beauté durable.",
        milestones: [
          { label: "Semaines 1–2", desc: "Une hydratation et une douceur visibles sur le visage et le corps, avec une sensation de confort et d'éclat." },
          { label: "Semaines 2–3", desc: "Une peau plus lumineuse et éclatante, avec une amélioration visible de la force et de la brillance des cheveux et des ongles." },
          { label: "Après 4 semaines", desc: "Une peau plus rebondie et raffermie, les ridules disparaissent et les ongles deviennent forts et ne se cassent plus facilement." },
        ],
        callouts: [
          "🥤 À associer à une bonne hydratation (eau) pour de meilleurs résultats.",
          "💧 Poursuivez quotidiennement et buvez suffisamment d'eau.",
        ],
        disclaimer: "Résultats progressifs, variables selon chaque organisme. La régularité quotidienne est la clé.",
      },
      ctaMid: {
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      ctaMid2: {
        cta: "Commander — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      values: {
        eyebrow: "Pourquoi WARDA BEAUTÉ",
        h2: "Une marque marocaine, des standards exigeants.",
        pillars: [
          { title: "Fait au Maroc", desc: "Conditionné au Maroc, contrôle qualité rigoureux." },
          { title: "Formule transparente", desc: "Composition complète affichée, sans sucre ajouté." },
          { title: "Douceur d'abord", desc: "Sans gluten*, sans arôme artificiel." },
        ],
        badges: ["Sans sucre ajouté", "Sans arôme artificiel", "Contrôlé qualité", "Cruelty free"],
      },
      testimonials: {
        eyebrow: "Elles en parlent",
        h2: "Vos retours, notre fierté.",
        items: [
          { quote: "Après un mois, mon teint est visiblement plus lumineux.", name: "Ghita", city: "Casablanca", stars: 5 },
          { quote: "Facile à intégrer dans ma routine, et mes ongles cassent beaucoup moins.", name: "Loubna", city: "Salé", stars: 5 },
          { quote: "Le goût est neutre, se mélange bien à l'eau. Je continue la cure.", name: "Asmae", city: "Oujda", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "Votre cure",
        h2: "Choisissez votre offre.",
        cards: [
          {
            title: "Cure 25 jours",
            price: PRICES.collaglow.single,
            size: SIZES.collaglow.single,
            duration: DURATIONS.collaglow.single,
            cta: "Je commande",
          },
          {
            title: "Cure 50 jours",
            price: PRICES.collaglow.duo,
            size: SIZES.collaglow.duo,
            duration: DURATIONS.collaglow.duo,
            badge: "Économisez 159 DH",
            savingText: "Économisez 159 DH",
            cta: "Je commande",
            isFeatured: true,
          },
          {
            title: "Cure 75 jours",
            price: PRICES.collaglow.triple,
            size: SIZES.collaglow.triple,
            duration: DURATIONS.collaglow.triple,
            badge: "Économisez 328 DH",
            savingText: "Économisez 328 DH",
            cta: "Je commande",
          },
        ],
        trust: "✓ Paiement à la livraison, partout au Maroc · Livraison 24–72h selon votre ville.",
      },
      gallery: [
        "flatlay boîte + sachets",
        "verre d'eau avec poudre qui se dissout",
        "packshot studio",
        "pack duo",
        "modèle buvant le mélange",
        "zoom texture poudre",
        "photo lifestyle matinale",
        "avant/après teint flouté",
      ],
      orderForm: {
        eyebrow: "Votre cure",
        h2: "Commandez votre CollaGlow",
        para: "Remplissez le formulaire — nous vous appelons pour confirmer. Vous ne payez qu'à la réception.",
        fields: ["Offre (radio)", "Nom complet", "Téléphone", "Ville & adresse"],
        badges: ["✓ Paiement à la livraison", "🚚 Livraison 24–72h", "🔒 Confidentialité"],
        cta: "Commander — payez à la livraison",
        whatsappCta: "Commander sur WhatsApp",
      },
      faq: [
        { q: "Comment fonctionne le paiement à la livraison ?", a: "Commande en 1 minute, appel de confirmation, paiement en espèces au livreur." },
        { q: "Délais de livraison ?", a: "24 à 72h selon votre ville." },
        { q: "Quand voir les résultats ?", a: "Hydratation dès 1–2 semaines, éclat et fermeté plus visibles après 6–8 semaines." },
        { q: "Comment consommer CollaGlow ?", a: "1 sachet/jour dilué dans de l'eau ou un jus, de préférence le matin." },
        { q: "Puis-je l'utiliser enceinte ou allaitante ?", a: "Par précaution, demandez l'avis de votre médecin avant toute cure de compléments." },
        { q: "Et si le produit ne me convient pas ?", a: "Vérifiez le colis devant le livreur, refusez-le si endommagé. 7 jours pour signaler un problème via WhatsApp — un sachet non ouvert peut être repris." },
      ],
    },
    ar: {
      hero: {
        label: "WARDA BEAUTÉ · إشراقة ونضارة من الداخل",
        h1: "بشرة مشدودة ونضرة كتشع بالحيوية، انطلاقاً من الداخل.",
        sub: "CollaGlow كيقدم ليك 2500 مغ من الكولاجين البحري المحلل + حمض الهيالورونيك وفيتامين C على شكل حلوى غنية ولذيذة (Gummies) بنكهة الرمان، باش يغذي بشرتك، شعرك، وظفارك من الأعماق.",
        pills: ["كولاجين بحري محلل", "فيتامين C وحمض الهيالورونيك", "25 حبة غنية ولذيذة"],
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك مزيان",
        h2: "البشرة كتفقد النضارة والمرونة ديالها، والشعر والظفار ولاو عيانين وهشاش؟",
        para: "مع التقدم فالعمر، التوتر، أو من بعد الولادة، إنتاج الكولاجين الطبيعي فالجسم كينقص. البشرة كتفقد الامتلاء والنضارة ديالها، والشعر كيتساقط والظفار كيتكسرو. عناية منتظمة من الداخل كتعاون الجسم يعوض هاد النقص من المصدر.",
        bullets: ["بشرة باهتة وناقصاها المرونة والنضارة", "ظهور خطوط وتجاعيد رقيقة", "تساقط الشعر وهشاشة وتكسر الأظافر"],
      },
      ingredients: {
        eyebrow: "التركيبة الطبيعية",
        h2: "مكونات فعالة ومدروسة، بشفافية تامة.",
        para: "حلوى مضغ غنية بتركيبة مركزة، بقاعدة بكتين نباتية، حلال 100% وبنكهة الرمان الطبيعية اللذيذة.",
        items: [
          { num: "01", name: "كولاجين بحري محلل (2500 مغ)", desc: "بيبتيدات دقيقة عالية الامتصاص باش توصل لأعماق خلايا البشرة." },
          { num: "02", name: "حمض الهيالورونيك", desc: "كيساعد على حبس الرطوبة داخل خلايا البشرة لإعطائها مظهر ممتلئ ومشرق." },
          { num: "03", name: "فيتامين C الطبيعي", desc: "عنصر ضروري وأساسي لتحفيز إنتاج الكولاجين الطبيعي مع حماية مضادة للأكسدة." },
          { num: "04", name: "البيوتين (فيتامين B8)", desc: "كيقوي بصيلات الشعر ويحمي الأظافر من التكسر ويعزز نموها الصحي." },
        ],
      },
      ritual: {
        h2: "طريقة الاستعمال السهلة",
        steps: [
          "حبة وحدة ولذيذة من CollaGlow كل صباح (مضغ).",
          "طعم الرمان الطبيعي المنعش، سهلة وخفيفة بلا ما تحتاجي للماء.",
          "استمتعي بها يومياً كجزء من روتينك الصباحي للعناية بجمالك.",
          "واظبي على الكورس لمدة شهر على الأقل باش تحصلي على أفضل وأوضح نتيجة.",
        ],
      },
      timeline: {
        eyebrow: "نتائج تدريجية واضحة",
        h2: "المداومة هي السر الحقيقي لجمال كيدوم.",
        milestones: [
          { label: "السيمانة 1–2", desc: "ترطيب ونعومة باينة فالوجه والجسم، مع إحساس بالراحة والنضارة." },
          { label: "السيمانة 2–3", desc: "إشراقة ونور كثر فالبشرة، مع تحسن واضح فقوة ولمعان الشعر والظفار." },
          { label: "من بعد 4 سيمانات", desc: "بشرة عامرة ومجبدة كثر، الخطوط الرقيقة مكيبقاوش، وظفار صحاح مكيتهرسوش بسهولة." },
        ],
        callouts: ["🥤 باش تحصلي على أقصى فائدة، شربي كمية كافية من الماء يومياً.", "💧 الترطيب الداخلي كيكمل مفعول الكولاجين."],
        disclaimer: "النتائج تدريجية وكتختلف حسب طبيعة كل جسم. المواظبة اليومية هي سر النتائج الرائعة.",
      },
      ctaMid: {
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      ctaMid2: {
        cta: "طلبي دابا — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية بمعايير جودة عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "معبأ ومصنع فالمغرب بمراقبة جودة دقيقة وصارمة." },
          { title: "حلال ونباتي 100%", desc: "كولاجين بحري حلال، بقاعدة بكتين نباتية بدون جيلاتين حيواني." },
          { title: "لذيذ وسهل الاستعمال", desc: "طعم الرمان الطبيعي المحبب بدون نكهات صناعية مزعجة." },
        ],
        badges: ["حلال 100%", "نكهة رمان طبيعية", "مراقب الجودة", "غير مجرب على الحيوانات"],
      },
      testimonials: {
        eyebrow: "شهادات حقيقية",
        h2: "آراء الزبونات ديالنا هي فخرنا.",
        items: [
          { quote: "من بعد شهر ديال الاستعمال، وجهي رجعات فيه النضارة والإشراق وشعري نقص منو التساقط.", name: "غيثة", city: "الدار البيضاء", stars: 5 },
          { quote: "المذاق ديالو غزال بزاف وساهل تديريه فـ روتينك، والظفار ديالي مابقاوش كيتكسرو نهائياً.", name: "لبنى", city: "سلا", stars: 5 },
          { quote: "أحسن كولاجين جربتو، خفيف ولذيذ والنتيجة بانت ليا فـ بشرتي بعد 3 سيمانات.", name: "أسماء", city: "وجدة", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "العلاج ديالك",
        h2: "اختاري العرض المناسب ليك.",
        cards: [
          { title: "علبة وحدة (25 حبة)", price: PRICES.collaglow.single, size: "25 gummies", duration: "كورس ديال 25 يوم", cta: "بغيت نطلب" },
          { title: "2 علب (50 حبة)", price: PRICES.collaglow.duo, size: "50 gummies", duration: "كورس متكامل ديال 50 يوم", badge: "وفّري 159 درهم", savingText: "وفّري 159 درهم", cta: "بغيت نطلب", isFeatured: true },
          { title: "3 علب (75 حبة)", price: PRICES.collaglow.triple, size: "75 gummies", duration: "كورس علاجي كامل ديال 75 يوم", badge: "وفّري 328 درهم", savingText: "وفّري 328 درهم", cta: "بغيت نطلب" },
        ],
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      gallery: [
        "flatlay boîte + sachets",
        "verre d'eau avec poudre qui se dissout",
        "packshot studio",
        "pack duo",
        "modèle buvant le mélange",
        "zoom texture poudre",
        "photo lifestyle matinale",
        "avant/après teint flouté",
      ],
      orderForm: {
        eyebrow: "العلاج ديالك",
        h2: "طلبي CollaGlow ديالك دابا",
        para: "عمّري الاستمارة — غادي نتصلو بيك لتأكيد الطلب. ما كتخلصي حتى كتوصلك السلعة ليدك.",
        fields: ["العرض", "الاسم الكامل", "رقم الهاتف", "المدينة والعنوان"],
        badges: ["✓ الدفع عند الاستلام", "🚚 التوصيل فـ 24–48 ساعة", "🔒 معلوماتك في سرية تامة"],
        cta: "طلبي دابا — الدفع عند الاستلام",
        whatsappCta: "طلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيدوز الدفع عند الاستلام؟", a: "كتطلبي فدقيقة، كنتصلو بيك لتأكيد العنوان، وكتخلصي كاش للموزع ملي كيوصلك الكولي ليدك." },
        { q: "شحال هي مدة التوصيل؟", a: "من 24 إلى 48 ساعة حسب مدينتك فالمغرب." },
        { q: "فوقاش كتبان النتيجة؟", a: "تحسن فالترطيب والنضارة من الأسبوع 1–2، وامتلاء البشرة وقوة الشعر والأظافر كتبان واضحة من بعد 4–6 أسابيع." },
        { q: "كيفاش كنستعمل CollaGlow؟", a: "حبة واحدة يومياً (مضغ) فـ الصباح، بمذاق الرمان اللذيذ وبلا ما تحتاجي للماء." },
        { q: "واش نقدر نستعملو وأنا حاملة أو كنرضع؟", a: "من باب الاحتياط، استشيري طبيبك قبل بداية أي مكمل غذائي." },
        { q: "واش المكونات حلال؟", a: "نعم، كولاجين بحري حلال 100% مع قاعدة بكتين نباتية بدون أي مشتقات خنزير أو جيلاتين حيواني." },
      ],
    },
  },

  // ========================================================================
  // 4️⃣ KIT COLLAGÈNE — "Le Duo Collagène" (Inside & Outside)
  // slug: kit-collagene (also aliased as "kit")
  // ========================================================================
  "kit-collagene": {
    fr: {
      hero: {
        label: "WARDA BEAUTÉ · Collagène Inside & Outside",
        h1: "Le collagène qui agit de l'intérieur et de l'extérieur.",
        sub: "Le Duo Collagène combine CollaGlow (cure buvable) et VelvaStretch (crème corps) pour une action complète : fermeté nourrie de l'intérieur, élasticité renforcée à la surface de la peau.",
        pills: ["Inside : CollaGlow", "Outside : VelvaStretch", "Action complémentaire"],
        cta: "Commander le kit — payez à la livraison",
        trust: "✓ Paiement à la livraison · Livraison 24–72h selon votre ville.",
      },
      problem: {
        eyebrow: "On se comprend",
        h2: "Vergetures, manque de fermeté, éclat en berne : pourquoi un seul geste ne suffit pas ?",
        para: "La peau a deux besoins en même temps : être nourrie et soutenue de l'intérieur (collagène, hydratation) et être traitée localement sur les zones à risque (ventre, hanches, poitrine). Utiliser un seul produit, c'est ne traiter qu'une moitié du problème.",
        bullets: [
          "Vergetures qui s'installent malgré une crème seule",
          "Peau qui manque de fermeté globale",
          "Résultats qui stagnent avec une routine incomplète",
        ],
      },
      ingredients: {
        eyebrow: "La formule",
        h2: "Deux formules, une seule mission : le collagène.",
        para: "Les deux formules sont sans parabènes, non comédogènes, et transparentes sur leur composition complète.",
        items: [
          { num: "01", name: "CollaGlow (Inside)", desc: "Collagène marin hydrolysé, acide hyaluronique, vitamine C, biotine. Une cure buvable quotidienne." },
          { num: "02", name: "VelvaStretch (Outside)", desc: "Collagène marin, beurre de karité, centella asiatica, huile d'argan. Une crème corps quotidienne." },
          { num: "03", name: "Sans parabènes", desc: "Les deux formules sont sans parabènes, non comédogènes." },
          { num: "04", name: "Transparence totale", desc: "Composition complète affichée pour chaque produit du kit. Pas de promesses miracles." },
        ],
      },
      ritual: {
        h2: "Le rituel — matin & soir",
        steps: [
          "Matin : 1 sachet CollaGlow dilué dans un verre d'eau, à jeun.",
          "Journée : VelvaStretch appliqué en massage sur les zones concernées, dès le réveil ou après la douche.",
          "Soir : Nouvelle application de VelvaStretch avant le coucher.",
          "Constance : Poursuivre le kit sur 30 jours minimum pour une synergie complète.",
        ],
      },
      timeline: {
        eyebrow: "Résultat progressif",
        h2: "La double action et la régularité sont le secret d'un résultat qui va vous surprendre.",
        milestones: [
          { label: "Semaines 1–2", desc: "Une hydratation profonde de l'intérieur et de l'extérieur, avec un confort total et une peau d'une douceur soyeuse." },
          { label: "Semaines 2–3", desc: "Une peau raffermie et pleine d'éclat, avec une souplesse visible sur tout le corps." },
          { label: "Après 4 semaines", desc: "Une peau détendue, rebondie et plus ferme, les vergetures ne sont plus visibles, avec des cheveux et des ongles visiblement forts et pleins de vitalité." },
        ],
        callouts: [
          "🧴 Testez VelvaStretch 24h dans le pli du coude avant la première utilisation.",
          "💧 Hydratation quotidienne recommandée — buvez suffisamment d'eau.",
        ],
        disclaimer: "Résultats progressifs, variables selon les peaux. La constance du duo matin et soir est la clé.",
      },
      ctaMid: {
        cta: "Commander le kit — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      ctaMid2: {
        cta: "Commander le kit — payez à la livraison",
        trust: "✓ Paiement à la livraison, partout au Maroc.",
      },
      values: {
        eyebrow: "Pourquoi WARDA BEAUTÉ",
        h2: "Une marque marocaine, des standards exigeants.",
        pillars: [
          { title: "Fait au Maroc", desc: "Les deux produits formulés et conditionnés au Maroc." },
          { title: "Formule transparente", desc: "Composition complète affichée pour chaque produit du kit." },
          { title: "Douceur d'abord", desc: "Non comédogène, sans parabènes, testé dermatologiquement." },
        ],
        badges: ["Testé dermatologiquement", "Non comédogène", "Sans parabènes", "Cruelty free"],
      },
      testimonials: {
        eyebrow: "Elles en parlent",
        h2: "Vos retours, notre fierté.",
        items: [
          { quote: "J'utilise les deux produits ensemble depuis ma grossesse, je vois vraiment la différence.", name: "Zineb", city: "Casablanca", stars: 5 },
          { quote: "Le duo est plus simple que d'acheter deux produits à part, et l'économie est réelle.", name: "Karima", city: "Fès", stars: 5 },
          { quote: "Ma peau est plus ferme et plus lumineuse en même temps.", name: "Rania", city: "Marrakech", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "Votre kit",
        h2: "Le duo complet, à prix avantageux.",
        cards: [
          {
            title: "Kit Duo (1 CollaGlow + 1 VelvaStretch)",
            price: PRICES.kit.duo,
            originalPrice: 848,
            size: SIZES.kit.duo,
            duration: DURATIONS.kit.duo,
            badge: "Économisez 519 DH",
            savingText: "Économisez 519 DH (au lieu de 848 DH à l'unité)",
            cta: "Je commande le kit",
            isFeatured: true,
          },
          {
            title: "Kit Duo XL (2 cures, 2–3 mois)",
            price: PRICES.kit.duoXL,
            size: SIZES.kit.duoXL,
            duration: DURATIONS.kit.duoXL,
            badge: "Économisez 209 DH",
            savingText: "Économisez 209 DH",
            cta: "Je commande le kit XL",
          },
          // No triple for kit now — future placeholder if needed
        ],
        trust: "✓ Paiement à la livraison, partout au Maroc · Livraison 24–72h selon votre ville.",
      },
      gallery: [
        "flatlay des deux produits ensemble",
        "packshot studio duo",
        "boîte kit fermée + ouverte",
        "texture crème + sachet côte à côte",
        "modèle avec les deux produits en main",
        "zoom ingrédients communs (collagène)",
        "photo lifestyle routine matin",
        "avant/après flouté",
      ],
      orderForm: {
        eyebrow: "Votre kit",
        h2: "Commandez votre Kit Collagène",
        para: "Remplissez le formulaire — nous vous appelons pour confirmer. Vous ne payez qu'à la réception.",
        fields: ["Offre (radio : Kit Duo / Kit Duo XL)", "Nom complet", "Téléphone", "Ville & adresse"],
        badges: ["✓ Paiement à la livraison", "🚚 Livraison 24–72h", "🔒 Confidentialité"],
        cta: "Commander le kit — payez à la livraison",
        whatsappCta: "Commander sur WhatsApp",
      },
      faq: [
        { q: "Comment fonctionne le paiement à la livraison ?", a: "Commande en 1 minute, appel de confirmation, paiement en espèces au livreur." },
        { q: "Délais de livraison ?", a: "24 à 72h selon votre ville." },
        { q: "Pourquoi un kit plutôt qu'un seul produit ?", a: "Les deux produits agissent en complémentarité : l'un nourrit de l'intérieur, l'autre traite localement — pour une action plus complète." },
        { q: "Quand voir les résultats du duo ?", a: "Confort et hydratation dès 1–2 semaines ; fermeté et éclat plus visibles après 6–12 semaines d'utilisation combinée." },
        { q: "Puis-je l'utiliser enceinte ou allaitante ?", a: "Par précaution, demandez l'avis de votre médecin avant de démarrer le kit, notamment pour la cure buvable." },
        { q: "Et si le kit ne me convient pas ?", a: "Vérifiez le colis devant le livreur, refusez-le si endommagé. 7 jours pour signaler un problème via WhatsApp — échange ou remboursement selon le cas." },
      ],
    },
    ar: {
      hero: {
        label: "WARDA BEAUTÉ · كولاجين من الداخل ومن برا",
        h1: "الكولاجين المزدوج اللي كيخدم من الداخل ومن برا فنفس الوقت.",
        sub: "Kit Collagène كيجمع بين CollaGlow (حلوى كولاجين غنية للمضغ) و VelvaStretch (سيروم مرونة الجسم) لعلاج متكامل: تغذية وتماسك من الداخل، ومرونة ونعومة معززة على سطح البشرة.",
        pills: ["من الداخل: CollaGlow", "من برا: VelvaStretch", "علاج مزدوج متكامل"],
        cta: "طلبي الباك — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك مزيان",
        h2: "علامات التمدد، نقص المرونة، وفقدان النضارة: علاش علاج واحد ما كافيش؟",
        para: "البشرة كتحتاج جوج حوايج فنفس الوقت: تغذية وبناء الكولاجين من الداخل، وعلاج وترميم موضعي فالمناطق المعرضة للترهل وعلامات التمدد (البطن، الصدر، الأرداف، الفخذين). ملي كتستعملي كريم بوحدو، كتعالجي غير نص المشكل.",
        bullets: ["علامات التمدد كتبقى باينة بكريم سطحي بوحدو", "بشرة ناقصاها النضارة والتماسك العام", "نتائج بطيئة مع الروتين غير المكتمل"],
      },
      ingredients: {
        eyebrow: "التركيبة المزدوجة",
        h2: "جوج تركيبات فعالة لهدف واحد: استرجاع الكولاجين.",
        para: "جوج تركيبات بدون بارابين، ما كيسدوش المسام، وشفافية كاملة فالمكونات.",
        items: [
          { num: "01", name: "CollaGlow (من الداخل)", desc: "كولاجين بحري محلل، حمض الهيالورونيك، فيتامين C، وبيوتين. حلوى مضغ لذيذة يومية." },
          { num: "02", name: "VelvaStretch (من برا)", desc: "كولاجين بحري، زبدة الكاريتي، سنتيلا أسياتيكا، وزيت الأركان. سيروم يومي لمرونة الجسم." },
          { num: "03", name: "خالي من البارابين", desc: "جوج تركيبات آمنة، خفيفة وما كتسدش المسام." },
          { num: "04", name: "شفافية ومصداقية", desc: "لائحة المكونات كاملة ومعروضة بوضوح على كل عبوة." },
        ],
      },
      ritual: {
        h2: "الروتين اليومي — صباحاً ومساءً",
        steps: [
          "الصباح: حبة وحدة لذيذة من CollaGlow لمضغها وبداية يوم بنشاط وجمال.",
          "النهار: دهني سيروم VelvaStretch بحركات دائرية على المناطق المعنية بعد الدوش.",
          "المساء: دهنة خفيفة ثانية من VelvaStretch قبل النوم.",
          "المواظبة: كملي الباك لمدة شهر على الأقل باش تحصلي على الفائدة المزدوجة الكاملة.",
        ],
      },
      timeline: {
        eyebrow: "نتائج تدريجية مضاعفة",
        h2: "المفعول المزدوج والمداومة هوما السر ديال النتيجة اللي غادي تصدمك.",
        milestones: [
          { label: "السيمانة 1–2", desc: "ترطيب عميق من الداخل وبرا، مع راحة تامة ونعومة حريرية للبشرة." },
          { label: "السيمانة 2–3", desc: "لحم مشدود وفيه النضارة، مع مرونة واضحة فملمس الجلد كامل." },
          { label: "من بعد 4 سيمانات", desc: "بشرة مرتاحة، عامرة ومجبدة، علامات التمدد مكاتبقاش، وشعر وظفار بصحة وحيوية باينة للعين." },
        ],
        callouts: ["🧴 جربي VelvaStretch على ثنية الذراع قبل أول استعمال.", "💧 شربي الماء بكمية كافية يومياً لدعم الترطيب الداخلي."],
        disclaimer: "النتائج تدريجية وكتختلف حسب طبيعة البشرة. المواظبة اليومية هي سر النجاح.",
      },
      ctaMid: {
        cta: "طلبي الباك — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      ctaMid2: {
        cta: "طلبي الباك — الدفع عند الاستلام",
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية بمعايير جودة عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "جوج منتجات مصنعين ومعبأين فالمغرب بمراقبة جودة عالية." },
          { title: "تركيبة شفافة", desc: "لائحة المكونات معروضة بالكامل لكل منتج فالباك." },
          { title: "أمان ونعومة تامة", desc: "ما كيسدوش المسام، بدون بارابين، ومجربين عند أطباء الجلد." },
        ],
        badges: ["مجربين عند أطباء الجلد", "ما كيسدوش المسام", "بدون بارابين", "غير مجربين على الحيوانات"],
      },
      testimonials: {
        eyebrow: "شهادات حقيقية",
        h2: "آراء الزبونات ديالنا هي فخرنا.",
        items: [
          { quote: "كنستعمل الباك بجوج من وقت الحمل، وفرق كبير حسيت بيه فـ مرونة ونضارة جلدي.", name: "زينب", city: "الدار البيضاء", stars: 5 },
          { quote: "الباك كامل اقتصادي بزاف ومريح، والنتيجة ديال الكولاجين من الداخل وبرا بانت ليا دغيا.", name: "كريمة", city: "فاس", stars: 5 },
          { quote: "بشرتي ولات مشدودة ومشرقة فنفس الوقت، وعلامات التمدد مابقاوش كيبانو كاع كيف لول.", name: "رانيا", city: "مراكش", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "الباك ديالك",
        h2: "الثنائي الكامل، بتوفير استثنائي.",
        cards: [
          {
            title: "باك ثنائي (1 CollaGlow + 1 VelvaStretch)",
            price: PRICES.kit.duo,
            originalPrice: 598,
            size: "1 CollaGlow (25) + 1 VelvaStretch (60 مل)",
            duration: "علاج متكامل ديال شهر",
            badge: "وفّري 269 درهم",
            savingText: "وفّري 269 درهم (بدل 598 درهم كلا بوحدو)",
            cta: "بغيت نطلب الباك",
            isFeatured: true,
          },
          {
            title: "باك ثنائي مضاعف (2 CollaGlow + 2 VelvaStretch)",
            price: PRICES.kit.duoXL,
            size: "2 CollaGlow (50) + 2 VelvaStretch (120 مل)",
            duration: "علاج مكثف ديال شهرين لـ 3 أشهر",
            badge: "وفّري 209 درهم",
            savingText: "وفّري 209 درهم",
            cta: "بغيت نطلب الباك المضاعف",
          },
        ],
        trust: "✓ الدفع عند الاستلام فجميع مدن المغرب · التوصيل فـ 24 إلى 48 ساعة حسب مدينتك.",
      },
      gallery: [
        "flatlay des deux produits ensemble",
        "packshot studio duo",
        "boîte kit fermée + ouverte",
        "texture crème + sachet côte à côte",
        "modèle avec les deux produits en main",
        "zoom ingrédients communs (collagène)",
        "photo lifestyle routine matin",
        "avant/après flouté",
      ],
      orderForm: {
        eyebrow: "الباك ديالك",
        h2: "طلبي Kit Collagène ديالك دابا",
        para: "عمّري الاستمارة — غادي نتصلو بيك لتأكيد الطلب. ما كتخلصي حتى كتوصلك السلعة ليدك.",
        fields: ["العرض", "الاسم الكامل", "رقم الهاتف", "المدينة والعنوان"],
        badges: ["✓ الدفع عند الاستلام", "🚚 التوصيل فـ 24–48 ساعة", "🔒 معلوماتك في سرية تامة"],
        cta: "طلبي الباك — الدفع عند الاستلام",
        whatsappCta: "طلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيدوز الدفع عند الاستلام؟", a: "كتطلبي فدقيقة، كنتصلو بيك لتأكيد العنوان، وكتخلصي كاش للموزع ملي كيوصلك الكولي ليدك." },
        { q: "شحال هي مدة التوصيل؟", a: "من 24 إلى 48 ساعة فجميع مدن ومناطق المغرب." },
        { q: "علاش الباك أحسن من منتج واحد بوحدو؟", a: "حيت كيعالج المشكل من الجيهتين: CollaGlow كيبني ويغذي من الداخل، و VelvaStretch كيرمم ويشد الجلد من برا — لنتيجة أسرع وأقوى." },
        { q: "فوقاش كتبان نتيجة الباك المزدوج؟", a: "ترطيب ونعومة فورية من الأسبوع الأول؛ والتماسك ونقص علامات التمدد كيبان واضح ابتداءً من 4 إلى 8 أسابيع." },
        { q: "واش نقدر نستعملو وأنا حاملة أو كنرضع؟", a: "سيروم VelvaStretch آمن تماماً، وبالنسبة للمكمل الغذائي استشيري طبيبك أولاً كإجراء وقائي." },
        { q: "إيلا كان عندي أي سؤال؟", a: "فريق خدمة الزبناء ديالنا فـ الواتساب رهن إشارتك فـ أي وقت." },
      ],
    },
  },
} as const;

// Aliases for convenience — "kit" and "kit-collagene" point to same content
export const WARDAPagesAliases: Record<string, string> = {
  kit: "kit-collagene",
  "kit-collagene": "kit-collagene",
  velvastretch: "velvastretch",
  silkstop: "silkstop",
  collaglow: "collaglow",
};

// Helper to resolve page with alias support
export function getWardaPage(slug: string): { fr: WardaPageBlocks; ar: WardaPageBlocks } | undefined {
  const key = WARDAPagesAliases[slug] ?? slug;
  return (WARDAPages as Record<string, { fr: WardaPageBlocks; ar: WardaPageBlocks }>)[key];
}

// Re-usable micro-texts (footer, badges, CTAs) — from banque de micro-textes
export const MICRO_TEXTS = {
  fr: {
    footerBaseline: "Skincare honnête, née au Maroc.",
    badgeOrigin: "Fait au Maroc avec soin 🇲🇦",
    trustTriad: "✓ Paiement à la livraison · 🚚 Livraison 24–72h · 🔒 Informations confidentielles",
    ctaMain: "Commander — payez à la livraison",
    ctaWhatsApp: "Commander sur WhatsApp",
    footerInfos: "Livraison partout au Maroc, paiement à la réception.",
  },
  ar: {
    footerBaseline: "عناية طبيعية وصادقة بالبشرة، تولدات فالمغرب.",
    badgeOrigin: "صنع فالمغرب بعناية 🇲🇦",
    trustTriad: "✓ الدفع عند الاستلام · 🚚 التوصيل فـ 24–48 ساعة · 🔒 سرية وأمان تام",
    ctaMain: "طلبي دابا — الدفع عند الاستلام",
    ctaWhatsApp: "طلبي عبر واتساب",
    footerInfos: "التوصيل لجميع مدن المغرب، والدفع عند الاستلام.",
  },
} as const;

// Price helper — format MAD
export function formatPriceMAD(price: number): string {
  return `${price} DH`;
}
export function formatPriceMADAr(price: number): string {
  return `${price} درهم`;
}
