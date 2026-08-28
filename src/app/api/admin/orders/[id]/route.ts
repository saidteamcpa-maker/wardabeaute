import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth';
import { sendWatiMessage } from '@/lib/wati';

const VALID = ['new','pending','pending_confirmation','confirmed','preparing','shipped','out_for_delivery','delivered','paid','canceled','cancelled','returned'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const status = body.status as string;
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const update: Record<string, unknown> = { status: status as any };
  if (status === 'confirmed') update.confirmedAt = new Date();

  const [row] = await db
    .update(orders)
    .set(update)
    .where(eq(orders.orderNumber, params.id))
    .returning({ orderNumber: orders.orderNumber, phone: orders.phone, customerName: orders.customerName });

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // WhatsApp lifecycle sequence (configure these templates in WATI).
  if (status === 'confirmed') {
    sendWatiMessage(row.phone, 'order_confirmed', [row.customerName, row.orderNumber]).catch(() => {});
  } else if (status === 'shipped') {
    sendWatiMessage(row.phone, 'order_shipped', [row.customerName, row.orderNumber]).catch(() => {});
  } else if (status === 'delivered') {
    sendWatiMessage(row.phone, 'order_delivered', [row.customerName]).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
