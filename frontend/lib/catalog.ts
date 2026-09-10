import { products as STATIC_PRODUCTS, type Product as StaticProduct } from "@/content/products";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

export type CatalogOffer = { qty: number; price: number; save?: number; sku?: string };
export type CatalogProduct = Omit<StaticProduct, "oldPrice"> & {
  oldPrice: number;
  active: boolean;
  stockCount: number | null;
  badge: string | null;
  shortDescription: string | null;
  offers: CatalogOffer[];
  isBundle: boolean;
};

function resolveImage(dbImage: string | null, staticImage: string): string {
  if (!dbImage) return staticImage;
  if (dbImage.startsWith("http")) return dbImage;
  if (dbImage.startsWith("/")) {
    const disk = path.join(process.cwd(), "public", dbImage);
    if (fs.existsSync(disk)) return dbImage;
    return staticImage;
  }
  return dbImage;
}

// In-memory cache: revalidate every 60s so storefront pages don't hit DB on every request.
// Cart/checkout/orders remain dynamic and bypass this cache.
let _cache: { data: Record<string, CatalogProduct>; ts: number } | null = null;
const CACHE_TTL_MS = 60_000;

export async function getCatalog(): Promise<Record<string, CatalogProduct>> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL_MS) return _cache.data;

  let dbProducts: { slug: string; image: string | null; active: boolean; stockCount: number | null; badge: string | null; shortDescription: string | null; isBundle: boolean }[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      select: { slug: true, image: true, active: true, stockCount: true, badge: true, shortDescription: true, isBundle: true },
    });
  } catch {
    // DB unavailable (e.g. at build time in Docker) — use static data only
  }
  const map: Record<string, CatalogProduct> = {};
  for (const slug of Object.keys(STATIC_PRODUCTS)) {
    const base = STATIC_PRODUCTS[slug];
    const db = dbProducts.find((p) => p.slug === slug);
    const offers = base.offers as CatalogOffer[];
    map[slug] = {
      ...base,
      price: base.price,
      oldPrice: base.oldPrice,
      image: resolveImage(db?.image ?? null, base.image),
      active: db ? db.active : true,
      stockCount: db?.stockCount ?? base.stockCount ?? null,
      badge: db?.badge ?? base.badge ?? null,
      shortDescription: db?.shortDescription ?? null,
      offers,
      isBundle: db ? db.isBundle : Boolean((base as unknown as Record<string, unknown>).isBundle),
    };
  }
  _cache = { data: map, ts: Date.now() };
  return map;
}

export function getBundleFromCatalog(catalog: Record<string, CatalogProduct>) {
  const kit = catalog["kit-collagene"];
  const price = kit ? kit.price : 329;
  const oldPrice = kit ? kit.oldPrice ?? 848 : 848;
  const save = Math.max(0, oldPrice - price);
  return { price, oldPrice, save };
}
