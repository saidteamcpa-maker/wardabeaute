"use client";

import { useMemo } from "react";

// Subtle brand "petals" floating in the background. emojis kept low-opacity + on-palette.
const PETALS = ["🌸", "🌹", "🌿", "✿"];

// Deterministic pseudo-random so SSR and client renders match (no hydration mismatch).
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function FloatingPetals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: rand(i * 1 + 1) * 100,
        size: 14 + rand(i * 2 + 2) * 26,
        delay: rand(i * 3 + 3) * 8,
        dur: 10 + rand(i * 4 + 4) * 12,
        emoji: PETALS[i % PETALS.length],
        opacity: 0.06 + rand(i * 5 + 5) * 0.1,
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
