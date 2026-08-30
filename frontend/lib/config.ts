/**
 * lib/config.ts
 * Centralized runtime config for Warda Beauté.
 * - Reads from env with safe fallbacks
 * - Re-exports PRICES / SIZES / WHATSAPP_NUMBER from content/wardaContent for single source of truth
 */

// -----------------------------------------------------------------------------
// Env-backed config (client + server)
// -----------------------------------------------------------------------------
/** WhatsApp number in international format without + (e.g. 2126XXXXXXXX) */
export const WHATSAPP_NUMBER: string =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";

/** Server-only webhooks — never expose via NEXT_PUBLIC */
export const ORDER_WEBHOOK_URL: string = process.env.ORDER_WEBHOOK_URL || "";
export const SHEETS_WEBHOOK_URL: string = process.env.SHEETS_WEBHOOK_URL || "";

/** Optional: site URL for absolute links / OG tags */
export const SITE_URL: string = process.env.NEXT_PUBLIC_SITE_URL || "https://wardabeaute.com";

/** Optional: API URL for backend */
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || "";

// -----------------------------------------------------------------------------
// Re-exports from canonical content source — keep editable vars in one place
// -----------------------------------------------------------------------------
export { PRICES, SIZES, DURATIONS, SAVINGS, WHATSAPP_NUMBER as WHATSAPP_NUMBER_CONTENT, TRUST_LINE, TRUST_SHORT } from "@/content/wardaContent";

// Also re-export helpers
export { formatPriceMAD, formatPriceMADAr } from "@/content/wardaContent";

// -----------------------------------------------------------------------------
// Placeholder images — replace with real assets in /public/images/
// -----------------------------------------------------------------------------
export const PLACEHOLDER_IMAGES = {
  velvastretch: {
    hero: "/images/velvastretch.png",
    flatlay: "/images/placeholder-velvastretch-flatlay.jpg",
    packshot: "/images/placeholder-velvastretch-packshot.jpg",
    texture: "/images/placeholder-velvastretch-texture.jpg",
    lifestyle: "/images/placeholder-velvastretch-lifestyle.jpg",
  },
  silkstop: {
    hero: "/images/silkstop.png",
    flatlay: "/images/placeholder-silkstop-flatlay.jpg",
    packshot: "/images/placeholder-silkstop-packshot.jpg",
    texture: "/images/placeholder-silkstop-texture.jpg",
    lifestyle: "/images/placeholder-silkstop-lifestyle.jpg",
  },
  collaglow: {
    hero: "/images/collaglow.png",
    flatlay: "/images/placeholder-collaglow-flatlay.jpg",
    packshot: "/images/placeholder-collaglow-packshot.jpg",
    texture: "/images/placeholder-collaglow-texture.jpg",
    lifestyle: "/images/placeholder-collaglow-lifestyle.jpg",
  },
  kit: {
    hero: "/kit-collagene-hero.png",
    flatlay: "/images/placeholder-kit-flatlay.jpg",
    packshot: "/images/placeholder-kit-packshot.jpg",
    duo: "/images/placeholder-kit-duo.jpg",
  },
  fallback: "/images/placeholder-fallback.jpg",
} as const;

export type PlaceholderKey = keyof typeof PLACEHOLDER_IMAGES;
