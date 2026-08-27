"""Send orders to a Google Apps Script webhook (see docs/10). Fire-and-forget.

Google Apps Script web apps use a redirect chain:
  POST /exec → 302 → script.googleusercontent.com/macros/echo/...
The echo endpoint accepts POST and forwards to the script.

We use a two-step approach:
  1. GET /exec → follows redirect → resolves to the final execution URL
  2. POST to that resolved URL → script runs → JSON response

The resolved URL is cached for subsequent requests.
"""
import json
import traceback

import httpx

from ..config import settings

# Cache the resolved Apps Script execution URL.
_resolved_url: str | None = None


def _log(msg: str):
    """Print + flush immediately so Docker containers capture output."""
    print(msg, flush=True)


async def push_order(payload: dict):
    """POST order data to Google Apps Script. Called as a FastAPI BackgroundTask."""
    global _resolved_url

    url = settings.sheets_url
    if not url:
        _log("[sheets] SHEETS_WEBHOOK_URL not set — skipping push")
        return

    order_id = payload.get("order_id", "?")

    try:
        _log(f"[sheets] Preparing order {order_id} for Google Sheets")

        # Sanitize payload for logging (remove nested items_json to keep log short)
        log_payload = {k: v for k, v in payload.items() if k != "items_json"}
        log_payload["items_json"] = f"[{len(payload.get('items_json', []))} items]"
        _log(f"[sheets] Payload: {json.dumps(log_payload, default=str)[:300]}")

        async with httpx.AsyncClient(timeout=20) as client:
            # Step 1: Resolve the execution URL via GET (follows redirect chain).
            target = _resolved_url or url
            if not _resolved_url:
                _log(f"[sheets] Resolving redirect for {url[:70]}...")
                try:
                    r = await client.get(url, follow_redirects=True)
                    _resolved_url = str(r.url)
                    target = _resolved_url
                    _log(f"[sheets] Resolved to {target[:80]}")
                except Exception as e:
                    _log(f"[sheets] GET resolve failed: {e}")
                    # Fall back to the original URL
                    target = url

            # Step 2: POST the order data to the resolved URL.
            _log(f"[sheets] Sending order {order_id} to Google Apps Script...")
            resp = await client.post(target, json=payload, follow_redirects=True)

            _log(f"[sheets] Response {resp.status_code}: {resp.text[:200]}")

            # Step 3: Verify the Apps Script returned success.
            if resp.status_code == 200:
                try:
                    body = resp.json()
                    if body.get("ok"):
                        _log(f"[sheets] Successfully synced order {order_id}")
                    else:
                        _log(f"[sheets] WARNING: Apps Script returned ok=false for {order_id}: {body}")
                except Exception:
                    _log(f"[sheets] WARNING: Response not valid JSON for {order_id}")
            elif resp.status_code in (301, 302, 303, 307, 308):
                # Got a redirect — the script may have executed but we couldn't
                # reach the final response. The302 alone means Google accepted
                # the request; the script likely ran.
                _log(f"[sheets] Got redirect {resp.status_code} — script likely executed for {order_id}")
            else:
                _log(f"[sheets] ERROR: Unexpected status {resp.status_code} for {order_id}")

    except httpx.TimeoutException:
        _log(f"[sheets] TIMEOUT sending order {order_id} to Sheets")
    except httpx.ConnectError as e:
        _log(f"[sheets] CONNECTION ERROR for {order_id}: {e}")
        # Clear cached URL so next request re-resolves
        _resolved_url = None
    except Exception as e:
        _log(f"[sheets] FAILED to sync order {order_id}: {e}")
        traceback.print_exc()
