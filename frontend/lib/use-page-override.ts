"use client";

import { useEffect, useState } from "react";

type LangContent = Record<string, string>;
type PageOverride = { fr: LangContent; ar: LangContent };

const cache: Record<string, PageOverride> = {};

export function usePageOverride(slug: string): PageOverride | null {
  const [data, setData] = useState<PageOverride | null>(cache[slug] || null);
  useEffect(() => {
    let active = true;
    if (cache[slug]) {
      setData(cache[slug]);
      return;
    }
    fetch(`/api/content/page?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : { fr: {}, ar: {} }))
      .then((d: PageOverride) => {
        cache[slug] = d;
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setData({ fr: {}, ar: {} });
      });
    return () => {
      active = false;
    };
  }, [slug]);
  return data;
}
