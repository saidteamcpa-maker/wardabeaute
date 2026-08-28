"use client";

import { motion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  immediate?: boolean;
}) {
  if (immediate) {
    // Render immediately (no opacity gate) so LCP/above-the-fold content is
    // painted in the initial HTML without waiting for hydration/animation.
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
