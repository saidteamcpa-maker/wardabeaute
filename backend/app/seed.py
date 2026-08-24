from sqlalchemy.orm import Session

from .db import Base, engine
from .models import Product
from .prices import SEED_PRODUCTS


def seed_products():
    # create tables if missing (idempotent; main startup also calls create_all)
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        for p in SEED_PRODUCTS:
            existing = db.get(Product, p["id"])
            if not existing:
                db.add(Product(**p))
        db.commit()
