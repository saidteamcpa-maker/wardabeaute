import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { WIDTHS } from "../image-loader.js";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const pub = join(root, "public");
const outDir = join(pub, "optimized");
mkdirSync(outDir, { recursive: true });

// source path (relative to /public) -> base name used for output
const sources = [
  ["images/collaglow.png", "collaglow"],
  ["images/velvastretch.png", "velvastretch"],
  ["images/silkstop.png", "silkstop"],
  ["kit-collagene-hero.png", "kit-collagene-hero"],
  ["logo.png", "logo"],
  ["header-logo.png", "header-logo"],
];

const QUALITY = 80;

for (const [rel, base] of sources) {
  const abs = join(pub, rel);
  const widths = WIDTHS[base] || [640, 828, 1200];
  const uniq = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of uniq) {
    const buf = await sharp(abs)
      .resize(Math.round(w))
      .webp({ quality: QUALITY, effort: 4 })
      .toBuffer();
    const out = join(outDir, `${base}.${w}.webp`);
    mkdirSync(join(out, ".."), { recursive: true });
    writeFileSync(out, buf);
    console.log(`${rel} -> ${base}.${w}.webp : ${(buf.length / 1024).toFixed(0)}KB`);
  }
}
console.log("done");
