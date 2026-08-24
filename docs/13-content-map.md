# 13 — Content Map (where the coder gets every word)

All final copy lives in `warda_beaute_strategy.md` (keep it next to this repo). This maps each page
to the exact sections to import. Do NOT rewrite copy — import it verbatim and render with the
design system (04) + voice rules (02).

| Page / Component | Copy source (strategy doc) | Notes |
| - | - | - |
| Announcement bar | §2.3 | 3 rotating messages |
| Header / Footer | §2.2, §2.4 | nav + 4-col footer |
| Home — Hero | §3.2 | eyebrow, H1, sub, CTAs, microcopy |
| Home — Trust bar | §3.3 | 5 signals |
| Home — Brand story | §3.4 | H2 + body + Darija pull quote |
| Home — Featured | §3.5 | 3 ProductCards (badge,name,ar,pitch,price,stars,cta) |
| Home — How it works | §3.6 | 3 COD steps |
| Home — Social proof | §3.7 | 8 testimonials (verbatim) |
| Home — Why us | §3.8 | 6 benefit blocks |
| Home — Bundle | §3.9 | Body Confidence Kit |
| Home — Final CTA | §3.10 | Darija H2 |
| PDP VelvaStretch™ | §4.0–4.14 | full PDP incl. ingredients §4.5, INCI §4.6, FAQ §4.11, upsell §4.13, cross-sell §4.14 |
| PDP SilkStop™ | §5.0–5.10 | same structure |
| PDP CollaGlow™ | §6.0–6.10 | same structure |
| Collection | §3.5 + per-PDP intro | grid of 3 + bundle |
| Bundle page | §7.1 | 3 bundles with savings |
| About / Notre Histoire | §3.4 + §1.6 | brand story + UVP |
| FAQ page | §4.11 / 5.9 / 6.9 | merge product FAQs |
| Contact | §2.4 + §8.4 | WhatsApp + email + socials |
| Checkout popup | §8.1 | form + order bump (§7.3) + trust |
| Confirmation / thank-you | §8.2 + §8.3 | order #, delivery, cross-sell |
| SEO meta | §3.0 / 4.0 / 5.0 / 6.0 / §9 | titles + meta + keywords |
| Upsell/cross-sell logic | §7.2, §7.3, §7.4 | cart triggers + bumps |
| Loyalty/referral | §7.7 | optional Phase 2 |

## Typed content module
Create `frontend/content/products.ts`:
```ts
export type Product = {
  slug: "velvastretch"|"silkstop"|"collaglow";
  name: string; arSub: string; badge: string;
  price: number; oldPrice: number; stars: number; reviews: number;
  offers: {qty:1|2|3; price:number}[];
  hero: {...}; description: {...}; benefits: string[];
  ingredients: {name:string; role:string; origin?:string}[];
  inci: string; howTo: string[]; who: {for:string[]; not:string[]};
  faq: {q:string; r:string}[]; testimonials: {text:string; name:string; stars:number}[];
  upsell: {slug:string; copy:string}; crossSell: {slug:string; copy:string};
};
export const products: Record<string, Product> = { ... }; // fill from sections above
```
Use this object in ProductCard, PDP, cart math, and `/api/products` seed.

## Image slots (use placeholders until real assets)
For each PDP: 1 hero + 3–4 gallery images (before/after, texture, lifestyle). Home: hero + brand.
Certs: 4 SVG badges. See `04-design-system.md §6` for placeholder approach.
