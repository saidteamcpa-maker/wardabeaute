import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getCatalog();
  const data = Object.values(catalog).map((p) => ({
    slug: p.slug,
    name: p.name,
    ar_sub: p.arSub,
    price: p.price,
    old_price: p.oldPrice,
    badge: p.badge,
    stars: p.stars,
    reviews: p.reviews,
    active: p.active,
  }));
  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return response;
}
