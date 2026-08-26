from typing import List, Optional

from pydantic import BaseModel


class OrderItemIn(BaseModel):
    slug: str
    qty: int = 1


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    city: str
    address: Optional[str] = None
    postal: Optional[str] = None
    items: List[OrderItemIn]
    upsell: bool = False
    idempotency_key: Optional[str] = None


class UpsellIn(BaseModel):
    add: bool = True


class OrderOut(BaseModel):
    id: str
    total: int
    discount: int = 0
    status: str
