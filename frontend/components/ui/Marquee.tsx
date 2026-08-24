"use client";

// Infinite horizontal marquee. Renders children twice for seamless loop.
export function Marquee({
  children,
  speed = 40,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <div
        className="flex w-max gap-4 animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex gap-4">{children}</div>
        <div className="flex gap-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
