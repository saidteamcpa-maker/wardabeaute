# 14 — EasyPanel Deployment (Docker Compose)

Full-stack deploy of Warda Beauté (Next.js frontend + FastAPI backend + Postgres) via an EasyPanel **Docker Compose** project.

## Repository
- Repo: `https://github.com/saidteamcpa-maker/opencode.git`
- Branch: `main`
- Compose file: `docker-compose.yml` (repo root)

## Services
| Service               | Image / Build      | Port  | Public domain            |
|-----------------------|--------------------|-------|--------------------------|
| `frontend`            | `./frontend`       | 3000  | `wardabeaute.com`        |
| `backend`             | `./backend`        | 8000  | `api.wardabeaute.com`    |
| `wardabeaute_database`| `postgres:16-alpine`| 5432 | internal only            |

The backend auto-creates tables and seeds products on first boot (`Base.metadata.create_all` + `seed.seed_products()`).

## Steps
1. In EasyPanel, create a **Docker Compose** project.
2. Connect the Git repo above (`main`, compose file at root).
3. Deploy. EasyPanel builds `frontend` and `backend` and starts `wardabeaute_database`.
4. Add domains:
   - `wardabeaute.com` → `frontend` service
   - `api.wardabeaute.com` → `backend` service
5. (Optional) Set backend env vars in the EasyPanel UI:
   - `SHEETS_WEBHOOK_URL`, `FB_PIXEL_ID`, `FB_CAPI_TOKEN`, `TT_PIXEL_ID`, `TT_CAPI_TOKEN`, `WHATSAPP_TOKEN`, `ADMIN_SECRET`, `MAXMIND_DB_PATH`, `MAXMIND_ENABLED`.
   - `CORS_ORIGINS` (default already includes `wardabeaute.com`, `www.wardabeaute.com`, `localhost:3000`).
   - `NEXT_PUBLIC_API_URL` (frontend build arg, default `https://api.wardabeaute.com`).

## Connection strings
- Backend → DB: `postgres://wardabeaute:wardabeaute324@wardabeaute_database:5432/wardabeaute?sslmode=disable`
- Frontend → Backend (browser): `https://api.wardabeaute.com`

## Notes
- `NEXT_PUBLIC_API_URL` is baked at build time; change it only by rebuilding (or set it in EasyPanel before first deploy).
- Database data persists in the `pgdata` named volume.
- Never commit `.env` files (already gitignored).
