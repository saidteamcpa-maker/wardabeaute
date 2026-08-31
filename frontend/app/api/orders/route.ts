import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isMorocco } from "@/lib/geo";
import { computeTotal, generateReference, deriveSource, parseDevice, parseBrowser, unitPriceFor, offerSkuFor, CO_COLLAGEN_DISCOUNT, bundleDiscount } from "@/lib/orders";
import { getCatalog } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalog";

/**
 * The "Kit Collagène Inside & Outside" is a PACK, not a real product.
 * When pushing to Sheets/Marketplace we expand it into its constituent products,
 * each carrying its own real Spaceseller SKU. Identifiers below are the
 * authoritative Spaceseller SKUs for each product.
 */
const CONSTITUENT_SKU: Record<string, { slug: string; sku: string }[]> = {
  "kit-collagene": [
    { slug: "velvastretch", sku: "anti-vergeture" },
    { slug: "collaglow", sku: "gummies_collagen" },
  ],
};

function expandItem(item: { slug: string; qty: number }): { slug: string; qty: number }[] {
  const pack = CONSTITUENT_SKU[item.slug];
  if (!pack) return [{ slug: item.slug, qty: item.qty }];
  return pack.map((p) => ({ slug: p.slug, qty: item.qty }));
}

// Resolve the Spaceseller SKU for any product: pack constituents use the fixed
// mapping; single products use the DB SKU (falling back to their slug).
function skuFor(slug: string, catalog: Record<string, CatalogProduct>, skuMap: Map<string, string | null>): string {
  for (const pack of Object.values(CONSTITUENT_SKU)) {
    const found = pack.find((p) => p.slug === slug);
    if (found) return found.sku;
  }
  return skuMap.get(slug) || catalog[slug]?.name || slug;
}

const SHEETS_URL =
  process.env.SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbybYq3NDTzqj2vsOacTq8CWNweiMBvptn4oa44Y9DLXLTi7WtlARGwZjeefbRt09lBj/exec";

const SPACESHELL_URL =
  (process.env.SPACESHELL_BASE_URL || process.env.SPACESSELLER_BASE_URL || "https://drop.spaceseller.ma/api/v1").replace(/\/$/, "");
const SPACESHELL_TOKEN = (process.env.SPACESHELL_TOKEN || process.env.SPACESSELLER_TOKEN || "").trim();

const CITY_MAP: Record<string, number> = {
  casablanca: 1, rabat: 2, marrakech: 3, fes: 4, tanger: 5, tangier: 5, agadir: 6, meknes: 7, oujda: 8, kenitra: 9, tetouan: 10, safi: 11, "el jadida": 12, "beni mellal": 13, nador: 14, taza: 15,
};
function mapCityId(city: string | null | undefined): number | undefined {
  if (!city) return undefined;
  const k = city.trim().toLowerCase();
  if (CITY_MAP[k] !== undefined) return CITY_MAP[k];
  for (const [ck, cv] of Object.entries(CITY_MAP)) if (k.includes(ck) || ck.includes(k)) return cv;
  return undefined;
}

async function pushToSheets(payload: Record<string, unknown>) {
  if (!SHEETS_URL) return;
  const body = JSON.stringify(payload);
  const headers = { "Content-Type": "text/plain;charset=utf-8" } as const;
  try {
    console.log(`[sheets] Sending order ${payload.order_id} to ${SHEETS_URL.slice(0, 70)}...`);
    const res = await fetch(SHEETS_URL, {
      method: "POST",
      headers,
      body,
      redirect: "manual",
    });
    const status = res.status;
    const text = await res.text().catch(() => "");
    console.log(`[sheets] Response ${status}: ${text.slice(0, 300)}`);
    // Apps Script returns 302 → GET echo URL for JSON result
    if (status >= 301 && status <= 308) {
      const loc = res.headers.get("location");
      if (loc) {
        console.log(`[sheets] Following redirect GET → ${loc.slice(0, 80)}`);
        const res2 = await fetch(loc, { method: "GET", redirect: "follow" });
        const text2 = await res2.text();
        console.log(`[sheets] GET Result ${res2.status}: ${text2.slice(0, 300)}`);
        try {
          const j = JSON.parse(text2);
          if (j?.ok) console.log(`[sheets] Successfully synced order ${payload.order_id}`);
          else console.warn(`[sheets] WARNING ok=false for ${payload.order_id}:`, j);
        } catch {}
        return;
      }
    }
    if (status === 200) {
      try {
        const j = JSON.parse(text);
        if (j?.ok) console.log(`[sheets] Successfully synced order ${payload.order_id}`);
        else console.warn(`[sheets] WARNING ok=false for ${payload.order_id}:`, j);
      } catch {}
    }
  } catch (e) {
    console.error(`[sheets] FAILED for ${payload.order_id}:`, e);
  }
}

