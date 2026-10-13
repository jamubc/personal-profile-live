/* global document */
// Renders public/og-image.png (1200x630) from scripts/og-template.html in headless Chromium, so the
// real IBM Plex files are used. Run locally and commit the PNG; never runs on Vercel.
//   node scripts/generate-og-image.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let chromium;
try {
  chromium = createRequire(import.meta.url)('playwright').chromium;
} catch {
  try {
    chromium = createRequire('/opt/node-tools/node_modules/')('playwright').chromium;
  } catch {
    console.error('generate-og-image: Playwright is not installed; install it locally to regenerate the image.');
    process.exit(1);
  }
}

const font = (pkg, file) => pathToFileURL(join(root, 'node_modules', '@fontsource', pkg, 'files', file)).href;
const html = readFileSync(join(root, 'scripts', 'og-template.html'), 'utf8')
  .replace('{{MONO_600}}', font('ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff2'))
  .replace('{{MONO_500}}', font('ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2'))
  .replace('{{MONO_400}}', font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2'))
  .replace('{{SANS_400}}', font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff2'));

const tmp = join(root, 'scripts', '.og-render.html');
writeFileSync(tmp, html);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
// Fonts load lazily; re-run layout-dependent drawing by reloading once they are cached.
await page.reload();
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: join(root, 'public', 'og-image.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
import('node:fs').then((fs) => fs.rmSync(tmp, { force: true }));
console.log('wrote public/og-image.png');
