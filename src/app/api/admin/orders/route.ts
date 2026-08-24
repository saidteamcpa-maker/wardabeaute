import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { desc, eq, like, or, and, sql } from 'drizzle-orm';
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!verifyToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const conditions = [];
  if (status && status !== 'all') conditions.push(eq(orders.status, status as any));
  if (search) {
    conditions.push(
      or(
        like(orders.customerName, `%${search}%`),
        like(orders.phone, `%${search}%`),
        like(orders.orderNumber, `%${search}%`)
      )!
    );
  }

  const rows = await db
    .select()
    .from(orders)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return NextResponse.json({ orders: rows });
}
