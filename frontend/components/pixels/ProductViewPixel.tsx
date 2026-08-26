"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixels";

export function ProductViewPixel({ slug, value }: { slug: string; value: number }) {
  useEffect(() => {
    track("ViewContent", {
      content_ids: [slug],
      content_type: "product",
      value,
      currency: "MAD",
    });
  }, [slug, value]);
  return null;
}
