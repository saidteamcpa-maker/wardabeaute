from typing import List, Optional

from pydantic import BaseModel


class OrderItemIn(BaseModel):
    slug: str
    qty: int = 1


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    city: str
    address: str
    postal: Optional[str] = None
    items: List[OrderItemIn]
    upsell: bool = False


class UpsellIn(BaseModel):
    add: bool = True


class OrderOut(BaseModel):
    id: str
    total: int
    status: str
