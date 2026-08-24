import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Public: expose stock + price for a SKU (used by the on-page urgency counter).
export async function GET(
  _req: NextRequest,
  { params }: { params: { sku: string } }
) {
  const rows = await db
    .select({ sku: products.sku, stock: products.stock, price: products.price })
    .from(products)
    .where(eq(products.sku, params.sku))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ sku: params.sku, stock: 50, price: null });
  }
  return NextResponse.json(rows[0]);
}
