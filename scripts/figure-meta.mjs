// Generates the figure metadata and the project row thumbnails.
//
//   src/generated/figures.json
//     { "/projects/<slug>/images/<name>.webp": { w, h, lum, plate } }
//       w, h   displayed pixel size (EXIF orientation applied), so every <img> gets width and height: no layout shift
//       lum    mean luminance 0-255 (Rec. 709 weights on sRGB values, transparency flattened onto white)
//       plate  'light' when lum >= 200, else 'none'. A figure directive's plate= overrides it at render time.
//   public/projects/<slug>/thumb.webp
//     192 x 144 cover crops for the E-100 schedule rows (drawn at 64 x 48, so 3x for dense screens)
//
// Both outputs are committed. Run after adding or replacing an image:
//   node scripts/figure-meta.mjs [--out path] [--table]
import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(root, 'public');
const EXT = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const LIGHT_THRESHOLD = 200;
const THUMB = { width: 192, height: 144 };
const THUMBS = [
  { slug: 'apple-classifier', from: 'working-setup' },
  { slug: 'ppg-monitor', from: 'scope-ppg-processed' },
];
const outIndex = process.argv.indexOf('--out');
const OUT = outIndex > -1 ? process.argv[outIndex + 1] : join(root, 'src', 'generated', 'figures.json');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function measure(file) {
  const { data, info } = await sharp(file)
    .rotate()
    .flatten({ background: '#ffffff' })
    .toColourspace('srgb')
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const sums = [0, 0, 0];
  for (let i = 0; i < data.length; i += 3) {
    sums[0] += data[i];
    sums[1] += data[i + 1];
    sums[2] += data[i + 2];
  }
  const px = info.width * info.height;
  const [r, g, b] = sums.map((s) => s / px);
  return { w: info.width, h: info.height, lum: Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b) };
}

const figures = {};
for await (const file of walk(join(PUBLIC, 'projects'))) {
  const key = '/' + relative(PUBLIC, file).split(sep).join('/');
  if (!EXT.has(extname(file).toLowerCase()) || !key.includes('/images/')) continue;
  const { w, h, lum } = await measure(file);
  figures[key] = { w, h, lum, plate: lum >= LIGHT_THRESHOLD ? 'light' : 'none' };
}

const sorted = Object.fromEntries(Object.entries(figures).sort(([a], [b]) => a.localeCompare(b)));
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(sorted, null, 2) + '\n');
console.log(`figure-meta: ${Object.keys(sorted).length} figures -> ${relative(root, OUT)}`);

for (const { slug, from } of THUMBS) {
  const src = join(PUBLIC, 'projects', slug, 'images', `${from}.webp`);
  const dest = join(PUBLIC, 'projects', slug, 'thumb.webp');
  await sharp(src).rotate().resize(THUMB.width, THUMB.height, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(dest);
  console.log(`figure-meta: ${slug}/thumb.webp (${THUMB.width} x ${THUMB.height}) from ${from}`);
}

if (process.argv.includes('--table')) {
  for (const [k, v] of Object.entries(sorted).sort(([, a], [, b]) => b.lum - a.lum)) {
    console.log(String(v.lum).padStart(3), v.plate.padEnd(5), `${v.w}x${v.h}`.padEnd(10), k.replace('/projects/', ''));
  }
}
