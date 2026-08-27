import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, engine
from . import models  # noqa
from . import seed
from .routes import health, geo, orders, marketplace


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Best-effort DB setup on boot; don't crash the process if the DB is
    # briefly unavailable or misconfigured — the app should still serve /health.
    try:
        Base.metadata.create_all(bind=engine)
        seed.seed_products()
    except Exception as e:  # noqa: BLE001
        print("WARN: DB init failed on boot:", repr(e))
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="Warda Beauté API", version="1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(geo.router)
    app.include_router(orders.router)
    app.include_router(marketplace.router)
    return app


app = create_app()
