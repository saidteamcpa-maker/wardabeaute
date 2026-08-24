# 07 — Pixels: Meta + TikTok (Web + Server CAPI)

Goal: full funnel tracking with **browser pixels** + **server CAPI**, **deferred loading**, and
**deduplication via shared `event_id`**. Tokens stay server-side (never in frontend).

## 1. Events to track
| Funnel stage | Event | Fires on |
| - | - | - |
| View | `PageView` / `ViewContent` | every pageview / PDP view |
| Add to cart | `AddToCart` | cart drawer opens / item added |
| Checkout | `InitiateCheckout` | checkout popup opens |
| Purchase | `Purchase` | order POST succeeds (value=MAD) |

## 2. Browser pixels — DEFERRED (speed)
Load with `next/script` `strategy="afterInteractive"` (or `defer`). Do NOT block LCP.

**Meta Pixel** (`components/pixels/MetaPixel.tsx`):
```tsx
<Script id="fb-pixel" strategy="afterInteractive">{`
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,
  'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init','${NEXT_PUBLIC_FB_PIXEL_ID}'); fbq('track','PageView');`}</Script>
```

**TikTok Pixel** (`components/pixels/TikTokPixel.tsx`):
```tsx
<Script id="tt-pixel" strategy="afterInteractive">{`
  !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=
  ['page','track','identify','instance','init'];ttq.methods.forEach(function(m){ttq[m]=
  function(){ttq.push([m].concat(Array.prototype.slice.call(arguments)))}});
  ttq.load=function(id){ttq._i=ttq._i||{};ttq._i[id]={};ttq.loaded=1};
  ttq.init('${NEXT_PUBLIC_TIKTOK_PIXEL_ID}');ttq.page();}
  (window,document,'ttq');`}</Script>
```

Fire web events from `lib/pixels.ts`:
```ts
export function track(event, data, eventId) {
  const eid = eventId ?? crypto.randomUUID();
  if (window.fbq) window.fbq('track', event, data, {eventID: eid});   // Meta (eventID for dedup)
  if (window.ttq) window.ttq.track(event, {...data, event_id: eid});  // TikTok
  return eid; // send same eid to backend for CAPI
}
```
- Meta web event uses `fbq('track', name, customData, {eventID})`.
- TikTok web event uses `ttq.track(event, {..., event_id})`.

## 3. Server CAPI (backend) — dedup
Frontend sends events to `POST /api/events` with `{event, event_id, value?, content_ids?, phone?}`.
Backend forwards to BOTH Meta Conversions API and TikTok Events API using the SAME `event_id` → Meta
dedups automatically when `event_id` matches between browser + server.

**Meta CAPI** (`services/capi_meta.py`):
```
POST https://graph.facebook.com/v19.0/{FB_PIXEL_ID}/events?access_token={FB_CAPI_TOKEN}
{ "data": [ {
  "event_name": "Purchase",
  "event_time": <unix>,
  "event_id": "<same uuid>",
  "action_source": "website",
  "event_source_url": "<url>",
  "user_data": {
     "ph": ["<sha256 of +2126xxxxxxxxx>"],   // normalized + hashed
     "client_ip_address": "<ip>",
     "client_user_agent": "<ua>",
     "fbc": "<_fbc cookie>", "fbp": "<_fbp cookie>"
  },
  "custom_data": { "value": 279, "currency": "MAD", "content_ids": ["velvastretch"] }
} ] }
```
- Hashing: SHA-256 (lowercase hex) of **normalized phone**: strip spaces, replace leading `0` with
  `+212` → `+2126xxxxxxxxx`. Email (if ever collected) lowercase+trim then SHA-256.
- Pass `fbc`/`fbp` cookies from request if present.

**TikTok Events API** (`services/capi_tiktok.py`):
```
POST https://business-api.tiktok.com/open_api/v1.3/event/track/
Header: "Access-Token: <TT_CAPI_TOKEN>"
{ "event_source":"web", "event_source_id":"<TT_PIXEL_ID>",
  "data":[ {
    "event":"CompletePayment",            // AddToCart | InitiateCheckout | ViewContent
    "event_id":"<same uuid>",
    "timestamp":<unix>,
    "context":{ "ip": "<ip>", "user_agent":"<ua>", "page_url":"<url>" },
    "properties":{ "value":279, "currency":"MAD",
                   "contents":[{"content_id":"velvastretch","quantity":1,"price":279}] },
    "user":{ "external_id":"<sha256 random or phone hash>",
             "phone":["<sha256 of +2126...>"] }   // TikTok wants + prefix, hashed
  } ] }
```
- TikTok phone: normalize to E.164 with leading `+` (`+2126...`) then **SHA-256**. (Client/TikTok
  require the `+` before country code.) No raw phone sent.
- `event` names: `ViewContent`, `AddToCart`, `InitiateCheckout`, `CompletePayment` (=Purchase).

## 4. Dedup rules
- Same `event_id` (UUID) used by browser pixel AND server CAPI for the SAME action → Meta/TikTok
  collapse into one. Generate the UUID **once on the client** and pass it to `/api/events`.
- Only send CAPI for `AddToCart`, `InitiateCheckout`, `Purchase` (high-value). PageView web-only is fine.
- For `Purchase`, send from backend after order insert (authoritative value).

## 5. Env vars (see 09)
```
NEXT_PUBLIC_FB_PIXEL_ID=...        # frontend (browser)
NEXT_PUBLIC_TIKTOK_PIXEL_ID=...    # frontend (browser)
FB_CAPI_TOKEN=...                  # backend only (Conversions API access token)
TT_CAPI_TOKEN=...                  # backend only (TikTok Access Token)
```

## 6. Speed/quality
- Pixels deferred (`afterInteractive`). No blocking `<script>` in `<head>`.
- `meta`/TikTok `noscript` img fallbacks optional (kept minimal).
- Respect Morocco connectivity: pixel JS is small; fire async.
- Test with Meta Events Manager + TikTok Events Debugger before launch.

## 7. Test mode
- Dev: gate pixels behind `NEXT_PUBLIC_PIXELS_ENABLED=true` so localhost doesn't pollute data.
- Whitelisted `0666666666` orders still tracked but flagged `test:true` in Sheets.
