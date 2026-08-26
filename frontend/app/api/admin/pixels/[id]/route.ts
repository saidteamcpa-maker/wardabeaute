import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { updatePixel, deletePixel } from "@/lib/pixels";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof body.pixelId === "string") data.pixelId = body.pixelId;
  if (typeof body.label === "string") data.label = body.label;
  if (typeof body.enabled === "boolean") data.enabled = body.enabled;

  const pixel = await updatePixel(params.id, data);
  if (!pixel) return NextResponse.json({ detail: "not_found" }, { status: 404 });
  return NextResponse.json(pixel);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  try {
    await deletePixel(params.id);
  } catch {
    return NextResponse.json({ detail: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
