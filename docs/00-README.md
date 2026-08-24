# Warda Beauté — docs/

> **Single source of truth for the AI coder building wardabeaute.com**
> Branded DTC store · Morocco · COD only · Next.js (frontend) + FastAPI (backend)

This folder contains everything the coder needs to ship a 12/10 CRO, authority-heavy,
emotionally-positioned ecom store. Read `00-README.md` (this file) first, then the others in order.

The companion brand/copy bible is `warda_beaute_strategy.md` (in the parent /Downloads folder and
should be copied next to this repo). It holds all final copy, testimonials, ingredient tables and
section-by-section text. This `docs/` set adds the **technical architecture, rules, and the parts
the strategy doc did not fully specify**: cart drawer, checkout popup, upsell, MaxMind geo-gating,
FastAPI backend, Google Sheets webhook, pixels + CAPI, Docker, env, deploy.

---

## HOW TO USE THESE DOCS (prompts for the AI coder)

1. Read `01-architecture.md` → scaffold the two folders (`frontend/`, `backend/`) exactly as described.
2. Read `02-brand-positioning-icp.md` → write copy/voice in the components. Do NOT invent new claims.
3. Read `03-frontend-stack-rules.md` + `04-design-system.md` → build the component library and pages.
4. Read `05-backend-fastapi.md` + `12-maxmind-geo.md` → build API, models, migrations, geo gate.
5. Read `06-checkout-cart-flow.md` → implement cart drawer + checkout popup + 99 MAD upsell + thank-you.
6. Read `07-pixels-capi.md` → wire Meta + TikTok web pixels AND server CAPI with dedup + defer.
7. Read `09-env-examples.md`, `10-google-sheets-webhook.md`, `11-docker-deploy.md` → config + deploy.
8. Validate with `08-cro-checklist.md` before launch.

---

## FILE MAP

| # | File | What the coder gets |
| - | - | - |
| 00 | `00-README.md` | This index + prompt order |
| 01 | `01-architecture.md` | Routes, folder tree, tech stack, data flow |
| 02 | `02-brand-positioning-icp.md` | Positioning, ICP, language rules, proof/authority/science framework |
| 03 | `03-frontend-stack-rules.md` | Exact libs, conventions, coding rules, component contracts |
| 04 | `04-design-system.md` | Colors, fonts, spacing, component specs, responsive rules |
| 05 | `05-backend-fastapi.md` | FastAPI structure, SQLAlchemy models, endpoints, migration on boot |
| 06 | `06-checkout-cart-flow.md` | Cart drawer, checkout popup, 99 MAD upsell, thank-you page, webhook payload |
| 07 | `07-pixels-capi.md` | Meta + TikTok web pixel + CAPI, defer, event_id dedup, hashing |
| 08 | `08-cro-checklist.md` | 30-point pre-launch CRO / quality gate |
| 09 | `09-env-examples.md` | `frontend/.env.example` + `backend/.env.example` for easypanel |
| 10 | `10-google-sheets-webhook.md` | Apps Script JS to paste in Sheets + CSV column template |
| 11 | `11-docker-deploy.md` | Dockerfile x2, docker-compose, GitHub, easypanel, DNS |
| 12 | `12-maxmind-geo.md` | MaxMind IP detection, Morocco-only orders, VPN block, whitelist |

---

## HARD CONSTRAINTS (never violate)

- **No Shopify / no platform.** Custom Next.js storefront + custom FastAPI backend.
- **COD only.** No Stripe/Card/PayPal at checkout. Cash at delivery.
- **No cart page.** Cart is a **drawer** (slide-in). Checkout is a **popup** over the current page.
- **Valid Morocco phone only.** Must start with `0` and be a valid `06/05/07/08` format. `+` prefix for TikTok CAPI.
- **Geo-gate:** orders allowed only from Morocco IP, not VPN/proxy/suspicious, EXCEPT whitelisted `0666666666`.
- **Only one discount ever:** the 99 MAD post-submit upsell. Everything else is original price / bundle savings shown as value, not a "discount".
- **Languages:** Darija (emotion/hooks/testimonials) + French (science/product names). RTL only for Arabic content blocks.
- **Domains:** store `wardabeaute.com`, API `api.wardabeaute.com`.
- **DB (internal docker network):** `postgres://wardabeaute:wardabeaute324@wardabeaute_database:5432/wardabeaute?sslmode=disable`

---

## PRODUCTS (IDs used everywhere)

| slug | name | AR sub | base price | old price | bundle |
| - | - | - | - | - | - |
| `velvastretch` | VelvaStretch™ | سيروم الكولاجين لعلامات التمدد | 279 MAD | 399 MAD | Body Confidence Kit |
| `silkstop` | SilkStop™ | زيت إيقاف نمو الشعر بالزيوت الطبيعية | 229 MAD | 329 MAD | Smooth Skin Kit |
| `collaglow` | CollaGlow™ | علكات الكولاجين البحري + حمض الهيالورونيك | 319 MAD | 449 MAD | Inside + Outside Kit |

Offers per product page: **1 / 2 / 3 pieces** (quantity selector that changes price + savings).
The 99 MAD upsell product is a separate internal SKU `upsell-99` (e.g. a mini/travel item) shown only in the post-submit 10–15s window.

---

*Generated for Warda Beauté · wardabeaute.com · Morocco 2026*
