# 09 — Environment Examples (easypanel)

Copy to `frontend/.env.example` and `backend/.env.example`. Fill real values in easypanel.

## frontend/.env.example
```
# Site
NEXT_PUBLIC_SITE_URL=https://wardabeaute.com
NEXT_PUBLIC_API_URL=https://api.wardabeaute.com

# Pixels (browser)
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_PIXELS_ENABLED=true     # set false in localhost

# WhatsApp (click-to-chat)
NEXT_PUBLIC_WHATSAPP_NUMBER=2126XXXXXXXXX   # international, no +

# Misc
NEXT_PUBLIC_FREE_SHIPPING_CITIES=all        # copy hook
```

## backend/.env.example
```
# Database (internal docker network — DO NOT expose publicly)
DATABASE_URL=postgres://wardabeaute:wardabeaute324@wardabeaute_database:5432/wardabeaute?sslmode=disable

# CORS
CORS_ORIGINS=https://wardabeaute.com

# Google Sheets webhook (Apps Script deploy URL — see 10)
SHEETS_WEBHOOK_URL=

# MaxMind (geo gate — see 12)
MAXMIND_DB_PATH=/app/geo/GeoLite2-City.mmdb
MAXMIND_LICENSE_KEY=        # for geoip-update cron (optional)
MAXMIND_ENABLED=true

# Whitelist (test orders in prod)
WHITELIST_PHONES=0666666666

# Meta Conversions API (server) — backend only
FB_CAPI_TOKEN=

# TikTok Events API (server) — backend only
TT_CAPI_TOKEN=

# Optional WhatsApp Business API (Wati/twilio)
WHATSAPP_TOKEN=
WHATSAPP_WHITELIST_NOTIFY=

# Admin
ADMIN_SECRET=
```

## Notes
- Frontend never sees `FB_CAPI_TOKEN` / `TT_CAPI_TOKEN` / `DATABASE_URL` / `SHEETS_WEBHOOK_URL`.
- `DATABASE_URL` uses host `wardabeaute_database` (docker service name). Public traffic only via
  `api.wardabeaute.com` reverse proxy (easypanel).
- `WHITELIST_PHONES` comma-separated; `0666666666` always included for prod testing.
- In easypanel: frontend service builds `frontend/Dockerfile` → domain wardabeaute.com; backend →
  api.wardabeaute.com; postgres service named `wardabeaute_database`.
