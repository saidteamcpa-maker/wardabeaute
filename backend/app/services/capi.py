"""Server-side CAPI (Meta Conversions API + TikTok Events API) with shared event_id dedup.
Tokens stay server-side. If pixel/token missing, this is a no-op (graceful)."""
import hashlib
import time

import httpx

from ..config import settings
from .geo import normalize_phone

# Map Meta event names -> TikTok event names
TT_MAP = {
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Purchase": "CompletePayment",
}


def _sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode("utf-8")).hexdigest()


async def track(event: str, event_id: str, *, value: int = 0, content_ids=None,
                phone: str = "", ip: str = "", ua: str = "", url: str = ""):
    content_ids = content_ids or []
    ph_hashed = _sha256(normalize_phone(phone)) if phone else None
    ua = ua or ""

    # Meta Conversions API
    if settings.fb_pixel_id and settings.fb_capi_token:
        meta_event = {
            "event_name": event,
            "event_time": int(time.time()),
            "event_id": event_id,
            "action_source": "website",
            "event_source_url": url,
            "user_data": {
                "ph": [ph_hashed] if ph_hashed else [],
                "client_ip_address": ip,
                "client_user_agent": ua,
            },
            "custom_data": {"value": value, "currency": "MAD", "content_ids": content_ids},
        }
        try:
            async with httpx.AsyncClient(timeout=10) as c:
                await c.post(
                    f"https://graph.facebook.com/v19.0/{settings.fb_pixel_id}/events",
                    params={"access_token": settings.fb_capi_token},
                    json={"data": [meta_event]},
                )
        except Exception as e:
            print("Meta CAPI failed:", e)

    # TikTok Events API (phone normalized with +, hashed)
    if settings.tt_pixel_id and settings.tt_capi_token:
        tt_event = {
            "event": TT_MAP.get(event, event),
            "event_id": event_id,
            "timestamp": int(time.time()),
            "context": {"ip": ip, "user_agent": ua, "page_url": url},
            "properties": {
                "value": value,
                "currency": "MAD",
                "contents": [{"content_id": cid, "quantity": 1, "price": value} for cid in content_ids],
            },
            "user": {"phone": [ph_hashed] if ph_hashed else []},
        }
        try:
            async with httpx.AsyncClient(timeout=10) as c:
                await c.post(
                    "https://business-api.tiktok.com/open_api/v1.3/event/track/",
                    headers={"Access-Token": settings.tt_capi_token},
                    json={"event_source": "web", "event_source_id": settings.tt_pixel_id,
                          "data": [tt_event]},
                )
        except Exception as e:
            print("TikTok CAPI failed:", e)
