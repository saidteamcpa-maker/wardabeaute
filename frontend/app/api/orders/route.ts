import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isMorocco } from "@/lib/geo";
import { computeTotal, generateReference, deriveSource, parseDevice, parseBrowser, unitPriceFor, CO_COLLAGEN_DISCOUNT } from "@/lib/orders";
import { getCatalog } from "@/lib/catalog";

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
  const hasV = cleanItems.some((i: any) => i.slug === "velvastretch");
  const hasC = cleanItems.some((i: any) => i.slug === "collaglow");
  const kitDiscount = hasV && hasC ? CO_COLLAGEN_DISCOUNT : 0;

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

  return NextResponse.json({ id: created.reference, total: created.total, discount: created.discount });
}
