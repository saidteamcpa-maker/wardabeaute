import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// WATI sends delivery receipts / replies. We auto-confirm when the customer
// replies "OUI"/"YES" to the confirmation template.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text: string = (body?.text || body?.message || '').toString().toUpperCase();
  const waNumber: string = (body?.waId || body?.phone || '').toString();

  if (text.includes('OUI') || text.includes('YES') || text.includes('CONFIRM')) {
    if (waNumber) {
      const clean = waNumber.replace(/[^0-9]/g, '');
      await db
        .update(orders)
        .set({ status: 'confirmed', confirmedAt: new Date() })
        .where(eq(orders.phone, clean));
      return NextResponse.json({ ok: true, action: 'confirmed' });
    }
  }

  return NextResponse.json({ ok: true, action: 'ignored' });
}
