import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth';

type Tier = 'Rose' | 'Fleur' | 'Or';

function tierFor(ordersCount: number, spent: number): Tier {
  if (ordersCount >= 5 || spent >= 150000) return 'Or';
  if (ordersCount >= 3 || spent >= 80000) return 'Fleur';
  return 'Rose';
}

export async function GET(req: NextRequest) {
  if (!verifyToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select({
      phone: orders.phone,
      name: sql<string>`MAX(${orders.customerName})`,
      city: sql<string>`MAX(${orders.city})`,
      orders: sql<number>`COUNT(*)`,
      spent: sql<number>`COALESCE(SUM(${orders.total}),0)`,
      last: sql<Date>`MAX(${orders.createdAt})`,
    })
    .from(orders)
    .groupBy(orders.phone);

  const customers = rows.map((r) => ({
    phone: r.phone,
    name: r.name,
    city: r.city,
    orders: Number(r.orders),
    spent: Number(r.spent),
    tier: tierFor(Number(r.orders), Number(r.spent)),
    last: r.last,
  }));

  customers.sort((a, b) => b.spent - a.spent);

  return NextResponse.json({ customers });
}
