"""Marketplace (SpaceSeller) inbound sync — polling + webhook.

Uses existing Product.sku as marketplace SKU. No new DB columns required for v1;
external IDs are returned in API responses and logged. If you add columns
(externalId, externalStatus) later, update the PATCH below to persist them.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Order, OrderActivity
from ..services import spaceseller

router = APIRouter()

# Warda internal status ordering for history display
WARD_ORDER = ["new", "pending_confirmation", "confirmed", "preparing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"]


@router.get("/api/marketplace/statuses")
async def list_marketplace_statuses():
    """Proxy GET /api/v1/statuses from SpaceSeller (requires token)."""
    data = await spaceseller.fetch_statuses()
    if data is None:
        raise HTTPException(status_code=502, detail="marketplace_unavailable_or_token_missing")
    return {"success": True, "data": data}


@router.get("/api/marketplace/orders/{external_id}")
async def get_marketplace_order(external_id: int):
    """Proxy GET /api/v1/orders/{id}."""
    data = await spaceseller.fetch_order_status(external_id)
    if data is None:
        raise HTTPException(status_code=404, detail="order_not_found_or_token_missing")
    return {"success": True, "data": data}


@router.post("/api/marketplace/orders/{external_id}/sync/{reference}")
async def sync_order_status(external_id: int, reference: str, db: Session = Depends(get_db)):
    """
    Pull status from marketplace and update local Warda order identified by `reference` (WB-...).
    Creates an OrderActivity entry. Admin can call this from OrderDrawer.
    """
    local = db.query(Order).filter(Order.reference == reference).first()
    if not local:
        local = db.get(Order, reference)
    if not local:
        raise HTTPException(status_code=404, detail="local_order_not_found")

    ext = await spaceseller.fetch_order_status(external_id)
    if not ext:
        raise HTTPException(status_code=502, detail="marketplace_fetch_failed")

    # Guide returns { order_status: {code,label}, delivery_status: {code,label} }
    order_code = (ext.get("order_status") or {}).get("code")
    delivery_code = (ext.get("delivery_status") or {}).get("code")
    mapped = spaceseller.STATUS_MAP_INBOUND.get(str(order_code).upper()) if order_code else None

    changes = []
    if mapped and mapped != local.status:
        old = local.status
        # Validate transition is in allowed list (optional: allow any for now)
        local.status = mapped
        # Derive sub-statuses like admin PATCH does
        if mapped == "confirmed":
            local.confirmation_status = "confirmed"
        elif mapped == "cancelled":
            local.confirmation_status = "cancelled"
            local.payment_status = "unpaid"
        elif mapped == "delivered":
            local.delivery_status = "delivered"
            local.payment_status = "paid"
        changes.append(f"Marketplace sync: {old} → {mapped} (ext {order_code}/{delivery_code})")
    elif order_code:
        changes.append(f"Marketplace poll: {order_code}/{delivery_code} (no status change, local={local.status})")

    if ext.get("tracking_number") and not local.notes:
        local.notes = f"tracking:{ext['tracking_number']}"

    for msg in changes:
        db.add(OrderActivity(order_id=local.id, type="marketplace_sync", message=msg, admin_user="marketplace"))

    db.commit()
    db.refresh(local)
    return {
        "success": True,
        "local": {"reference": local.reference, "status": local.status, "paymentStatus": local.payment_status},
        "external": ext,
        "changes": changes,
    }


@router.post("/api/webhooks/spaceseller")
async def webhook_spaceseller(payload: dict, db: Session = Depends(get_db)):
    """
    Generic inbound webhook for SpaceSeller if they push status updates.
    Expects at least {order_id, status} or {uuid, order_status}. Tries to find local order by
    external id (if you persist it) or by note containing Warda ref. For v1 we match via
    `payload.get('order_id')` as external id and look up recent orders if needed.

    This is a scaffold — wire your marketplace webhook URL to https://api.wardabeaute.com/api/webhooks/spaceseller
    """
    # Try to extract external id / status
    ext_id = payload.get("order_id") or payload.get("id") or payload.get("external_id")
    order_code = payload.get("status") or (payload.get("order_status") or {}).get("code") if isinstance(payload.get("order_status"), dict) else None
    if order_code is None:
        order_code = payload.get("code")

    # Best-effort: if payload contains Warda ref in note, use it
    warda_ref = None
    for key in ("note", "notes", "customer_note"):
        v = payload.get(key)
        if v and "WB-" in str(v):
            import re
            m = re.search(r"WB-[A-Z0-9\-]+", str(v))
            if m:
                warda_ref = m.group(0)
                break

    # If we have warda_ref, update that order directly
    target = None
    if warda_ref:
        target = db.query(Order).filter(Order.reference == warda_ref).first()
    elif ext_id:
        # Fallback: try to find order whose note contains external uuid? For v1 we just log.
        _log = __import__("builtins").print
        _log(f"[spaceseller webhook] no warda ref, ext_id={ext_id} payload={payload}", flush=True)

    if target and order_code:
        mapped = spaceseller.STATUS_MAP_INBOUND.get(str(order_code).upper())
        if mapped and mapped != target.status:
            old = target.status
            target.status = mapped
            db.add(OrderActivity(order_id=target.id, type="marketplace_webhook", message=f"Webhook {old}→{mapped} ext={order_code}", admin_user="marketplace"))
            db.commit()
            return {"success": True, "updated": target.reference, "from": old, "to": mapped}

    return {"success": True, "received": True, "warda_ref": warda_ref, "ext_id": ext_id}
