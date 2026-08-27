"""Send orders to a Google Sheets Apps Script webhook (see docs/10). Fire-and-forget."""
import httpx
import traceback

from ..config import settings

# Cache the resolved Apps Script URL (the /exec endpoint redirects to
# script.googleusercontent.com on first call).
_resolved_url_cache: str | None = None


async def push_order(payload: dict):
    global _resolved_url_cache
    url = settings.sheets_webhook_url
    if not url:
        print("[sheets] SHEETS_WEBHOOK_URL not set — skipping push")
        return
    try:
        order_id = payload.get("order_id", "?")
        print(f"[sheets] Pushing order {order_id} to Sheets...")

        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            # Resolve the real URL behind the /exec redirect (GET follows
            # the 302 chain; we cache the final URL for future POSTs).
            post_url = _resolved_url_cache or url
            if not _resolved_url_cache:
                print(f"[sheets] Resolving redirect for {url[:60]}...")
                r = await client.get(url)
                _resolved_url_cache = str(r.url)
                post_url = _resolved_url_cache
                print(f"[sheets] Resolved to {post_url[:80]}")

            # POST directly to the resolved URL
            resp = await client.post(post_url, json=payload)

            # If resolved URL is stale (404/302), re-resolve once
            if resp.status_code in (301, 302, 303, 307, 308, 404):
                print(f"[sheets] Got {resp.status_code}, re-resolving...")
                r = await client.get(url)
                _resolved_url_cache = str(r.url)
                resp = await client.post(_resolved_url_cache, json=payload)

            print(f"[sheets] Response {resp.status_code}: {resp.text[:200]}")

    except Exception as e:
        print(f"[sheets] FAILED: {e}")
        traceback.print_exc()
