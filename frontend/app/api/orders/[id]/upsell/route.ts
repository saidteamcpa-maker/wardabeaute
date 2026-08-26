import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CO_COLLAGEN_DISCOUNT, suggestedUpsellSlug, unitPriceFor } from "@/lib/orders";
import { getCatalog } from "@/lib/catalog";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const reference = params.id;
  const order = await prisma.order.findUnique({ where: { reference }, include: { items: true } });
  if (!order) return NextResponse.json({ detail: "not_found" }, { status: 404 });

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  if (!body.add) return NextResponse.json({ ok: true, added: false });

  const slugs = order.items.map((i) => i.slug);
  const suggest = suggestedUpsellSlug(slugs);
  if (!suggest) return NextResponse.json({ ok: true, added: false });

  const catalog = await getCatalog();
  const price = unitPriceFor(suggest, 1, catalog);
  await prisma.$transaction([
    prisma.orderItem.create({
      data: { orderId: order.id, slug: suggest, name: catalog[suggest]?.name ?? suggest, qty: 1, unitPrice: price },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { total: order.total + price - CO_COLLAGEN_DISCOUNT, discount: order.discount + CO_COLLAGEN_DISCOUNT },
    }),
  ]);

  return NextResponse.json({ ok: true, added: true });
}
