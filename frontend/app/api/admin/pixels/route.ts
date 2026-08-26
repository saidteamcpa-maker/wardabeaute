import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getPixels, createPixel, type PixelType } from "@/lib/pixels";

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getPixels());
}

const VALID_TYPES: PixelType[] = ["meta", "tiktok", "gtm"];

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const pixelId = typeof body.pixelId === "string" ? body.pixelId.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const label = typeof body.label === "string" ? body.label.trim() : "";

  if (!pixelId) return NextResponse.json({ detail: "pixelId_required" }, { status: 422 });
  if (!VALID_TYPES.includes(type as PixelType)) {
    return NextResponse.json({ detail: "invalid_type" }, { status: 422 });
  }

  const pixel = await createPixel({ pixelId, type: type as PixelType, label });
  return NextResponse.json(pixel, { status: 201 });
}
