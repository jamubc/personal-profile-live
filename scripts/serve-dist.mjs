// Static server that behaves like Vercel for the prerendered site (no trailing slash):
//   /path -> dist/path/index.html or dist/path ; unknown -> dist/404.html with status 404
// usage: node scripts/serve-dist.mjs [distDir] [port]
import { createServer } from 'node:http';
import { existsSync, statSync, createReadStream } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [, , dirArg = 'dist', portArg = '4173'] = process.argv;
const dist = join(root, dirArg);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const safe = normalize(url).replace(/^(\.\.[/\\])+/, '');
  const file = [join(dist, safe), join(dist, safe, 'index.html')].find((p) => existsSync(p) && statSync(p).isFile());
  if (file) {
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    return createReadStream(file).pipe(res);
  }
  const notFound = join(dist, '404.html');
  if (existsSync(notFound)) {
    res.writeHead(404, { 'content-type': types['.html'] });
    return createReadStream(notFound).pipe(res);
  }
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('404');
}).listen(Number(portArg), () => console.log(`serving ${dirArg} on http://localhost:${portArg}`));
