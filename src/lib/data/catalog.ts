export type ProductOffer = {
  id: string;
  qty: number;
  labelFr: string;
  labelAr: string;
  price: number;
  original: number;
  badgeFr?: string;
  badgeAr?: string;
  save?: number;
};

export type Benefit = { titleFr: string; titleAr: string; bodyFr: string; bodyAr: string };
export type Result = { value: string; labelFr: string; labelAr: string };
export type Faq = { qFr: string; aFr: string; qAr: string; aAr: string };

export type CatalogProduct = {
  sku: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  price: number;
  originalPrice: number;
  badge: string;
  routineFr: string;
  shortFr: string;
  shortAr: string;
  longFr: string;
  longAr: string;
  heroImage: string;
  gallery: string[];
  ingredientsFr: string[];
  ingredientsAr: string[];
  howToFr: string;
  howToAr: string;
  reviewCount: number;
  rating: number;
  offers: ProductOffer[];
  benefitsFr: Benefit[];
  benefitsAr: Benefit[];
  resultsFr: Result[];
  resultsAr: Result[];
  faqsFr: Faq[];
  faqsAr: Faq[];
  scarcityFr: string;
  scarcityAr: string;
  upsellSku?: string;
};

export const CATALOG: CatalogProduct[] = [
  {
    sku: 'velvastretch',
    slug: 'velvastretch',
    nameFr: 'VelvaStretch™',
    nameAr: 'فيلفا ستراتش™',
    price: 27900,
    originalPrice: 39900,
    badge: 'Best-seller',
    routineFr: 'Anti-vergetures',
    shortFr: 'Le sérum qui lisse visiblement les vergetures et ravive l’élasticité de la peau.',
    shortAr: 'السيروم الذي ينعم علامات التمدد بشكل ملحوظ ويعيد مرونة البشرة.',
    longFr:
      'Formulé au Maroc avec du beurre de karité et l’huile précieuse de figue de barbarie, VelvaStretch™ agit en profondeur sur l’épiderme pour estomper vergetures, ridules et perte de fermeté. Sa texture fondante pénètre sans gras et nourrit la peau des premières applications.',
    longAr:
      'مُصيغ في المغرب بزبد الكريتيه وزيت الصبار النفيس، يعمل فيلفا ستراتش™ في العمق لطمس علامات التمدد والتجاعيد وترهل البشرة. قوامه الذائب يتغلغل دون دهون وينعم البشرة من أول استخدامات.',
    reviewCount: 487,
    rating: 4.8,
    heroImage: '/products/velvastretch.svg',
    gallery: ['/products/velvastretch.svg', '/images/ph-2.svg', '/images/ph-3.svg', '/images/ph-1.svg'],
    ingredientsFr: ['Beurre de karité', 'Huile de figue de barbarie', 'Vitamine E', 'Aloe vera'],
    ingredientsAr: ['زبد الكريتيه', 'زيت الصبار', 'فيتامين E', 'ألوة فيرا'],
    howToFr: 'Appliquez matin et soir en massant circulairement sur les zones ciblées, peau propre et sèche.',
    howToAr: 'طبّقي صباحاً ومساءً مع تدليك دائري على المناطق المستهدفة، على بشرة نظيفة وجافة.',
    offers: [
      { id: '1pc', qty: 1, labelFr: '1 pièce', labelAr: 'قطعة واحدة', price: 27900, original: 39900, badgeFr: 'Essentiel', badgeAr: 'أساسي' },
      { id: '2pc', qty: 2, labelFr: '2 pièces', labelAr: 'قطعتان', price: 49900, original: 55800, badgeFr: 'Populaire', badgeAr: 'الأكثر رواجاً', save: 5900 },
      { id: '3pc', qty: 3, labelFr: '3 pièces', labelAr: '3 قطع', price: 69900, original: 83700, badgeFr: 'Meilleur prix', badgeAr: 'أفضل سعر', save: 13800 },
    ],
    benefitsFr: [
      { titleFr: 'Vergetures estompées', titleAr: 'علامات مترهلة أخف', bodyFr: 'Réduit visiblement l’apparence des vergetures en 4 semaines.', bodyAr: 'يقلل مظهر علامات التمدد بشكل ملحوظ في 4 أسابيع.' },
      { titleFr: 'Peau plus ferme', titleAr: 'بشرة أكثر صلابة', bodyFr: 'Améliore l’élasticité et la fermeté cutanée.', bodyAr: 'يحسّن مرونة البشرة وصلابتها.' },
      { titleFr: 'Hydratation profonde', titleAr: 'ترطيب عميق', bodyFr: 'Nourrit intensément sans effet gras.', bodyAr: 'يغذّي بعمق دون مفعول دهني.' },
    ],
    benefitsAr: [],
    resultsFr: [
      { value: '92%', labelFr: 'voient un résultat en 4 semaines', labelAr: 'يلاحظن نتيجة في 4 أسابيع' },
      { value: '4.8/5', labelFr: 'note moyenne clientes', labelAr: 'متوسط تقييم الزبونات' },
      { value: '12 000+', labelFr: 'clientes satisfaites', labelAr: 'زبونة راضية' },
    ],
    resultsAr: [],
    faqsFr: [
      { qFr: 'En combien de temps vois-je un résultat ?', aFr: 'Les premiers signes apparaissent dès 2 semaines, avec un résultat optimal après 4 à 8 semaines d’application régulière.', qAr: 'كم من الوقت لرؤية النتيجة؟', aAr: 'تظهر أولى العلامات في غضون أسبوعين، مع نتيجة مثالية بعد 4 إلى 8 أسابيع من الاستخدام المنتظم.' },
      { qFr: 'Convient-il aux peaux sensibles ?', aFr: 'Oui, la formule est dermatologiquement testée et sans paraben.', qAr: 'هل يناسب البشرة الحساسة؟', aAr: 'نعم، التركيبة مُختبرة جلدياً وخالية من البارابين.' },
      { qFr: 'Comment l’utiliser ?', aFr: 'Massez matin et soir sur les zones ciblées, peau propre et sèche.', qAr: 'كيفية الاستخدام؟', aAr: 'دلّكي صباحاً ومساءً على المناطق المستهدفة، بشرة نظيفة وجافة.' },
    ],
    faqsAr: [],
    scarcityFr: 'Plus de 120 commandes cette semaine',
    scarcityAr: 'أكثر من 120 طلباً هذا الأسبوع',
    upsellSku: 'collaglow',
  },
  {
    sku: 'silkstop',
    slug: 'silkstop',
    nameFr: 'SilkStop™',
    nameAr: 'سيلك ستوب™',
    price: 22900,
    originalPrice: 32900,
    badge: 'Anti-repousse',
    routineFr: 'Anti-repousse',
    shortFr: 'L’huile qui ralentit visiblement la repousse des poils après épilation.',
    shortAr: 'الزيت الذي يبطئ ملحوظاً لنمو الشعر بعد إزالة الشعر.',
    longFr:
      'SilkStop™ réunit 8 huiles botaniques, curcuma et huile de ricin pour prolonger la douceur de la peau entre deux épilations. Testé par des milliers de Marocaines, il retarde la repousse pour un effet « peau de soie » qui dure.',
    longAr:
      'يجمع سيلك ستوب™ 8 زيوت نباتية والكركم وزيت الخروع لإطالة نعومة البشرة بين جلستي إزالة الشعر. مُختبر من آلاف المغربيات، يؤخر النمو لمفعول « بشرة حريرية » يدوم.',
    reviewCount: 312,
    rating: 4.7,
    heroImage: '/products/silkstop.svg',
    gallery: ['/products/silkstop.svg', '/images/ph-2.svg', '/images/ph-3.svg', '/images/ph-1.svg'],
    ingredientsFr: ['8 huiles botaniques', 'Extrait de curcuma', 'Huile de ricin', 'Vitamine B5'],
    ingredientsAr: ['8 زيوت نباتية', 'مستخلص الكركم', 'زيت الخروع', 'فيتامين B5'],
    howToFr: 'Après épilation, massez une petite quantité sur la zone épilée jusqu’à absorption complète.',
    howToAr: 'بعد إزالة الشعر، دلّكي كمية صغيرة على المنطقة حتى الامتصاص الكامل.',
    offers: [
      { id: '1pc', qty: 1, labelFr: '1 pièce', labelAr: 'قطعة واحدة', price: 22900, original: 32900, badgeFr: 'Essentiel', badgeAr: 'أساسي' },
      { id: '2pc', qty: 2, labelFr: '2 pièces', labelAr: 'قطعتان', price: 39900, original: 45800, badgeFr: 'Populaire', badgeAr: 'الأكثر رواجاً', save: 5900 },
      { id: '3pc', qty: 3, labelFr: '3 pièces', labelAr: '3 قطع', price: 55900, original: 68700, badgeFr: 'Meilleur prix', badgeAr: 'أفضل سعر', save: 12800 },
    ],
    benefitsFr: [
      { titleFr: 'Repousse ralentie', titleAr: 'نمو مؤجل', bodyFr: 'Prolonge la douceur de la peau jusqu’à 2 semaines de plus.', bodyAr: 'يُطيل نعومة البشرة حتى أسبوعين إضافيين.' },
      { titleFr: 'Peau nourrie', titleAr: 'بشرة مغذّاة', bodyFr: 'Les huiles apaisent et illuminent la peau épilée.', bodyAr: 'الزيوت تُهدّئ وتُنير البشرة بعد الإزالة.' },
      { titleFr: 'Sans traces', titleAr: 'بلا آثار', bodyFr: 'Texture sèche non grasse, aucune tache sur les vêtements.', bodyAr: 'قوام جاف غير دهني، لا يترك أثراً على الملابس.' },
    ],
    benefitsAr: [],
    resultsFr: [
      { value: '2x', labelFr: 'plus longtemps sans poil', labelAr: 'مدة أطول دون شعر' },
      { value: '4.7/5', labelFr: 'note moyenne clientes', labelAr: 'متوسط تقييم الزبونات' },
      { value: '8 400+', labelFr: 'clientes satisfaites', labelAr: 'زبونة راضية' },
    ],
    resultsAr: [],
    faqsFr: [
      { qFr: 'Est-ce que ça brûle ou irrite ?', aFr: 'Non, la formule est apaisante et convient aux peaux sensibles.', qAr: 'هل يحرق أو يهيّج؟', aAr: 'لا، التركيبة مُهدّئة وتناسب البشرة الحساسة.' },
      { qFr: 'À utiliser avant ou après épilation ?', aFr: 'Après épilation, sur peau propre et sèche.', qAr: 'يُستعمل قبل أو بعد إزالة الشعر؟', aAr: 'بعد إزالة الشعر، على بشرة نظيفة وجافة.' },
      { qFr: 'En combien de temps le résultat ?', aFr: 'La repousse ralentit dès les premières applications.', qAr: 'كم من الوقت لرؤية النتيجة؟', aAr: 'يتباطأ النمو منذ الاستخدامات الأولى.' },
    ],
    faqsAr: [],
    scarcityFr: 'Stock limité — réappro. rapide',
    scarcityAr: 'كمية محدودة — إعادة تخزين سريعة',
    upsellSku: 'velvastretch',
  },
  {
    sku: 'collaglow',
    slug: 'collaglow',
    nameFr: 'CollaGlow™',
    nameAr: 'كولا غلو™',
    price: 31900,
    originalPrice: 44900,
    badge: 'Gummies',
    routineFr: 'Beauté intérieure',
    shortFr: 'Les gummies qui illuminent peau, cheveux et ongles de l’intérieur.',
    shortAr: 'علكات تُنير البشرة والشعر والأظافر من الداخل.',
    longFr:
      'CollaGlow™ associe collagène marin, vitamine C, biotine et acide hyaluronique en une gummie savoureuse. Une routine beauté de l’intérieur, 100% halal-friendly et fabriquée au Maroc, pour un éclat visible en 30 jours.',
    longAr:
      'يجمع كولا غلو™ الكولاجين البحري وفيتامين C والبيوتين وحمض الهيالورونيك في علكة لذيذة. روتين جمال من الداخل، صديق للحلال ومُصنّع في المغرب، لإشراق ملحوظ في 30 يوماً.',
    reviewCount: 401,
    rating: 4.9,
    heroImage: '/products/collaglow.svg',
    gallery: ['/products/collaglow.svg', '/images/ph-2.svg', '/images/ph-3.svg', '/images/ph-1.svg'],
    ingredientsFr: ['Collagène marin', 'Vitamine C', 'Biotine', 'Acide hyaluronique'],
    ingredientsAr: ['كولاجين بحري', 'فيتامين C', 'بيوتين', 'حمض الهيالورونيك'],
    howToFr: 'Prenez 2 gummies par jour, idéalement le matin, avec un verre d’eau.',
    howToAr: 'تناولي علكتين يومياً، يُفضّل صباحاً، مع كوب من الماء.',
    offers: [
      { id: '1pc', qty: 1, labelFr: '1 boîte', labelAr: 'علبة واحدة', price: 31900, original: 44900, badgeFr: 'Essentiel', badgeAr: 'أساسي' },
      { id: '2pc', qty: 2, labelFr: '2 boîtes', labelAr: 'علبتان', price: 56900, original: 89800, badgeFr: 'Populaire', badgeAr: 'الأكثر رواجاً', save: 9900 },
      { id: '3pc', qty: 3, labelFr: '3 boîtes', labelAr: '3 علب', price: 79900, original: 134700, badgeFr: 'Meilleur prix', badgeAr: 'أفضل سعر', save: 15800 },
    ],
    benefitsFr: [
      { titleFr: 'Éclat visible', titleAr: 'إشراق ملحوظ', bodyFr: 'Peau, cheveux et ongles plus lumineux en 30 jours.', bodyAr: 'بشرة وشعر وأظافر أكثر إشراقاً في 30 يوماً.' },
      { titleFr: 'Collagène marin', titleAr: 'كولاجين بحري', bodyFr: 'Soutient la fermeté et l’hydratation.', bodyAr: 'يدعم الصلابة والترطيب.' },
      { titleFr: 'Goût gourmand', titleAr: 'طعم لذيذ', bodyFr: 'Une gummie par jour, sans effort.', bodyAr: 'علكة يومية دون عناء.' },
    ],
    benefitsAr: [],
    resultsFr: [
      { value: '30j', labelFr: 'pour un éclat visible', labelAr: 'لإشراق ملحوظ' },
      { value: '4.9/5', labelFr: 'note moyenne clientes', labelAr: 'متوسط تقييم الزبونات' },
      { value: '9 600+', labelFr: 'clientes satisfaites', labelAr: 'زبونة راضية' },
    ],
    resultsAr: [],
    faqsFr: [
      { qFr: 'C’est halal-friendly ?', aFr: 'Oui, nos gummies ne contiennent ni gélatine animale, ni alcool.', qAr: 'هل هي صديقة للحلال؟', aAr: 'نعم، علكاتنا لا تحتوي على جيلاتين حيواني ولا كحول.' },
      { qFr: 'Combien par jour ?', aFr: '2 gummies le matin, avec un verre d’eau.', qAr: 'كم عددها يومياً؟', aAr: 'علكتان صباحاً مع كوب من الماء.' },
      { qFr: 'En combien de temps ?', aFr: 'L’éclat commence dès 2 semaines, optimum à 30 jours.', qAr: 'كم من الوقت؟', aAr: 'يبدأ الإشراق في أسبوعين، والأمثل في 30 يوماً.' },
    ],
    faqsAr: [],
    scarcityFr: 'Édition limitée — stock garanti',
    scarcityAr: 'إصدار محدود — مخزون مضمون',
    upsellSku: 'silkstop',
  },
];

