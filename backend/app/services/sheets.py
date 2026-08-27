"""Send orders to a Google Sheets Apps Script webhook (see docs/10). Fire-and-forget."""
import httpx
import traceback

from ..config import settings


async def push_order(payload: dict):
    url = settings.sheets_webhook_url
    if not url:
        print("[sheets] SHEETS_WEBHOOK_URL not set — skipping push")
        return
    try:
        print(f"[sheets] Pushing order {payload.get('order_id', '?')} to Sheets...")
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, json=payload)
            print(f"[sheets] Response {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"[sheets] FAILED: {e}")
        traceback.print_exc()
