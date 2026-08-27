# 11 — SpaceSeller Marketplace Integration (drop.spaceseller.ma)

**Uses your existing `Product.sku` field** — no new columns. Set the marketplace SKU (e.g. `PROD-001`) in **Admin → Products → SKU** for each product. Orders use `OrderItem.sku || slug` fallback.

## Env (server-only, never NEXT_PUBLIC)

Backend `backend/app/config.py:20` reads both spellings (`SPACESHELL_*` and `SPACESSELLER_*`):

```
SPACESHELL_TOKEN=eyJ...  # Bearer token from Mediaplus (keep secret)
SPACESSELLER_TOKEN=eyJ... # alias, either works
SPACESHELL_BASE_URL=https://drop.spaceseller.ma/api/v1 # optional, defaults to drop.spaceseller.ma
SPACESSELLER_BASE_URL=https://drop.spaceseller.ma/api/v1
```

Frontend `frontend/app/api/orders/route.ts:7` reads the same vars server-side (`process.env.SPACESHELL_TOKEN`). `docker-compose.yml:38` injects them as runtime env for `backend` (and `frontend` for fallback path). Set in **EasyPanel → backend → Environment** and **frontend → Environment**, then redeploy. If token missing, orders still succeed — marketplace sync is best-effort like Sheets (`backend/app/services/sheets.py:20`).

## Outbound — Every new order → SpaceSeller

- **Backend** `backend/app/routes/orders.py:141` after `db.commit()` → `background.add_task(spaceseller.push_order, sheet_payload)`
- **Frontend fallback** `frontend/app/api/orders/route.ts:169` same `pushToSpaceseller(sheetsPayload)` (shares Sheets payload shape)
- Service `backend/app/services/spaceseller.py:20` / `frontend/app/api/orders/route.ts:11` maps:

```json
{
  "fullname": "Ahmed Benali",
  "phone": "0612345678",
  "address": "Casablanca, 123 Rue Example",
  "id_city": 1,         // mapped from Warda `city` via CITY_MAP, optional
  "note": "Warda ref WB-... | Bundle -49 MAD",
  "total_price": 279,
  "products": [{"sku": "PROD-001", "quantity": 1, "unit_price": 279}]
}
```

- `sku` comes from existing `Product.sku` (admin panel). If `sku` empty, logged `WARNING sku missing` and skipped to avoid `422 Product with SKU X not found`.
- City `id_city` is optional per guide; we send it only if `city` matches `CITY_MAP` (`casablanca→1, rabat→2...` extend in `backend/app/services/spaceseller.py:11` and `frontend/app/api/orders/route.ts:11`).

**Logs (backend, `flush=True`):**
```
[orders] Scheduling SpaceSeller sync for WB-...
[spaceseller] Pushing order WB-... to https://drop.spaceseller.ma/api/v1/orders — 1 products, total 279
[spaceseller] Response 201: {"success":true,"data":{"order_id":278669,"uuid":"..."}}
[spaceseller] Successfully created WB-... → marketplace order_id=278669
```
`401` = token wrong, `422` = sku/phone validation.

## Inbound — Status updates (polling + webhook)

Marketplace status codes `GET /api/v1/statuses` → Warda `STATUS_ORDER new/pending_confirmation/confirmed/preparing/shipped/out_for_delivery/delivered/cancelled/returned` via `backend/app/services/spaceseller.py:11` `STATUS_MAP_INBOUND`.

**Endpoints (backend `backend/app/routes/marketplace.py:1`):**
- `GET https://api.wardabeaute.com/api/marketplace/statuses` → proxy `GET /api/v1/statuses` (needs token)
- `GET https://api.wardabeaute.com/api/marketplace/orders/{external_id}` → proxy `GET /api/v1/orders/{id}`
- `POST https://api.wardabeaute.com/api/marketplace/orders/{external_id}/sync/{WardaRef}` → fetch external, map `order_status.code` → Warda `status` + `confirmationStatus/deliveryStatus/paymentStatus`, creates `OrderActivity` `marketplace_sync`, updates `notes` with `tracking_number` if present. Call from admin `OrderDrawer` or cron.
- `POST https://api.wardabeaute.com/api/webhooks/spaceseller` → if marketplace can push, wire webhook URL there. It extracts `order_id/status` and `WB-...` from `note`, updates local order and creates `marketplace_webhook` activity. Idempotent, no auth yet — add HMAC if they provide secret.

**Polling (no cron yet):** Call `POST /api/marketplace/orders/278669/sync/WB-...` manually or add a 5-15m cron (e.g. EasyPanel cron hitting that endpoint for recent `new→confirmed→shipped` orders).

## Products

Marketplace expects `products[].sku` to exist in their catalog. Keep `Product.sku` in admin as the marketplace SKU. No separate sync table for v1; future `ProductMarketplaceMapping` can be added if you sell marketplace-owned products (stock/price pull). For now, stock decrement is local only (`Product.stockCount`).

## Testing without token

Without `SPACESHELL_TOKEN`, logs show `[spaceseller] disabled — no token` and order still returns `200` with `reference`. Set token later and new orders will push automatically; old orders can be retried via `POST /api/marketplace/orders/{extId}/sync/{ref}` after manual creation.

## Checklist

- [ ] Set `Product.sku` for each product in admin (must match Mediaplus catalog)
- [ ] Set `SPACESHELL_TOKEN` in EasyPanel (backend + frontend env) → redeploy
- [ ] Place test order with `phone: 0606060606` (whitelist) → check backend logs `Successfully created` + marketplace dashboard shows order with `Warda ref WB-...` in note
- [ ] Call `GET /api/marketplace/statuses` with token to see code map, then `POST /api/marketplace/orders/{extId}/sync/{WB-ref}` to test inbound
