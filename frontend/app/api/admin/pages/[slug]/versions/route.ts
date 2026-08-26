import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getPage, restoreVersion } from "@/lib/store-content";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const page = await getPage(params.slug);
  return NextResponse.json({ versions: page.versions });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    const page = await restoreVersion(params.slug, body.versionId);
    return NextResponse.json({ page });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur" }, { status: 400 });
  }
}
