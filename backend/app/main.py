import asyncio
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, SessionLocal, engine
from . import models  # noqa
from . import seed
from .routes import health, geo, orders, marketplace


async def _spaceseller_poll_loop():
    """Poll every 5m for orders with externalId (manual Sheets flow)."""
    # Wait a bit for DB to be ready
    await asyncio.sleep(10)
    from .services import spaceseller as ss
    from .models import Order

    while True:
        try:
            if not settings.is_spaceseller_enabled:
                await asyncio.sleep(300)
                continue
            # Quick check if any pending orders exist before opening DB
            db = SessionLocal()
            try:
                terminal = {"delivered", "cancelled", "returned"}
                # Find up to 20 orders with externalId not terminal and not synced recently
                import datetime
                cutoff = datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
                q = db.query(Order).filter(Order.external_id.isnot(None), ~Order.status.in_(list(terminal)))
                pending = [o for o in q.all() if o.last_synced_at is None or o.last_synced_at < cutoff][:20]
                if not pending:
                    db.close()
                    await asyncio.sleep(300)
                    continue
                # Poll each
                for order in pending:
                    ext = await ss.fetch_order_status(int(order.external_id))
                    if not ext:
                        continue
                    order_code = (ext.get("order_status") or {}).get("code")
                    delivery_code = (ext.get("delivery_status") or {}).get("code")
                    mapped = ss.map_to_warda_status(order_code, delivery_code)
                    order.external_status = order_code
                    order.external_delivery_status = delivery_code
                    order.last_synced_at = datetime.datetime.utcnow()
                    if ext.get("tracking_number"):
                        order.tracking_number = ext["tracking_number"]
                    if ext.get("uuid"):
                        order.external_uuid = ext["uuid"]
                    if mapped and mapped != order.status:
                        old = order.status
                        order.status = mapped
                        if mapped == "confirmed":
                            order.confirmation_status = "confirmed"
                        elif mapped == "cancelled":
                            order.confirmation_status = "cancelled"
                            order.payment_status = "unpaid"
                        elif mapped == "delivered":
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
                        from .models import OrderActivity
                        db.add(OrderActivity(order_id=order.id, type="marketplace_sync", message=f"Auto-poll {old}→{mapped} ext {order_code}/{delivery_code}", admin_user="marketplace"))
                        print(f"[spaceseller poll] {order.reference} {old}→{mapped} ext {order_code}/{delivery_code}", flush=True)
                db.commit()
            finally:
                db.close()
        except asyncio.CancelledError:
            break
        except Exception as e:  # noqa: BLE001
            print(f"[spaceseller poll] error: {e}", flush=True)
            try:
                import traceback
                traceback.print_exc()
            except:
                pass
        await asyncio.sleep(300)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Best-effort DB setup on boot; don't crash the process if the DB is
    # briefly unavailable or misconfigured — the app should still serve /health.
    try:
        Base.metadata.create_all(bind=engine)
        seed.seed_products()
    except Exception as e:  # noqa: BLE001
        print("WARN: DB init failed on boot:", repr(e))
    # Start 5-min SpaceSeller poller (fire-and-forget)
    poll_task = None
    try:
        poll_task = asyncio.create_task(_spaceseller_poll_loop())
    except Exception as e:  # noqa: BLE001
        print(f"WARN: poll loop not started: {e}", flush=True)
    yield
    if poll_task:
        poll_task.cancel()
        try:
            await poll_task
        except asyncio.CancelledError:
            pass


def create_app() -> FastAPI:
    app = FastAPI(title="Warda Beauté API", version="1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(geo.router)
    app.include_router(orders.router)
    app.include_router(marketplace.router)
    return app


app = create_app()
