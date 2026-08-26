import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getSiteContent, saveSiteContent, type SiteContentData } from "@/lib/store-content";

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const site = await getSiteContent();
  return NextResponse.json({ site });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Partial<SiteContentData>;
  const site = await saveSiteContent(body);
  return NextResponse.json({ site });
}
