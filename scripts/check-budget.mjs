// Fails the build when the first page's weight exceeds the budget (design spec section 4.4).
// Reads dist/index.html (the prerendered "/") and sums gzip sizes of what it loads eagerly.
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const KB = 1024;
const BUDGET = { js: 100 * KB, css: 16 * KB, fontPreload: 96 * KB };

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}="([^"]*)"`)) ?? [])[1];
const totals = { js: 0, css: 0, fontPreload: 0 };
const rows = [];
const seen = new Set();

for (const [, name, rest] of html.matchAll(/<(script|link)\b([^>]*)>/g)) {
  const href = attr(rest, name === 'script' ? 'src' : 'href');
  if (!href || !href.startsWith('/assets/') || seen.has(href)) continue;
  let kind = null;
  if (name === 'script' && attr(rest, 'type') === 'module') kind = 'js';
  else if (name === 'link' && attr(rest, 'rel') === 'modulepreload') kind = 'js';
  else if (name === 'link' && attr(rest, 'rel') === 'stylesheet') kind = 'css';
  else if (name === 'link' && attr(rest, 'rel') === 'preload' && attr(rest, 'as') === 'font') kind = 'fontPreload';
  if (!kind) continue;
  seen.add(href);
  const file = join(dist, href);
  if (!existsSync(file)) { console.error(`referenced asset missing: ${href}`); process.exit(1); }
  const gz = gzipSync(readFileSync(file)).length;
  totals[kind] += gz;
  rows.push([kind, href, gz]);
}

for (const [kind, href, gz] of rows) console.log(`${kind.padEnd(12)} ${(gz / KB).toFixed(1).padStart(7)} KB  ${href}`);
let failed = false;
for (const kind of Object.keys(BUDGET)) {
  const ok = totals[kind] <= BUDGET[kind];
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${kind.padEnd(12)} ${(totals[kind] / KB).toFixed(1)} KB gz of ${(BUDGET[kind] / KB).toFixed(0)} KB budget`);
}
process.exit(failed ? 1 : 0);
