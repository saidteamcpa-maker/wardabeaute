import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isMorocco } from "@/lib/geo";
import { computeTotal, generateReference, deriveSource, parseDevice, parseBrowser, unitPriceFor } from "@/lib/orders";
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
  const reference = generateReference();

  const order = await prisma.order.create({
    data: {
      reference,
      customerName: String(customer_name).slice(0, 120),
      phone: String(phone).slice(0, 20),
      city: String(city).slice(0, 80),
      address: address ? String(address).slice(0, 300) : null,
      postal: postal ? String(postal).slice(0, 20) : null,
      total,
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
    },
    include: { items: true },
  });

  return NextResponse.json({ id: order.reference, total: order.total });
}
