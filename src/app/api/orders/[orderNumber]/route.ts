import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  const phone = req.nextUrl.searchParams.get('phone')?.replace(/[^0-9]/g, '');
  if (!phone) {
    return NextResponse.json({ error: 'phone required' }, { status: 400 });
  }

  const rows = await db
    .select({
      orderNumber: orders.orderNumber,
      status: orders.status,
      createdAt: orders.createdAt,
      total: orders.total,
      city: orders.city,
      products: orders.products,
    })
    .from(orders)
    .where(and(eq(orders.orderNumber, params.orderNumber), eq(orders.phone, phone)));

  if (rows.length === 0) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({ found: true, order: rows[0] });
}
