import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });
  await prisma.product.deleteMany({ where: { slug: params.slug } });
  return NextResponse.json({ ok: true });
}
