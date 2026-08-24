"""Send orders to a Google Sheets Apps Script webhook (see docs/10). Fire-and-forget."""
import httpx

from ..config import settings


async def push_order(payload: dict):
    url = settings.sheets_webhook_url
    if not url:
        return
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(url, json=payload)
    except Exception as e:
        # Never fail the order because Sheets is down.
        print("Sheets webhook failed:", e)
