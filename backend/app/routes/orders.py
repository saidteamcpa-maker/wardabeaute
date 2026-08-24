import re
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..config import settings
from ..db import get_db
from ..models import Order, Product
from ..prices import PRODUCT_NAMES, compute_total
from ..schemas import OrderCreate, OrderOut, UpsellIn
from ..services import geo, sheets
from ..services.capi import track

router = APIRouter(prefix="/api")

PHONE_RE = re.compile(r"^0(5|6|7|8)[0-9]{8}$")


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else ""


@router.get("/products")
def list_products(db: Session = Depends(get_db)):
    rows = db.query(Product).filter(Product.active.is_(True)).all()
    return [
        {
            "slug": p.id,
            "name": p.name,
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

    # 2. Geo gate (re-check server-side; never trust client)
    ip = _client_ip(request)
    g = geo.lookup(ip)
    if not geo.allowed(payload.phone, g):
        reason = "vpn_blocked" if (g.get("is_vpn") or g.get("is_proxy") or g.get("is_tor")) else "orders_only_morocco"
        raise HTTPException(status_code=403, detail=reason)

    # 3. Authoritative totals (ignore any client price)
    subtotal, upsell_total, total, lines = compute_total(payload.items, upsell=False)

    # 4. Insert
    order = Order(
        customer_name=payload.customer_name,
        phone=payload.phone,
        city=payload.city,
        address=payload.address,
        postal=payload.postal,
        items=lines,
        subtotal=subtotal,
        upsell_total=0,
        total=total,
        upsell_added=False,
        status="pending",
        country=g.get("country_name"),
        ip=ip,
        geo_risk=str(g.get("risk_score")),
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # 5. Sheets webhook (fire-and-forget)
    sheet_payload = {
        "order_id": order.id,
        "date": order.created_at.isoformat(),
        "customer_name": order.customer_name,
        "phone": order.phone,
        "city": order.city,
        "address": order.address,
        "postal": order.postal or "",
        "items_json": lines,
        "subtotal": subtotal,
        "upsell": 0,
        "total": total,
        "status": order.status,
        "country": order.country,
        "geo_risk": order.geo_risk,
        "ip": ip,
        "source": "web",
        "notes": "test" if order.phone in settings.whitelist_phones else "",
    }
    background.add_task(sheets.push_order, sheet_payload)

    # 6. CAPI (server) — Purchase
    background.add_task(
        track, "Purchase", str(uuid.uuid4()), value=total,
        content_ids=[it.slug for it in payload.items],
        phone=order.phone, ip=ip,
        ua=request.headers.get("user-agent", ""), url=str(request.url),
    )

    return OrderOut(id=order.id, total=total, status=order.status)


@router.post("/orders/{order_id}/upsell", response_model=OrderOut)
async def add_upsell(
    order_id: str,
    payload: UpsellIn,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="order_not_found")
    if not payload.add:
        return OrderOut(id=order.id, total=order.total, status=order.status)

    order.upsell_added = True
    order.upsell_total = 99
    order.total = order.subtotal + 99
    items = list(order.items)
    items.append({
        "slug": "upsell-99",
        "name": PRODUCT_NAMES.get("upsell-99"),
        "qty": 1,
        "unit_price": 99,
        "line_total": 99,
    })
    order.items = items
    db.commit()

    background.add_task(
        sheets.push_order,
        {
            "type": "upsell",
            "order_id": order.id,
            "total": order.total,
        },
    )
    return OrderOut(id=order.id, total=order.total, status=order.status)
