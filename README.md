# Warda Beauté — Storefront + Admin (COD)

Moroccan cosmetics storefront with FR (default) + AR (RTL) storefront, COD
checkout, and a full admin dashboard. Built with Next.js 14 App Router,
TypeScript, Tailwind, next-intl, Drizzle ORM + PostgreSQL, deployed on
EasyPanel (Hostinger VPS).

## Stack

- **Frontend**: Next.js 14 App Router, Tailwind CSS, framer-motion,
  react-hook-form + zod, react-hot-toast
- **i18n**: next-intl — `/fr` (default) and `/ar` (RTL, `dir="rtl"`)
- **Backend**: Next.js Route Handlers + Drizzle ORM (postgres-js)
- **DB**: PostgreSQL (EasyPanel managed service)
- **Auth**: admin JWT in httpOnly cookie
- **WhatsApp**: WATI Business API (order confirmations + auto-confirm webhook)
- **Deploy**: Docker (multi-stage) via EasyPanel

## Project structure

```
src/
  app/
    [locale]/            # localized storefront
      page.tsx           # homepage
      [slug]/page.tsx    # product + bundle pages
      checkout/          # 1-page COD checkout
      confirmation/      # order success
      suivi-commande/     # order tracking
      notre-histoire/ faq/ contact/
      admin/             # dashboard (FR only, auth protected)
    api/
      orders/            # POST create, GET track
      admin/             # login, logout, orders, stats, stock
      webhooks/wati/      # WhatsApp auto-confirm
  components/            # UI + cart + admin
  i18n/                  # routing + request config
  lib/
    db/                  # drizzle schema + client
    data/                # catalog, cities
messages/                # fr.json, ar.json
drizzle/                 # generated migrations
scripts/seed.mjs         # seed products table
```

## Local development

```bash
cp .env.example .env          # set DATABASE_URL + secrets
npm install
npm run dev                   # http://localhost:3000  (redirects to /fr)
```

The DB host `wardabeaute_database` is the EasyPanel internal service name.
For local dev, point `DATABASE_URL` at your own Postgres.

```bash
npm run db:push               # create tables from schema
node scripts/seed.mjs         # seed products
```

## Environment variables

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | EasyPanel PostgreSQL connection string |
| `ADMIN_PASSWORD` | admin login password |
| `JWT_SECRET` | secret for admin JWT |
| `WATI_API_TOKEN` / `WATI_WABA_NUMBER` | WhatsApp Business API |
| `NEXT_PUBLIC_SITE_URL` | absolute site URL (pixels, meta) |
| `NEXT_PUBLIC_FB_PIXEL_ID` / `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | marketing pixels |

## Deploy on EasyPanel (Hostinger VPS)

1. Create a **PostgreSQL** service in EasyPanel (name `wardabeaute_database`).
   Copy its internal connection string into the app's `DATABASE_URL` env var.
2. Create an **App** from this repo (or push the image). EasyPanel builds with
   the included `Dockerfile`.
3. Set env vars above in the EasyPanel dashboard.
4. Add a **Deploy hook / start command** to run migrations once:
   `npm run db:push && node scripts/seed.mjs`.
5. Enable **SSL** (Let's Encrypt) and point `wardabeaute.com` at the app.
6. WATI webhook URL: `https://wardabeaute.com/api/webhooks/wati`.

## Admin

- URL: `/fr/admin` (any `/admin` path redirects to login)
- Password: `ADMIN_PASSWORD` env var
- Features: orders table w/ status actions (confirm/ship/deliver/cancel),
  revenue stats (today/week/month), product stock editor.
