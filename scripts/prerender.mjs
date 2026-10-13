// Static prerender (design spec 9.2): renders every sheet to dist/<route>/index.html with its own
// <head>, writes 404.html, sitemap.xml and llms.txt, then checks that every local link and image in
// the output resolves. Runs after `vite build` (client) and `vite build --ssr` (server bundle).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const fail = (message) => {
  console.error(`prerender: ${message}`);
  process.exit(1);
};

const template = readFileSync(join(dist, 'index.html'), 'utf8');
for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) fail(`index.html is missing ${marker}`);
}

const server = await import(pathToFileURL(join(dist, 'server', 'entry-server.js')).href);
const { render, prerenderPaths, sitemapXml, llmsTxt, checkRegistry } = server;

const problems = checkRegistry();
if (problems.length) fail(`registry check failed:\n  - ${problems.join('\n  - ')}`);

// Preload the three fonts used on first paint.
const assets = readdirSync(join(dist, 'assets'));
const preloads = ['ibm-plex-mono-latin-400-normal', 'ibm-plex-mono-latin-600-normal', 'ibm-plex-sans-latin-400-normal'].map((name) => {
  const file = assets.find((f) => f.startsWith(`${name}-`) && f.endsWith('.woff2'));
  if (!file) fail(`font file for ${name} not found in dist/assets`);
  return `<link rel="preload" as="font" type="font/woff2" href="/assets/${file}" crossorigin />`;
});

const pages = [];
for (const path of prerenderPaths()) {
  const { html, head, seo } = await render(path);
  if (!seo) fail(`${path} did not set document metadata (call useSeo)`);
  const page = template
    .replace('<!--app-head-->', () => [head, ...preloads].join('\n    '))
    .replace('<!--app-html-->', () => html);
  const file = path === '/404' ? join(dist, '404.html') : join(dist, path === '/' ? '' : path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  pages.push({ path, page });
  console.log(`prerendered ${path.padEnd(32)} ${seo.title}`);
}

writeFileSync(join(dist, 'sitemap.xml'), sitemapXml());
writeFileSync(join(dist, 'llms.txt'), llmsTxt());

// Every local href and src in the output must resolve to a file or a prerendered route.
const broken = [];
for (const { path, page } of pages) {
  for (const m of page.matchAll(/\b(?:href|src)="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    const url = decodeURI(m[1]);
    if (url.startsWith('//')) continue;
    const candidates = [join(dist, url), join(dist, url, 'index.html')];
    if (!candidates.some((c) => existsSync(c) && statSync(c).isFile())) broken.push(`${path}: ${url}`);
  }
}
if (broken.length) fail(`broken local references:\n  - ${[...new Set(broken)].join('\n  - ')}`);

rmSync(join(dist, 'server'), { recursive: true, force: true });
console.log(`prerender: ${pages.length} pages, sitemap.xml, llms.txt; all local references resolve`);
