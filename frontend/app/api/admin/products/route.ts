import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { products as STATIC_PRODUCTS } from "@/content/products";

function requireAuth() {
  return getAdminSessionFromCookies();
}

export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });
  const db = await prisma.product.findMany();
  const bySlug = new Map(db.map((p) => [p.slug, p]));
  const list = Object.keys(STATIC_PRODUCTS).map((slug) => {
    const dbp = bySlug.get(slug);
    if (dbp) return { ...dbp, managed: true };
    const s = STATIC_PRODUCTS[slug];
    return {
      slug,
      name: s.name,
      sku: null,
      price: s.price,
      oldPrice: s.oldPrice,
      image: s.image,
      active: true,
      stockCount: (s as unknown as Record<string, unknown>).stockCount ?? null,
      badge: (s as unknown as Record<string, unknown>).badge ?? null,
      shortDescription: null,
      offers: JSON.stringify(s.offers),
      isBundle: Boolean((s as unknown as Record<string, unknown>).isBundle),
      managed: false,
    };
  });
  return NextResponse.json(list);
}

interface ProductBody {
  slug: string;
  name: string;
  price: number;
  sku?: string | null;
  oldPrice?: number | null;
  image?: string | null;
  active?: boolean;
  stockCount?: number | null;
  badge?: string | null;
  shortDescription?: string | null;
  offers?: unknown;
  isBundle?: boolean;
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ detail: "unauthorized" }, { status: 401 });

  let body: ProductBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "invalid_json" }, { status: 400 });
  }

  const slug = (body.slug || "").trim();
  const name = (body.name || "").trim();
  if (!slug || !name) return NextResponse.json({ detail: "slug_and_name_required" }, { status: 422 });
  if (!Number.isFinite(body.price) || body.price < 0) return NextResponse.json({ detail: "invalid_price" }, { status: 422 });

  let offers: unknown = undefined;
  if (body.offers !== undefined) {
    if (typeof body.offers === "string") {
      try {
        offers = JSON.parse(body.offers);
      } catch {
        return NextResponse.json({ detail: "invalid_offers_json" }, { status: 422 });
      }
    } else {
      offers = body.offers;
    }
  }

  const data: Record<string, unknown> = {
    slug,
    name,
    price: Math.round(body.price),
    sku: body.sku ? body.sku.trim() : null,
    oldPrice: body.oldPrice != null ? Math.round(body.oldPrice as number) : null,
    image: body.image || null,
    active: body.active ?? true,
    stockCount: body.stockCount != null ? Math.round(body.stockCount as number) : null,
    badge: body.badge || null,
    shortDescription: body.shortDescription || null,
    isBundle: body.isBundle ?? false,
  };
  if (offers !== undefined) data.offers = JSON.stringify(offers);

  try {
    const product = await prisma.product.upsert({
      where: { slug },
      update: data,
      create: data as any,
    });
    return NextResponse.json(product);
  } catch (e: any) {
    if (e?.code === "P2002" && String(e?.meta?.target ?? "").includes("sku")) {
      return NextResponse.json({ detail: "sku_not_unique" }, { status: 422 });
    }
    throw e;
  }
}
