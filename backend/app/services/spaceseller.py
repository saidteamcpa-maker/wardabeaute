"""SpaceSeller Marketplace integration (drop.spaceseller.ma).

Uses existing Product.sku as marketplace SKU (admin panel sku field).
Fire-and-forget like sheets.py / capi.py — orders always succeed even if marketplace fails.

API guide: POST /api/v1/orders {fullname, phone, address, id_city?, note, total_price, products:[{sku, quantity, unit_price}]}
GET /api/v1/orders/{id} + GET /api/v1/statuses for polling.
"""
import json
import traceback

import httpx

from ..config import settings

# Simple city string -> id_city mapping. Extend when Mediaplus provides catalog.
# For now we send no id_city if city not mapped (API says id_city optional).
CITY_MAP: dict[str, int] = {
    "casablanca": 1,
    "rabat": 2,
    "marrakech": 3,
    "fes": 4,
    "tanger": 5,
    "tangier": 5,
    "agadir": 6,
    "meknes": 7,
    "oujda": 8,
    "kenitra": 9,
    "tetouan": 10,
    "safi": 11,
    "el jadida": 12,
    "beni mellal": 13,
    "nador": 14,
    "taza": 15,
}

# Marketplace -> Warda STATUS_ORDER (leads-faithful, Option A)
# Primary status mirrors SpaceSeller order_status.code verbatim (lowercased).
STATUS_MAP_INBOUND: dict[str, str] = {
    "NEW": "new",
    "PENDING": "pending",
    "PENDING_CONFIRMATION": "pending_confirmation",
    "CONFIRMED": "confirmed",
    "PREPARING": "preparing",
    "SHIPPED": "shipped",
    "OUT_FOR_DELIVERY": "out_for_delivery",
    "DELIVERED": "delivered",
    "PAID": "paid",
    "CANCELED": "canceled",
    "CANCELLED": "cancelled",
    "RETURNED": "returned",
}
# Delivery codes are kept for derived deliveryStatus only; primary status ignores them when order_status is present.
DELIVERY_MAP_INBOUND: dict[str, str] = {
    "P_UNPACKED": "preparing",
    "P_PACKED": "preparing",
    "P_PENDING": "pending_confirmation",
    "P_SHIPPED": "shipped",
    "P_OUT_FOR_DELIVERY": "out_for_delivery",
    "P_DELIVERED": "delivered",
    "P_CANCELED": "canceled",
    "P_CANCELLED": "cancelled",
    "P_RETURNED": "returned",
}


def map_to_warda_status(order_code: str | None, delivery_code: str | None) -> str | None:
    """Leads-faithful: primary status mirrors order_status.code verbatim (lowercased). Delivery ignored when order present."""
    if order_code:
        key = order_code.strip().upper()
        mapped = STATUS_MAP_INBOUND.get(key)
        if mapped:
            return mapped
        # Fallback: verbatim lowercased for forward-compat with new SpaceSeller codes
        return order_code.strip().lower()
    if delivery_code:
        key = delivery_code.strip().upper()
        mapped = DELIVERY_MAP_INBOUND.get(key)
        if mapped:
            return mapped
        return delivery_code.strip().lower()
    return None


def _log(msg: str):
    print(msg, flush=True)


def _get_headers() -> dict[str, str]:
    token = settings.spaceseller_token_clean
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def _map_city_id(city: str | None) -> int | None:
    if not city:
        return None
    key = city.strip().lower()
    if key in CITY_MAP:
        return CITY_MAP[key]
    # Try contains
    for k, v in CITY_MAP.items():
        if k in key or key in k:
            return v
    return None


def _build_marketplace_payload(order_payload: dict) -> dict:
    """
    Map Warda sheets-format payload to SpaceSeller create order payload.
    Uses existing Product.sku via items_json[].sku (fallback to slug if sku empty).
    """
    items = order_payload.get("items_json") or []
    products = []
    for it in items:
        sku = (it.get("sku") or it.get("slug") or "").strip()
        if not sku:
            continue
        qty = int(it.get("qty") or 1)
        # unit_price from Warda authoritative pricing
        unit = int(it.get("unit_price") or it.get("line_total") or 0)
        products.append({"sku": sku, "quantity": max(1, qty), "unit_price": unit})

    # Fallback if items_json missing sku (legacy)
    if not products:
        _log(f"[spaceseller] WARNING: no SKU-mapped products for {order_payload.get('order_id')}")

    fullname = (order_payload.get("customer_name") or "").strip()
    phone = (order_payload.get("phone") or "").strip()
    city = (order_payload.get("city") or "").strip()
    address_raw = (order_payload.get("address") or "").strip()
    # Combine city + address like Sheets does, but keep address field separate for API
    address = ", ".join([p for p in [city, address_raw] if p]) if address_raw else city
    total = order_payload.get("total") or order_payload.get("total_price") or 0
    note_parts = []
    if order_payload.get("order_id"):
        note_parts.append(f"Warda ref {order_payload['order_id']}")
    if order_payload.get("discount"):
        note_parts.append(f"Bundle -{order_payload['discount']} MAD")
    if order_payload.get("notes"):
        note_parts.append(str(order_payload["notes"]))
    note = " | ".join(note_parts)[:500]

    out: dict = {
        "fullname": fullname,
        "phone": phone,
        "address": address,
        "note": note,
        "total_price": float(total),
        "products": products,
    }
    city_id = _map_city_id(city)
    if city_id is not None:
        out["id_city"] = city_id
    return out


