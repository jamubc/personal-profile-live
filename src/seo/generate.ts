import { articles } from '../data/articles';
import { engineering } from '../data/engineering';
import { modifiedFor } from '../data/revisions';
import { PUBLIC_REPOS, STARS_AS_OF, formatStars, repos, starsOf } from '../data/oss';
import { sheets, publishedSheets, sheetById } from '../data/sheets';
import { LINKS, SITE } from '../data/site';
import { works } from '../data/works';
import { hasDocument } from '../lib/content';
import { routes } from '../routes';

const abs = (path: string): string => (path === '/' ? `${SITE.url}/` : SITE.url + path);

/** Every path to prerender: all issued sheets plus /404. */
export const prerenderPaths = (): string[] => routes.map((r) => r.path);

export function sitemapXml(): string {
  const urls = publishedSheets().map(
    (s) => `  <url>\n    <loc>${abs(s.route!)}</loc>\n    <lastmod>${modifiedFor(s.id)}</lastmod>\n  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/** llms.txt, generated from the same data as the pages so it cannot drift. */
export function llmsTxt(): string {
  const lines: string[] = [];
  lines.push('# Andrew Manson', '');
  lines.push(
    '> Electrical Engineering graduate from the University of British Columbia (Okanagan) and registered EGBC Engineer-in-Training (EIT). I work across machine vision, embedded systems, analog electronics, and engineering economics, and I build open-source Model Context Protocol (MCP) servers and AI tooling. I like solving real-world problems with simple solutions. Everything I create is to solve a problem I have, so I test my solutions thoroughly. I hope my open-source work reaches many people and brings value to their lives and workflows.',
    '',
  );
  lines.push(`- Website: ${SITE.url}/`, `- GitHub: ${LINKS.github}`, `- LinkedIn: ${LINKS.linkedin}`, `- Email: ${SITE.email}`);
  lines.push(`- Sitemap: ${SITE.url}/sitemap.xml`, '');

  lines.push('## Engineering & Research', '');
  for (const e of engineering.filter((x) => x.status === 'issued')) {
    const sheet = sheetById(e.sheet)!;
    lines.push(`- [${e.title}](${abs(sheet.route!)}): ${e.description} (${e.tags.slice(0, 4).join(', ')})`);
  }
  lines.push(`- Automotive work (exhaust repair, rust restoration, a 4-cylinder rebuild) is listed on ${abs('/projects')} and has no write-up yet.`, '');

  lines.push('## Open-Source & AI Projects', '');
  for (const r of repos) {
    const stars = starsOf(r.name);
    const tail = [r.language, stars ? `${formatStars(stars)} GitHub stars (as of ${STARS_AS_OF})` : null].filter(Boolean).join('; ');
    lines.push(`- [${r.name}](${r.links[0].href}): ${r.description}${tail ? ` (${tail})` : ''}`);
  }
  lines.push(`- Full schedule: ${abs('/open-source')}. ${PUBLIC_REPOS} public repositories at ${LINKS.github}.`, '');

  lines.push('## Writing', '');
  for (const a of articles) {
    lines.push(`- [${a.title}](${abs(`/writing/${a.slug}`)}): ${a.summary} (${a.date}; drafted with AI assistance)`);
  }
  lines.push('', '## Selected Works', '');
  for (const w of works) lines.push(`- ${w.title}: ${w.scope} (${w.year}) — ${w.href}`);
  lines.push('');
  return lines.join('\n');
}

/** Consistency checks between the registry, routes, content and data. Returns problems (empty when sound). */
export function checkRegistry(): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const s of sheets) {
    if (seen.has(s.id)) problems.push(`duplicate sheet id ${s.id}`);
    seen.add(s.id);
    if (s.status !== 'issued' && s.route) problems.push(`${s.id} is ${s.status} but has a route`);
    if (s.status === 'issued' && s.kind !== 'error' && !s.route) problems.push(`${s.id} is issued but has no route`);
    if ((s.kind === 'case' || s.kind === 'post') && s.status === 'issued') {
      if (!s.slug || !s.contentFile) problems.push(`${s.id} needs a slug and a contentFile`);
      else if (!hasDocument(s.contentFile)) problems.push(`${s.id}: no loader for content file ${s.contentFile}`);
      const prefix = s.kind === 'case' ? '/projects/' : '/writing/';
      if (s.slug && s.route !== `${prefix}${s.slug}`) problems.push(`${s.id}: route ${s.route} does not match slug ${s.slug}`);
    }
  }
  for (const r of routes) if (!sheets.includes(r.sheet)) problems.push(`route ${r.path} has no registry row`);
  for (const a of articles) {
    const sheet = sheetById(a.sheet);
    if (!sheet || sheet.slug !== a.slug) problems.push(`article ${a.slug} does not match sheet ${a.sheet}`);
  }
  for (const e of engineering) {
    const sheet = sheetById(e.sheet);
    if (!sheet) problems.push(`engineering entry ${e.sheet} has no sheet`);
    else if (sheet.status !== e.status) problems.push(`${e.sheet}: status ${e.status} in engineering.ts but ${sheet.status} in the registry`);
  }
  return problems;
}
