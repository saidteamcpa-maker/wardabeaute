"use client";

import { useEffect, useState } from "react";
import type { SiteContentData } from "@/lib/page-schema";

let cache: SiteContentData | null = null;
let inflight: Promise<SiteContentData> | null = null;

async function load(): Promise<SiteContentData> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = fetch("/api/content/site")
    .then((r) => (r.ok ? r.json() : { site: { header: {}, footer: {}, announcement: {} } }))
    .then((d) => {
      cache = d.site as SiteContentData;
      return cache!;
    })
    .catch(() => ({ header: {}, footer: {}, announcement: {} }) as SiteContentData);
  return inflight;
}

export function useSiteContent() {
  const [site, setSite] = useState<SiteContentData | null>(cache);
  useEffect(() => {
    let active = true;
    load().then((s) => active && setSite(s));
    return () => {
      active = false;
    };
  }, []);
  return site;
}

export function navOverride(
  site: SiteContentData | null,
  key: string,
  lang: "fr" | "ar"
): string | null {
  const v = site?.header?.nav?.[key];
  if (!v) return null;
  const val = v[lang];
  return val && val.trim().length ? val : null;
}

export function announcementOverride(
  site: SiteContentData | null,
  lang: "fr" | "ar"
): string | null {
  const v = site?.announcement?.text?.[lang];
  return v && v.trim().length ? v : null;
}