async def push_order(order_payload: dict):
    """
    Fire-and-forget: create order in SpaceSeller.
    Called as FastAPI BackgroundTasks after DB commit (like sheets.push_order).
    order_payload is the same dict passed to sheets.push_order (with order_id, customer_name, phone, city, address, items_json, total, discount, etc).
    """
    if not settings.is_spaceseller_enabled:
        _log(f"[spaceseller] disabled or token missing — skipping {order_payload.get('order_id','?')}")
        return

    order_id = order_payload.get("order_id", "?")
    url = f"{settings.spaceseller_url}/orders"
    headers = _get_headers()
    marketplace_payload = _build_marketplace_payload(order_payload)

    if not marketplace_payload.get("products"):
        _log(f"[spaceseller] SKIP {order_id}: no products with SKU (set SKU in admin Products panel)")
        return
    if not marketplace_payload.get("fullname") or len(marketplace_payload["fullname"]) < 2:
        _log(f"[spaceseller] SKIP {order_id}: fullname missing/ too short")
        return
    if not marketplace_payload.get("phone") or len(marketplace_payload["phone"]) < 5:
        _log(f"[spaceseller] SKIP {order_id}: phone missing")
        return

    try:
        _log(f"[spaceseller] Pushing order {order_id} to {url} — {len(marketplace_payload['products'])} products, total {marketplace_payload['total_price']}")
        _log(f"[spaceseller] Payload: {json.dumps({k: v for k, v in marketplace_payload.items() if k != 'products'}, ensure_ascii=False)} + products={json.dumps(marketplace_payload['products'], ensure_ascii=False)[:300]}")

        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(url, headers=headers, json=marketplace_payload)

            body_text = resp.text[:500]
            _log(f"[spaceseller] Response {resp.status_code}: {body_text}")

            if resp.status_code in (200, 201):
                try:
                    data = resp.json()
                    if data.get("success"):
                        ext_id = data.get("data", {}).get("order_id")
                        ext_uuid = data.get("data", {}).get("uuid")
                        _log(f"[spaceseller] Successfully created {order_id} → marketplace order_id={ext_id} uuid={ext_uuid}")
                        # Persist external mapping so polling (main.py 5m loop) works automatically
                        if ext_id:
                            try:
                                import datetime
                                from ..db import SessionLocal
                                from ..models import Order, OrderActivity
                                db = SessionLocal()
                                try:
                                    order = db.query(Order).filter(Order.reference == order_id).first()
                                    if order:
                                        order.external_id = int(ext_id)
                                        if ext_uuid:
                                            order.external_uuid = ext_uuid
                                        order.external_status = "NEW"
                                        order.last_synced_at = datetime.datetime.utcnow()
                                        db.add(OrderActivity(order_id=order.id, type="marketplace_auto_create", message=f"Auto-created in marketplace {ext_id}", admin_user="marketplace"))
                                        db.commit()
                                        _log(f"[spaceseller] Persisted external mapping {order_id} -> {ext_id}")
                                finally:
                                    db.close()
                            except Exception as e:  # noqa: BLE001
                                _log(f"[spaceseller] Failed to persist external mapping for {order_id}: {e}")
                    else:
                        _log(f"[spaceseller] WARNING: success=false for {order_id}: {data}")
                except Exception as e:
                    _log(f"[spaceseller] WARNING: non-JSON 200 for {order_id}: {e}")
            elif resp.status_code == 401:
                _log(f"[spaceseller] ERROR 401 Unauthenticated for {order_id} — check SPACESHELL_TOKEN/SPACESSELLER_TOKEN")
            elif resp.status_code == 422:
                try:
                    j = resp.json()
                    _log(f"[spaceseller] ERROR 422 validation for {order_id}: {j.get('errors') or j}")
                except Exception:
                    _log(f"[spaceseller] ERROR 422 for {order_id}: {body_text}")
            else:
                _log(f"[spaceseller] ERROR {resp.status_code} for {order_id}: {body_text}")

    except httpx.TimeoutException:
        _log(f"[spaceseller] TIMEOUT for {order_id}")
    except httpx.ConnectError as e:
        _log(f"[spaceseller] CONNECTION ERROR for {order_id}: {e}")
    except Exception as e:
        _log(f"[spaceseller] FAILED for {order_id}: {e}")
        traceback.print_exc()


async def fetch_order_status(external_id: int) -> dict | None:
    """GET /api/v1/orders/{id} — for polling. Returns parsed JSON data or None."""
    if not settings.is_spaceseller_enabled:
        return None
    url = f"{settings.spaceseller_url}/orders/{external_id}"
    headers = _get_headers()
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                j = resp.json()
                return j.get("data") if j.get("success") else None
            _log(f"[spaceseller] fetch_order_status {external_id} → {resp.status_code}: {resp.text[:300]}")
    except Exception as e:
        _log(f"[spaceseller] fetch_order_status failed for {external_id}: {e}")
    return None


async def fetch_statuses() -> dict | None:
    """GET /api/v1/statuses — catalog of order/delivery statuses."""
    if not settings.is_spaceseller_enabled:
        return None
    url = f"{settings.spaceseller_url}/statuses"
    headers = _get_headers()
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                j = resp.json()
                return j.get("data") if j.get("success") else j
            _log(f"[spaceseller] fetch_statuses → {resp.status_code}: {resp.text[:300]}")
    except Exception as e:
        _log(f"[spaceseller] fetch_statuses failed: {e}")
    return None
