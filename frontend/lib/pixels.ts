"use client";

// Browser pixel tracking. Tokens are public (NEXT_PUBLIC_*). The matching
// server CAPI call uses the SAME event_id for dedup (see docs/07).

// Runtime enable flag, overridable by the admin-configured PixelConfig
// (see components/pixels/PixelsConfig). Defaults to the env kill-switch.
let pixelsEnabled = process.env.NEXT_PUBLIC_PIXELS_ENABLED !== "false";

export function setPixelsEnabled(v: boolean) {
  pixelsEnabled = v;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = Array.from(b).map((x) => x.toString(16).padStart(2, "0"));
    return `${h.slice(0, 4).join("")}-${h.slice(4, 6).join("")}-${h.slice(6, 8).join("")}-${h.slice(8, 10).join("")}-${h.slice(10, 16).join("")}`;
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Map our canonical event names to each network's standard event name.
const META_EVENTS: Record<string, string> = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Purchase",
};

const TT_EVENTS: Record<string, string> = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
};

function pushGTM(event: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const dl = ((window as any).dataLayer = (window as any).dataLayer || []);
  dl.push({
    event,
    value: data.value ?? 0,
    currency: data.currency ?? "MAD",
    content_ids: data.content_ids,
    content_type: data.content_type ?? "product",
    orderId: data.orderId,
  });
}

// Forward a subset of pixel events to our own first-party analytics endpoint.
// Server re-derives source/device/country from headers — never trust the client.
const ANALYTICS_MAP: Record<string, string> = {
  PageView: "page_view",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
  Purchase: "order_success",
};

function getVisitorId(): string {
  try {
    let v = localStorage.getItem("warda_visitor_id");
    if (!v) {
      v = uuid();
      localStorage.setItem("warda_visitor_id", v);
    }
    return v;
  } catch {
    return uuid();
  }
}

function getSessionId(): string {
  try {
    let s = sessionStorage.getItem("warda_session_id");
    if (!s) {
      s = uuid();
      sessionStorage.setItem("warda_session_id", s);
    }
    return s;
  } catch {
    return uuid();
  }
}

function sendAnalytics(event: string, data: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof location === "undefined") return;
  const eventType = ANALYTICS_MAP[event];
  if (!eventType) return;
  const qs = new URLSearchParams(location.search);
  const payload: Record<string, unknown> = {
    eventType,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    page: location.pathname,
    productId: Array.isArray(data.content_ids) ? (data.content_ids as unknown[])[0] : data.productId,
    orderId: data.orderId,
    utm_source: qs.get("utm_source") || undefined,
    utm_medium: qs.get("utm_medium") || undefined,
    utm_campaign: qs.get("utm_campaign") || undefined,
    utm_content: qs.get("utm_content") || undefined,
    utm_term: qs.get("utm_term") || undefined,
  };
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function track(
  event: string,
  data: Record<string, unknown> = {},
  eventId?: string,
  opts?: { skipPixel?: boolean }
): string {
  const eid = eventId || uuid();
  const enabled = pixelsEnabled;

  if (enabled && typeof window !== "undefined") {
    // Meta + TikTok (skipped on the very first PageView to avoid double counting
    // against the pixel's own init-time PageView). GTM has no auto PageView, so it
    // is always pushed.
    if (!opts?.skipPixel) {
      if ((window as any).fbq) {
        (window as any).fbq(
          "track",
          META_EVENTS[event] || event,
          { ...data, value: data.value || 0, currency: "MAD" },
          { eventID: eid }
        );
      }
      if ((window as any).ttq) {
        (window as any).ttq.track(TT_EVENTS[event] || event, {
          ...data,
          value: data.value || 0,
          currency: "MAD",
          event_id: eid,
        });
      }
    }
    pushGTM(event, data);
    sendAnalytics(event, data);
  }
  return eid;
}
