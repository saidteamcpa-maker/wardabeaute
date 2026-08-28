"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/pixels";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    // Defer to idle time so analytics work never competes with the critical
    // rendering path / LCP. The pixels fire their own PageView on init; skip
    // the pixel portion on the first run to avoid a double count, but still
    // record first-party + GTM.
    const run = () => {
      track("PageView", { page: pathname }, undefined, { skipPixel: first.current });
      first.current = false;
    };
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(run, { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    run();
  }, [pathname]);
  return null;
}
