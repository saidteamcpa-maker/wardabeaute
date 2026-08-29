const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const OPTIMIZED_DIR = path.join(__dirname, 'public', 'optimized');
const WIDTHS = [640, 828, 1200, 1254];

const products = [
  { name: 'silkstop', input: 'silkstop.jpeg' },
  { name: 'collaglow', input: 'collaglow.jpeg' },
];

(async () => {
  for (const p of products) {
    const inputPath = path.join(IMAGES_DIR, p.input);
    if (!fs.existsSync(inputPath)) {
      console.log(`SKIP: ${p.input} not found`);
      continue;
    }
    console.log(`Converting ${p.input}...`);
    const meta = await sharp(inputPath).metadata();
    console.log(`  ${meta.width}x${meta.height} ${meta.format}`);

    for (const w of WIDTHS) {
      const out = path.join(OPTIMIZED_DIR, `${p.name}.${w}.webp`);
      await sharp(inputPath)
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: 100, lossless: true })
        .toFile(out);
      const size = fs.statSync(out).size;
      console.log(`  -> ${p.name}.${w}.webp (${(size / 1024).toFixed(0)} KB)`);
    }
  }
  console.log('Done!');
})();
