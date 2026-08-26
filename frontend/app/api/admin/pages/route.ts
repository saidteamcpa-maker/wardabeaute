import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getPagesMeta, createCustomPage } from "@/lib/store-content";

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const pages = await getPagesMeta();
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const title = String(body.title || "").trim();
  if (!slug || !title) {
    return NextResponse.json({ error: "Slug et titre requis" }, { status: 400 });
  }
  if (!/^[a-z0-9-]{2,40}$/.test(slug)) {
    return NextResponse.json({ error: "Slug invalide (lettres, chiffres, tirets)" }, { status: 400 });
  }
  try {
    const page = await createCustomPage(slug, title);
    return NextResponse.json({ page });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur" }, { status: 400 });
  }
}