export const BUNDLE = {
  sku: 'bundle-bck',
  slug: 'bundle-body-confidence',
  nameFr: 'Body Confidence Kit',
  nameAr: 'باقة الثقة بالجسم',
  price: 65000,
  originalPrice: 82800,
  badge: 'Kit',
  shortFr: 'VelvaStretch™ + SilkStop™ : le rituel complet pour un corps confiant.',
  shortAr: 'فيلفا ستراتش™ + سيلك ستوب™: الروتين الكامل لجسم واثق.',
  longFr:
    'Le Body Confidence Kit réunit nos deux best-sellers en un seul coffret. Vergetures et repousse, traités ensemble, pour des résultats visibles plus vite — au meilleur prix.',
  longAr:
    'يجمع باقة الثقة بالجسم أفضل منتجين لدينا في علبة واحدة. علامات التمدد والنمو يُعالجان معاً لنتيجة أسرع وأوضح — بأفضل سعر.',
  heroImage: '/products/bundle.svg',
  gallery: ['/products/bundle.svg', '/images/ph-2.svg', '/images/ph-3.svg', '/images/ph-1.svg'],
  offers: [
    { id: '1pc', qty: 1, labelFr: '1 kit', labelAr: 'باقة واحدة', price: 65000, original: 82800, badgeFr: 'Essentiel', badgeAr: 'أساسي' },
    { id: '2pc', qty: 2, labelFr: '2 kits', labelAr: 'باقتان', price: 119900, original: 165600, badgeFr: 'Populaire', badgeAr: 'الأكثر رواجاً', save: 45700 },
    { id: '3pc', qty: 3, labelFr: '3 kits', labelAr: '3 باقات', price: 169900, original: 248400, badgeFr: 'Meilleur prix', badgeAr: 'أفضل سعر', save: 78500 },
  ],
  reviewCount: 243,
  rating: 4.8,
};

