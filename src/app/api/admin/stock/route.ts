import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, ADMIN_COOKIE } from '@/lib/auth';
import { CATALOG, BUNDLE } from '@/lib/data/catalog';

export async function PATCH(req: NextRequest) {
  if (!verifyToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { sku, stock } = await req.json();
  if (typeof stock !== 'number') {
    return NextResponse.json({ error: 'invalid stock' }, { status: 400 });
  }

  const all = [...CATALOG, BUNDLE];
  const cat = all.find((p) => p.sku === sku);
  if (!cat) return NextResponse.json({ error: 'unknown sku' }, { status: 404 });

  await db
    .insert(products)
    .values({
      sku: cat.sku,
      nameFr: cat.nameFr,
      nameAr: cat.nameAr,
      slug: cat.slug,
      price: cat.price,
      originalPrice: cat.originalPrice,
      stock,
      badge: cat.badge,
    })
    .onConflictDoUpdate({ target: products.sku, set: { stock } });

  return NextResponse.json({ ok: true });
}
