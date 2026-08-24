# 03 — Frontend Stack & Coding Rules

Exact libraries and the conventions the AI coder MUST follow. Do not add unapproved deps.

## 1. Approved libraries
```
next@14            react@18            react-dom@18
typescript         tailwindcss         @tailwindcss/rtl   (or logical props)
next-intl          zustand             react-hook-form
zod                @hookform/resolvers framer-motion
react-hot-toast    clsx                tailwind-merge
lucide-react       (icons)             date-fns (light, optional)
```
Do NOT add: Redux, MUI, Chakra, Bootstrap, jQuery, heavy carousel libs. Use CSS/Tailwind + framer-motion.

## 2. Coding rules
- **TypeScript strict mode on.** No `any` in committed code.
- **Server vs Client:** pages are Server Components by default. Only mark `"use client"` for:
  CartDrawer, CheckoutPopup, forms, pixels, toasts, animations.
- **No business logic in components.** Put it in `lib/` (cart store, api client, validation, pixels).
- **Cart state:** `zustand` store `useCart` with `persist` middleware (localStorage key `warda-cart`).
- **API client:** `lib/api.ts` wraps `fetch` to `NEXT_PUBLIC_API_URL`. Always handle non-2xx.
- **Validation:** `lib/validation.ts` exports `moroccoPhoneSchema` (zod). Phone must match
  `^0(5|6|7|8)[0-9]{8}$` (10 digits, leading 0). Used in form + shown example "0612345678".
- **Class helper:** `cn()` = `clsx` + `tailwind-merge`. Use everywhere.
- **Images:** ALWAYS `next/image`. Placeholders in `public/images/` (sample). Provide `width/height`
  or `aspect-ratio` to avoid CLS. Hero gets `priority`.
- **No inline `<style>`; use Tailwind + `globals.css` tokens (see 04).**
- **Animations subtle:** drawer 250ms ease, toast 200ms. No parallax/scrolljacking.
- **Accessibility:** buttons min 48px tap target, labels on inputs, `aria-*` on drawer/dialog.
- **RTL:** Arabic blocks get `dir="rtl"` + `lang="ar"`. Use logical utilities (`ms-*`/`me-*`).

## 3. Component contracts (props typed)

### `Header`
- Props: none (reads cart count from store). Layout: **right→left**: brand logo (right), nav menu,
  cart icon (with badge count). Sticky on scroll. Mobile: hamburger → slide-in from right.
- CTA in header (desktop): "🌸 Commander — 279 MAD" linking to /collection.

### `Footer`
- 4 columns: Logo+tagline+socials · Nos Produits · Informations · Nous contacter. Bottom bar copyright.

### `AnnouncementBar`
- Rotates 3 messages every 4s (copy from strategy 2.3). Pause on hover. Closes on mobile? No—keep.

### `ProductCard`
- Props: `{ slug, badge, name, arSub, pitch, price, oldPrice, stars, reviews, ctaLabel }`.
- Renders: badge, name (Cormorant), AR sub, 2-line pitch, price strike, stars, CTA, trust micro.
- Variant for collection grid vs homepage vs cross-sell (smaller).

### `CartDrawer` (`use client`)
- Slide-in from right. Shows line items (offer qty), subtotal, cross-sell row (same original prices),
  "Commander" CTA → opens CheckoutPopup. Close on overlay click / Esc.

### `CheckoutPopup` (`use client`)
- Modal over page. Fields: full name*, phone* (example below), city* (dropdown all MA cities),
  address*, qty (if not preset), order-bump checkbox, order summary, CTA "Confirmer".
- On valid submit → POST /api/orders → then 99 MAD upsell window (10–15s) → /confirmation.

### `Section` (layout helper)
- Props: `{ imageSide: 'left'|'right', image, children }`. Desktop: text on one side, image other;
  alternate per section. Mobile: image on top, text below. Reserve aspect ratio.

### `TrustBadges`, `TestimonialGrid`, `IngredientTable`, `Faq`, `Countdown/StockCounter`, `ToastSocialProof`

## 4. Content source
`content/products.ts` exports typed objects per slug with ALL copy from strategy doc (sections 3/4/5/6).
Do not hardcode copy in components — import from `content/`.

## 5. Folder conventions
- `components/sections/` for homepage/product sections (Hero, BrandStory, Featured, HowItWorks,
  SocialProof, WhyUs, Bundle, FinalCTA).
- `components/ui/` for primitives (Button, Badge, Input, Modal, Card).
- `lib/` for logic. `content/` for copy. `public/images/` for assets.

## 6. Lint/format
- ESLint (next/core-web-vitals) + Prettier. `npm run lint` must pass before any PR.
- No `console.log` in production paths.
