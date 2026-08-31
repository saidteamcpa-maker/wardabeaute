import type { Lang } from "@/lib/i18n-shared";
import { productsAr } from "./productsAr";

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
  image: string;
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
  upsellSlug?: string;
  upsellQty?: number;
  upsellSlugs?: string[];
  crossSell: { slug: string; copy: string };
  comparison?: { vs: string; rows: { criterion: string; warda: string; other: string }[] };
}

export const products: Record<string, Product> = {
  velvastretch: {
    slug: "velvastretch",
    name: "VelvaStretch™",
    arSub: "سيروم الكولاجين لعلامات التمدد ومرونة البشرة",
    image: "/images/velvastretch.png",
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
      eyebrow: "✦ Marque marocaine · 100% naturel · Paiement à la livraison ✦",
      h1: "Le sérum anti-vergetures, né au Maroc",
      h1Ar: "واش كتخبي جسمك بسبب علامات التمدد؟",
      sub: "Formulé avec de la Centella Asiatica (scientifiquement prouvée pour stimuler le collagène) + collagène marin + vitamine E. Sans retinol — donc sûr pendant et après la grossesse. Résultats en 8 à 12 semaines.",
      subAr: "سيروم بالكولاجين الطبيعي — آمن حتى وقت الحمل والرضاعة.",
      cta: "Commander maintenant — paiement à la livraison",
      micro: "Livraison gratuite · Plus que 47 unités · Paiement à la réception uniquement",
    },
    hook: "Vous avez essayé des huiles, du Bio-Oil, des crèmes coûteuses. Rien n'a vraiment fonctionné — parce que les vergetures sont une rupture des fibres de collagène SOUS la peau. VelvaStretch™ ne masque pas : il aide la peau à reconstruire ses fibres.",
    description: [
      "Les vergetures sont une vraie rupture des fibres sous la peau. Les crèmes classiques restent en surface — VelvaStretch™ est formulé pour aller en profondeur et aider à la réparation.",
      "La Centella Asiatica (aussi appelée Gotu Kola) est l'actif le plus documenté contre les vergetures : des études montrent qu'elle stimule la synthèse du collagène de type I dans les fibroblastes du derme et améliore la résistance de la peau nouvelle. C'est pour cela qu'on l'a mise au cœur de la formule.",
      "Le collagène marin hydrolysé pénètre plus profondément que le collagène classique pour nourrir le derme, la vitamine E protège des radicaux libres, et l'acide hyaluronique rebondit la peau. Ensemble, ils agissent sur l'épaisseur ET la couleur des marques.",
      "Soyez réaliste et patiente : les vergetures ROUGES (récentes) répondent le mieux, souvent en 4 à 8 semaines. Les vergetures BLANCHES (anciennes) demandent 8 à 12 semaines d'application régulière, deux fois par jour.",
    ],
    benefits: [
      "Réduit l'apparence des vergetures dès 4–8 semaines",
      "Centella Asiatica — stimule le collagène (prouvé cliniquement)",
      "Collagène marin hydrolysé — pénétration profonde",
      "Sûr pendant la grossesse & l'allaitement (sans retinol)",
      "Hydrate la peau 48h sans effet gras",
      "Testé et garanti — 4 semaines sans résultat ? On vous rembourse",
    ],
    ingredients: [
      { name: "Centella Asiatica", role: "Stimule la synthèse du collagène de type I (fibroblastes)", origin: "Extrait de feuilles, cultivé au Maroc" },
      { name: "Collagène Marin Hydrolysé", role: "Nourrit et redensifie le derme", origin: "Poissons d'eau marine" },
      { name: "Vitamine E", role: "Antioxydant, protège les cellules", origin: "Germe de blé" },
      { name: "Bakuchiol", role: "Renouvellement cellulaire sans irritation (alternative naturelle au retinol)", origin: "Plante Babchi" },
      { name: "Huile de Rose Musquée", role: "Régénère et atténue les marques", origin: "Roses du Maroc" },
      { name: "Acide Hyaluronique", role: "Hydratation et rebond", origin: "Fermentation végétale" },
    ],
    inci: "Aqua, Glycerin, Centella Asiatica Leaf Extract, Hydrolyzed Marine Collagen, Tocopheryl Acetate, Bakuchiol, Rosa Canina Fruit Oil, Sodium Hyaluronate, Butyrospermum Parkii Butter, Panthenol, Allantoin. Sans parabènes · sans sulfates · sans retinol.",
    howTo: [
      "Nettoyez et séchez bien votre peau",
      "Prélevez une petite quantité de sérum",
      "Massez en mouvement circulaire pendant 2 min",
      "Laissez pénétrer avant de vous habiller",
      "Deux fois par jour — matin et soir — pendant 8 à 12 semaines",
    ],
    whoFor: ["Vous avez des vergetures (grossesse ou poids)", "Vous avez essayé des crèmes sans résultat", "Vous voulez une solution naturelle sûre même en allaitement"],
    whoNot: ["Peau avec plaies ouvertes", "Allergie connue à un ingrédient"],
    faq: [
      { q: "Est-il sûr pendant la grossesse et l'allaitement ?", r: "Oui. Notre formule ne contient PAS de retinol (interdit en grossesse) — elle est à base de Centella, collagène marin et huiles naturelles, sûres pendant et après la grossesse." },
      { q: "Quand voit-on les premiers résultats ?", r: "Hydratation dès la 1ère semaine. Sur les vergetures ROUGES récentes, différence visible en 4–8 semaines. Sur les BLANCHES anciennes, comptez 8–12 semaines." },
      { q: "Est-ce efficace sur les anciennes vergetures blanches ?", r: "Oui, mais elles sont plus résistantes : il faut de la régularité (2x/jour) et 8 à 12 semaines." },
      { q: "Comment commander ?", r: "Cliquez sur Commander, saisissez votre nom et numéro, livraison en paiement à la réception. Sans avance." },
    ],
    testimonials: [
      { text: "Je suis sortie de ma grossesse avec des vergetures rouges. Après un mois, mon ventre a commencé à revenir. VelvaStretch seul m'a fait voir la différence, et j'étais rassurée car il est sûr même en allaitement.", name: "Samira L. — Casablanca", stars: 5 },
      { text: "J'avais des vergetures depuis mes 17 ans. Après 7 semaines elles sont beaucoup moins visibles. La texture pénètre vite, pas grasse.", name: "Hajar B. — Rabat", stars: 5 },
      { text: "J'ai la peau sensible et aucune réaction. Après 5 semaines la différence est visible, surtout sur les vergetures rouges.", name: "Nadia K. — Marrakech", stars: 5 },
      { text: "J'avais peur d'utiliser un produit pendant l'allaitement. Ce sérum contient de la Centella et pas de retinol — j'ai été rassurée et j'ai vu un résultat en 6 semaines.", name: "Salma R. — Agadir", stars: 5 },
    ],
    upsellCopy: "Ajoutez le Kit Collagène Inside & Outside pour 549 MAD seulement (économisez 299 MAD)",
    upsellSlug: "kit-collagene",
    crossSell: { slug: "silkstop", copy: "Après l'épilation — appliquez SilkStop pour une peau lisse pendant 2 semaines" },
  },

  silkstop: {
    slug: "silkstop",
    name: "SilkStop™",
    arSub: "سيروم إبطاء نمو الشعر ومنع الشعر تحت الجلد",
    image: "/images/silkstop.png",
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
      eyebrow: "✦ 8 huiles naturelles · Paiement à la livraison ✦",
      h1: "L'huile qui ralentit la repousse",
      h1Ar: "عييتي من إزالة الشعر المتكررة والحبوب تحت الجلد؟",
      sub: "8 huiles naturelles marocaines et exotiques appliquées APRÈS l'épilation pour calmer la peau et ralentir la repousse. La science le confirme : calmer l'activité du follicule repousse l'épilation de plusieurs semaines.",
      subAr: "تركيبة بـ 8 زيوت طبيعية كتبطئ نمو الشعر وترجع جلدك رطب بحال الحرير.",
      cta: "Commander maintenant — paiement à la livraison",
      micro: "Livraison gratuite · Offre limitée · Paiement à la réception uniquement",
    },
    hook: "Tu fais l'épilation. 3 jours après, ça repousse. SilkStop™ n'est pas un dépilatoire — c'est l'huile que tu appliques après chaque épilation pour ralentir la repousse et laisser ta peau douce plus longtemps.",
    description: [
      "Toute femme se lasse de la douleur et du coût de l'épilation mensuelle. SilkStop™ ralentit nettement le cycle de repousse grâce à son mélange d'huiles.",
      "Le principe est connu de la dermatologie : ralentir l'activité du follicule pileux repousse la repousse. Les acides oléique et linoléique (Argan, coco, amande) pénètrent et apaisent le follicule, tandis que la lavande calme les rougeurs. Résultat : l'intervalle entre deux épilations s'allonge.",
      "En bonus : une huile corps luxueuse, parfumée à la lavande et au jasmin marocain, sans résidu gras — parfaite pour les peaux mates et méditerranéennes qui rougissent vite.",
    ],
    benefits: [
      "Ralentit la repousse dès la 2e semaine",
      "8 huiles naturelles (argan, coco, lavande...)",
      "Peau douce jusqu'à 2 semaines après l'épilation",
      "Réduit rougeurs et irritations — idéal peaux mates/méditerranéennes",
      "Utilisable partout (jambes, aisselles, bikini)",
      "Flacon suffisant pour plus de 3 mois",
    ],
    ingredients: [
      { name: "Huile d'Argan", role: "Nourrit en profondeur, apaise le follicule", origin: "Maroc" },
      { name: "Huile de Coco", role: "Antibactérien, hydratation", origin: "Exotique" },
      { name: "Huile d'Amande Douce", role: "Adoucit après épilation", origin: "Exotique" },
      { name: "Huile de Lavande", role: "Anti-inflammatoire, calme rougeurs", origin: "Maroc" },
      { name: "Huile de Thé Vert", role: "Réduit les poils incarnés", origin: "Exotique" },
      { name: "Vitamine E", role: "Régénère et protège", origin: "Germe de blé" },
    ],
    inci: "Cocos Nucifera Oil, Prunus Amygdalus Dulcis Oil, Argania Spinosa Kernel Oil, Lavandula Angustifolia Oil, Camellia Sinensis Leaf Extract, Tocopheryl Acetate, Jasminum Sambac Flower Extract. 100% naturelle · vegan.",
    howTo: [
      "Juste après l'épilation, nettoyez la peau à l'eau tiède",
      "Appliquez SilkStop sur les zones épilées",
      "Massez doucement 2 min — ne rincez pas",
      "Laissez pénétrer, évitez les vêtements serrés 30 min",
      "Après chaque épilation + une fois en milieu de cycle",
    ],
    whoFor: ["Vous êtes lasse de l'épilation mensuelle", "Votre peau rougit après l'épilation", "Vous voulez une peau douce plus longtemps"],
    whoNot: ["Pas pour le visage (lèvre/sourcils)", "Allergie à une huile mentionnée"],
    faq: [
      { q: "Empêche-t-il la repousse définitivement ?", r: "Non — comme les soins dermatologiques de référence, il ralentit et affine la repousse. Avec le temps, tu as besoin d'épiler moins souvent." },
      { q: "Avec quelle méthode d'épilation ?", r: "Avec toutes : cire, fil, rasoir. Après chaque séance." },
      { q: "Quand voit-on les résultats ?", r: "La peau est plus douce dès les premiers jours ; l'allongement de l'intervalle d'épilation se voit à partir de 4 à 6 semaines." },
      { q: "Convient-il aux peaux mates/méditerranéennes ?", r: "Oui, c'est formulé pour apaiser rougeurs et poils incarnés fréquents sur les peaux mates." },
    ],
    testimonials: [
      { text: "Je me lassais de l'épilation chaque mois. Après 2 mois, le poil est revenu plus fin et moins dense, et la peau douce comme la soie.", name: "Noura H. — Fès", stars: 5 },
      { text: "Je l'utilise depuis 7 semaines. La repousse est vraiment plus lente — avant 3 semaines, maintenant 5.", name: "Yasmine A. — Casablanca", stars: 5 },
      { text: "Ma peau est très sensible et rougissait. SilkStop a résolu ce problème entièrement.", name: "Hiba M. — Agadir", stars: 5 },
    ],
    upsellCopy: "Offre duo — 2 sérums SilkStop™ à 419 MAD (économisez 39 MAD)",
    upsellSlug: "silkstop",
    upsellQty: 2,
    crossSell: { slug: "collaglow", copy: "Pour les femmes qui veulent aussi une peau plus jeune de l'intérieur" },
  },

  collaglow: {
    slug: "collaglow",
    name: "CollaGlow™",
    arSub: "حلوى الكولاجين البحري المحلل + حمض الهيالورونيك",
    image: "/images/collaglow.png",
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
      eyebrow: "✦ Beauté de l'intérieur · Paiement à la livraison ✦",
      h1: "La beauté qui reconstruit de l'intérieur",
      h1Ar: "بشرتك بدات تبان عيانة؟ الكريمات بوحدها ما كافياش.",
      sub: "Les gummies au collagène marin hydrolysé — la forme la plus BIODISPONIBLE. Une étude double-aveugle 2023 a mesuré -14 à -31% de rides et +23% d'élasticité en 12 semaines. Résultats dès 30 jours.",
      subAr: "حلوى كولاجين بحري لذيذة — بشرة مشدودة ونضارة من الداخل فـ 30 يوم.",
      cta: "Commander maintenant — paiement à la livraison",
      micro: "Livraison gratuite · Goût grenade · Paiement à la réception uniquement",
    },
    hook: "À 25 ans ton corps produit 1% de collagène en moins chaque année. Les crèmes agissent en surface — mais le collagène de la crème ne traverse PAS la peau (la molécule est trop grande). CollaGlow™ reconstruit depuis l'intérieur, là où ça compte.",
    description: [
      "Après 25 ans, le corps réduit sa production de collagène — la protéine responsable de l'élasticité de la peau, des cheveux et des ongles.",
      "Le collagène marin hydrolysé est découpé en petits peptides : il est absorbé par l'intestin puis transporté jusqu'au derme. C'est la forme prouvée la plus biodisponible. Une méta-analyse de 2023 (12 études, 967 participants) confirme gains d'hydratation et d'élasticité après 12 semaines.",
      "La vitamine C n'est PAS un détail : c'est le cofacteur OBLIGATOIRE pour que le corps fabrique le collagène (hydroxylation de la proline et de la lysine). Sans elle, les peptides ne se transforment pas. L'acide hyaluronique retient l'eau, la biotine et le zinc renforcent cheveux et ongles.",
      "Résultats : peau plus lumineuse vers 30 jours, effet complet (élasticité, rides, fermeté) vers 90 jours. Une habitude de 2 gummies par jour, goût grenade naturel.",
    ],
    benefits: [
      "Collagène marin hydrolysé — la forme la plus absorbable (biodisponible)",
      "Acide Hyaluronique — hydrate de l'intérieur",
      "Vitamine C — cofacteur OBLIGATOIRE de la synthèse du collagène",
      "Renforce cheveux et ongles (biotine + zinc)",
      "25 gummies par boîte (25 jours)",
      "Goût grenade naturel · Halal & Vegan (pectine, sans gélatine)",
    ],
    ingredients: [
      { name: "Collagène Marin Hydrolysé", role: "Régénération dermique (forme biodisponible)", origin: "2 500 mg/jour" },
      { name: "Acide Hyaluronique", role: "Hydratation profonde", origin: "100 mg/jour" },
      { name: "Vitamine C (Acérola)", role: "Cofacteur de la synthèse du collagène", origin: "60 mg/jour" },
      { name: "Biotine (B7)", role: "Cheveux et ongles", origin: "2.5 mg/jour" },
      { name: "Zinc", role: "Régénération cellulaire", origin: "5 mg/jour" },
    ],
    inci: "Glucose Syrup, Sugar, Hydrolyzed Marine Collagen, Sodium Hyaluronate, Ascorbic Acid, Biotin, Zinc Gluconate, Pectin (Vegan), Natural Pomegranate Flavor. Halal · Vegan · sans gluten · sans gélatine animale.",
    howTo: [
      "2 gummies par jour",
      "Avec le petit-déjeuner ou à tout moment",
      "30 jours pour les premiers résultats (éclat, hydratation)",
      "75 jours (3 boîtes) pour l'effet complet (rides, fermeté)",
      "Température ambiante, à l'abri de la lumière",
    ],
    whoFor: ["À partir de 25 ans", "Votre peau paraît fatiguée", "Vous voulez un résultat de l'intérieur et de l'extérieur"],
    whoNot: ["Allergie à un ingrédient mentionné", "Grossesse sans avis médical (consultez votre médecin)"],
    faq: [
      { q: "Dès quel âge ?", r: "Idéal à partir de 25 ans ; tout âge au-delà en profite." },
      { q: "Est-ce halal ?", r: "Oui — collagène MARIN (poisson), base pectine végétale, sans gélatine animale, certifié halal & vegan." },
      { q: "Pourquoi pas une crème au collagène ?", r: "La molécule de collagène est trop grande pour traverser la peau. Par voie orale (gummies), elle atteint le derme par le sang." },
      { q: "Combien de boîtes pour des résultats ?", r: "1 pour les premiers signes, 3 (90 jours) pour l'effet complet." },
    ],
    testimonials: [
      { text: "J'ai 34 ans et je sentais que ma peau n'était plus comme avant. Après un mois la différence est claire, mon visage rayonne.", name: "Sanaa M. — Rabat", stars: 5 },
      { text: "J'ai pris CollaGlow avec VelvaStretch. En 6 semaines ma peau est transformée, mes ongles ne cassent plus.", name: "Kaoutar B. — Casablanca", stars: 5 },
      { text: "Son goût est délicieux, mes cheveux sont plus épais et mes ongles ne cassent plus.", name: "Amina T. — Marrakech", stars: 5 },
    ],
    upsellCopy: "VelvaStretch™ + CollaGlow™ — Inside + Outside Kit — 549 MAD",
    upsellSlug: "kit-collagene",
    crossSell: { slug: "silkstop", copy: "Le kit complet : Kit Collagène Inside & Outside" },
  },
};