async function pushToSpaceseller(payload: Record<string, unknown>) {
  if (!SPACESHELL_TOKEN) {
    console.log(`[spaceseller] disabled — no token for ${payload.order_id}`);
    return;
  }
  const items = (payload.items_json as any[]) || [];
  const products = items
    .map((it: any) => ({
      sku: String(it.sku || it.slug || "").trim(),
      quantity: Math.max(1, Number(it.qty) || 1),
      unit_price: Number(it.unit_price ?? it.line_total ?? 0),
    }))
    .filter((p: any) => p.sku);
  if (products.length === 0) {
    console.warn(`[spaceseller] SKIP ${payload.order_id}: no SKU (set SKU in admin Products)`);
    return;
  }
  const fullname = String((payload as any).customer_name || "").trim();
  const phone = String((payload as any).phone || "").trim();
  if (fullname.length < 2 || phone.length < 5) {
    console.warn(`[spaceseller] SKIP ${payload.order_id}: missing fullname/phone`);
    return;
  }
  const city = String((payload as any).city || "").trim();
  const addr = String((payload as any).address || "").trim();
  const address = [city, addr].filter(Boolean).join(", ");
  const noteParts = [`Warda ref ${payload.order_id}`];
  if ((payload as any).discount) noteParts.push(`Bundle -${(payload as any).discount} MAD`);
  if ((payload as any).notes) noteParts.push(String((payload as any).notes));
  const body: Record<string, unknown> = {
    fullname,
    phone,
    address,
    note: noteParts.join(" | ").slice(0, 500),
    total_price: Number((payload as any).total || 0),
    products,
  };
  const cityId = mapCityId(city);
  if (cityId !== undefined) body.id_city = cityId;
  console.log(`[spaceseller] Payload for ${payload.order_id}: ` + JSON.stringify(body));

  try {
    const url = `${SPACESHELL_URL}/orders`;
    console.log(`[spaceseller] Pushing order ${payload.order_id} to ${url} — ${products.length} products`);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SPACESHELL_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log(`[spaceseller] Response ${res.status}: ${text.slice(0, 500)}`);
    if (res.status === 201 || res.status === 200) {
      try {
        const j = JSON.parse(text);
        if (j?.success) {
          console.log(`[spaceseller] Successfully created ${payload.order_id} → ${j.data?.order_id} ${j.data?.uuid}`);
          if (j.data?.order_id) {
            try {
              await (prisma.order.update as any)({
                where: { reference: String(payload.order_id) },
                data: {
                  externalId: Number(j.data.order_id),
                  externalUuid: j.data.uuid || null,
                  externalStatus: "NEW",
                  lastSyncedAt: new Date(),
                },
              });
              console.log(`[spaceseller] Persisted external mapping ${payload.order_id} -> ${j.data.order_id}`);
            } catch (e) {
              console.warn(`[spaceseller] Failed to persist mapping for ${payload.order_id}:`, e);
            }
          }
        } else console.warn(`[spaceseller] WARNING success=false for ${payload.order_id}:`, j);
      } catch {}
    } else if (res.status === 401) {
      console.error(`[spaceseller] 401 Unauthenticated for ${payload.order_id} — check SPACESHELL_TOKEN`);
    } else if (res.status === 422) {
      console.warn(`[spaceseller] 422 validation for ${payload.order_id}: ${text.slice(0, 500)}`);
    }
  } catch (e) {
    console.error(`[spaceseller] FAILED for ${payload.order_id}:`, e);
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
  // Fetch SKU snapshot for Sheets/Marketplace (uses existing admin SKU field).
  // Fetch for the whole catalog so kit-pack expansion (velvastretch/collaglow)
  // can resolve real SKUs even though the order line itself is "kit-collagene".
  const skuRows = await prisma.product.findMany({ select: { slug: true, sku: true } });
  const skuMap = new Map(skuRows.map((p) => [p.slug, p.sku] as const));

  // "Kit Collagène Inside & Outside" discount: auto-granted whenever the order
  // already contains BOTH VelvaStretch (outside) and CollaGlow (inside) — with or
  // without any other products. The upsell popup only offers to *complete* the kit
  // (add the missing one) when exactly one of them is present.
  // NOT applied when the Kit product itself is in the cart (tested separately).
  const kitDiscount = bundleDiscount(cleanItems);

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
        sku: offerSkuFor(i.slug, i.qty, catalog) ?? skuMap.get(i.slug) ?? null,
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
      items_json: (() => {
        const flat: { slug: string; qty: number }[] = created.items.flatMap((i: any) => expandItem({ slug: i.slug, qty: i.qty }));
        const sheetSku = flat
          .map((f) => {
            const specific = offerSkuFor(f.slug, f.qty, catalog);
            if (specific) return specific;
            return `${skuFor(f.slug, catalog, skuMap)}-x${(f.qty || 1)}`;
          })
          .join("+");
        const totalQty = flat.reduce((s: number, f) => s + (f.qty || 1), 0);
        return [{ slug: "", sku: sheetSku, sku_sheet: sheetSku, qty: totalQty, name: "", unit_price: total }];
      })(),
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
  // Marketplace payload must use real per-product items (not the consolidated Sheets sku)
  const marketplacePayload = {
    ...sheetsPayload,
    items_json: created.items.flatMap((i: any) =>
      expandItem({ slug: i.slug, qty: i.qty }).map((f) => {
        const unit = unitPriceFor(f.slug, f.qty, catalog);
        return {
          slug: f.slug,
          sku: skuFor(f.slug, catalog, skuMap),
          qty: f.qty,
          unit_price: unit,
          name: catalog[f.slug]?.name ?? f.slug,
          line_total: unit * f.qty,
        };
      })
    ),
  };
  // Fire-and-forget — both must not block order creation
  pushToSheets(sheetsPayload).catch(() => {});
  pushToSpaceseller(marketplacePayload).catch(() => {});

  return NextResponse.json({ id: created.reference, total: created.total, discount: created.discount });
}
