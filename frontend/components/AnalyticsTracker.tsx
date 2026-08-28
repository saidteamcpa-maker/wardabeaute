"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/pixels";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    // The pixels fire their own PageView on init; skip the pixel portion on the
    // first run to avoid a double count, but still record first-party + GTM.
    track("PageView", { page: pathname }, undefined, { skipPixel: first.current });
    first.current = false;
  }, [pathname]);
  return null;
}
