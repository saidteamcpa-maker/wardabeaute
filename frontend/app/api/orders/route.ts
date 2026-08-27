import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isMorocco } from "@/lib/geo";
import { computeTotal, generateReference, deriveSource, parseDevice, parseBrowser, unitPriceFor, CO_COLLAGEN_DISCOUNT, bundleDiscount } from "@/lib/orders";
import { getCatalog } from "@/lib/catalog";

const SHEETS_URL =
  process.env.SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbybYq3NDTzqj2vsOacTq8CWNweiMBvptn4oa44Y9DLXLTi7WtlARGwZjeefbRt09lBj/exec";

async function pushToSheets(payload: Record<string, unknown>) {
  if (!SHEETS_URL) return;
  const body = JSON.stringify(payload);
  const headers = { "Content-Type": "text/plain;charset=utf-8" } as const;
  try {
    let current = SHEETS_URL;
    for (let attempt = 0; attempt < 4; attempt++) {
      console.log(`[sheets] Sending order ${payload.order_id} to ${current.slice(0, 70)}... (attempt ${attempt + 1})`);
      const res = await fetch(current, {
        method: "POST",
        headers,
        body,
        redirect: "manual",
      });
      const status = res.status;
      const text = await res.text().catch(() => "");
      console.log(`[sheets] Response ${status}: ${text.slice(0, 300)}`);
      // 0 = opaque redirect in some runtimes, 301-308 = redirect
      if (status >= 301 && status <= 308) {
        const loc = res.headers.get("location");
        if (!loc) break;
        console.log(`[sheets] Following redirect → ${loc.slice(0, 80)}`);
        current = loc;
        continue;
      }
      // Also handle fetch following redirect automatically (status 200 but HTML)
      // If we got HTML instead of JSON, it means we were redirected to echo without POST body
      if (status === 200) {
        try {
          const j = JSON.parse(text);
          if (j?.ok) console.log(`[sheets] Successfully synced order ${payload.order_id}`);
          else console.warn(`[sheets] WARNING ok=false for ${payload.order_id}:`, j);
        } catch {
          // Not JSON — likely HTML from echo GET, treat as needing manual POST
          if (text.includes("<!DOCTYPE") || text.includes("ppConfig")) {
            console.warn(`[sheets] Got HTML instead of JSON for ${payload.order_id} — redirect was followed as GET, body lost`);
          }
        }
      } else {
        console.warn(`[sheets] Unexpected status ${status} for ${payload.order_id}`);
      }
      break;
    }
  } catch (e) {
    console.error(`[sheets] FAILED for ${payload.order_id}:`, e);
  }
}

const PHONE_RE = /^0(5|6|7|8)[0-9]{8}$/;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "invalid_json" }, { status: 400 });
  }

  const { customer_name, phone, city, address, postal, items } = body ?? {};
  if (!customer_name || !phone || !city || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ detail: "invalid_payload" }, { status: 422 });
  }
  if (typeof phone !== "string" || !PHONE_RE.test(phone)) {
    return NextResponse.json({ detail: "invalid_phone" }, { status: 422 });
  }
  if (!(await isMorocco(req))) {
    return NextResponse.json({ detail: "orders_only_morocco" }, { status: 403 });
  }

  const cleanItems = items
    .filter((i: any) => i && i.slug)
    .map((i: any) => ({ slug: i.slug, qty: Math.max(1, Math.min(20, Math.floor(i.qty) || 1)) }));

  if (cleanItems.length === 0) {
    return NextResponse.json({ detail: "invalid_items" }, { status: 422 });
  }

  const catalog = await getCatalog();
  const total = await computeTotal(cleanItems);

  // "Kit Collagène Inside & Outside" discount: auto-granted whenever the order
  // already contains BOTH VelvaStretch (outside) and CollaGlow (inside) — with or
  // without any other products. The upsell popup only offers to *complete* the kit
  // (add the missing one) when exactly one of them is present.
  // NOT applied when the Kit product itself is in the cart (tested separately).
  const kitDiscount = bundleDiscount(cleanItems.map((i: any) => i.slug));

  const idemKey =
    typeof body.idempotency_key === "string" && body.idempotency_key.trim()
      ? body.idempotency_key.trim().slice(0, 120)
      : null;

  // Idempotency: an identical checkout attempt (e.g. double-click / network retry)
  // returns the already-created order instead of creating a duplicate.
  if (idemKey) {
    const existing = await prisma.order.findUnique({
      where: { idempotencyKey: idemKey },
      include: { items: true },
    });
    if (existing) {
      return NextResponse.json({ id: existing.reference, total: existing.total, duplicate: true });
    }
  }

  const baseData = {
    customerName: String(customer_name).slice(0, 120),
    phone: String(phone).slice(0, 20),
    city: String(city).slice(0, 80),
    address: address ? String(address).slice(0, 300) : null,
    postal: postal ? String(postal).slice(0, 20) : null,
    total: total - kitDiscount,
    discount: kitDiscount,
    idempotencyKey: idemKey,
    source: deriveSource(req.headers.get("referer"), body.utm_source),
    utmSource: body.utm_source ?? null,
    utmMedium: body.utm_medium ?? null,
    utmCampaign: body.utm_campaign ?? null,
    utmContent: body.utm_content ?? null,
    utmTerm: body.utm_term ?? null,
    referrer: req.headers.get("referer")?.slice(0, 300) ?? null,
    device: parseDevice(req.headers.get("user-agent")),
    browser: parseBrowser(req.headers.get("user-agent")),
    country: "MA",
    items: {
      create: cleanItems.map((i: any) => ({
        slug: i.slug,
        name: catalog[i.slug]?.name ?? i.slug,
        qty: i.qty,
        unitPrice: unitPriceFor(i.slug, i.qty, catalog),
      })),
    },
  };

  let created: any = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    const reference = generateReference();
    try {
      created = await prisma.order.create({
        data: { ...baseData, reference },
        include: { items: true },
      });
      break;
    } catch (e: any) {
      if (e?.code === "P2002") {
        // Reference (or idempotencyKey) collision — reuse existing if it's the idempotency key
        if (idemKey) {
          const existing = await prisma.order.findUnique({
            where: { idempotencyKey: idemKey },
            include: { items: true },
          });
          if (existing) {
            created = existing;
            break;
          }
        }
        if (attempt < 5) continue; // regenerate reference and retry
      }
      throw e;
    }
  }

  // Sheets webhook — fire-and-forget (must not block order creation)
  // Payload shape must match backend/app/services/sheets.py and the Apps Script doc.
  const sheetsPayload = {
    order_id: created.reference,
    date: created.createdAt.toISOString(),
    customer_name: created.customerName,
    phone: created.phone,
    city: created.city,
    address: created.address || "",
    postal: created.postal || "",
    items_json: created.items.map((i: any) => ({
      slug: i.slug,
      name: i.name,
      qty: i.qty,
      unit_price: i.unitPrice,
      line_total: i.unitPrice * i.qty,
    })),
    subtotal: total,
    discount: kitDiscount,
    upsell: 0,
    total: created.total,
    status: created.status,
    country: created.country,
    geo_risk: "",
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    source: baseData.source,
    notes: "",
  };
  // Don't await — order already created, sheets is best-effort
  pushToSheets(sheetsPayload).catch(() => {});

  return NextResponse.json({ id: created.reference, total: created.total, discount: created.discount });
}
