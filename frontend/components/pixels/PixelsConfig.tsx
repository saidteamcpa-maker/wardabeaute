"use client";

import { useEffect } from "react";
import { setPixelsEnabled } from "@/lib/pixels";

export function PixelsConfig({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    setPixelsEnabled(enabled);
  }, [enabled]);
  return null;
}
