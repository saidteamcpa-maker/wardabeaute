import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const search = sp.get("search")?.trim();
  const status = sp.get("status");
  const source = sp.get("source");
  const city = sp.get("city");
  const product = sp.get("product");
  const dateFrom = sp.get("dateFrom");
  const dateTo = sp.get("dateTo");
  const minValue = sp.get("minValue");
  const maxValue = sp.get("maxValue");
  const sort = sp.get("sort") || "newest";
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(sp.get("pageSize") || "20", 10) || 20));

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (source) where.source = source;
  if (city) where.city = { contains: city };
  if (dateFrom || dateTo) {
    const dateFilter: Prisma.DateTimeFilter = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) dateFilter.lte = new Date(dateTo + "T23:59:59.999Z");
    where.createdAt = dateFilter;
  }
  const totalFilter: Prisma.IntFilter = {};
  if (minValue) totalFilter.gte = parseInt(minValue, 10);
  if (maxValue) totalFilter.lte = parseInt(maxValue, 10);
  if (Object.keys(totalFilter).length) where.total = totalFilter;
  if (product) where.items = { some: { slug: product } };
  if (search) {
    where.OR = [
      { reference: { contains: search } },
      { customerName: { contains: search } },
      { phone: { contains: search } },
      { city: { contains: search } },
    ];
  }

  const orderBy: Prisma.OrderOrderByWithRelationInput =
    sort === "oldest"
      ? { createdAt: "asc" }
      : sort === "highest"
        ? { total: "desc" }
        : sort === "lowest"
          ? { total: "asc" }
          : { createdAt: "desc" };

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: true },
    }),
  ]);

  return NextResponse.json({ data: orders, total, page, pageSize });
}
