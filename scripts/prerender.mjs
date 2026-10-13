// Static prerender: renders every route of the app to dist/<route>/index.html
// with route-specific <head> metadata, and writes sitemap.xml + 404.html.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).
//
//   dist/index.html            ← template produced by the client build
//   dist/server/entry-server.js ← exports render(url) and routes()
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');

if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('index.html must contain <!--app-head--> and <!--app-html--> placeholders');
}

const { render, routes, SITE_URL } = await import(join(dist, 'server', 'entry-server.js'));

const outFile = (url) => (url === '/404' ? join(dist, '404.html') : join(dist, url === '/' ? '' : url, 'index.html'));

const urls = [];
for (const route of await routes()) {
  const { html, head, seo } = await render(route.path);
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
  const file = outFile(route.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  if (!seo?.noindex) urls.push({ loc: SITE_URL + route.path, lastmod: route.lastmod, priority: route.priority ?? 0.5, changefreq: route.changefreq ?? 'monthly' });
  console.log(`prerendered ${route.path.padEnd(40)} ${seo?.title ?? ''}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
rmSync(join(dist, 'server'), { recursive: true, force: true });
console.log(`sitemap.xml: ${urls.length} urls; removed dist/server`);
