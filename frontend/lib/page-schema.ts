export type BlockKind = "text" | "textarea" | "image" | "url";

export interface BlockDef {
  key: string;
  label: string;
  kind: BlockKind;
  required?: boolean;
  hint?: string;
}

export interface PageTypeDef {
  name: string;
  blocks: BlockDef[];
}

function b(key: string, label: string, kind: BlockKind = "text", extra: Partial<BlockDef> = {}): BlockDef {
  return { key, label, kind, ...extra };
}

export const PAGE_TYPES: Record<string, PageTypeDef> = {
  home: {
    name: "Accueil",
    blocks: [
      b("home.heroEyebrow", "Hero — sourcilline", "text"),
      b("home.heroH1", "Hero — titre principal", "text", { required: true }),
      b("home.heroAr", "Hero — titre Darija", "text"),
      b("home.discover", "Hero — bouton « Découvrir »", "text"),
      b("home.story", "Hero — bouton « Notre histoire »", "text"),
      b("home.heroFooter", "Hero — mention sous boutons", "textarea"),
      b("home.problemTitle", "Bloc problème — titre", "text"),
      b("home.problemBody", "Bloc problème — texte", "textarea"),
      b("home.featuredEyebrow", "Produits — sourcilline", "text"),
      b("home.featuredTitle", "Produits — titre", "text"),
      b("home.scienceEyebrow", "Science — sourcilline", "text"),
      b("home.scienceTitle", "Science — titre", "text"),
      b("home.bundleTitle", "Kit — titre", "text"),
      b("home.bundleSub", "Kit — sous-titre", "textarea"),
      b("home.bundleCta", "Kit — bouton", "text"),
      b("home.howTitle", "Fonctionnement — titre", "text"),
      b("home.whyTitle", "Pourquoi nous — titre", "text"),
      b("home.finalTitle", "CTA final — titre", "text"),
      b("home.finalBody", "CTA final — texte", "textarea"),
      b("home.finalCta1", "CTA final — bouton 1", "text"),
      b("home.finalCta2", "CTA final — bouton 2", "text"),
      b("home.heroImage", "Hero — image", "image"),
      b("home.storyImage", "Section Histoire — image", "image"),
      b("home.bundleImage", "Kit — image", "image"),
    ],
  },
  product: {
    name: "Page Produit",
    blocks: [
      b("pp.ceLabel", "Hero — sourcilline (« pour toi »)", "text"),
      b("pp.whyLove", "Titre — « Pourquoi vous l'aimerez »", "text"),
      b("pp.comparisonTitle", "Titre — Comparaison", "text"),
      b("pp.science", "Ingrédients — sourcilline", "text"),
      b("pp.ingredients", "Ingrédients — titre", "text"),
      b("pp.howTo", "Application — sourcilline", "text"),
      b("pp.steps", "Application — titre", "text"),
      b("pp.forYouIf", "« C'est pour vous si » — titre", "text"),
      b("pp.testimonials", "Témoignages — titre", "text"),
      b("pp.moreResults", "« Plus de résultats » — titre", "text"),
      b("pp.faq", "FAQ — titre", "text"),
      b("pp.heroImage", "Hero — image produit", "image"),
      b("pp.descImage", "Description — image", "image"),
      b("pp.ingredientsImage", "Ingrédients — image", "image"),
      b("pp.howToImage", "Application — image", "image"),
    ],
  },
  faq: {
    name: "FAQ",
    blocks: [
      b("faqPage.title", "Titre de page", "text"),
      b("faqPage.sub", "Sous-titre", "textarea"),
      b("faq.bannerImage", "Bannière — image", "image"),
    ],
  },
  contact: {
    name: "Contact",
    blocks: [
      b("contact.title", "Titre de page", "text"),
      b("contact.sub", "Sous-titre", "textarea"),
      b("contact.address", "Adresse", "text"),
      b("contact.email", "Email", "text"),
      b("contact.instagram", "Instagram (texte lien)", "text"),
      b("contact.tiktok", "TikTok (texte lien)", "text"),
      b("contact.whatsapp", "WhatsApp (texte lien)", "text"),
      b("contact.bannerImage", "Bannière — image", "image"),
    ],
  },
  policy: {
    name: "Page légale",
    blocks: [
      b("policy.title", "Titre de page", "text"),
      b("policy.body", "Contenu (HTML autorisé : p, br, strong, ul, li, h2, h3, a)", "textarea"),
      b("policy.bannerImage", "Bannière — image", "image"),
    ],
  },
  checkout: {
    name: "Commande (popup)",
    blocks: [
      b("co.title", "Titre popup", "text"),
      b("co.cod", "Mention paiement à la livraison", "text"),
      b("co.name", "Placeholder — nom", "text"),
      b("co.phone", "Placeholder — téléphone", "text"),
      b("co.city", "Placeholder — ville", "text"),
      b("co.address", "Placeholder — adresse", "text"),
      b("co.submit", "Bouton — valider", "text"),
      b("co.secure", "Mentions sécurité", "text"),
    ],
  },
  confirmation: {
    name: "Confirmation",
    blocks: [
      b("confirm.title", "Titre — Merci", "text"),
      b("confirm.message", "Message principal", "textarea"),
      b("confirm.delivery", "Info livraison", "textarea"),
      b("confirm.bannerImage", "Bannière — image", "image"),
    ],
  },
  kit: {
    name: "Page Kit",
    blocks: [
      b("kit.problemTitle", "Titre — problème", "text"),
      b("kit.problemBody", "Texte — problème", "textarea"),
      b("kit.problemMicro", "Micro-texte Darija", "text"),
      b("kit.scienceEyebrow", "Science — sourcilline", "text"),
      b("kit.scienceTitle", "Science — titre", "text"),
      b("kit.sci1", "Science — bloc 1", "textarea"),
      b("kit.sci2", "Science — bloc 2", "textarea"),
      b("kit.sci3", "Science — bloc 3", "textarea"),
      b("kit.extTitle", "Extérieur — titre", "text"),
      b("kit.extBody", "Extérieur — texte", "textarea"),
      b("kit.intTitle", "Intérieur — titre", "text"),
      b("kit.intBody", "Intérieur — texte", "textarea"),
      b("kit.synergy", "Synergie — texte", "textarea"),
      b("kit.authorityTitle", "Autorité — titre", "text"),
      b("kit.insideEyebrow", "Ingrédients — sourcilline", "text"),
      b("kit.insideTitle", "Ingrédients — titre", "text"),
      b("kit.insideBody", "Ingrédients — texte", "textarea"),
      b("kit.benefitsTitle", "Bénéfices — titre", "text"),
      b("kit.ritualEyebrow", "Rituel — sourcilline", "text"),
      b("kit.ritualTitle", "Rituel — titre", "text"),
      b("kit.ritualNote", "Rituel — note", "textarea"),
      b("kit.faqTitle", "FAQ — titre", "text"),
      b("kit.riskTitle", "Risque — titre", "text"),
      b("kit.riskBody", "Risque — texte", "textarea"),
      b("kit.finalTitle", "CTA final — titre", "text"),
      b("kit.finalSub", "CTA final — sous-titre", "textarea"),
      b("kit.viewAll", "Bouton — voir tout", "text"),
      b("kit.heroImage", "Hero — image", "image"),
      b("kit.scienceImage", "Science — image", "image"),
      b("kit.ingredientsImage", "Ingrédients — image", "image"),
      b("kit.ritualImage", "Rituel — image", "image"),
    ],
  },
  collection: {
    name: "Collection",
    blocks: [
      b("collection.title", "Titre de page", "text"),
      b("collection.sub", "Sous-titre", "textarea"),
      b("collection.bannerImage", "Bannière — image", "image"),
    ],
  },
  story: {
    name: "Notre Histoire",
    blocks: [
      b("story.title", "Titre de page", "text"),
      b("story.secEyebrow", "Sourcilline section", "text"),
      b("story.secTitle", "Section — titre", "text"),
      b("story.sec1", "Section 1 — titre", "text"),
      b("story.sec2", "Section 2 — titre", "text"),
      b("story.p1", "Paragraphe 1", "textarea"),
      b("story.p2", "Paragraphe 2", "textarea"),
      b("story.quote", "Citation", "textarea"),
      b("story.image", "Image de page", "image"),
    ],
  },
};

