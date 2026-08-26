import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { reference: params.id },
    include: { items: true, activities: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) return NextResponse.json({ detail: "not_found" }, { status: 404 });
  return NextResponse.json(order);
}

const VALID_STATUSES = [
  "new",
  "pending_confirmation",
  "confirmed",
  "preparing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const existing = await prisma.order.findUnique({ where: { reference: params.id } });
  if (!existing) return NextResponse.json({ detail: "not_found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof body.status === "string" && VALID_STATUSES.includes(body.status)) data.status = body.status;
  if (typeof body.paymentStatus === "string") data.paymentStatus = body.paymentStatus;
  if (typeof body.confirmationStatus === "string") data.confirmationStatus = body.confirmationStatus;
  if (typeof body.deliveryStatus === "string") data.deliveryStatus = body.deliveryStatus;
  if (typeof body.city === "string") data.city = body.city.slice(0, 80);
  if (body.address !== undefined) data.address = body.address ? String(body.address).slice(0, 300) : null;
  if (body.notes !== undefined) data.notes = body.notes ? String(body.notes).slice(0, 500) : null;

  // Derive linked statuses from the main status for convenience.
  if (data.status === "confirmed") data.confirmationStatus = "confirmed";
  if (data.status === "cancelled") {
    data.confirmationStatus = "cancelled";
    data.paymentStatus = "unpaid";
  }
  if (data.status === "delivered") {
    data.deliveryStatus = "delivered";
    data.paymentStatus = "paid";
  }
  if (data.status === "returned") {
    data.deliveryStatus = "returned";
    data.paymentStatus = "refunded";
  }
  if (data.status === "shipped") data.deliveryStatus = "shipped";
  if (data.status === "out_for_delivery") data.deliveryStatus = "out_for_delivery";
  if (data.status === "preparing") data.deliveryStatus = "preparing";

  const activities: { type: string; message: string; adminUser: string }[] = [];
  if (data.status && data.status !== existing.status) {
    activities.push({
      type: "status_change",
      message: `Statut: ${existing.status} → ${data.status}`,
      adminUser: session.username,
    });
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: existing.id }, data }),
    ...activities.map((a) => prisma.orderActivity.create({ data: { orderId: existing.id, ...a } })),
  ]);

  const refreshed = await prisma.order.findUnique({
    where: { id: existing.id },
    include: { items: true, activities: { orderBy: { createdAt: "desc" } } },
  });
  return NextResponse.json(refreshed);
}
