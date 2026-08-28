"""Marketplace (SpaceSeller) inbound sync — polling every 5m + webhook.
Manual Sheets flow: you create order in SpaceSeller, paste its order_id into Warda admin
(Marketplace ID field), then auto-polling syncs status to dashboard.
"""
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Order, OrderActivity
from ..services import spaceseller

router = APIRouter()

# Warda internal status ordering for history display — leads-faithful (mirrors SpaceSeller order_status)
WARD_ORDER = ["new", "pending", "pending_confirmation", "confirmed", "preparing", "shipped", "out_for_delivery", "delivered", "paid", "canceled", "cancelled", "returned"]


def _apply_status_derivation(order: Order, mapped: str):
    """Mirror frontend/app/api/admin/orders/[id]/route.ts:47 derivation. Leads-faithful: primary status = order_status verbatim."""
    order.status = mapped
    if mapped == "confirmed":
        order.confirmation_status = "confirmed"
    elif mapped in ("canceled", "cancelled"):
        order.confirmation_status = "cancelled"
        order.payment_status = "unpaid"
    elif mapped == "delivered":
        order.delivery_status = "delivered"
        order.payment_status = "paid"
    elif mapped == "paid":
        order.delivery_status = "delivered"
        order.payment_status = "paid"
    elif mapped == "returned":
        order.delivery_status = "returned"
        order.payment_status = "refunded"
    elif mapped == "shipped":
        order.delivery_status = "shipped"
    elif mapped == "out_for_delivery":
        order.delivery_status = "out_for_delivery"
    elif mapped == "preparing":
        order.delivery_status = "preparing"
    elif mapped == "pending_confirmation":
        order.confirmation_status = "pending_confirmation"
    elif mapped == "pending":
        order.confirmation_status = "pending_confirmation"


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
    Persists external fields, updates status via map_to_warda_status, creates OrderActivity.
    """
    local = db.query(Order).filter(Order.reference == reference).first()
    if not local:
        local = db.get(Order, reference)
    if not local:
        raise HTTPException(status_code=404, detail="local_order_not_found")

    ext = await spaceseller.fetch_order_status(external_id)
    if not ext:
        raise HTTPException(status_code=502, detail="marketplace_fetch_failed")

    order_code = (ext.get("order_status") or {}).get("code")
    delivery_code = (ext.get("delivery_status") or {}).get("code")
    mapped = spaceseller.map_to_warda_status(order_code, delivery_code)

    # Persist external tracking even if status unchanged
    local.external_id = external_id
    local.external_uuid = ext.get("uuid") or ext.get("external_uuid") or local.external_uuid
    local.external_status = order_code
    local.external_delivery_status = delivery_code
    local.last_synced_at = datetime.datetime.utcnow()
    if ext.get("tracking_number"):
        local.tracking_number = ext["tracking_number"]

    changes = []
    if mapped and mapped != local.status:
        old = local.status
        _apply_status_derivation(local, mapped)
        changes.append(f"Marketplace sync: {old} → {mapped} (ext {order_code}/{delivery_code})")
    elif order_code:
        changes.append(f"Marketplace poll: {order_code}/{delivery_code} (no status change, local={local.status})")

    for msg in changes:
        if "→" in msg or "→" in msg:
            db.add(OrderActivity(order_id=local.id, type="marketplace_sync", message=msg, admin_user="marketplace"))

    # Also add a poll activity even if no change, for audit (optional, keep light)
    if not changes:
        db.add(OrderActivity(order_id=local.id, type="marketplace_poll", message=f"Poll {order_code}/{delivery_code}", admin_user="marketplace"))

    db.commit()
    db.refresh(local)
    return {
        "success": True,
        "local": {"reference": local.reference, "status": local.status, "paymentStatus": local.payment_status, "externalId": local.external_id},
        "external": ext,
        "changes": changes,
    }


@router.post("/api/marketplace/poll")
async def poll_all_pending(db: Session = Depends(get_db)):
    """
    Auto-sync every 5m: polls all orders with externalId set and not in terminal status.
    Called by background task and can be triggered manually from admin.
    """
    # Terminal statuses that no longer need polling — keep paid with delivered, allow delivered->returned RTO
    terminal = {"canceled", "cancelled", "returned"}
    # Find orders with externalId that are not terminal and last synced >5m ago or never
    cutoff = datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
    q = db.query(Order).filter(Order.external_id.isnot(None), ~Order.status.in_(list(terminal)))
    # Only poll those not synced recently to avoid hammering
    # If last_synced_at is None, poll; else poll if older than 5m
    pending = q.all()
    # Filter in Python for last_synced_at
    to_poll = [o for o in pending if o.last_synced_at is None or o.last_synced_at < cutoff]
    # Limit per run to avoid timeouts (process 20 at a time)
    to_poll = to_poll[:20]

    results = []
    for order in to_poll:
        ext = await spaceseller.fetch_order_status(int(order.external_id))
        if not ext:
            results.append({"reference": order.reference, "externalId": order.external_id, "error": "fetch_failed"})
            continue
        order_code = (ext.get("order_status") or {}).get("code")
        delivery_code = (ext.get("delivery_status") or {}).get("code")
        mapped = spaceseller.map_to_warda_status(order_code, delivery_code)
        order.external_status = order_code
        order.external_delivery_status = delivery_code
        order.last_synced_at = datetime.datetime.utcnow()
        if ext.get("tracking_number"):
            order.tracking_number = ext["tracking_number"]
        if ext.get("uuid"):
            order.external_uuid = ext["uuid"]
        if mapped and mapped != order.status:
            old = order.status
            _apply_status_derivation(order, mapped)
            db.add(OrderActivity(order_id=order.id, type="marketplace_sync", message=f"Auto-poll {old}→{mapped} ext {order_code}/{delivery_code}", admin_user="marketplace"))
            results.append({"reference": order.reference, "externalId": order.external_id, "from": old, "to": mapped})
        else:
            db.add(OrderActivity(order_id=order.id, type="marketplace_poll", message=f"Poll {order_code}/{delivery_code}", admin_user="marketplace"))
            results.append({"reference": order.reference, "externalId": order.external_id, "polled": f"{order_code}/{delivery_code}"})
    db.commit()
    return {"success": True, "polled": len(to_poll), "results": results}


@router.get("/api/marketplace/pending")
async def list_pending_for_poll(db: Session = Depends(get_db)):
    """List orders that will be auto-polled (have externalId and not terminal)."""
    terminal = {"canceled", "cancelled", "returned"}
    orders = db.query(Order).filter(Order.external_id.isnot(None), ~Order.status.in_(list(terminal))).order_by(Order.created_at.desc()).limit(50).all()
    return {"success": True, "data": [{"reference": o.reference, "status": o.status, "externalId": o.external_id, "lastSyncedAt": o.last_synced_at.isoformat() if o.last_synced_at else None} for o in orders]}


@router.post("/api/webhooks/spaceseller")
async def webhook_spaceseller(payload: dict, db: Session = Depends(get_db)):
    """
    Generic inbound webhook for SpaceSeller if they push status updates.
    Wire your marketplace webhook URL to https://api.wardabeaute.com/api/webhooks/spaceseller
    """
    ext_id = payload.get("order_id") or payload.get("id") or payload.get("external_id")
    # Try to parse int
    try:
        ext_id_int = int(ext_id) if ext_id is not None else None
    except:
        ext_id_int = None
    order_code = payload.get("status") or (payload.get("order_status") or {}).get("code") if isinstance(payload.get("order_status"), dict) else None
    delivery_code = (payload.get("delivery_status") or {}).get("code") if isinstance(payload.get("delivery_status"), dict) else None
    if order_code is None:
        order_code = payload.get("code") or payload.get("order_status_code")
    if delivery_code is None:
        delivery_code = payload.get("delivery_code")

    warda_ref = None
    for key in ("note", "notes", "customer_note", "customer_notes"):
        v = payload.get(key)
        if v and "WB-" in str(v):
            import re
            m = re.search(r"WB-[A-Z0-9\-]+", str(v))
            if m:
                warda_ref = m.group(0)
                break

    target = None
    if ext_id_int is not None:
        target = db.query(Order).filter(Order.external_id == ext_id_int).first()
    if not target and warda_ref:
        target = db.query(Order).filter(Order.reference == warda_ref).first()
    if not target and ext_id:
        print(f"[spaceseller webhook] no warda ref, ext_id={ext_id} payload={payload}", flush=True)

    if target and (order_code or delivery_code):
        mapped = spaceseller.map_to_warda_status(order_code, delivery_code)
        if mapped and mapped != target.status:
            old = target.status
            _apply_status_derivation(target, mapped)
            target.external_status = order_code
            target.external_delivery_status = delivery_code
            target.last_synced_at = datetime.datetime.utcnow()
            if ext_id_int:
                target.external_id = ext_id_int
            db.add(OrderActivity(order_id=target.id, type="marketplace_webhook", message=f"Webhook {old}→{mapped} ext={order_code}/{delivery_code}", admin_user="marketplace"))
            db.commit()
            return {"success": True, "updated": target.reference, "from": old, "to": mapped}
        else:
            # Still update external fields
            target.external_status = order_code or target.external_status
            target.external_delivery_status = delivery_code or target.external_delivery_status
            target.last_synced_at = datetime.datetime.utcnow()
            if ext_id_int:
                target.external_id = ext_id_int
            db.commit()

    return {"success": True, "received": True, "warda_ref": warda_ref, "ext_id": ext_id}


@router.patch("/api/marketplace/orders/{reference}/external")
async def set_external_mapping(reference: str, payload: dict, db: Session = Depends(get_db)):
    """Admin sets the marketplace externalId for a Warda order (manual Sheets flow). Body: {externalId: 278669}"""
    order = db.query(Order).filter(Order.reference == reference).first()
    if not order:
        order = db.get(Order, reference)
    if not order:
        raise HTTPException(status_code=404, detail="local_order_not_found")
    ext_id = payload.get("externalId") or payload.get("external_id") or payload.get("order_id")
    if ext_id is None:
        raise HTTPException(status_code=422, detail="externalId_required")
    try:
        ext_id_int = int(ext_id)
    except:
        raise HTTPException(status_code=422, detail="externalId_must_be_int")
    order.external_id = ext_id_int
    if payload.get("externalUuid"):
        order.external_uuid = str(payload["externalUuid"])
    order.last_synced_at = None  # force next poll to fetch immediately
    db.add(OrderActivity(order_id=order.id, type="marketplace_link", message=f"Linked to marketplace {ext_id_int}", admin_user="admin"))
    db.commit()
    return {"success": True, "reference": order.reference, "externalId": order.external_id}
