import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { sendWatiMessage } from '@/lib/wati';
import { CATALOG, BUNDLE } from '@/lib/data/catalog';

const itemSchema = z.object({
  sku: z.string(),
  nameFr: z.string(),
  nameAr: z.string(),
  price: z.number().int().positive(),
  qty: z.number().int().positive(),
});

const orderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().regex(/^0(6|7)\d{8}$/, 'Invalid MA phone'),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  items: z.array(itemSchema).min(1),
  source: z.string().optional(),
});

function makeOrderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `WB-${n}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const total = data.items.reduce((s, i) => s + i.price * i.qty, 0);
  const orderNumber = makeOrderNumber();

  try {
    const [row] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: data.customerName,
        phone: data.phone,
        city: data.city ?? 'À confirmer',
        address: data.address ?? 'À confirmer par WhatsApp',
        postalCode: data.postalCode ?? null,
        products: data.items,
        total,
        source: data.source ?? 'web',
      })
      .returning({ id: orders.id, orderNumber: orders.orderNumber });

    // Fire-and-forget WhatsApp confirmation
    const productNames = data.items.map((i) => i.nameFr).join(', ');
    sendWatiMessage(
      data.phone,
      'order_confirmation',
      [data.customerName, orderNumber, productNames, data.city ?? 'votre ville']
    ).catch(() => {});

    // Fire-and-forget webhook to Google Sheet / n8n / Make (if configured)
    const webhookUrl = process.env.ORDER_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName: data.customerName,
          phone: data.phone,
          city: data.city,
          address: data.address,
          postalCode: data.postalCode ?? '',
          items: data.items,
          total,
          source: data.source ?? 'web',
          createdAt: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, orderNumber: row.orderNumber, id: row.id });
  } catch (e) {
    console.error('[orders] insert failed', e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
