import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getPixelConfig, savePixelConfig } from "@/lib/pixel-config";

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getPixelConfig());
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const updated = await savePixelConfig({
    metaPixelId: typeof body.metaPixelId === "string" ? body.metaPixelId.trim() : undefined,
    tiktokPixelId: typeof body.tiktokPixelId === "string" ? body.tiktokPixelId.trim() : undefined,
    gtmId: typeof body.gtmId === "string" ? body.gtmId.trim() : undefined,
    enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
  });
  return NextResponse.json(updated);
}
