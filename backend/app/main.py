import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, engine
from . import models  # noqa
from . import seed
from .routes import health, geo, orders


def create_app() -> FastAPI:
    app = FastAPI(title="Warda Beauté API", version="1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    # Migration on boot
    Base.metadata.create_all(bind=engine)
    seed.seed_products()

    app.include_router(health.router)
    app.include_router(geo.router)
    app.include_router(orders.router)
    return app


app = create_app()
