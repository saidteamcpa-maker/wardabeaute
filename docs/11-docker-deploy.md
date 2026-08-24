# 11 — Docker + Deploy (GitHub → easypanel)

## 1. frontend/Dockerfile
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/next.config.js ./next.config.js
EXPOSE 3000
CMD ["npm","run","start"]
```
`next.config.js` must set `output: "standalone"` (or use `npm run start`). Use `next.config.js`:
```js
const nextConfig = { output: "standalone", images:{ formats:["image/avif","image/webp"] } };
module.exports = nextConfig;
```

## 2. backend/Dockerfile
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Geo DB mounted via volume at /app/geo (see compose)
EXPOSE 8000
CMD ["sh","-c","python -c \"import app.db, app.seed\" && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
```

## 3. docker-compose.yml (local dev / reference)
```yaml
services:
  wardabeaute_database:
    image: postgres:16
    environment:
      POSTGRES_USER: wardabeaute
      POSTGRES_PASSWORD: wardabeaute324
      POSTGRES_DB: wardabeaute
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports: ["5432:5432"]
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgres://wardabeaute:wardabeaute324@wardabeaute_database:5432/wardabeaute?sslmode=disable
      SHEETS_WEBHOOK_URL: ${SHEETS_WEBHOOK_URL}
      MAXMIND_DB_PATH: /app/geo/GeoLite2-City.mmdb
      WHITELIST_PHONES: 0666666666
      FB_CAPI_TOKEN: ${FB_CAPI_TOKEN}
      TT_CAPI_TOKEN: ${TT_CAPI_TOKEN}
    depends_on: [wardabeaute_database]
    volumes:
      - ./geo:/app/geo
    ports: ["8000:8000"]
  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
      NEXT_PUBLIC_FB_PIXEL_ID: ${NEXT_PUBLIC_FB_PIXEL_ID}
      NEXT_PUBLIC_TIKTOK_PIXEL_ID: ${NEXT_PUBLIC_TIKTOK_PIXEL_ID}
    depends_on: [backend]
    ports: ["3000:3000"]
volumes:
  pgdata:
```

## 4. GitHub
- Repo: `warda-beaute` with two folders `frontend/`, `backend/`, root `docker-compose.yml`, `docs/`.
- `.gitignore`: `node_modules`, `.next`, `__pycache__`, `*.env`, `geo/*.mmdb`, `.env*`.
- Push to GitHub; connect repo in easypanel.

## 5. easypanel setup
- Create **PostgreSQL** service named exactly `wardabeaute_database` (matches `DATABASE_URL` host).
  Credentials: user `wardabeaute`, pass `wardabeaute324`, db `wardabeaute`.
- Create **backend** service from `backend/Dockerfile`, domain `api.wardabeaute.com`, env from
  `backend/.env.example` (fill real). Mount GeoLite2 DB at `/app/geo/GeoLite2-City.mmdb` (upload file
  or use `geoipupdate` in a cron/sidecar). Port 8000.
- Create **frontend** service from `frontend/Dockerfile`, domain `wardabeaute.com`, env from
  `frontend/.env.example`. Port 3000.
- Add **CORS**: backend allows only `https://wardabeaute.com`.
- Health check: `GET /health` on backend.

## 6. DNS
- `wardabeaute.com` → frontend (easypanel).
- `api.wardabeaute.com` → backend (easypanel reverse proxy, HTTPS).
- Both behind managed HTTPS (easypanel auto-cert).

## 7. MaxMind DB provisioning
- Download GeoLite2-City.mmdb via MaxMind account (`geoipupdate` with `MAXMIND_LICENSE_KEY`) into
  `geo/` volume. Backend reads `MAXMIND_DB_PATH`. If missing, `MAXMIND_ENABLED=false` → geo gate
  degrades to "allow" (log warning) so store never hard-fails.

## 8. CI sanity (optional)
- Frontend: `npm run lint && npm run build` on PR.
- Backend: `pip install -r requirements.txt && python -c "import app.main"` smoke test.
