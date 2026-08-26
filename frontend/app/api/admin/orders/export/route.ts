import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");
  const search = req.nextUrl.searchParams.get("search");

  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { reference: { contains: search } },
      { customerName: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "reference", "date", "cliente", "telephone", "ville", "adresse",
    "statut", "paiement", "source", "campagne", "pays", "appareil", "navigateur",
    "total", "remise", "articles", "notes",
  ];

  const rows = orders.map((o) => [
    o.reference,
    o.createdAt.toISOString(),
    o.customerName,
    o.phone,
    o.city,
    o.address ?? "",
    o.status,
    o.paymentStatus,
    o.source ?? "",
    o.utmCampaign ?? "",
    o.country ?? "",
    o.device ?? "",
    o.browser ?? "",
    o.total,
    o.discount,
    o.items.map((i) => `${i.slug} x${i.qty} @${i.unitPrice}`).join(" ; "),
    o.notes ?? "",
  ].map(csvCell).join(","));

  const csv = "﻿" + headers.map(csvCell).join(",") + "\n" + rows.join("\n");
  const filename = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
