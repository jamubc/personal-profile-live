// Generates src/generated/figures.json: intrinsic size, mean luminance and a
// tiny placeholder for every raster under public/projects.
//
//   w, h   intrinsic pixels, so <img> gets width/height and aspect-ratio (no layout shift)
//   lum    mean luminance 0-255; bright images (schematics, screenshots) render on a light plate
//   lqip   ~16px wide WebP data URI shown behind the lazy image
//
// Run: node scripts/figure-meta.mjs [--out path]
import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(root, 'public');
const SCAN = ['projects'];
const EXT = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const outIndex = process.argv.indexOf('--out');
const OUT = outIndex > -1 ? process.argv[outIndex + 1] : join(root, 'src', 'generated', 'figures.json');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const figures = {};
for (const dir of SCAN) {
  for await (const file of walk(join(PUBLIC, dir))) {
    if (!EXT.has(extname(file).toLowerCase())) continue;
    const key = '/' + relative(PUBLIC, file).split(sep).join('/');
    const meta = await sharp(file).metadata();
    const { channels } = await sharp(file).flatten({ background: '#ffffff' }).removeAlpha().stats();
    const [r, g, b] = channels.map((c) => c.mean);
    const lum = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    const tiny = await sharp(file).flatten({ background: '#ffffff' }).resize({ width: 16 }).webp({ quality: 35 }).toBuffer();
    figures[key] = { w: meta.width, h: meta.height, lum, lqip: `data:image/webp;base64,${tiny.toString('base64')}` };
  }
}

const sorted = Object.fromEntries(Object.entries(figures).sort(([a], [b]) => a.localeCompare(b)));
await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(sorted, null, 2) + '\n');
console.log(`figure-meta: ${Object.keys(sorted).length} figures -> ${OUT}`);
if (process.argv.includes('--table')) {
  for (const [k, v] of Object.entries(sorted).sort(([, a], [, b]) => b.lum - a.lum)) {
    console.log(String(v.lum).padStart(3), `${v.w}x${v.h}`.padEnd(10), String(v.lqip.length).padStart(4), k.replace('/projects/', ''));
  }
}
