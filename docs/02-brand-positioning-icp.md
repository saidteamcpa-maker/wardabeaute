# 02 — Brand Positioning · ICP · Language · Proof Framework

> This file tells the coder *how to sound and sell*, not just *what to build*.
> All final copy lives in `warda_beaute_strategy.md`. This defines the **rules + psychology** so the
> coder never writes off-brand text and always pairs emotion with proof.

## 1. Positioning statement (the 180-IQ frame)

**"Local Moroccan pride × French-pharmacy authority × science you can verify."**

Warda Beauté is NOT a generic beauty brand. It is the brand that *owns* these three products and
speaks like a trusted older sister who studied cosmetic chemistry in Paris and came home. We sell
expensive because we *look* and *prove* expensive: real ingredients, real tests, real Moroccan
manufacturing, real women's results.

Three pillars the coder must reflect in every section:
1. **Belonging** — "made for you, in Morocco, by Moroccan women."
2. **Authority** — name the molecule, the mechanism, the test, the certificate.
3. **Safety (COD)** — "you pay nothing until it's in your hands."

## 2. ICP (write to these two people)

**Primary — "Nadia", 28, Casablanca/Rabat, 4000–9000 MAD/mo, TikTok/FB/IG, COD-only (burned by cards).**
- Pain: stretch marks from weight changes; tired of monthly epilation; early aging.
- Trigger: Darija video ad → product page → COD.
- Needs: reassurance COD = real, not a scam; proof it works; social proof from "girls like me".

**Secondary — "Khadija", 38, Fès/Marrakech, married, 2 kids, stretch marks post-pregnancy.**
- More skeptical, reads ingredient lists, responds to "made in Morocco" + "dermatologist-tested".
- Orders 8–11 PM. Needs MORE proof and authority signals.

**Implication for build:** every product page must carry (a) Darija pain mirror headline, (b) French
science explanation, (c) ingredient table with origins, (d) certificates/badges, (e) Moroccan
testimonials with names + cities, (f) COD safety reassurance near every CTA.

## 3. Language rules (CRITICAL — follow exactly)

- **Emotion + hooks + testimonials = Darija** (Moroccan dialect, NOT MSA/fusha). MSA sounds stiff/corporate — banned.
- **Science + product names + clinical claims = French.** e.g. "Collagène marin hydrolysé", "testé dermatologiquement".
- **Arabic content blocks = RTL** (`dir="rtl"`). French blocks = LTR.
- Use informal **"tu"** for 20–35, **"vous"** for 36+.
- Show NUMBERS constantly: "86% de confirmation", "30 jours", "4 semaines", "+2,400 femmes".
- Reference Morocco concretely: cities, traditions, "جداتنا", "مطبخ في الدار".

**Banned:** "premium", "luxurious", "exclusive" without substance; MSA; fake medical claims
("treats/cures" → use "visibly reduces / améliore l'apparence de").

## 4. The persuasion stack (use in this order on every product page)

For each claim, back it with ONE of: Proof · Logic · Certificate · Science · Authority · Social proof · Ingredient.

| Layer | What to show | Example (VelvaStretch™) |
| - | - | - |
| Pain mirror | Darija headline naming HER problem | "واش كتخبي جسمك بسبب علامات التمدد؟" |
| Mechanism | French, name molecule + how | "Collagène marin → pénètre 1.5x plus profondément" |
| Science | Why it works, brief | bakuchiol accélère renouvellement cellulaire |
| Ingredient | Table w/ origin | Rose musquée du Maroc, etc. |
| Authority | Certs/badges | "🔬 Testé Dermatologiquement", "🇲🇦 Fabriqué au Maroc" |
| Social proof | Real testimonials + counter | "★★★★★ 4.9 (847 avis)" + 8 testimonials |
| Risk reversal | COD + guarantee | "مكتعطيش درهم حتى توصلك" + "Garantie 4 semaines" |

## 5. Authority & proof assets to render (components exist in 04)

- Badges row: `100% Naturel · 🇲🇦 Fabriqué au Maroc · 💳 الدفع عند الاستلام · 🔬 Testé Dermatologiquement · 🚚 24–48h`.
- Certificate strip (SVG placeholders): "Dermatologically Tested", "Halal Certified" (CollaGlow), "Made in Morocco", "Non testé sur animaux".
- Ingredient callout tables (copy from strategy doc sections 4.5 / 5.5 / 6.5).
- INCI lists (verbatim from strategy doc 4.6 / 5.6 / 6.6) in a collapsible `<details>`.
- Testimonial grid: 8 on home, 3 product-specific each (copy verbatim from strategy doc).
- Live counters / toasts: "⚡ 47 personnes regardent", "📦 Fatima de Casablanca vient de commander".

## 6. Emotion → Proof mapping (the "180 IQ" part)

Never make an emotional claim without a proof anchor right after it.
- Emotion: "جمالك يستاهل الأحسن" → Proof: "سيروم بالكولاجين المغربي، 847 مرضية".
- Emotion: "ما كتعياش أكثر من الإبيلاسيون" → Proof: "8 huiles naturelles ralentissent la repousse de 30–50%".
- Emotion: "بشرك عياان" → Proof: "collagène marin + acide hyaluronique, résultats en 30 jours".

## 7. Pricing & offer psychology

- Always show **old price struck through** next to current (anchoring).
- Offers: 1 / 2 / 3 pieces per product with rising savings (e.g. 1=279, 2=499, 3=699).
- Bundles show combined value saved (e.g. Body Confidence Kit 650 vs 827).
- **The ONLY real discount** is the 99 MAD post-submit upsell. Everywhere else, present bundle
  savings as "value you keep", not a discount banner.
- High AOV tactics: cart-drawer cross-sells, in-page upsells, post-submit 99 MAD, bundle CTA.

See `06-checkout-cart-flow.md` for exact offer/upsell mechanics.
