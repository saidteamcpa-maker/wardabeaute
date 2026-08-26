import { prisma } from "./db";

export interface Pixel {
  id: string;
  pixelId: string;
  type: string;
  label: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PixelsResponse {
  pixels: Pixel[];
  globalEnabled: boolean;
}

export type PixelType = "meta" | "tiktok" | "gtm";

// ---------- Global enable/disable ----------

async function getSitePixels(): Promise<{ enabled: boolean }> {
  const row = await prisma.siteContent.findUnique({ where: { id: 1 } });
  if (!row) return { enabled: true };
  try {
    const parsed = JSON.parse(row.pixels);
    return { enabled: parsed.enabled !== false };
  } catch {
    return { enabled: true };
  }
}

export async function isPixelsEnabled(): Promise<boolean> {
  return (await getSitePixels()).enabled;
}

export async function setGlobalPixelsEnabled(enabled: boolean): Promise<void> {
  const row = await prisma.siteContent.findUnique({ where: { id: 1 } });
  const current = row ? JSON.parse(row.pixels || "{}") : {};
  await prisma.siteContent.upsert({
    where: { id: 1 },
    create: { id: 1, pixels: JSON.stringify({ enabled }) },
    update: { pixels: JSON.stringify({ ...current, enabled }) },
  });
}

// ---------- CRUD ----------

export async function getPixels(): Promise<PixelsResponse> {
  const [pixels, globalEnabled] = await Promise.all([
    prisma.pixel.findMany({ orderBy: { createdAt: "desc" } }),
    isPixelsEnabled(),
  ]);
  return { pixels, globalEnabled };
}

export async function getEnabledPixels(): Promise<Pixel[]> {
  const enabled = await isPixelsEnabled();
  if (!enabled) return [];
  return prisma.pixel.findMany({ where: { enabled: true }, orderBy: { createdAt: "asc" } });
}

export async function createPixel(data: {
  pixelId: string;
  type: PixelType;
  label: string;
}): Promise<Pixel> {
  return prisma.pixel.create({
    data: {
      pixelId: data.pixelId.trim(),
      type: data.type,
      label: data.label.trim() || `${data.type.toUpperCase()} Pixel`,
    },
  });
}

export async function updatePixel(
  id: string,
  data: Partial<{ pixelId: string; label: string; enabled: boolean }>
): Promise<Pixel | null> {
  const update: Record<string, unknown> = {};
  if (data.pixelId !== undefined) update.pixelId = data.pixelId.trim();
  if (data.label !== undefined) update.label = data.label.trim();
  if (data.enabled !== undefined) update.enabled = data.enabled;
  if (Object.keys(update).length === 0) return prisma.pixel.findUnique({ where: { id } });
  return prisma.pixel.update({ where: { id }, data: update });
}

export async function deletePixel(id: string): Promise<void> {
  await prisma.pixel.delete({ where: { id } });
}

// ---------- Env seed (backward compatibility) ----------

export async function seedPixelsFromEnv(): Promise<void> {
  const count = await prisma.pixel.count();
  if (count > 0) return; // already seeded

  const envPixels: { pixelId: string; type: PixelType; label: string }[] = [];
  if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
    envPixels.push({ pixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID, type: "meta", label: "Facebook Pixel" });
  }
  if (process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID) {
    envPixels.push({ pixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID, type: "tiktok", label: "TikTok Pixel" });
  }
  if (process.env.NEXT_PUBLIC_GTM_ID) {
    envPixels.push({ pixelId: process.env.NEXT_PUBLIC_GTM_ID, type: "gtm", label: "Google Tag Manager" });
  }

  for (const p of envPixels) {
    await prisma.pixel.create({ data: p });
  }

  // Also seed the global enabled flag
  const site = await prisma.siteContent.findUnique({ where: { id: 1 } });
  if (!site) {
    const enabled = process.env.NEXT_PUBLIC_PIXELS_ENABLED !== "false";
    await prisma.siteContent.upsert({
      where: { id: 1 },
      create: { id: 1, pixels: JSON.stringify({ enabled }) },
      update: {},
    });
  }
}

// ---------- Client-side pixel helpers ----------

let _pixelsEnabled = true;

/** Called by PixelsConfig to enable/disable all client-side pixel tracking. */
export function setPixelsEnabled(enabled: boolean) {
  _pixelsEnabled = enabled;
}

/**
 * Fire a tracking event to all active client-side pixels (Meta, TikTok, GTM dataLayer).
 * Safe to call from server components (no-ops).
 */
export function track(
  event: string,
  data?: Record<string, unknown>,
  _pixelIds?: string[],
  opts?: { skipPixel?: boolean },
) {
  if (typeof window === "undefined") return;
  if (!_pixelsEnabled) return;
  if (opts?.skipPixel) return;

  // GTM dataLayer
  try {
    const dl = (window as any).dataLayer;
    if (Array.isArray(dl)) {
      dl.push({ event, ...data });
    }
  } catch { /* ignore */ }

  // Meta (Facebook) pixel
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") {
      const safeData = Object.fromEntries(
        Object.entries(data ?? {}).filter(([, v]) => v !== undefined && v !== null)
      );
      fbq("track", event, Object.keys(safeData).length ? safeData : undefined);
    }
  } catch { /* ignore */ }

  // TikTok pixel
  try {
    const win = window as any;
    const ttq = win.ttq;
    if (ttq && typeof ttq.track === "function") {
      ttq.track(event, data);
    }
  } catch { /* ignore */ }
}
