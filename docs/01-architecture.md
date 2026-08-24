# 01 — Architecture

## 1. Monorepo layout

```
warda-beaute/
├─ frontend/                 # Next.js 14 (App Router) + TS + Tailwind
│  ├─ app/
│  │  ├─ layout.tsx          # root: fonts, RTL provider, pixels, announcement bar, header/footer
│  │  ├─ page.tsx            # Home (/)
│  │  ├─ collection/page.tsx # /collection  (all 3 products)
│  │  ├─ velvastretch/page.tsx
│  │  ├─ silkstop/page.tsx
│  │  ├─ collaglow/page.tsx
│  │  ├─ notre-histoire/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ faq/page.tsx
│  │  ├─ suivi-commande/page.tsx
│  │  ├─ confirmation/page.tsx        # thank-you (after order POST succeeds)
│  │  ├─ politiques/...               # livrersion, retour, confidentialite, mentions-legales, cgv
│  │  └─ not-found.tsx     # 404 with product recos
│  ├─ components/           # Header, Footer, CartDrawer, CheckoutPopup, ProductCard, sections...
│  ├─ lib/                  # api client, cart store (zustand), pixels, validation
│  ├─ content/              # product copy objects (typed) — sourced from strategy doc
│  ├─ public/images/        # sample placeholders (replace later)
│  ├─ .env.example
│  ├─ Dockerfile
│  └─ next.config.js
├─ backend/                 # FastAPI + SQLAlchemy + Alembic
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ models.py
│  │  ├─ schemas.py
│  │  ├─ routes/orders.py, geo.py, health.py
│  │  ├─ services/geo.py (MaxMind), sheets.py (webhook), notify.py (WhatsApp)
│  │  └─ db.py
│  ├─ alembic/  (or auto-migrate on boot — see 05)
│  ├─ .env.example
│  ├─ Dockerfile
│  └─ requirements.txt
├─ docker-compose.yml       # frontend + backend + postgres
└─ README.md
```

## 2. Tech stack (final)

**Frontend**
- Next.js 14+ App Router, TypeScript
- Tailwind CSS (+ `tailwindcss-rtl` or logical properties for RTL blocks)
- `next-intl` for FR/AR locale switching (default `fr`, `/ar` for Arabic)
- `zustand` for cart state (persist to localStorage)
- `react-hook-form` + `zod` for the checkout form
- `framer-motion` for SUBTLE animation only (drawer slide, toast). Never heavy.
- `react-hot-toast` for "X just ordered" social-proof toasts
- `clsx` + `tailwind-merge` for class composition
- `lucide-react` for icons (or inline SVG — keep bundle small)

**Backend**
- FastAPI + Uvicorn
- SQLAlchemy 2.0 (async) + `asyncpg` driver
- PostgreSQL (the provided internal URL)
- Pydantic v2 schemas
- Auto table creation / migration on startup (Alembic optional; for launch, `Base.metadata.create_all` on boot is acceptable, but prefer Alembic for prod)
- `httpx` for outbound calls (Sheets webhook, WhatsApp, MaxMind)
- `maxminddb` for GeoLite2/GeoIP2 lookups

## 3. Data flow (COD order)

```
User clicks CTA "add offer to cart"
  → zustand adds item + opens CartDrawer
  → CartDrawer shows cross-sells (same original prices)
User clicks "Commander" in drawer
  → CheckoutPopup opens (order summary + name + phone + city + address)
  → phone validated by zod (Morocco regex) + MaxMind geo check (POST /api/geo from client IP)
  → on submit: POST /api/orders  (backend re-checks geo + whitelist + validates)
       → backend inserts order (status=pending)
       → backend POSTs to Google Sheets webhook (Apps Script)
       → backend (optional) triggers WhatsApp confirmation template
       → returns order_id + summary
  → Frontend shows 10–15s 99 MAD upsell, then redirects to /confirmation
```

## 4. API contract (base: https://api.wardabeaute.com)

| Method | Path | Purpose |
| - | - | - |
| GET | `/health` | liveness |
| POST | `/api/geo` | client IP → {country, is_morocco, is_vpn, risk} (uses MaxMind) |
| POST | `/api/orders` | create COD order (validates geo + phone + whitelist) |
| GET | `/api/products` | product catalog (slugs, prices, offers) |
| POST | `/api/orders/{id}/upsell` | attach the 99 MAD upsell post-submit |

All `/api/*` must set CORS `Access-Control-Allow-Origin: https://wardabeaute.com`.

## 5. Environment split
- Frontend talks to backend via `NEXT_PUBLIC_API_URL` (default `https://api.wardabeaute.com`).
- Backend uses internal `DATABASE_URL` (`wardabeaute_database:5432`) inside docker; exposed publicly only via `api.wardabeaute.com` through easypanel reverse proxy.

## 6. Performance budget (non-negotiable)
- LCP < 2.5s on Slow 4G Morocco · TTI < 4s · CLS < 0.1 · Mobile Lighthouse > 85
- Pixels deferred (`strategy="afterInteractive"` / `defer`). Images: AVIF/WebP, `<200KB` hero, `next/image`, `priority` on hero.
- Keep client JS minimal — COD means no heavy cart framework.

See `08-cro-checklist.md` for the full gate.
