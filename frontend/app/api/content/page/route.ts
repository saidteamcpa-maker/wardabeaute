import { NextResponse } from "next/server";
import { getPageOverride } from "@/lib/store-content";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug requis" }, { status: 400 });
  const fr = (await getPageOverride(slug, "fr", false)) || {};
  const ar = (await getPageOverride(slug, "ar", false)) || {};
  return NextResponse.json({ fr, ar });
}
