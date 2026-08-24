# 04 — Design System

Exact tokens. Do NOT change hex values. Build the component library from these.

## 1. Colors (CSS vars in `globals.css :root`)
```css
:root {
  --petal: #FBF2EF;      /* bg 45% */
  --brume: #EDD5CD;      /* cards/borders 22% */
  --warda: #C17A82;      /* brand/accent 14% */
  --profond: #8A3D52;    /* CTA/headlines 8% */
  --champagne: #C4993A;  /* gold/star/price 5% */
  --or-doux: #EAD9A6;    /* light gold bg 3% */
  --brun: #3C2128;       /* body text 2% */
  --gris: #8A6E72;       /* secondary text 1% */
  --white: #FFFFFF;
}
```
Tailwind `theme.extend.colors`: map `petal`, `brume`, `warda`, `profond`, `champagne`, `or-doux`, `brun`, `gris`.

**Rules:** page bg `--petal`. CTA buttons bg `--profond`, text `--brume`/white, hover darken 8%.
Links `--warda`. Body text `--brun`. Secondary `--gris`. Stars/badges/price highlight `--champagne`.

## 2. Typography
- Display: **Cormorant Garamond** (300/400 + italic) — brand name, hero H1, product names, pull quotes.
- Body: **DM Sans** (400/500) — nav, body, buttons, form labels, badges.
- Arabic: system stack (Geeza Pro / Segoe UI Arabic / Arial) or **Cairo** from Google Fonts.
- Load via `<link>` in layout head (preconnect). Use `next/font` if possible to self-host.

Scale (mobile-first):
```css
h1 { font-size: clamp(2rem,6vw,3.5rem); font-family:'Cormorant Garamond'; font-weight:300; }
h2 { font-size: clamp(1.5rem,4vw,2.5rem); font-family:'Cormorant Garamond'; font-weight:300; }
h3 { font-size: clamp(1.125rem,3vw,1.5rem); font-family:'DM Sans'; font-weight:500; }
p  { font-size:1rem; line-height:1.75; font-family:'DM Sans'; }
```

## 3. Spacing & layout
- Container max-width `1200px`, padding `16px` mobile / `32px` desktop.
- Section vertical padding `clamp(48px,8vw,96px)`.
- Radius: cards `16px`, buttons `999px` (pill) or `12px`. Inputs `12px`.
- Shadows: soft, low-opacity `--brun`/`--warda`. No harsh shadows.

## 4. Components spec

### Button (`.btn`, `.btn-primary`, `.btn-outline`)
- Primary: bg `--profond`, text white, pill, min-h `48px`, px `28px`, hover darken.
- Outline: border `--warda`, text `--warda`, transparent bg.
- Sticky mobile CTA bar: fixed bottom, bg `--profond`, white text, z-100.

### Input
- min-h `48px`, font-size `16px` (prevents iOS zoom), border `--brume`, focus ring `--warda`.
- Labels above inputs, DM Sans 500.

### Badge
- pill, bg `--or-doux`, text `--brun` (or `--profond`), for "Bestseller"/"Nouveau".
- Star rating: `--champagne` stars + "4.9 (847 avis)".

### Card
- bg `--brume` or white, radius `16px`, border `1px --brume`, padding `20px`.

### Modal / Drawer
- Overlay `rgba(60,33,40,0.5)`. Drawer slides from right (width `min(420px,90vw)`).
- Popup centered, max-w `480px`, radius `16px`.

## 5. Responsive rules (Morocco: 80%+ mobile)
- Breakpoints: `sm 360`, `md 768`, `lg 1024`. Design mobile-first.
- Tap targets ≥ `48px`. Body font ≥ `16px`.
- Section image/text: desktop alternate sides; mobile always image-top then text.
- Test on 360 / 390 / 414 widths. Announcement bar must not break layout.
- Sticky bottom CTA on product pages (mobile).

## 6. Imagery (placeholders now, real later)
Put samples in `public/images/`:
- `hero-home.webp`, `about-hero.webp`
- `velvastretch-1..4.webp`, `silkstop-1..4.webp`, `collaglow-1..4.webp`
- `collection-grid` thumbs
- `cert-derma.svg`, `cert-halal.svg`, `cert-madeinma.svg`, `cert-notested.svg`
- `og-home.webp`, product OG images
Use neutral rose-toned placeholders (CSS gradient + label) if no image yet. Keep `<200KB`, AVIF/WebP.

## 7. Sample placeholder approach
Create `public/images/placeholder.svg` (rose gradient + product name text) referenced until real assets arrive.
Components should accept an `image` prop; default to placeholder if missing.
