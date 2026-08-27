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
        async with httpx.AsyncClient(timeout=15, follow_redirects=False) as client:
            resp = await client.post(url, json=payload)
            # Google Apps Script /exec returns 302 on first POST. Follow the
            # redirect manually and re-POST (httpx would convert POST→GET on
            # 302, losing the body).
            if resp.status_code in (301, 302, 303, 307, 308):
                location = resp.headers.get("location", "")
                if location:
                    print(f"[sheets] Redirect {resp.status_code} → following POST to {location[:80]}...")
                    resp = await client.post(location, json=payload)
            print(f"[sheets] Response {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"[sheets] FAILED: {e}")
        traceback.print_exc()
