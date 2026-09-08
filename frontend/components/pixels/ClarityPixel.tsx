"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type ClarityWindow = Window & {
  clarity?: {
    (method: string, ...args: unknown[]): void;
    q?: unknown[];
  };
};

export function ClarityPixel({
  projectId,
  enabled = true,
}: {
  projectId?: string;
  enabled?: boolean;
}) {
  const finalId = projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const pathname = usePathname();

  // Initial load — client-side only, respects global kill-switch
  useEffect(() => {
    if (!enabled || !finalId || typeof window === "undefined") return;
    // Avoid double-init if already loaded (e.g. Fast Refresh)
    const w = window as ClarityWindow;
    if (w.clarity && (w.clarity as unknown as { _clId?: string })["_clId"] === finalId) return;

    (async () => {
      try {
        const Clarity = (await import("@microsoft/clarity")).default;
        Clarity.init(finalId);
        // Store for dedupe check
        (window as unknown as Record<string, unknown>)["_clId"] = finalId;
      } catch {
        // Fail gracefully — never break the storefront
      }
    })();
  }, [finalId, enabled]);

  // SPA navigation — Clarity auto-tracks, but fire an explicit page_view for heatmap segmentation
  useEffect(() => {
    if (!enabled || !finalId || typeof window === "undefined") return;
    const w = window as ClarityWindow;
    // Only fire after init
    if (!w.clarity) return;
    try {
      // Use the clarity event API if available, otherwise no-op
      const Clarity = w.clarity;
      // Clarity treats event names case-insensitively; keep snake_case for consistency with requested names
      // This is a lightweight page_view signal for navigation between App Router routes
      if (typeof Clarity === "function") {
        // dynamic import path already initialized; use global
        (Clarity as unknown as (m: string, ...a: unknown[]) => void)("event", "page_view");
      }
    } catch {
      // never break navigation
    }
  }, [pathname, finalId, enabled]);

  return null;
}
