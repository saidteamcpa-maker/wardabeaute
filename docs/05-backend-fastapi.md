# 05 — Backend (FastAPI)

Python FastAPI + SQLAlchemy 2.0 async + PostgreSQL. Auto-migrate on boot. Exposes `api.wardabeaute.com`.

## 1. Structure
```
backend/
├─ app/
│  ├─ main.py            # FastAPI app, CORS, include routers, startup migration
│  ├─ db.py              # engine, session, Base
│  ├─ models.py          # Order, OrderItem, Product
│  ├─ schemas.py         # Pydantic v2 request/response
│  ├─ config.py          # pydantic-settings from env
│  ├─ routes/
│  │  ├─ health.py
│  │  ├─ geo.py          # POST /api/geo
│  │  ├─ orders.py       # POST /api/orders, GET /api/products, POST upsell
│  ├─ services/
│  │  ├─ geo.py          # MaxMind lookup (see 12)
│  │  ├─ sheets.py       # POST order to Sheets webhook (see 10)
│  │  ├─ notify.py       # WhatsApp (Wati/twilio optional)
│  └─ seed.py            # insert 3 products + upsell-99 if empty
├─ requirements.txt
├─ Dockerfile
├─ .env.example
```

## 2. Config (`config.py`) — pydantic-settings
```
DATABASE_URL            # internal: postgres://wardabeaute:wardabeaute324@wardabeaute_database:5432/wardabeaute?sslmode=disable
CORS_ORIGINS           # https://wardabeaute.com
SHEETS_WEBHOOK_URL      # Apps Script deploy URL (see 10)
MAXMIND_DB_PATH         # /app/geo/GeoLite2-City.mmdb
MAXMIND_LICENSE_KEY     # for geoip update (env.example)
WHITELIST_PHONES        # 0666666666 (comma separated)
WHATSAPP_TOKEN          # optional
ADMIN_SECRET
```

## 3. Models (`models.py`)
```python
class Product(Base):
    __tablename__ = "products"
    id = str (slug) PK
    name, ar_sub, price, old_price, badge, stars, reviews, active

class Order(Base):
    __tablename__ = "orders"
    id = UUID PK
    created_at = datetime default now
    customer_name, phone, city, address, postal (opt)
    items = JSONB  # [{slug, name, qty, unit_price, line_total}]
    subtotal, upsell_total, total  # int MAD
    upsell_added = bool default False
    status = "pending"  # pending|confirmed|shipped|delivered|cancelled
    country, ip, is_vpn, geo_risk  # from MaxMind
    notes

class OrderItem(Base):  # optional normalized; JSONB on Order is enough for launch
    ...
```
Migration on boot: `Base.metadata.create_all(engine)` in `startup`. For prod prefer Alembic; include
`alembic` dir + `alembic upgrade head` in Docker CMD after table create. Seed products if table empty.

## 4. Schemas (`schemas.py`)
```python
class OrderItemIn(BaseModel):
    slug: str
    qty: int = 1

class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2)
    phone: str                    # validated Morocco on client; re-validated server
    city: str
    address: str = Field(min_length=5)
    postal: str | None = None
    items: list[OrderItemIn]      # 1..N
    upsell: bool = False          # the 99 MAD add-on (only valid via upsell endpoint too)

class OrderOut(BaseModel):
    id: str
    total: int
    status: str
    summary: list[dict]
```

## 5. Endpoints

### POST `/api/geo`
Body: `{}` (reads `request.client.host` + `X-Forwarded-For`). Returns
`{country_iso, country_name, city, is_morocco, is_vpn, is_proxy, is_tor, risk_score}`.
Used by frontend BEFORE showing checkout + by backend on order create as a second gate.

### POST `/api/orders`
1. Validate payload with Pydantic.
2. Server-side phone regex `^0(5|6|7|8)[0-9]{8}$`.
3. Geo gate: call MaxMind on client IP. If `not is_morocco` AND phone not in `WHITELIST_PHONES`
   → `403 {error:"orders_only_morocco"}`. If `is_vpn/proxy/tor` or `risk_score` high AND not whitelisted → `403`.
4. Compute totals from catalog (never trust client prices). Upsell not applied here.
5. Insert Order(status=pending) with geo metadata + IP.
6. Fire-and-forget `services/sheets.py` POST to Sheets webhook (await with timeout; log on fail).
7. (Optional) `services/notify.py` WhatsApp template.
8. Return `OrderOut`.

### POST `/api/orders/{id}/upsell`
Body `{add: true}`. Only valid within 15 min of order. Sets `upsell_added=True`, adds `upsell-99`
(99 MAD) to items + total. Re-POST to Sheets webhook with updated row (append note "UPSOLD").

### GET `/api/products`
Returns catalog (slugs, names, prices, offers tiers). Frontend uses for cart math + pages.

### GET `/health` → `{"status":"ok"}`

## 6. CORS
```
allow_origins = [CORS_ORIGINS]   # https://wardabeaute.com
allow_methods = ["GET","POST"]
allow_headers = ["*"]
```

## 7. Totals math (authoritative on server)
```
PRICES = {
  "velvastretch": {"1":279,"2":499,"3":699},
  "silkstop":     {"1":229,"2":419,"3":599},
  "collaglow":    {"1":319,"2":569,"3":799},
}
UPSELL_99 = 99
total = sum(line unit_price*qty) + (99 if upsell else 0)
```

## 8. Requirements.txt
```
fastapi
uvicorn[standard]
sqlalchemy>=2.0
asyncpg
pydantic>=2
pydantic-settings
maxminddb
httpx
alembic        # if used
python-dotenv
```

## 9. Docker CMD
`uvicorn app.main:app --host 0.0.0.0 --port 8000` (behind easypanel proxy at api.wardabeaute.com).
Startup runs `Base.metadata.create_all` + `seed.py`.

## 10. Notes
- All money in MAD integer (no decimals).
- Never log full phone in plaintext to public logs.
- Sheets webhook failure must NOT fail the order; queue + retry (simple: log + background task).
