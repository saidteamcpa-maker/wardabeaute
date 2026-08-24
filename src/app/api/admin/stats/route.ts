import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth';
import { sql, and, gte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  if (!verifyToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const sum = (col: 'total') => sql`COALESCE(SUM(${orders[col]}),0)`;
  const count = sql`COUNT(*)`;

  const period = (start: Date, status?: string) =>
    db
      .select({ revenue: sum('total'), orders: count })
      .from(orders)
      .where(
        status
          ? and(gte(orders.createdAt, start), sql`${orders.status} = ${status}`)
          : gte(orders.createdAt, start)
      );

  const [today] = await period(dayStart);
  const [week] = await period(weekStart);
  const [month] = await period(monthStart);
  const [all] = await db.select({ orders: count, revenue: sum('total') }).from(orders);

  const byStatus = await db
    .select({ status: orders.status, count })
    .from(orders)
    .groupBy(orders.status);

  return NextResponse.json({
    today: { revenue: Number(today?.revenue ?? 0), orders: Number(today?.orders ?? 0) },
    week: { revenue: Number(week?.revenue ?? 0), orders: Number(week?.orders ?? 0) },
    month: { revenue: Number(month?.revenue ?? 0), orders: Number(month?.orders ?? 0) },
    all: { revenue: Number(all?.revenue ?? 0), orders: Number(all?.orders ?? 0) },
    byStatus,
  });
}
