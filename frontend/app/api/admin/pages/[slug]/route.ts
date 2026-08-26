import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getPage, saveDraft, publishPage, setStatus } from "@/lib/store-content";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const page = await getPage(params.slug);
  return NextResponse.json({ page });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const action = body.action || "draft";
  const data = body.data;
  const seo = body.seo || {};
  const title = body.title;

  if (action === "publish") {
    const page = await publishPage(params.slug, data, seo, title);
    return NextResponse.json({ page, published: true });
  }
  if (action === "status") {
    const page = await setStatus(params.slug, body.status);
    return NextResponse.json({ page });
  }
  const page = await saveDraft(params.slug, data, seo, title);
  return NextResponse.json({ page, published: false });
}
