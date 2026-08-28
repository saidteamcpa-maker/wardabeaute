// Custom Next.js image loader: serves pre-generated static WebP variants from
// /public/optimized so images are delivered instantly with zero runtime encoding.
// Original assets in /public remain untouched. Unknown/remote sources fall back
// to being served as-is (static), so nothing breaks.

const MAP = {
  "/images/collaglow.png": "collaglow",
  "/images/velvastretch.png": "velvastretch",
  "/images/silkstop.png": "silkstop",
  "/kit-collagene-hero.png": "kit-collagene-hero",
  "/logo.png": "logo",
  "/header-logo.png": "header-logo",
};

export const WIDTHS = {
  collaglow: [640, 828, 1200, 1254],
  velvastretch: [640, 828, 1200, 1254],
  silkstop: [640, 828, 1200, 1254],
  "kit-collagene-hero": [640, 828, 1200, 1792],
  logo: [640, 828, 1024],
  "header-logo": [64, 128],
};

export default function wardaLoader({ src, width }) {
  const base = MAP[src];
  if (!base) return src; // unknown/remote -> serve original statically
  const set = WIDTHS[base];
  const chosen = set.filter((w) => w <= width).pop() ?? set[0];
  return `/optimized/${base}.${chosen}.webp`;
}
