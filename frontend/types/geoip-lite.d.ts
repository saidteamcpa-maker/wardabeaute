declare module "geoip-lite" {
  export function lookup(ip: string): { country?: string; city?: string; [key: string]: unknown } | null;
}
