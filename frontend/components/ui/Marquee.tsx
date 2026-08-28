"use client";

import React, { useEffect, useRef } from "react";

// Infinite horizontal marquee driven by requestAnimationFrame (works in every
// browser regardless of RTL / flex `max-content` quirks). Renders children twice
// for a seamless loop.
export function Marquee({
  children,
  speed = 38,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const copyWidth = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!track || !copy) return;

    // Measure with ResizeObserver so we never force a synchronous layout
    // (avoids the read/write layout thrash flagged by Lighthouse).
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        copyWidth.current = entry.contentRect.width || copy.offsetWidth || 0;
      }
    });
    ro.observe(copy);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      const w = copyWidth.current;
      if (w > 0) {
        offset.current -= (w / (speed * 1000)) * dt;
        if (offset.current <= -w) offset.current += w;
        track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [speed, children]);

  return (
    <div className={`flex overflow-hidden ${className || ""}`}>
      <div
        ref={trackRef}
        className="flex shrink-0"
        dir="ltr"
        style={{ willChange: "transform" }}
      >
        <div ref={copyRef} className="flex gap-4 shrink-0">
          {children}
        </div>
        <div className="flex gap-4 shrink-0 pl-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