// Kit Collagène Inside & Outside — declared separately then merged into the catalog
const kitCollagene: Product = {
    slug: "kit-collagene",
    name: "Kit Collagène Inside & Outside",
    arSub: "باقة الكولاجين المتكاملة من الداخل ومن برا",
    image: "/kit-collagene-hero.png",
    badge: "🌟 Le Duo",
    price: 549,
    oldPrice: 848,
    stars: 5.0,
    reviews: 1459,
    offers: [
      { qty: 1, price: 549, save: 299 },
      { qty: 2, price: 999, save: 99 },
    ],
    stockCount: 40,
    hero: {
      eyebrow: "✦ Marque marocaine · Collagène de l'intérieur et de l'extérieur ✦",
      h1: "Ta peau, reconstruite de l'intérieur et de l'extérieur",
      h1Ar: "جمال بشرتك من الداخل ومن برا — نتائج وثقة كاملة",
      sub: "VelvaStretch™ (le sérum qui agit SUR ta peau) + CollaGlow™ (le collagène que tu prends CHAQUE matin). Ensemble, ils attaquent vergetures ET perte de fermeté des deux côtés à la fois.",
      subAr: "علاج متكامل من الداخل ومن برا — نتائج واضحة فـ 4 سيمانات.",
      cta: "Commander le Kit Collagène",
      micro: "Paiement à la livraison | Livraison gratuite 24–48h",
    },
    hook: "Un seul produit traite la surface. L'autre rebuild de l'intérieur. La recherche est claire : agir des DEUX côtés en même temps donne plus que la somme des deux. C'est le principe Inside & Outside.",
    description: [
      "Les vergetures et la perte de fermeté ne viennent pas que de la surface : le collagène qui soutient ta peau se fabrique à l'intérieur, et il baisse de 1% par an après 25 ans.",
      "VelvaStretch™ agit à l'EXTÉRIEUR : Centella Asiatica + collagène marin hydrolysé pénètrent le derme pour estomper les vergetures et redensifier — sans retinol, donc sûr pendant l'allaitement.",
      "CollaGlow™ agit à l'INTÉRIEUR : 2 500 mg de collagène marin hydrolysé (forme la plus biodisponible) + acide hyaluronique + vitamine C (cofacteur OBLIGATOIRE de la synthèse) + biotine, qui rebuild la peau, les cheveux et les ongles depuis la source.",
      "Ensemble : hydratation 48h (sérum) + hydratation de l'intérieur (gummies), et une action sur les fibres de collagène des deux côtés. C'est ce que les études appellent un effet synergique.",
    ],
    benefits: [
      "Estompe les vergetures dès 4 semaines (rouges)",
      "Redensifie et ferme la peau (intérieur + extérieur)",
      "Hydratation 48h (sérum) + hydratation de l'intérieur (gummies)",
      "Cheveux et ongles plus forts en 30 jours",
      "100% naturel · Halal & Vegan · sans retinol · sans paraben",
      "Garantie 4 semaines ou remboursé",
    ],
    ingredients: [
      { name: "Centella Asiatica (VelvaStretch™)", role: "Stimule le collagène de type I, estompe vergetures", origin: "Extrait de feuilles" },
      { name: "Collagène Marin Hydrolysé 2 500 mg (CollaGlow™)", role: "Rebuild depuis l'intérieur (biodisponible)", origin: "2 500 mg/jour" },
      { name: "Acide Hyaluronique", role: "Hydratation profonde", origin: "100 mg/jour" },
      { name: "Vitamine C (Acérola)", role: "Cofacteur OBLIGATOIRE de la synthèse du collagène", origin: "60 mg/jour" },
      { name: "Biotine (B7) + Zinc", role: "Cheveux et ongles", origin: "2.5 / 5 mg/jour" },
      { name: "Bakuchiol + Huile de Rose Musquée", role: "Renouvellement sans irritation", origin: "Maroc" },
    ],
    inci: "Sérum : Aqua, Centella Asiatica Leaf Extract, Hydrolyzed Marine Collagen, Tocopheryl Acetate, Bakuchiol, Rosa Canina Fruit Oil, Sodium Hyaluronate, Butyrospermum Parkii Butter. Gummies : Glucose Syrup, Hydrolyzed Marine Collagen, Sodium Hyaluronate, Ascorbic Acid, Biotin, Zinc Gluconate, Pectin (Vegan). Halal · Vegan · sans gluten · sans retinol.",
    howTo: [
      "Matins : 2 gummies CollaGlow™ (goût pomegranate)",
      "Matin & soir : VelvaStretch™ en massage circulaire 2 min",
      "Sur ventre, hanches, seins, cuisses — là où tu veux agir",
      "4 semaines pour les premiers signes, 12 pour le plein effet",
    ],
    whoFor: ["Tu as des vergetures (grossesse, poids, âge)", "Ta peau a perdu sa fermeté après 25 ans", "Tu veux une approche naturelle, halal & vegan"],
    whoNot: ["Grossesse sans avis médical (CollaGlow™)", "Allergie connue à un ingrédient"],
    faq: [
      { q: "En combien de temps les résultats ?", r: "Hydratation dès 1 semaine, vergetures et fermeté visibles à 4 semaines (rouges), plein effet à 12 semaines." },
      { q: "Est-ce halal et vegan ?", r: "Oui — collagène marin (poisson), base pectine végétale, sans gélatine animale, certifié halal & vegan." },
      { q: "Puis-je prendre CollaGlow™ enceinte ?", r: "Demande à ton médecin ; nos clientes l'utilisent surtout après l'allaitement." },
      { q: "Et la livraison / paiement ?", r: "Gratuite 24–48h partout au Maroc, paiement à la réception (COD)." },
      { q: "Et si ça ne marche pas ?", r: "Garantie 4 semaines : on rembourse, sans discussion." },
    ],
    testimonials: [
      { text: "Après 4 semaines, mon ventre montrait des améliorations nettes. L'intérieur et l'extérieur ensemble, c'est ça le secret.", name: "Samira L. — Casablanca", stars: 5 },
      { text: "J'ai pris les deux ensemble 3 mois. Ma peau est plus ferme et mes ongles ne cassent plus. Je regrette de ne pas avoir commencé plus tôt.", name: "Kaoutar B. — Casablanca", stars: 5 },
      { text: "Je n'ai jamais essayé quelque chose qui m'a fait voir une différence comme ce kit. Louange à Dieu.", name: "Sanaa M. — Rabat", stars: 5 },
    ],
    upsellCopy: "Ajoutez SilkStop™ pour une peau lisse 2 semaines après l'épilation",
    crossSell: { slug: "silkstop", copy: "Pour une peau lisse de la tête aux pieds" },
  }
;

products["kit-collagene"] = kitCollagene;
export const productList = Object.values(products);

// Returns the product with the appropriate language overlay applied.
export function localize(p: Product, lang: Lang): Product {
  if (lang !== "ar") return p;
  const ar = productsAr[p.slug];
  return ar ? { ...p, ...ar } : p;
}

export const bundle = {
  name: "Kit Collagène Inside & Outside",
  arSub: "باقة الكولاجين المتكاملة من الداخل ومن برا",
  contents: ["velvastretch", "collaglow"],
  price: 549,
  oldPrice: 848,
  save: 299,
  cta: "Commander le Kit Collagène",
  micro: "Paiement à la livraison | Livraison gratuite sous 48h",
  urgency: "⚡ Offre limitée — stocks réduits",
};

export function unitPrice(slug: string, qty: number, catalog: Record<string, Product> = products): number {
  const p = catalog[slug];
  if (!p) return 0;
  if (!p.offers || p.offers.length === 0) return p.price ?? 0;
  const offer = p.offers.find((o) => o.qty === qty) || p.offers[0];
  return offer?.price ?? p.price ?? 0;
}
