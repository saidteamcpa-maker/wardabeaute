import re
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..config import settings
from ..db import get_db
from ..models import Order, OrderItem, Product
from ..prices import PRODUCT_NAMES, compute_total, CO_COLLAGEN_DISCOUNT
from ..schemas import OrderCreate, OrderOut, UpsellIn
from ..services import geo, sheets, spaceseller
from ..services.capi import track

router = APIRouter(prefix="/api")

PHONE_RE = re.compile(r"^0(6|7)[0-9]{8}$")


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else ""


def _generate_reference() -> str:
    import time
    ts = int(time.time() * 1000)
    rand = uuid.uuid4().hex[:8].upper()
    return f"WB-{ts}-{rand}"


@router.get("/products")
def list_products(db: Session = Depends(get_db)):
    rows = db.query(Product).filter(Product.active.is_(True)).all()
    return [
        {
            "slug": p.slug,
            "name": p.name,
            "sku": p.sku,
            "ar_sub": p.ar_sub,
            "price": p.price,
            "old_price": p.old_price,
            "badge": p.badge,
            "stars": p.stars,
            "reviews": p.reviews,
        }
        for p in rows
    ]


@router.post("/orders", response_model=OrderOut)
async def create_order(
    payload: OrderCreate,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # 1. Validate phone
    if not PHONE_RE.match(payload.phone or ""):
        raise HTTPException(status_code=422, detail="invalid_phone")

    # 2. Geo gate
    ip = _client_ip(request)
    g = geo.lookup(ip)
    if not geo.allowed(payload.phone, g):
        reason = "vpn_blocked" if (g.get("is_vpn") or g.get("is_proxy") or g.get("is_tor")) else "orders_only_morocco"
        raise HTTPException(status_code=403, detail=reason)

    # 3. Authoritative totals (includes bundle discount when eligible)
    subtotal, upsell_total, discount, total, lines = compute_total(payload.items, upsell=False)

    # 4. Check idempotency - return reference as public ID for consistency with frontend
    if payload.idempotency_key:
        existing = db.query(Order).filter(Order.idempotency_key == payload.idempotency_key).first()
        if existing:
            return OrderOut(id=existing.reference, total=existing.total, discount=existing.discount, status=existing.status)

    # 5. Create order
    reference = _generate_reference()
    order = Order(
        reference=reference,
        idempotency_key=payload.idempotency_key,
        customer_name=payload.customer_name,
        phone=payload.phone,
        city=payload.city,
        address=payload.address,
        postal=payload.postal,
        subtotal=subtotal,
        upsell_total=0,
        total=total,
        discount=discount,
        upsell_added=False,
        status="new",
        country=g.get("country_name"),
        ip=ip,
        geo_risk=str(g.get("risk_score")),
        source="web",
    )
    db.add(order)
    db.flush()  # get order.id

    # 6. Create order items (snapshot product SKU at order time)
    slugs = [l["slug"] for l in lines]
    product_map = {p.slug: p for p in db.query(Product).filter(Product.slug.in_(slugs)).all()}
    for line in lines:
        prod = product_map.get(line["slug"])
        item = OrderItem(
            order_id=order.id,
            slug=line["slug"],
            name=line["name"],
            sku=prod.sku if prod else None,
            qty=line["qty"],
            unit_price=line["unit_price"],
        )
        db.add(item)

    db.commit()
    db.refresh(order)

    # 7. Sheets webhook (fire-and-forget) — enrich with SKU from admin panel
    sku_map = {slug: prod.sku for slug, prod in product_map.items()}
    # Format the Sheets "sku" column repo-side as "<qty>x<SKU>" per item, joined by
    # " / " (e.g. "2xWVE-001 / 1xCGL-001"), and send it as a single consolidated item.
    # This makes the live Apps Script output the correct value without a redeploy.
    sheet_sku = "+".join(
        f"{(sku_map.get(l['slug']) or '')}-x{(l.get('qty') or 1)}" for l in lines
    )
    total_qty = sum((l.get('qty') or 1) for l in lines)
    items_for_sheet = [{
        "slug": "",
        "sku": sheet_sku,
        "sku_sheet": sheet_sku,
        "qty": total_qty,
        "name": "",
        "unit_price": total,
    }]
    sheet_payload = {
        "order_id": order.reference,
        "date": order.created_at.isoformat(),
        "customer_name": order.customer_name,
        "phone": order.phone,
        "city": order.city,
        "address": order.address or "",
        "postal": order.postal or "",
        "items_json": items_for_sheet,
        "subtotal": subtotal,
        "discount": discount,
        "upsell": 0,
        "total": total,
        "status": order.status,
        "country": order.country,
        "geo_risk": order.geo_risk,
        "ip": ip,
        "source": "web",
        "notes": "test" if order.phone in settings.whitelist_phones else "",
    }
    print(f"[orders] Scheduling Sheets sync for {order.reference}", flush=True)
    background.add_task(sheets.push_order, sheet_payload)

    # 7b. SpaceSeller Marketplace — automatic push (fire-and-forget)
    # Use real per-product items (sku/qty/unit_price), NOT the consolidated Sheets sku
    marketplace_items = [
        {
            "slug": l["slug"],
            "sku": sku_map.get(l["slug"]),
            "qty": l["qty"],
            "unit_price": l["unit_price"],
            "name": l["name"],
            "line_total": l["unit_price"] * l["qty"],
        }
        for l in lines
    ]
    marketplace_payload = {**sheet_payload, "items_json": marketplace_items}
    # Skip marketplace for whitelist test numbers (like Sheets notes="test")
    _whitelist = [p.strip() for p in settings.whitelist_phones.split(",") if p.strip()]
    if order.phone not in _whitelist:
        background.add_task(spaceseller.push_order, marketplace_payload)
        print(f"[orders] Scheduling SpaceSeller sync for {order.reference} ({len(marketplace_items)} items)", flush=True)
    else:
        print(f"[orders] Skipping SpaceSeller for test order {order.reference}", flush=True)

    # 8. CAPI (server) — Purchase
    background.add_task(
        track, "Purchase", str(uuid.uuid4()), value=total,
        content_ids=[it.slug for it in payload.items],
        phone=order.phone, ip=ip,
        ua=request.headers.get("user-agent", ""), url=str(request.url),
    )

    # Return reference as public ID (matches frontend/confirmation + admin)
    return OrderOut(id=order.reference, total=total, discount=discount, status=order.status)


@router.post("/orders/{order_id}/upsell", response_model=OrderOut)
async def add_upsell(
    order_id: str,
    payload: UpsellIn,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # Support both internal id and public reference (frontend always sends reference)
    order = db.get(Order, order_id)
    if not order:
        order = db.query(Order).filter(Order.reference == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="order_not_found")
    if not payload.add:
        return OrderOut(id=order.reference, total=order.total, discount=order.discount, status=order.status)

    order.upsell_added = True
    order.upsell_total = 99
    order.total = order.subtotal + 99

    # Add upsell item
    item = OrderItem(
        order_id=order.id,
        slug="upsell-99",
        name=PRODUCT_NAMES.get("upsell-99", "Mini Soin Warda"),
        qty=1,
        unit_price=99,
    )
    db.add(item)
    db.commit()

    background.add_task(
        sheets.push_order,
        {
            "type": "upsell",
            "order_id": order.reference,
            "total": order.total,
        },
    )
    return OrderOut(id=order.reference, total=order.total, status=order.status)
