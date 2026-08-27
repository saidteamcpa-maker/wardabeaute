import datetime
import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .db import Base


class Product(Base):
    __tablename__ = "products"
    slug = Column(String, primary_key=True)  # maps to Prisma's "slug" PK
    name = Column(String, nullable=False)
    sku = Column(String)  # unique constraint is owned by Prisma's schema
    ar_sub = Column(String)
    price = Column(Integer, nullable=False)
    old_price = Column(Integer)
    image = Column(String)
    active = Column(Boolean, default=True)
    stock_count = Column(Integer)
    badge = Column(String)
    stars = Column(Float, default=4.8)
    reviews = Column(Integer, default=0)
    short_description = Column(String)
    offers = Column(Text)  # JSON string
    is_bundle = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:24])
    reference = Column(String, unique=True, nullable=False)
    idempotency_key = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String)
    postal = Column(String)
    status = Column(String, default="new")
    confirmation_status = Column(String)
    delivery_status = Column(String)
    payment_status = Column(String, default="unpaid")
    source = Column(String)
    utm_source = Column(String)
    utm_medium = Column(String)
    utm_campaign = Column(String)
    utm_content = Column(String)
    utm_term = Column(String)
    referrer = Column(String)
    device = Column(String)
    browser = Column(String)
    country = Column(String)
    visitor_id = Column(String)
    session_id = Column(String)
    total = Column(Integer, nullable=False)
    discount = Column(Integer, default=0)
    shipping_fee = Column(Integer, default=0)
    notes = Column(String)
    ip = Column(String)
    geo_risk = Column(String)
    subtotal = Column(Integer, default=0)
    upsell_total = Column(Integer, default=0)
    upsell_added = Column(Boolean, default=False)
    external_id = Column(Integer, unique=True)
    external_uuid = Column(String)
    external_status = Column(String)
    external_delivery_status = Column(String)
    last_synced_at = Column(DateTime)
    tracking_number = Column(String)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    activities = relationship("OrderActivity", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:24])
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    slug = Column(String, nullable=False)
    name = Column(String, nullable=False)
    sku = Column(String)  # snapshot of the product SKU at order time
    qty = Column(Integer, nullable=False)
    unit_price = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")


class OrderActivity(Base):
    __tablename__ = "order_activities"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:24])
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    admin_user = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    order = relationship("Order", back_populates="activities")


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:24])
    event_type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    session_id = Column(String)
    visitor_id = Column(String)
    page = Column(String)
    product_id = Column(String)
    order_id = Column(String)
    country = Column(String)
    referrer = Column(String)
    utm_source = Column(String)
    utm_medium = Column(String)
    utm_campaign = Column(String)
    utm_content = Column(String)
    utm_term = Column(String)
    device = Column(String)
    browser = Column(String)


class Pixel(Base):
    __tablename__ = "pixels"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:24])
    pixel_id = Column(String, nullable=False)
    type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class PageContent(Base):
    __tablename__ = "page_contents"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:24])
    slug = Column(String, unique=True, nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    status = Column(String, default="published")
    indexable = Column(Boolean, default=True)
    seo_title = Column(String)
    seo_description = Column(String)
    canonical = Column(String)
    og_title = Column(String)
    og_description = Column(String)
    og_image = Column(String)
    content = Column(Text, default="{}")
    published_content = Column(Text)
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    versions = relationship("PageVersion", back_populates="page", cascade="all, delete-orphan")


class PageVersion(Base):
    __tablename__ = "page_versions"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex[:24])
    page_id = Column(String, ForeignKey("page_contents.id", ondelete="CASCADE"), nullable=False)
    version = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    seo_json = Column(Text)
    label = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    page = relationship("PageContent", back_populates="versions")


class SiteContent(Base):
    __tablename__ = "site_contents"
    id = Column(Integer, primary_key=True, default=1)
    header = Column(Text, default="{}")
    footer = Column(Text, default="{}")
    announcement = Column(Text, default="{}")
    pixels = Column(Text, default="{}")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
