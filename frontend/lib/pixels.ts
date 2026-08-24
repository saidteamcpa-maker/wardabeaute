"use client";

// Browser pixel tracking. Tokens are public (NEXT_PUBLIC_*). The matching
// server CAPI call uses the SAME event_id for dedup (see docs/07).
export function track(event: string, data: Record<string, unknown> = {}, eventId?: string): string {
  const eid = eventId || crypto.randomUUID();
  const enabled = process.env.NEXT_PUBLIC_PIXELS_ENABLED !== "false";

  if (enabled && typeof window !== "undefined") {
    // Meta
    if ((window as any).fbq) {
      (window as any).fbq("track", event, { ...data, value: data.value || 0, currency: "MAD" }, { eventID: eid });
    }
    // TikTok
    if ((window as any).ttq) {
      (window as any).ttq.track(event, { ...data, event_id: eid });
    }
  }
  return eid;
}
