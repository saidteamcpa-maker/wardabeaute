import { prisma } from "./db";

export interface PixelConfig {
  metaPixelId: string;
  tiktokPixelId: string;
  gtmId: string;
  enabled: boolean;
}

const EMPTY: PixelConfig = {
  metaPixelId: "",
  tiktokPixelId: "",
  gtmId: "",
  enabled: true,
};

async function seedFromEnv(): Promise<PixelConfig> {
  const seeded: PixelConfig = {
    metaPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
    enabled: process.env.NEXT_PUBLIC_PIXELS_ENABLED !== "false",
  };
  try {
    await prisma.pixelConfig.create({ data: { id: 1, ...seeded } });
  } catch {
    // already created by a concurrent request
  }
  return seeded;
}

export async function getPixelConfig(): Promise<PixelConfig> {
  const row = await prisma.pixelConfig.findUnique({ where: { id: 1 } });
  if (row) {
    return {
      metaPixelId: row.metaPixelId,
      tiktokPixelId: row.tiktokPixelId,
      gtmId: row.gtmId,
      enabled: row.enabled,
    };
  }
  return seedFromEnv();
}

export async function savePixelConfig(input: Partial<PixelConfig>): Promise<PixelConfig> {
  const data = {
    metaPixelId: input.metaPixelId ?? "",
    tiktokPixelId: input.tiktokPixelId ?? "",
    gtmId: input.gtmId ?? "",
    enabled: input.enabled ?? true,
  };
  await prisma.pixelConfig.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  return getPixelConfig();
}
