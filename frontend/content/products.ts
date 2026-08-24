export interface Offer {
  qty: number;
  price: number;
  save?: number;
}

export interface Ingredient {
  name: string;
  role: string;
  origin?: string;
}

export interface Testimonial {
  text: string;
  name: string;
  stars: number;
}

export interface FaqItem {
  q: string;
  r: string;
}

export interface Product {
  slug: string;
  name: string;
  arSub: string;
  badge: string;
  price: number;
  oldPrice: number;
  stars: number;
  reviews: number;
  offers: Offer[];
  stockCount: number;
  hero: {
    eyebrow: string;
    h1: string;
    h1Ar: string;
    sub: string;
    subAr: string;
    cta: string;
    micro: string;
  };
  hook: string;
  description: string[];
  benefits: string[];
  ingredients: Ingredient[];
  inci: string;
  howTo: string[];
  whoFor: string[];
  whoNot: string[];
  faq: FaqItem[];
  testimonials: Testimonial[];
  upsellCopy: string;
  crossSell: { slug: string; copy: string };
}

export const products: Record<string, Product> = {
  velvastretch: {
    slug: "velvastretch",
    name: "VelvaStretch™",
    arSub: "سيروم الكولاجين لعلامات التمدد",
    badge: "🔥 Bestseller",
    price: 279,
    oldPrice: 399,
    stars: 4.9,
    reviews: 847,
    offers: [
      { qty: 1, price: 279 },
      { qty: 2, price: 499, save: 59 },
      { qty: 3, price: 699, save: 138 },
    ],
    stockCount: 47,
    hero: {
      eyebrow: "✦ ماركة مغربية · 100% طبيعي · الدفع عند الاستلام ✦",
      h1: "Le sérum anti-vergetures, né au Maroc",
      h1Ar: "واش كتخبي جسمك بسبب علامات التمدد؟",
      sub: "Le premier sérum formulé au Maroc avec du vrai collagène marin et de la vitamine E. Résultats visibles en 4 semaines. Ou remboursé.",
      subAr: "سيروم بالكولاجين المغربي — نتائج في 4 أسابيع.",
      cta: "اطلبي الآن — الدفع عند الاستلام",
      micro: "توصيل مجاني · بقاو 47 وحدة فقط · مكتعطيش فلوس حتى توصلك",
    },
    hook: "Vous avez essayé des huiles, des crèmes, du Bio Oil. Rien n'a vraiment fonctionné. VelvaStretch™ est différent — formulé avec du collagène marin actif qui pénètre 1,5x plus profondément.",
    description: [
      "علامات التمدد هي انكسار للألياف تحت الجلد. المستحضرات العادية تمشي فوق الجلد فقط — VelvaStretch™ مُركَّب ليدخل أعمق.",
      "Le collagène marin a une structure moléculaire plus petite que le collagène bovin — il pénètre 1,5x plus profondément pour stimuler la régénération. La vitamine E encapsulée protège contre le stress oxydatif.",
      "En 4 semaines d'utilisation quotidienne, les utilisatrices rapportent une visibilité réduite des vergetures de 40 à 70%. Testé sur des femmes de Casablanca, Rabat, Marrakech, Fès.",
    ],
    benefits: [
      "يقلل ظهور علامات التمدد من الأسبوع الأول",
      "Collagène marin actif — pénétration 1.5x plus profonde",
      "Améliore l'élasticité de la peau",
      "يرطب الجلد 48 ساعة بدون دهونة",
      "Pour tous types de vergetures (grossesse, poids, âge)",
      "مجرب ومضمون — 4 أسابيع بدون نتيجة؟ نرجعوليك الفلوس",
    ],
    ingredients: [
      { name: "Collagène Marin", role: "Stimule la régénération du derme", origin: "Poissons d'eau marine" },
      { name: "Vitamine E", role: "Antioxydant, protège les cellules", origin: "Germe de blé" },
      { name: "Bakuchiol", role: "Renouvellement cellulaire sans irritation", origin: "Plante Babchi" },
      { name: "Huile de Rose Musquée", role: "Régénère et nourrit", origin: "Roses du Maroc" },
      { name: "Acide Hyaluronique", role: "Hydratation profonde", origin: "Fermentation végétale" },
      { name: "Beurre de Karité", role: "Protège la barrière cutanée", origin: "Burkina Faso" },
    ],
    inci: "Aqua, Glycerin, Hydrolyzed Marine Collagen, Tocopheryl Acetate, Bakuchiol, Rosa Canina Fruit Oil, Sodium Hyaluronate, Butyrospermum Parkii Butter, Panthenol, Allantoin. Sans parabènes · sans sulfates.",
    howTo: [
      "صفي جلدك وجففيه جيداً",
      "خدي كمية صغيرة من السيروم",
      "دلكي بحركة دائرية لفوق 2 دقيقة",
      "دعيه يتشرب قبل ما تلبسي",
      "مرتين في اليوم — الصبح والمساء",
    ],
    whoFor: ["عندك علامات التمدد من الحمل أو الوزن", "جربتي كريمات بلا نتيجة", "بغيتي حل طبيعي بلا ليزر"],
    whoNot: ["بشرة بجروح مفتوحة", "حساسية معروفة لشي مكون"],
    faq: [
      { q: "متى نشوف النتائج الأولى؟", r: "الجلد يرطب من الأيام الأولى، الفرق في علامات التمدد من الأسبوع 2–3." },
      { q: "يشدو على العلامات القديمة البيضاء؟", r: "نعم، لكن كياخد وقت أكثر (8–12 أسبوع)." },
      { q: "كيفاش نطلب؟", r: "اضغطي اطلبي الآن، أدخلي اسمك ورقمك، توصلك بالدفع عند الاستلام." },
    ],
    testimonials: [
      { text: "خرجت من الحمل بعلامات تمدد. بعد شهر، بطني بدا يرجع لحالتو. VelvaStretch وحده خلاني نشوف الفرق.", name: "Samira L. — Casablanca", stars: 5 },
      { text: "J'avais des vergetures depuis mes 17 ans. Après 6 semaines elles sont beaucoup moins visibles. Je recommande.", name: "Hajar B. — Rabat", stars: 5 },
      { text: "عندي بشرة حساسة وما كانتش عندي رد فعل. بعد 5 أسابيع الفرق واضح.", name: "Nadia K. — Marrakech", stars: 5 },
    ],
    upsellCopy: "أضيفي CollaGlow™ بـ 319 MAD → الاثنين بـ 549 MAD (وفري 49 MAD)",
    crossSell: { slug: "silkstop", copy: "بعد الإبيلاسيون — طبقي SilkStop لجلد أملس لأسبوعين" },
  },

  silkstop: {
    slug: "silkstop",
    name: "SilkStop™",
    arSub: "زيت إيقاف نمو الشعر بالزيوت الطبيعية",
    badge: "⭐ Plus Vendu",
    price: 229,
    oldPrice: 329,
    stars: 4.8,
    reviews: 1203,
    offers: [
      { qty: 1, price: 229 },
      { qty: 2, price: 419, save: 39 },
      { qty: 3, price: 599, save: 90 },
    ],
    stockCount: 61,
    hero: {
      eyebrow: "✦ 8 زيوت طبيعية · الدفع عند الاستلام ✦",
      h1: "L'huile qui ralentit la repousse",
      h1Ar: "منعيتي من الإبيلاسيون اللي ما يوقفش؟",
      sub: "8 huiles naturelles marocaines et exotiques qui ralentissent la repousse et laissent ta peau douce pendant des semaines.",
      subAr: "زيت 8 زيوت يبطئ رجوع الشعر ويخلي جلدك حرير.",
      cta: "اطلبي الآن — الدفع عند الاستلام",
      micro: "توصيل مجاني · عرض محدود · مكتعطيش فلوس حتى توصلك",
    },
    hook: "Tu fais l'épilation. 3 jours après, ça repousse. SilkStop™ n'est pas un dépilatoire — c'est l'huile que tu appliques après chaque épilation pour ralentir la repousse.",
    description: [
      "كل امرأة تعيا من ألم الإبيلاسيون الشهري وتكلفته. SilkStop™ يبطئ دورة نمو الشعر بشكل ملحوظ.",
      "Les huiles aux acides oléique et linoléique pénètrent le follicule et réduisent son activité. Après 4–6 semaines, l'intervalle entre deux épilations s'allonge de 30 à 50%.",
      "En bonus : une huile corps luxueuse, parfumée à la lavande et au jasmin marocain, sans résidu gras.",
    ],
    benefits: [
      "يبطئ رجوع الشعر من الأسبوع الثاني",
      "8 زيوت طبيعية (أرغان، جوز الهند، لافندر...)",
      "Peau douce 2 semaines après l'épilation",
      "يهدئ البشرة المتهيجة",
      "Utilisable partout (jambes, aisselles, bikini)",
      "قارورة تكفي لأكثر من 3 أشهر",
    ],
    ingredients: [
      { name: "Huile d'Argan", role: "Nourrit en profondeur", origin: "المغرب" },
      { name: "Huile de Coco", role: "Antibactérien, hydratation", origin: "Exotique" },
      { name: "Huile d'Amande Douce", role: "Adoucit après épilation", origin: "Exotique" },
      { name: "Huile de Lavande", role: "Anti-inflammatoire, calme rougeurs", origin: "Maroc" },
      { name: "Huile de Thé Vert", role: "Réduit les poils incarnés", origin: "Exotique" },
      { name: "Vitamine E", role: "Régénère et protège", origin: "Germe de blé" },
    ],
    inci: "Cocos Nucifera Oil, Prunus Amygdalus Dulcis Oil, Argania Spinosa Kernel Oil, Lavandula Angustifolia Oil, Camellia Sinensis Leaf Extract, Tocopheryl Acetate, Jasminum Sambac Flower Extract. 100% naturelle · vegan.",
    howTo: [
      "بعد الإبيلاسيون مباشرة صفي البشرة بماء فاتر",
      "طبقي SilkStop على المناطق المزالة منها الشعر",
      "دلكي برفق دقيقتين — لا تشطفيه",
      "دعيه يتشرب، تجنبي الملابس الضيقة 30 دقيقة",
      "بعد كل إبيلاسيون + مرة إضافية في المنتصف",
    ],
    whoFor: ["تعيا من الإبيلاسيون الشهري", "جلدك يحمر بعد الإزالة", "بغيتي جلد ناعم أطول" ],
    whoNot: ["غير للوجه (مoustache/sourcils)", "حساسية من زيت معين مذكور"],
    faq: [
      { q: "هل يمنع نمو الشعر نهائياً؟", r: "لا — يبطئه ويخليه أرفع. مع الاستخدام المنتظم تحتاجين إبيلاسيون أقل." },
      { q: "مع أي طريقة إبيلاسيون؟", r: "مع الكل: شمع، خيط، موس. بعد كل جلسة." },
      { q: "منين نشوف النتائج؟", r: "الجلد أكثر نعومة من الأيام الأولى، الفرق في الرجوع من الأسبوع 2–3." },
    ],
    testimonials: [
      { text: "كنت كنعيا من الإبيلاسيون كل شهر. بعد شهرين الشعر رجع أقل وأرفع، والبشرة ناعمة بحال الحرير.", name: "Noura H. — Fès", stars: 5 },
      { text: "Je l'utilise depuis 7 semaines. La repousse est vraiment plus lente — avant 3 semaines, maintenant 5.", name: "Yasmine A. — Casablanca", stars: 5 },
      { text: "بشرتي حساسة بزاف وكانت كتحمر. SilkStop حل هاد المشكل كامل.", name: "Hiba M. — Agadir", stars: 5 },
    ],
    upsellCopy: "أضيفي VelvaStretch™ — كيت ما بعد الإبيلاسيون الكامل — الاثنين بـ 449 MAD",
    crossSell: { slug: "collaglow", copy: "النساء اللي بغاو حتى بشرة أكثر شباب من الداخل" },
  },

  collaglow: {
    slug: "collaglow",
    name: "CollaGlow™",
    arSub: "علكات الكولاجين البحري + حمض الهيالورونيك",
    badge: "✨ Nouveau",
    price: 319,
    oldPrice: 449,
    stars: 4.8,
    reviews: 612,
    offers: [
      { qty: 1, price: 319 },
      { qty: 2, price: 569, save: 69 },
      { qty: 3, price: 799, save: 158 },
    ],
    stockCount: 52,
    hero: {
      eyebrow: "✦ جمال من الداخل · الدفع عند الاستلام ✦",
      h1: "La beauté qui reconstruit de l'intérieur",
      h1Ar: "بشرتك بدات تبان عياانة؟ الكريمات ما كافيتش وحدها.",
      sub: "Le complément gummies qui reconstruit ta peau de l'intérieur. Collagène marin + acide hyaluronique. Résultats en 30 jours.",
      subAr: "علكات الكولاجين البحري — بشرة متجددة من الداخل في 30 يوم.",
      cta: "اطلبي الآن — الدفع عند الاستلام",
      micro: "توصيل مجاني · طعم كلوز الحمر · مكتعطيش فلوس حتى توصلك",
    },
    hook: "À 25 ans ton corps produit moins de collagène. À 30 ans, c'est 1% de moins par an. Les crèmes aident en surface — CollaGlow™ reconstruit depuis la source.",
    description: [
      "بعد سن 25 الجسم يقلل إنتاج الكولاجين — البروتين المسؤول عن مرونة الجلد.",
      "CollaGlow™ به كولاجين بحري مُحلل بجزيئات صغيرة تمتصها الأمعاء مباشرة للمجرى الدم.",
      "L'acide hyaluronique agit en synergie — il retient l'eau, plumpe la peau. بعد 30 يوم البشرة أكثر إشراقاً، بعد 90 يوم النتيجة الكاملة.",
    ],
    benefits: [
      "كولاجين بحري مُحلل — يُمتص أسرع",
      "Acide Hyaluronique — hydrate de l'intérieur",
      "Vitamine C — boost la synthèse du collagène",
      "تقوي الشعر والأظافر",
      "30 علكة في العلبة (30 يوم)",
      "طعم كلوز الحمر الطبيعي",
    ],
    ingredients: [
      { name: "Collagène Marin Hydrolysé", role: "Régénération dermique", origin: "2,500 mg/jour" },
      { name: "Acide Hyaluronique", role: "Hydratation profonde", origin: "100 mg/jour" },
      { name: "Vitamine C (Acérola)", role: "Synthèse du collagène", origin: "60 mg/jour" },
      { name: "Biotine (B7)", role: "Cheveux et ongles", origin: "2.5 mg/jour" },
      { name: "Zinc", role: "Régénération cellulaire", origin: "5 mg/jour" },
    ],
    inci: "Glucose Syrup, Sugar, Hydrolyzed Marine Collagen, Sodium Hyaluronate, Ascorbic Acid, Biotin, Zinc Gluconate, Pectin (Vegan), Natural Pomegranate Flavor. Halal · Vegan · sans gluten.",
    howTo: [
      "2 علكات في اليوم",
      "مع الإفطار أو في أي وقت",
      "30 يوم للنتائج الأولى",
      "90 يوم (3 علب) للنتائج الكاملة",
      "درجة حرارة الغرفة، بعيد عن الضوء",
    ],
    whoFor: ["من سن 25 فما فوق", "بشرك بانت عياانة", "بغيتي نتيجة من الداخل والخارج" ],
    whoNot: ["تحسسي من مكون مذكور", "حامل بدون استشارة (راجعي طبيبتك)"],
    faq: [
      { q: "من أي سن؟", r: "من 25 مثالي، لكن أي سن فوقه يستفيد." },
      { q: "هل هو حلال؟", r: "نعم — base pectine végétale، بدون جيلاتين حيواني، مصدق." },
      { q: "كم علبة للنتائج الدائمة؟", r: "1 للأولى، 3 (90 يوم) للدائمة." },
    ],
    testimonials: [
      { text: "عندي 34 سنة وبدات نحس بشاري ما رجعتش كيف كانت. بعد شهر الفرق واضح، وجهي ضوى.", name: "Sanaa M. — Rabat", stars: 5 },
      { text: "J'ai pris CollaGlow avec VelvaStretch. En 6 semaines ma peau est transformée.", name: "Kaoutar B. — Casablanca", stars: 5 },
      { text: "طعمه حلو بزاف، شعري صار أكتف وأظافري ما عاودو ينكسرو.", name: "Amina T. — Marrakech", stars: 5 },
    ],
    upsellCopy: "VelvaStretch™ + CollaGlow™ — Inside + Outside Kit — 549 MAD",
    crossSell: { slug: "silkstop", copy: "الكيت الكامل: Body Confidence Kit بـ 650 MAD" },
  },
};

export const productList = Object.values(products);

export const bundle = {
  name: "Body Confidence Kit",
  arSub: "كيت التغيير الكامل — الداخل والخارج",
  contents: ["velvastretch", "silkstop", "collaglow"],
  price: 650,
  oldPrice: 827,
  save: 177,
  cta: "Commander le Kit Complet",
  micro: "الدفع عند الاستلام | توصيل مجاني خلال 48 ساعة",
  urgency: "⚡ هاد العرض محدود — بقاو غير 23 كيت",
};

export function unitPrice(slug: string, qty: number): number {
  const p = products[slug];
  const offer = p.offers.find((o) => o.qty === qty) || p.offers[0];
  return offer.price;
}
