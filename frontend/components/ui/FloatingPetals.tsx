"use client";

import { useMemo } from "react";

// Subtle brand "petals" floating in the background. emojis kept low-opacity + on-palette.
const PETALS = ["🌸", "🌹", "🌿", "✿"];

export function FloatingPetals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 26,
        delay: Math.random() * 8,
        dur: 10 + Math.random() * 12,
        emoji: PETALS[i % PETALS.length],
        opacity: 0.06 + Math.random() * 0.1,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-10%] animate-float"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
