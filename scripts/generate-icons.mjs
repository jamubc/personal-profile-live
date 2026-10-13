// Rasterise the registration mark (public/favicon.svg) into the PNG icons the manifest and iOS want.
//   node scripts/generate-icons.mjs
// The mark is drawn at 80% so it stays inside the maskable safe zone; the background is the paper colour.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
  <rect width="24" height="24" fill="#0B0E14"/>
  <g transform="translate(2.4 2.4) scale(0.8)" fill="none" stroke="#5FD3F3" stroke-width="1.5">
    <circle cx="12" cy="12" r="8"/>
    <path d="M12 1v22M1 12h22" stroke-dasharray="8 3 2 3" stroke-dashoffset="7"/>
  </g>
</svg>`;

const targets = [
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
];
for (const [file, size] of targets) {
  const png = await sharp(Buffer.from(svg(size)), { density: Math.round((72 * size) / 24) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(resolve(root, file), png);
  console.log(`${file} ${size}x${size} ${png.length} B`);
}
