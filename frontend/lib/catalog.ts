import { products as STATIC_PRODUCTS, type Product as StaticProduct } from "@/content/products";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

export type CatalogOffer = { qty: number; price: number; save?: number };
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
    // Admin uploads live in /uploads/ which is ephemeral on Docker without a mounted volume — fall back to the
    // baked-in static image (which has optimized WebP variants via image-loader) so the storefront never 404s.
    return staticImage;
  }
  return dbImage;
}

export async function getCatalog(): Promise<Record<string, CatalogProduct>> {
  const dbProducts = await prisma.product.findMany();
  const map: Record<string, CatalogProduct> = {};
  for (const slug of Object.keys(STATIC_PRODUCTS)) {
    const base = STATIC_PRODUCTS[slug];
    const db = dbProducts.find((p) => p.slug === slug);
    let offers = base.offers as CatalogOffer[];
    if (db?.offers) {
      try {
        const parsed = JSON.parse(db.offers) as CatalogOffer[];
        if (Array.isArray(parsed) && parsed.length > 0) offers = parsed;
      } catch {
        offers = base.offers as CatalogOffer[];
      }
    }
    map[slug] = {
      ...base,
      price: db ? db.price : base.price,
      oldPrice: db ? (db.oldPrice ?? base.oldPrice) : base.oldPrice,
      image: resolveImage(db?.image ?? null, base.image),
      active: db ? db.active : true,
      stockCount: db?.stockCount ?? base.stockCount ?? null,
      badge: db?.badge ?? base.badge ?? null,
      shortDescription: db?.shortDescription ?? null,
      offers,
      isBundle: db ? db.isBundle : Boolean((base as unknown as Record<string, unknown>).isBundle),
    };
  }
  return map;
}

export function getBundleFromCatalog(catalog: Record<string, CatalogProduct>) {
  const kit = catalog["kit-collagene"];
  const price = kit ? kit.price : 549;
  const oldPrice = kit ? kit.oldPrice ?? 848 : 848;
  const save = Math.max(0, oldPrice - price);
  return { price, oldPrice, save };
}
