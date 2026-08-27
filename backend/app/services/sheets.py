"""Send orders to a Google Apps Script webhook (see docs/10). Fire-and-forget.

Google Apps Script /exec POSTs return 302 to script.googleusercontent.com.
httpx/fetch follow 302 as GET (drops body), so we must follow manually as POST
and use text/plain to avoid preflight.
"""
import json
import traceback

import httpx

from ..config import settings


def _log(msg: str):
    print(msg, flush=True)


async def push_order(payload: dict):
    """POST order data to Google Apps Script. Called as a FastAPI BackgroundTask."""
    url = settings.sheets_url
    if not url:
        _log("[sheets] SHEETS_WEBHOOK_URL not set — skipping push")
        return

    order_id = payload.get("order_id", "?")
    body = json.dumps(payload, ensure_ascii=False)

    try:
        _log(f"[sheets] Preparing order {order_id} for Google Sheets")
        log_payload = {k: v for k, v in payload.items() if k != "items_json"}
        log_payload["items_json"] = f"[{len(payload.get('items_json', []))} items]"
        _log(f"[sheets] Payload: {json.dumps(log_payload, default=str, ensure_ascii=False)[:300]}")

        headers = {"Content-Type": "text/plain;charset=utf-8"}

        async with httpx.AsyncClient(timeout=20, follow_redirects=False) as client:
            # POST directly to /exec, manually follow redirects as POST
            current_url = url
            resp = None
            for attempt in range(4):
                _log(f"[sheets] Sending order {order_id} to {current_url[:70]}... (attempt {attempt+1})")
                resp = await client.post(current_url, content=body, headers=headers)

                _log(f"[sheets] Response {resp.status_code}: {resp.text[:300]}")

                if resp.status_code in (301, 302, 303, 307, 308):
                    loc = resp.headers.get("location")
                    if not loc:
                        _log(f"[sheets] Redirect {resp.status_code} without location for {order_id}")
                        break
                    _log(f"[sheets] Following redirect {resp.status_code} → {loc[:80]}")
                    current_url = loc
                    continue

                # Not a redirect — final response
                break

            if resp is None:
                _log(f"[sheets] ERROR: no response for {order_id}")
                return

            if resp.status_code == 200:
                try:
                    # Apps Script may return text/plain JSON — try json() then fallback to text
                    try:
                        j = resp.json()
                    except Exception:
                        j = json.loads(resp.text)
                    if j.get("ok"):
                        _log(f"[sheets] Successfully synced order {order_id}")
                    else:
                        _log(f"[sheets] WARNING: Apps Script returned ok=false for {order_id}: {j}")
                except Exception as e:
                    _log(f"[sheets] WARNING: Response not valid JSON for {order_id}: {e}")
            elif resp.status_code in (301, 302, 303, 307, 308):
                _log(f"[sheets] ERROR: still redirect after 4 attempts for {order_id}")
            else:
                _log(f"[sheets] ERROR: Unexpected status {resp.status_code} for {order_id}: {resp.text[:300]}")

    except httpx.TimeoutException:
        _log(f"[sheets] TIMEOUT sending order {order_id} to Sheets")
    except httpx.ConnectError as e:
        _log(f"[sheets] CONNECTION ERROR for {order_id}: {e}")
    except Exception as e:
        _log(f"[sheets] FAILED to sync order {order_id}: {e}")
        traceback.print_exc()
