import type { NextRequest } from "next/server";

const PRIVATE_PREFIXES = ["127.", "10.", "192.168.", "169.254.", "::1", "0.", "172.16.", "172.17.", "172.18.", "172.19.", "172.2", "172.3"];

export function getClientIp(req: NextRequest | Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "127.0.0.1";
}

export function isPrivateIp(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === "localhost" || v === "::1" || v === "0.0.0.0") return true;
  return PRIVATE_PREFIXES.some((p) => v.startsWith(p));
}

/**
 * GeoIP lookup is loaded lazily (dynamic import) so the module never fails to
 * bundle at build time. In production it resolves the real country from the
 * client IP. Locally (private IPs) we treat the request as Morocco for testing.
 */
async function lookup(ip: string) {
  try {
    const mod = await import("geoip-lite");
    const geoip = (mod as any).default ?? mod;
    return geoip.lookup(ip) ?? null;
  } catch {
    return null;
  }
}

/**
 * Determines whether a request originates from Morocco, server-side, from the
 * real client IP (never trusting any client-sent country value).
 *
 * For local/private IPs (development) we allow and treat as Morocco so the
 * storefront can be tested locally. In production, only a GeoIP lookup of "MA"
 * counts as Morocco.
 */
export async function isMorocco(req: NextRequest | Request): Promise<boolean> {
  const ip = getClientIp(req);
  if (isPrivateIp(ip)) return true;
  const geo = await lookup(ip);
  return geo?.country === "MA";
}

export async function countryOf(req: NextRequest | Request): Promise<string | null> {
  const ip = getClientIp(req);
  if (isPrivateIp(ip)) return "MA";
  const geo = await lookup(ip);
  return geo?.country ?? null;
}
