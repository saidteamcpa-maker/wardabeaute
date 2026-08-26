import { products as STATIC_PRODUCTS } from "@/content/products";
import { getCatalog } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalog";

export function unitPriceFor(slug: string, qty: number, catalog: Record<string, CatalogProduct> = STATIC_PRODUCTS as Record<string, CatalogProduct>): number {
  const p = catalog[slug];
  if (!p) return 0;
  return p.offers.find((o) => o.qty === qty)?.price ?? p.price;
}

export async function computeTotal(items: { slug: string; qty: number }[]): Promise<number> {
  const catalog = await getCatalog();
  return items.reduce((sum, i) => sum + unitPriceFor(i.slug, i.qty, catalog), 0);
}

export function generateReference(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand =
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.random().toString(36).slice(2, 4).toUpperCase();
  return `WB-${time}${rand}`;
}

const SOURCE_MAP: [RegExp, string][] = [
  [/facebook/i, "facebook"],
  [/instagram/i, "instagram"],
  [/tiktok/i, "tiktok"],
  [/youtube/i, "youtube"],
  [/snapchat/i, "snapchat"],
  [/google/i, "google"],
];

export function deriveSource(referrer?: string | null, utmSource?: string | null): string {
  if (utmSource && utmSource.trim()) return utmSource.trim().toLowerCase().slice(0, 32);
  if (referrer) {
    for (const [re, name] of SOURCE_MAP) if (re.test(referrer)) return name;
    return "other";
  }
  return "direct";
}

export function parseDevice(ua?: string | null): string {
  if (!ua) return "unknown";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

export function parseBrowser(ua?: string | null): string {
  if (!ua) return "unknown";
  if (/edg/i.test(ua)) return "edge";
  if (/chrome|crios/i.test(ua)) return "chrome";
  if (/firefox|fxios/i.test(ua)) return "firefox";
  if (/safari/i.test(ua)) return "safari";
  return "other";
}

export const CO_COLLAGEN_DISCOUNT = 49;

export function suggestedUpsellSlug(cartSlugs: string[]): string | null {
  const hasV = cartSlugs.includes("velvastretch");
  const hasC = cartSlugs.includes("collaglow");
  if (hasV && hasC) return null;
  if (hasV) return "collaglow";
  if (hasC) return "velvastretch";
  return "collaglow";
}
