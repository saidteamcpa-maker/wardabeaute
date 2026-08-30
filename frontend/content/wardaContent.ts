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

/** Prices in MAD — previous pricing restored (from content/products.ts) */
export const PRICES = {
  velvastretch: { single: 279, duo: 499, triple: 699 },
  silkstop: { single: 229, duo: 419, triple: 599 },
  collaglow: { single: 319, duo: 569, triple: 799 },
  kit: { duo: 549, duoXL: 999 }, // kit duo 549 (prev), duoXL 2×549=1098 placeholder 999 TODO
} as const;

/** Savings computed from previous offers */
export const SAVINGS = {
  velvastretchDuo: 59, // 2×279 - 499 = 59
  velvastretchTriple: 138, // 3×279 - 699 = 138
  silkstopDuo: 39, // 2×229 - 419 = 39
  silkstopTriple: 88, // 3×229 - 599 = 88 (catalog shows 90, using 88)
  collaglowDuo: 69, // 2×319 - 569 = 69
  collaglowTriple: 158, // 3×319 - 799 = 158
  kitDuo: 299, // 848 - 549 = 299
  kitDuoXL: 99, // placeholder
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
        sub: "VelvaStretch associe le collagène marin, le beurre de karité pur et la centella asiatica pour aider à prévenir et estomper l'apparence des vergetures, jour après jour.",
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
        h2: "La régularité fait la différence.",
        milestones: [
          { label: "Semaines 1–2", desc: "Peau plus souple, hydratée et confortable dès les premières applications." },
          { label: "Semaines 4–8", desc: "Sensation de fermeté renforcée, tiraillements atténués." },
          { label: "Après 3 mois", desc: "L'apparence des vergetures paraît visiblement réduite avec une utilisation quotidienne." },
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
            title: "1 pot",
            price: PRICES.velvastretch.single,
            size: SIZES.velvastretch.single,
            duration: DURATIONS.velvastretch.single,
            cta: "Je commande",
          },
          {
            title: "2 pots",
            price: PRICES.velvastretch.duo,
            size: SIZES.velvastretch.duo,
            duration: DURATIONS.velvastretch.duo,
            badge: "Économisez 59 DH",
            savingText: "Économisez 59 DH",
            cta: "Je commande",
            isFeatured: true,
          },
          {
            title: "3 pots",
            price: PRICES.velvastretch.triple,
            size: SIZES.velvastretch.triple,
            duration: DURATIONS.velvastretch.triple,
            badge: "Économisez 138 DH",
            savingText: "Économisez 138 DH",
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
          a: "La peau est plus souple dès les premières semaines ; l'apparence des vergetures s'atténue progressivement, en général après 2 à 3 mois d'utilisation régulière.",
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
        label: "WARDA BEAUTÉ · نعومة و مرونة",
        h1: "رجعي لبشرتك المرونة ديالها، بلا ما تقلقي.",
        sub: "VelvaStretch كيجمع بين الكولاجين البحري، زبدة الكاريتي الأصلية، و السنتيلا أسياتيكا باش يعاون يوقف و يخفف من ظهور علامات التمدد، نهار على نهار.",
        pills: ["كولاجين بحري", "زبدة الكاريتي", "الحمل و تغيير الوزن"],
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك",
        h2: "الحمل، تبدل الوزن، النمو ديال المراهقة… الجلد كيتمدد و العلامات كتبان؟",
        para: "الكرش كيكبر، الجسم كيتبدل بسرعة، أو مرحلة المراهقة: الجلد كيتمدد أسرع من اللي يقدر يتبع، و ألياف الكولاجين كتبقى عليها علامة. ماشي قدر محتوم — روتين منتظم بمكونات فعالة كيعاون بشرتك تبقى مرنة.",
        bullets: ["علامات تمدد ورديّة ولا بيضاء كتبان", "جلد حاس بالشد و عدم الراحة", "نقص فالتماسك فالكرش، الحوض، الصدر، الفخدين"],
      },
      ingredients: {
        eyebrow: "التركيبة",
        h2: "مكونات معروفة للتماسك، بشفافية كاملة.",
        para: "تركيبة غنية ولكن ماشي دهنية، مدروسة للبشرة المغربية. بلا بارابين، ما كتسدش المسام.",
        items: [
          { num: "01", name: "الكولاجين البحري", desc: "كيعاون يدعم المرونة الطبيعية ديال الجلد و الكثافة ديالو." },
          { num: "02", name: "زبدة الكاريتي الأصلية", desc: "كتغذي بعمق و كتعاون تقوي حاجز البشرة." },
          { num: "03", name: "سنتيلا أسياتيكا", desc: "معروفة بكونها كتعاون تلطف و تريح الجلد اللي حاس بالشد." },
          { num: "04", name: "زيت أركان و فيتامين E", desc: "تغذية عميقة و حماية مضادة للأكسدة — البصمة المغربية ديالنا." },
        ],
      },
      ritual: {
        h2: "الروتين ديال الاستعمال",
        steps: [
          "صباحا و ليلا، فوق بشرة نظيفة، يستحسن من بعد الدوش.",
          "حطي كمية سخية فالمناطق المعنية (الكرش، الحوض، الصدر، الفخدين).",
          "دلكي بحركات دائرية حتى يتشرب مزيان، و ركزي على المناطق الجافة.",
          "للمرأة الحامل: من الشهر 3، طبقي كل نهار باش تعاوني بشرتك فالتمدد.",
        ],
      },
      timeline: {
        eyebrow: "نتيجة تدريجية",
        h2: "المواظبة هي لي كتصنع الفرق.",
        milestones: [
          { label: "الأسبوع 1–2", desc: "بشرة أكثر مرونة، مرطبة و مرتاحة من أول استعمالات." },
          { label: "الأسبوع 4–8", desc: "حس بتماسك أكثر، الشد كيقل." },
          { label: "من بعد 3 أشهر", desc: "علامات التمدد كتبان أخف بكثير مع الاستعمال اليومي." },
        ],
        callouts: ["🧴 قبل أول استعمال، جربي الكريم 24 ساعة فثنية الذراع.", "☀️ فحالة التعرض للشمس، حمي المناطق اللي طبقتي فيها."],
        disclaimer: "النتائج تدريجية و كتبدل من بشرة لأخرى. المواظبة صباحا و ليلا هي السر.",
      },
      ctaMid: {
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      ctaMid2: {
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية، بمعايير عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "متصنعة و معلبة فالمغرب، مدروسة لبشرتنا و للمناخ ديالنا." },
          { title: "تركيبة شفافة", desc: "لائحة كاملة ديال المكونات فوق كل علبة. بلا وعود خارقة." },
          { title: "النعومة قبل كلشي", desc: "ما كتسدش المسام، بلا بارابين، مجربة عند أطباء الجلدية." },
        ],
        badges: ["مجربة عند أطباء الجلدية", "ما كتسدش المسام", "بلا بارابين", "ماشي مجربة على الحيوانات"],
      },
      testimonials: {
        eyebrow: "كيهضرو عليه",
        h2: "الآراء ديالكم، فخرنا.",
        items: [
          { quote: "من الحمل ديالي و أنا كنستعمل VelvaStretch، البشرة ديالي بقات مرنة و العلامات قلات بزاف.", name: "فاطمة الزهراء", city: "الدار البيضاء", stars: 5 },
          { quote: "قوام غني ولكن كيتشرب بسرعة، ما فيهش الدبزة. كنحطو كل ليلة.", name: "نوال", city: "مراكش", stars: 5 },
          { quote: "أخيرا كريم مغربي جدي، و الخلاص عند الاستلام طمنني.", name: "سارة", city: "الرباط", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "العلاج ديالك",
        h2: "ختاري العرض ديالك.",
        cards: [
          {
            title: "علبة وحدة",
            price: PRICES.velvastretch.single,
            size: "60 مل",
            duration: "تقريبا شهر",
            cta: "بغيت نطلب",
          },
          {
            title: "جوج علب",
            price: PRICES.velvastretch.duo,
            size: "2×60 مل",
            duration: "علاج كامل ديال شهرين لـ 3",
            badge: "وفري 59 درهم",
            savingText: "وفري 59 درهم",
            cta: "بغيت نطلب",
            isFeatured: true,
          },
          {
            title: "3 علب",
            price: PRICES.velvastretch.triple,
            size: "3×60 مل",
            duration: "علاج كامل ديال 3 لـ 4 أشهر",
            badge: "وفري 138 درهم",
            savingText: "وفري 138 درهم",
            cta: "بغيت نطلب",
          },
        ],
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
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
        h2: "أطلبي VelvaStretch ديالك",
        para: "عمري الاستمارة — غادي نتصلو بيك باش نأكدو الطلب. ما كتخلصيش حتى توصلك السلعة.",
        fields: ["العرض (radio)", "الاسم الكامل", "رقم الهاتف", "المدينة و عنوان التوصيل"],
        badges: ["✓ الخلاص عند الاستلام", "🚚 التوصيل من 24 لـ 72 ساعة", "🔒 المعلومات ديالك تبقى سرية"],
        cta: "أطلبي دابا — خلصي عند الاستلام",
        whatsappCta: "أطلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيخدم الخلاص عند الاستلام؟", a: "كتطلبي فدقيقة، غادي نعيطو ليك باش نأكدو، و من بعد كتخلصي للموصل كاش من غير ما توصلك السلعة. حتى خلاص أونلاين." },
        { q: "شحال كيدوز الوقت ديال التوصيل؟", a: "غالبا من 24 لـ 72 ساعة حسب المدينة ديالك، فكل المغرب." },
        { q: "فوقاش غادي نشوف النتيجة؟", a: "البشرة كتولي أكثر مرونة من أول أسابيع؛ علامات التمدد كتبان كتخف بالتدريج، غالبا من بعد شهرين لـ 3 ديال الاستعمال المنتظم." },
        { q: "واش نقدر نستعملو و أنا حامل؟", a: "أيه، التركيبة مدروسة باش تعاون فترة الحمل. من باب الاحتياط، سولي طبيبك قبل أي منتوج جديد." },
        { q: "واش يصلح للبشرة الحساسة؟", a: "تركيبة لطيفة، ما كتسدش المسام، بلا بارابين. ديري تجربة 24 ساعة قبل أول استعمال." },
        { q: "إلا ما عجبنيش المنتوج؟", a: "فحصي الطرد قدام الموصل و رفضيه إلا كان متضرر. من بعد عندك 7 أيام باش تخبرينا بأي مشكل عبر واتساب — تبديل أو استرجاع الفلوس حسب الحالة." },
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
        h2: "La régularité fait la différence.",
        milestones: [
          { label: "Jours 1–3", desc: "Apaisement immédiat, moins de rougeurs après l'épilation." },
          { label: "Semaines 1–2", desc: "Repousse visiblement ralentie, moins de poils incarnés." },
          { label: "Après 4–6 semaines", desc: "Peau durablement plus douce, poils plus fins à la repousse." },
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
            title: "1 flacon",
            price: PRICES.silkstop.single,
            size: SIZES.silkstop.single,
            duration: DURATIONS.silkstop.single,
            cta: "Je commande",
          },
          {
            title: "2 flacons",
            price: PRICES.silkstop.duo,
            size: SIZES.silkstop.duo,
            duration: DURATIONS.silkstop.duo,
            badge: "Économisez 39 DH",
            savingText: "Économisez 39 DH",
            cta: "Je commande",
            isFeatured: true,
          },
          {
            title: "3 flacons",
            price: PRICES.silkstop.triple,
            size: SIZES.silkstop.triple,
            duration: DURATIONS.silkstop.triple,
            badge: "Économisez 88 DH",
            savingText: "Économisez 88 DH",
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
        h1: "بشرة ناعمة لمدة أطول، بلا ما يبان الشعر بسرعة.",
        sub: "SilkStop كيجمع بين خلاصة الببايا، حمض الغليكوليك اللطيف، و الألوفيرا باش يعاون يبطئ ظهور الشعر من جديد و يوقف مشكل الشعر النابت تحت الجلد.",
        pills: ["خلاصة الببايا", "ضد الشعر النابت", "نعومة تفوق 7 أيام"],
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك",
        h2: "الشعر كيبان بسرعة، حكة و شعر نابت تحت الجلد؟",
        para: "الحلاقة، الشمع، ولا الإبيلاتور… من بعد شي جوج تلاتة ديال الأيام، الشعر كيرجع يبان، البشرة كتحس بالشد، و كتبان بثور حمر صغار. حركة بسيطة من بعد كل إزالة للشعر تقدر تبدل كلشي.",
        bullets: ["الشعر كيبان من جديد فمدة قصيرة", "شعر نابت تحت الجلد و بثور حمر صغار", "بشرة كتحس بالحكة و خاصها النعومة"],
      },
      ingredients: {
        eyebrow: "التركيبة",
        h2: "مكونات مستهدفة، بشفافية كاملة.",
        para: "تركيبة خفيفة، كتتشرب بسرعة، مدروسة لكل مناطق الجسم. بلا بارابين، ما كتسدش المسام.",
        items: [
          { num: "01", name: "خلاصة الببايا", desc: "إنزيم طبيعي كيعاون يرقق الشعرة و يبطئ ظهورها من جديد." },
          { num: "02", name: "حمض الغليكوليك اللطيف", desc: "مقشر خفيف كيعاون يوقف الشعر النابت تحت الجلد و يلين البشرة." },
          { num: "03", name: "الألوفيرا", desc: "كيلطف مباشرة المناطق اللي تزالت فيها الشعر و كيقلل الاحمرار." },
          { num: "04", name: "زيت الجوجوبا و فيتامين E", desc: "كيغذي بلا ما يدهن و كيحمي البشرة على المدى الطويل." },
        ],
      },
      ritual: {
        h2: "الروتين ديال الاستعمال",
        steps: [
          "طبقي على بشرة نظيفة و جافة، مباشرة من بعد إزالة الشعر ولا الحلاقة.",
          "رشي ولا حطي 2 لـ 3 ضغطات فوق المناطق المعنية.",
          "دلكي بخفة حتى يتشرب، من غير ما تصبني.",
          "عاودي كل يومين باش تحصلي على أحسن نتيجة.",
        ],
      },
      timeline: {
        eyebrow: "نتيجة تدريجية",
        h2: "المواظبة هي لي كتصنع الفرق.",
        milestones: [
          { label: "النهار 1–3", desc: "ارتياح مباشر، احمرار أقل من بعد الإزالة." },
          { label: "الأسبوع 1–2", desc: "الشعر كيبان بشكل أبطأ، الشعر النابت تحت الجلد كيقل." },
          { label: "من بعد 4–6 أسابيع", desc: "بشرة ناعمة على المدى الطويل، الشعر كيبان أرق." },
        ],
        callouts: ["🧴 قبل أول استعمال، جربي السيروم 24 ساعة فثنية الذراع.", "☀️ تجنبي التعرض المباشر للشمس مباشرة من بعد التطبيق على المناطق اللي تزالت فيها الشعر."],
        disclaimer: "النتائج تدريجية و كتبدل حسب البشرة و نوع الشعر.",
      },
      ctaMid: {
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      ctaMid2: {
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية، بمعايير عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "متصنعة و معلبة فالمغرب." },
          { title: "تركيبة شفافة", desc: "لائحة كاملة ديال المكونات فوق كل علبة." },
          { title: "النعومة قبل كلشي", desc: "ما كتسدش المسام، بلا بارابين، مجربة عند أطباء الجلدية." },
        ],
        badges: ["مجربة عند أطباء الجلدية", "ما كتسدش المسام", "بلا بارابين", "ماشي مجربة على الحيوانات"],
      },
      testimonials: {
        eyebrow: "كيهضرو عليه",
        h2: "الآراء ديالكم، فخرنا.",
        items: [
          { quote: "من ساعة اللي كنستعملو من بعد الإزالة، ماشي بقى عندي شعر نابت!", name: "خديجة", city: "فاس", stars: 5 },
          { quote: "الشعر كياخد وقت بزاف باش يرجع يبان، صراحة تفاجات.", name: "مريم", city: "طنجة", stars: 5 },
          { quote: "التوصيل سريع و الخلاص عند الاستلام، كنصاوب عليه.", name: "هند", city: "أكادير", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "العلاج ديالك",
        h2: "ختاري العرض ديالك.",
        cards: [
          { title: "قنينة وحدة", price: PRICES.silkstop.single, size: "30 مل", duration: "تقريبا شهر", cta: "بغيت نطلب" },
          { title: "جوج قنيني", price: PRICES.silkstop.duo, size: "2×30 مل", duration: "علاج كامل ديال شهرين", badge: "وفري 39 درهم", savingText: "وفري 39 درهم", cta: "بغيت نطلب", isFeatured: true },
          { title: "3 قنيني", price: PRICES.silkstop.triple, size: "3×30 مل", duration: "علاج كامل ديال 3 أشهر", badge: "وفري 88 درهم", savingText: "وفري 88 درهم", cta: "بغيت نطلب" },
        ],
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
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
        h2: "أطلبي SilkStop ديالك",
        para: "عمري الاستمارة — غادي نتصلو بيك باش نأكدو الطلب. ما كتخلصيش حتى توصلك السلعة.",
        fields: ["العرض (radio)", "الاسم الكامل", "رقم الهاتف", "المدينة و العنوان"],
        badges: ["✓ الخلاص عند الاستلام", "🚚 التوصيل من 24 لـ 72 ساعة", "🔒 السرية"],
        cta: "أطلبي دابا — خلصي عند الاستلام",
        whatsappCta: "أطلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيخدم الخلاص عند الاستلام؟", a: "طلب فدقيقة، عيط للتأكيد، خلاص كاش للموصل." },
        { q: "شحال كيدوز وقت التوصيل؟", a: "من 24 لـ 72 ساعة حسب مدينتك." },
        { q: "فوقاش نشوف النتيجة؟", a: "ارتياح مباشر، و الشعر كيبطئ ظهوره من الأسبوع 1–2." },
        { q: "واش يصلح لكل المناطق؟", a: "أيه، الوجه (المناطق المسموحة)، الرجلين، الإبط، البيكيني — تجنبي الأغشية المخاطية." },
        { q: "واش نقدر نستعملو و أنا حامل ولا كنرضع؟", a: "من باب الاحتياط، سولي طبيبك ولا الصيدلي." },
        { q: "إلا ما عجبنيش؟", a: "فحصي الطرد قدام الموصل و رفضيه إلا كان متضرر. عندك 7 أيام باش تخبرينا عبر واتساب." },
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
        h2: "La régularité fait la différence.",
        milestones: [
          { label: "Semaines 1–2", desc: "Peau plus hydratée, sensation de confort." },
          { label: "Semaines 3–4", desc: "Éclat plus visible, teint plus reposé." },
          { label: "Après 8 semaines", desc: "Peau plus ferme, cheveux et ongles renforcés." },
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
            badge: "Économisez 69 DH",
            savingText: "Économisez 69 DH",
            cta: "Je commande",
            isFeatured: true,
          },
          {
            title: "Cure 75 jours",
            price: PRICES.collaglow.triple,
            size: SIZES.collaglow.triple,
            duration: DURATIONS.collaglow.triple,
            badge: "Économisez 158 DH",
            savingText: "Économisez 158 DH",
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
        label: "WARDA BEAUTÉ · إشراق كيجي من الداخل",
        h1: "بشرة ممتلئة و مشرقة، بداية من الداخل.",
        sub: "CollaGlow كيجمع بين الكولاجين البحري المحلل، حمض الهيالورونيك، و فيتامين C باش يعاون يدعم التماسك، الترطيب، و الإشراق الطبيعي ديال بشرتك.",
        pills: ["كولاجين بحري محلل", "فيتامين C", "علاج ديال 30 يوم"],
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك",
        h2: "البشرة كتخسر التماسك ديالها، الشعر و الظفار ولاو هشين؟",
        para: "مع الوقت، الضغط، ولا من بعد الحمل، الإنتاج الطبيعي ديال الكولاجين كيبطئ. البشرة كتولي رقيقة، الشعر و الظفار كيولاو هشين. علاج منتظم كيعاون الجسم يعوض هاد النقص من الداخل.",
        bullets: ["البشرة كتخسر التماسك و الإشراق", "أول تجاعيد صغار كتبان", "شعر و ظفار سهلين الكسر"],
      },
      ingredients: {
        eyebrow: "التركيبة",
        h2: "مكونات معروفة، بشفافية كاملة.",
        para: "تركيبة مركزة، بلا سكر مزاد، بلا نكهة صناعية.",
        items: [
          { num: "01", name: "كولاجين بحري محلل", desc: "بروتينات صغيرة، سهلة الامتصاص من طرف الجسم." },
          { num: "02", name: "حمض الهيالورونيك", desc: "كيعاون يحتفظ بالترطيب فقلب البشرة." },
          { num: "03", name: "فيتامين C", desc: "عنصر أساسي فالتصنيع الطبيعي ديال الكولاجين، بمفعول مضاد للأكسدة." },
          { num: "04", name: "البيوتين (فيتامين B8)", desc: "كيساهم فالحفاظ على شعر و ظفار فحالة طبيعية." },
        ],
      },
      ritual: {
        h2: "الروتين ديال الاستعمال",
        steps: [
          "كيس/جرعة وحدة فالنهار، يستحسن فالصباح على الريق.",
          "حليها فكاس ديال الما ولا العصير اللي بغيتي.",
          "خلطي مزيان و شربي مباشرة.",
          "كملي العلاج لمدة 30 يوم على الأقل باش تحصلي على أحسن نتيجة.",
        ],
      },
      timeline: {
        eyebrow: "نتيجة تدريجية",
        h2: "المواظبة هي لي كتصنع الفرق.",
        milestones: [
          { label: "الأسبوع 1–2", desc: "بشرة أكثر ترطيب، إحساس بالراحة." },
          { label: "الأسبوع 3–4", desc: "إشراق كيبان أكثر، بشرة مرتاحة." },
          { label: "من بعد 8 أسابيع", desc: "بشرة أكثر تماسك، شعر و ظفار أقوى." },
        ],
        callouts: ["🥤 خصها تكون مصحوبة بترطيب كافي (الما) باش تحصلي على أحسن نتيجة.", "💧 شربي الما بزاف يوميا."],
        disclaimer: "النتائج تدريجية و كتبدل من جسم لآخر. المواظبة اليومية هي السر.",
      },
      ctaMid: {
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      ctaMid2: {
        cta: "أطلبي دابا — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية، بمعايير عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "معلب فالمغرب، مراقبة جودة صارمة." },
          { title: "تركيبة شفافة", desc: "التركيبة الكاملة معروضة، بلا سكر مزاد." },
          { title: "النعومة قبل كلشي", desc: "بلا كلوتين*، بلا نكهة صناعية." },
        ],
        badges: ["بلا سكر مزاد", "بلا نكهة صناعية", "مراقب الجودة", "ماشي مجربة على الحيوانات"],
      },
      testimonials: {
        eyebrow: "كيهضرو عليه",
        h2: "الآراء ديالكم، فخرنا.",
        items: [
          { quote: "من بعد شهر، البشرة ديالي بانت واضح أكثر إشراقا.", name: "غيثة", city: "الدار البيضاء", stars: 5 },
          { quote: "سهل باش تدخليه فروتين ديالك، و الظفار ديالي بقاو ما كيتكسروش.", name: "لبنى", city: "سلا", stars: 5 },
          { quote: "الطعم عادي، كيتخلط مزيان مع الما. غادي نكمل العلاج.", name: "أسماء", city: "وجدة", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "العلاج ديالك",
        h2: "ختاري العرض ديالك.",
        cards: [
          { title: "علاج 25 يوم", price: PRICES.collaglow.single, size: "25 gummies", duration: "علاج ديال 25 يوم", cta: "بغيت نطلب" },
          { title: "علاج 50 يوم", price: PRICES.collaglow.duo, size: "50 gummies", duration: "علاج ديال 50 يوم", badge: "وفري 69 درهم", savingText: "وفري 69 درهم", cta: "بغيت نطلب", isFeatured: true },
          { title: "علاج 75 يوم", price: PRICES.collaglow.triple, size: "75 gummies", duration: "علاج ديال 75 يوم", badge: "وفري 158 درهم", savingText: "وفري 158 درهم", cta: "بغيت نطلب" },
        ],
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
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
        h2: "أطلبي CollaGlow ديالك",
        para: "عمري الاستمارة — غادي نتصلو بيك باش نأكدو الطلب. ما كتخلصيش حتى توصلك السلعة.",
        fields: ["العرض (radio)", "الاسم الكامل", "رقم الهاتف", "المدينة و العنوان"],
        badges: ["✓ الخلاص عند الاستلام", "🚚 التوصيل من 24 لـ 72 ساعة", "🔒 السرية"],
        cta: "أطلبي دابا — خلصي عند الاستلام",
        whatsappCta: "أطلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيخدم الخلاص عند الاستلام؟", a: "طلب فدقيقة، عيط للتأكيد، خلاص كاش للموصل." },
        { q: "شحال كيدوز وقت التوصيل؟", a: "من 24 لـ 72 ساعة حسب مدينتك." },
        { q: "فوقاش نشوف النتيجة؟", a: "ترطيب من الأسبوع 1–2، إشراق و تماسك أكثر وضوح من بعد 6–8 أسابيع." },
        { q: "كيفاش نستعمل CollaGlow؟", a: "كيس وحد فالنهار، محلول فالما ولا العصير، يستحسن فالصباح." },
        { q: "واش نقدر نستعملو و أنا حامل ولا كنرضع؟", a: "من باب الاحتياط، سولي طبيبك قبل أي علاج بالمكملات." },
        { q: "إلا ما عجبنيش؟", a: "فحصي الطرد قدام الموصل و رفضيه إلا كان متضرر. عندك 7 أيام باش تخبرينا عبر واتساب." },
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
        h2: "L'action combinée, la régularité fait la différence.",
        milestones: [
          { label: "Semaines 1–2", desc: "Peau hydratée en surface et en profondeur, confort immédiat." },
          { label: "Semaines 4–6", desc: "Fermeté plus visible, tiraillements atténués, teint plus lumineux." },
          { label: "Après 8–12 semaines", desc: "Apparence des vergetures réduite, peau visiblement plus ferme et repulpée." },
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
            badge: "Économisez 299 DH",
            savingText: "Économisez 299 DH (au lieu de 848 DH à l'unité)",
            cta: "Je commande le kit",
            isFeatured: true,
          },
          {
            title: "Kit Duo XL (2 cures, 2–3 mois)",
            price: PRICES.kit.duoXL,
            size: SIZES.kit.duoXL,
            duration: DURATIONS.kit.duoXL,
            badge: "Économisez 99 DH",
            savingText: "Économisez 99 DH",
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
        label: "WARDA BEAUTÉ · كولاجين من الداخل و من الخارج",
        h1: "الكولاجين اللي كيخدم من الداخل و من الخارج فنفس الوقت.",
        sub: "Le Duo Collagène كيجمع بين CollaGlow (العلاج الشروب) و VelvaStretch (كريم الجسم) لعمل كامل: تماسك مغذى من الداخل، و مرونة معززة على سطح البشرة.",
        pills: ["من الداخل: CollaGlow", "من الخارج: VelvaStretch", "عمل مكمل"],
        cta: "أطلبي الكيت — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
      },
      problem: {
        eyebrow: "كنفهموك",
        h2: "علامات التمدد، نقص التماسك، الإشراق ناقص: علاش حركة وحدة ما كافياش؟",
        para: "البشرة عندها حاجتين فنفس الوقت: تتغذى و تتدعم من الداخل (كولاجين، ترطيب) و تتعالج محليا فالمناطق المعرضة (الكرش، الحوض، الصدر). كتستعملي منتوج وحد بوحدو، كتعالجي غير نص المشكل.",
        bullets: ["علامات التمدد كتبقى موجودة حتى بكريم بوحدو", "بشرة ناقصها التماسك العام", "نتائج واقفة مع روتين ناقص"],
      },
      ingredients: {
        eyebrow: "التركيبة",
        h2: "جوج تركيبات، مهمة وحدة: الكولاجين.",
        para: "جوج التركيبات بلا بارابين، ما كيسدوش المسام، و شفافين فالتركيبة الكاملة ديالهم.",
        items: [
          { num: "01", name: "CollaGlow (من الداخل)", desc: "كولاجين بحري محلل، حمض الهيالورونيك، فيتامين C، بيوتين. علاج شروب يومي." },
          { num: "02", name: "VelvaStretch (من الخارج)", desc: "كولاجين بحري، زبدة الكاريتي، سنتيلا أسياتيكا، زيت أركان. كريم جسم يومي." },
          { num: "03", name: "بلا بارابين", desc: "جوج التركيبات بلا بارابين، ما كيسدوش المسام." },
          { num: "04", name: "شفافية كاملة", desc: "التركيبة الكاملة معروضة لكل منتوج فالكيت." },
        ],
      },
      ritual: {
        h2: "الروتين — صباحا و ليلا",
        steps: [
          "الصباح: كيس CollaGlow محلول فكاس ديال الما، على الريق.",
          "النهار: VelvaStretch مدلوك على المناطق المعنية، من بعد الصحيان ولا من بعد الدوش.",
          "الليل: تطبيق آخر ديال VelvaStretch قبل النوم.",
          "المواظبة: كملي الكيت لمدة 30 يوم على الأقل باش تحصلي على التآزر الكامل.",
        ],
      },
      timeline: {
        eyebrow: "نتيجة تدريجية",
        h2: "العمل المزدوج، و المواظبة هي لي كتصنع الفرق.",
        milestones: [
          { label: "الأسبوع 1–2", desc: "بشرة مرطبة من السطح و من العمق، راحة مباشرة." },
          { label: "الأسبوع 4–6", desc: "تماسك كيبان أكثر، الشد كيقل، البشرة أكثر إشراقا." },
          { label: "من بعد 8–12 أسبوع", desc: "علامات التمدد كتبان أقل، بشرة أكثر تماسكا و امتلاء." },
        ],
        callouts: ["🧴 جربي VelvaStretch 24 ساعة فثنية الذراع قبل أول استعمال.", "💧 شربي الما بزاف يوميا."],
        disclaimer: "النتائج تدريجية و كتبدل من بشرة لأخرى. المواظبة على الديو صباحا و ليلا هي السر.",
      },
      ctaMid: {
        cta: "أطلبي الكيت — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      ctaMid2: {
        cta: "أطلبي الكيت — خلصي عند الاستلام",
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب.",
      },
      values: {
        eyebrow: "علاش WARDA BEAUTÉ",
        h2: "ماركة مغربية، بمعايير عالية.",
        pillars: [
          { title: "صنع فالمغرب", desc: "جوج المنتوجات متصنعين و معلبين فالمغرب." },
          { title: "تركيبة شفافة", desc: "التركيبة الكاملة معروضة لكل منتوج فالكيت." },
          { title: "النعومة قبل كلشي", desc: "ما كيسدوش المسام، بلا بارابين، مجربين عند أطباء الجلدية." },
        ],
        badges: ["مجربين عند أطباء الجلدية", "ما كيسدوش المسام", "بلا بارابين", "ماشي مجربين على الحيوانات"],
      },
      testimonials: {
        eyebrow: "كيهضرو عليه",
        h2: "الآراء ديالكم، فخرنا.",
        items: [
          { quote: "كنستعمل جوج المنتوجات مع بعض من الحمل ديالي، كنشوف الفرق بزاف.", name: "زينب", city: "الدار البيضاء", stars: 5 },
          { quote: "الديو أسهل من ما تشري جوج منتوجات بوحدهم، و التوفير حقيقي.", name: "كريمة", city: "فاس", stars: 5 },
          { quote: "البشرة ديالي ولات أكثر تماسك و إشراق فنفس الوقت.", name: "رانيا", city: "مراكش", stars: 5 },
        ],
      },
      pricing: {
        eyebrow: "الكيت ديالك",
        h2: "الديو الكامل، بثمن مناسب.",
        cards: [
          {
            title: "كيت ديو (CollaGlow وحدة + VelvaStretch وحدة)",
            price: PRICES.kit.duo,
            originalPrice: 848,
            size: "1 CollaGlow + 1 VelvaStretch",
            duration: "cure d'1 mois",
            badge: "وفري 299 درهم",
            savingText: "وفري 299 درهم (بدل 848 درهم كلا بوحدو)",
            cta: "بغيت نطلب الكيت",
            isFeatured: true,
          },
          {
            title: "كيت ديو XL (جوج علاجات، شهرين لـ 3)",
            price: PRICES.kit.duoXL,
            size: "2 CollaGlow + 2 VelvaStretch",
            duration: "شهرين لـ 3",
            badge: "وفري 99 درهم",
            savingText: "وفري 99 درهم",
            cta: "بغيت نطلب الكيت XL",
          },
        ],
        trust: "✓ الخلاص عند الاستلام، فكل مدن المغرب · التوصيل من 24 لـ 72 ساعة حسب مدينتك.",
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
        eyebrow: "الكيت ديالك",
        h2: "أطلبي Kit Collagène ديالك",
        para: "عمري الاستمارة — غادي نتصلو بيك باش نأكدو الطلب. ما كتخلصيش حتى توصلك السلعة.",
        fields: ["العرض (radio: Kit Duo / Kit Duo XL)", "الاسم الكامل", "رقم الهاتف", "المدينة و العنوان"],
        badges: ["✓ الخلاص عند الاستلام", "🚚 التوصيل من 24 لـ 72 ساعة", "🔒 السرية"],
        cta: "أطلبي الكيت — خلصي عند الاستلام",
        whatsappCta: "أطلبي عبر واتساب",
      },
      faq: [
        { q: "كيفاش كيخدم الخلاص عند الاستلام؟", a: "طلب فدقيقة، عيط للتأكيد، خلاص كاش للموصل." },
        { q: "شحال كيدوز وقت التوصيل؟", a: "من 24 لـ 72 ساعة حسب مدينتك." },
        { q: "علاش كيت و ماشي منتوج وحد؟", a: "جوج المنتوجات كيخدمو مكملين لبعضهم: واحد كيغذي من الداخل، و الآخر كيعالج محليا — لعمل أكثر شمولية." },
        { q: "فوقاش نشوف نتائج الديو؟", a: "راحة و ترطيب من الأسبوع 1–2؛ تماسك و إشراق أكثر وضوح من بعد 6–12 أسبوع ديال الاستعمال المزدوج." },
        { q: "واش نقدر نستعملو و أنا حامل ولا كنرضع؟", a: "من باب الاحتياط، سولي طبيبك قبل ما تبداي الكيت، خصوصا العلاج الشروب." },
        { q: "إلا الكيت ما عجبنيش؟", a: "فحصي الطرد قدام الموصل و رفضيه إلا كان متضرر. عندك 7 أيام باش تخبرينا عبر واتساب — تبديل أو استرجاع الفلوس حسب الحالة." },
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
    footerBaseline: "العناية الصادقة بالبشرة، مزادة فالمغرب.",
    badgeOrigin: "صنع فالمغرب بعناية 🇲🇦",
    trustTriad: "✓ الخلاص عند الاستلام · 🚚 التوصيل من 24 لـ 72 ساعة · 🔒 المعلومات سرية",
    ctaMain: "أطلبي دابا — خلصي عند الاستلام",
    ctaWhatsApp: "أطلبي عبر واتساب",
    footerInfos: "التوصيل فكل مدن المغرب، الخلاص عند الاستلام.",
  },
} as const;

// Price helper — format MAD
export function formatPriceMAD(price: number): string {
  return `${price} DH`;
}
export function formatPriceMADAr(price: number): string {
  return `${price} درهم`;
}