export interface KnownPage {
  slug: string;
  name: string;
  type: string;
  route: string;
}

export const KNOWN_PAGES: KnownPage[] = [
  { slug: "home", name: "Accueil", type: "home", route: "/" },
  { slug: "velvastretch", name: "VelvaStretch™", type: "product", route: "/velvastretch" },
  { slug: "silkstop", name: "SilkStop™", type: "product", route: "/silkstop" },
  { slug: "collaglow", name: "CollaGlow™", type: "product", route: "/collaglow" },
  { slug: "kit-collagene", name: "Kit Collagène Inside & Outside", type: "kit", route: "/kit-collagene" },
  { slug: "collection", name: "Collection", type: "collection", route: "/collection" },
  { slug: "notre-histoire", name: "Notre Histoire", type: "story", route: "/notre-histoire" },
  { slug: "faq", name: "FAQ", type: "faq", route: "/faq" },
  { slug: "contact", name: "Contact", type: "contact", route: "/contact" },
  { slug: "privacy", name: "Confidentialité", type: "policy", route: "/politique-de-confidentialite" },
  { slug: "retour", name: "Politique de retour", type: "policy", route: "/politique-de-retour" },
  { slug: "checkout", name: "Commande (popup)", type: "checkout", route: "/" },
  { slug: "confirmation", name: "Confirmation", type: "confirmation", route: "/confirmation" },
];

export function pageTypeOf(slug: string): string {
  return KNOWN_PAGES.find((p) => p.slug === slug)?.type ?? "policy";
}

export function schemaFor(slug: string): PageTypeDef {
  return PAGE_TYPES[pageTypeOf(slug)];
}

// Editor-only view: keeps only image-kind blocks so admins can edit images
// and nothing else (text/url/textarea fields are hidden from the dashboard).
export function schemaForImagesOnly(slug: string): PageTypeDef {
  const s = schemaFor(slug);
  return { ...s, blocks: s.blocks.filter((b) => b.kind === "image") };
}

export interface SiteContentData {
  header: {
    logoUrl?: string;
    nav?: Record<string, { fr?: string; ar?: string }>;
  };
  footer: {
    description?: { fr?: string; ar?: string };
    copyright?: { fr?: string; ar?: string };
    email?: string;
    phone?: string;
    social?: { instagram?: string; facebook?: string; tiktok?: string; whatsapp?: string };
  };
  announcement: {
    text?: { fr?: string; ar?: string };
  };
}

export const SITE_SCHEMA = {
  header: {
    logoUrl: "URL du logo (ex: /header-logo.png)",
    nav: "Libellés du menu (par clé i18n)",
  },
  footer: {
    description: "Description de marque",
    copyright: "Mentions copyright",
    email: "Email de contact",
    phone: "Téléphone",
    social: "Liens sociaux",
  },
  announcement: {
    text: "Texte de la barre d'annonce",
  },
} as const;
