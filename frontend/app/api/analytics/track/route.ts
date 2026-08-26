import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDevice, parseBrowser, deriveSource } from "@/lib/orders";
import { countryOf } from "@/lib/geo";

const ALLOWED = ["page_view", "add_to_cart", "begin_checkout", "order_success"];

const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (arr.length >= 120) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, detail: "rate_limited" }, { status: 429 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, detail: "invalid_json" }, { status: 400 });
  }

  const eventType = body?.eventType;
  if (typeof eventType !== "string" || !ALLOWED.includes(eventType)) {
    return NextResponse.json({ ok: false, detail: "invalid_event" }, { status: 400 });
  }

  const ua = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || null;
  const source = deriveSource(referer, body.utm_source || null);
  const country = (await countryOf(req)) || "MA";

  await prisma.analyticsEvent.create({
    data: {
      eventType,
      page: typeof body.page === "string" ? body.page.slice(0, 200) : null,
      productId: typeof body.productId === "string" ? body.productId.slice(0, 80) : null,
      orderId: typeof body.orderId === "string" ? body.orderId.slice(0, 80) : null,
      country,
      referrer: referer ? referer.slice(0, 300) : null,
      utmSource: typeof body.utm_source === "string" ? body.utm_source.slice(0, 80) : null,
      utmMedium: typeof body.utm_medium === "string" ? body.utm_medium.slice(0, 80) : null,
      utmCampaign: typeof body.utm_campaign === "string" ? body.utm_campaign.slice(0, 80) : null,
      utmContent: typeof body.utm_content === "string" ? body.utm_content.slice(0, 80) : null,
      utmTerm: typeof body.utm_term === "string" ? body.utm_term.slice(0, 80) : null,
      device: parseDevice(ua),
      browser: parseBrowser(ua),
      sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 80) : null,
      visitorId: typeof body.visitorId === "string" ? body.visitorId.slice(0, 80) : null,
    },
  });

  return NextResponse.json({ ok: true });
}
