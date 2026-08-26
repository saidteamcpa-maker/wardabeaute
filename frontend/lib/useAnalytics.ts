"use client";

import { useEffect, useState } from "react";

export interface AnalyticsData {
  overview: any;
  series: any[];
  sources: any[];
  devices: any[];
  products: any[];
  funnel: any;
  audience: any;
  campaigns: any[];
}

export function useAnalytics(range: string) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?range=${range}`, { headers: { "Content-Type": "application/json" } })
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  return { data, loading };
}

export const RANGES = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "all", label: "All" },
];
