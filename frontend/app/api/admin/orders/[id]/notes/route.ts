import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const note = (body.note || "").toString().slice(0, 500).trim();
  if (!note) return NextResponse.json({ detail: "empty_note" }, { status: 422 });

  const order = await prisma.order.findUnique({ where: { reference: params.id } });
  if (!order) return NextResponse.json({ detail: "not_found" }, { status: 404 });

  await prisma.orderActivity.create({
    data: { orderId: order.id, type: "note_added", message: note, adminUser: session.username },
  });
  return NextResponse.json({ ok: true });
}
