import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { setGlobalPixelsEnabled, isPixelsEnabled } from "@/lib/pixels";

export async function PATCH(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (typeof body.enabled !== "boolean") {
    return NextResponse.json({ detail: "enabled_required" }, { status: 422 });
  }

  await setGlobalPixelsEnabled(body.enabled);
  return NextResponse.json({ enabled: body.enabled });
}

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });
  return NextResponse.json({ enabled: await isPixelsEnabled() });
}
