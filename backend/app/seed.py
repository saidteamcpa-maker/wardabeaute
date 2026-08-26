from sqlalchemy.orm import Session

from .db import Base, engine
from .models import Product
from .prices import SEED_PRODUCTS


def seed_products():
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        for p in SEED_PRODUCTS:
            existing = db.query(Product).filter(Product.slug == p["id"]).first()
            if not existing:
                db.add(Product(
                    slug=p["id"],
                    name=p["name"],
                    ar_sub=p["ar_sub"],
                    price=p["price"],
                    old_price=p["old_price"],
                    badge=p["badge"],
                    stars=p["stars"],
                    reviews=p["reviews"],
                ))
        db.commit()