export type Sellable =
  | CatalogProduct
  | (typeof BUNDLE & { isBundle: true });

export function getProduct(slug: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.slug === slug);
}

export function getSellable(slug: string): Sellable | undefined {
  if (slug === BUNDLE.slug) return { ...BUNDLE, isBundle: true };
  return getProduct(slug);
}

export function getAllSellables(): Sellable[] {
  return [...CATALOG, { ...BUNDLE, isBundle: true }];
}

export const UPsell99_SKU = 'collaglow';

export function getCheckoutUpsell(excludeSkus: string[]): {
  sku: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  price: number;
  image: string;
} | null {
  const p = CATALOG.find((x) => x.sku === UPsell99_SKU && !excludeSkus.includes(x.sku)) ||
    CATALOG.find((x) => !excludeSkus.includes(x.sku));
  if (!p) return null;
  return {
    sku: p.sku,
    slug: p.slug,
    nameFr: p.nameFr,
    nameAr: p.nameAr,
    price: 9900,
    image: p.heroImage,
  };
}

export function formatMAD(cents: number, locale = 'fr'): string {
  const value = cents / 100;
  if (locale === 'ar') return `${value.toLocaleString('ar-MA')} درهم`;
  return `${value.toLocaleString('fr-MA')} MAD`;
}
