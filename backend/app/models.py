import datetime
import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    JSON,
    String,
)
from .db import Base


class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True)  # slug
    name = Column(String)
    ar_sub = Column(String)
    price = Column(Integer)
    old_price = Column(Integer)
    badge = Column(String)
    stars = Column(Float, default=4.8)
    reviews = Column(Integer, default=0)
    active = Column(Boolean, default=True)


class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=lambda: "WB-" + uuid.uuid4().hex[:8].upper())
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    customer_name = Column(String)
    phone = Column(String)
    city = Column(String)
    address = Column(String)
    postal = Column(String)
    items = Column(JSON)
    subtotal = Column(Integer)
    upsell_total = Column(Integer, default=0)
    total = Column(Integer)
    upsell_added = Column(Boolean, default=False)
    status = Column(String, default="pending")
    country = Column(String)
    ip = Column(String)
    geo_risk = Column(String)
