import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

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
  return NextResponse.json(data);
}
