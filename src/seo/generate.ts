import { articles } from '../data/articles';
import { engineering } from '../data/engineering';
import { modifiedFor } from '../data/revisions';
import { PUBLIC_REPOS, STARS_AS_OF, formatStars, repos, starsOf } from '../data/oss';
import { sheets, publishedSheets, sheetById } from '../data/sheets';
import { LINKS, SITE, absoluteUrl } from '../data/site';
import { works } from '../data/works';
import { hasDocument } from '../lib/content';
import { routes } from '../routes';
import { META } from './meta';
import { checkRegistry as checkRegistryWith } from './registry-check';

const abs = absoluteUrl;

/** Every path to prerender: all issued sheets plus /404. */
export const prerenderPaths = (): string[] => routes.map((r) => r.path);

export function sitemapXml(): string {
  const urls = publishedSheets().map(
    (s) => `  <url>\n    <loc>${abs(s.route)}</loc>\n    <lastmod>${modifiedFor(s.id)}</lastmod>\n  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/** Ends a sentence that GitHub or a data file left without terminal punctuation. */
const sentence = (text: string): string => (/[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`);

/** llms.txt: the bio is fixed text; every list below it is generated from the same data as the pages. */
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
    lines.push(`- [${e.title}](${abs(sheet.route ?? '/')}): ${sentence(e.description)} (${e.tags.slice(0, 4).join(', ')})`);
  }
  const held = engineering.filter((x) => x.status === 'hold').map((x) => x.title);
  if (held.length) lines.push(`- Listed on ${abs('/projects')} without a write-up yet: ${held.join('; ')}.`);
  lines.push('');

  lines.push('## Open-Source & AI Projects', '');
  for (const r of repos) {
    const stars = starsOf(r.name);
    const starNote = stars ? ` ${formatStars(stars)} GitHub stars as of ${STARS_AS_OF}.` : '';
    lines.push(`- [${r.name}](${r.links[0].href}): ${sentence(r.description)}${starNote}${r.language ? ` (${r.language})` : ''}`);
  }
  lines.push(`- Full schedule: ${abs('/open-source')}. ${PUBLIC_REPOS} public repositories at ${LINKS.github}.`, '');

  lines.push('## Writing', '');
  for (const a of articles) {
    lines.push(`- [${a.title}](${abs(`/writing/${a.slug}`)}): ${a.summary} (${a.date}; drafted with AI assistance)`);
  }
  lines.push('', '## Selected Works', '');
  for (const w of works) lines.push(`- ${w.title}: ${w.scope} (${w.year}) — ${w.href}`);
  lines.push('', `This file is the machine-readable index of ${SITE.url}/; the human-readable drawing index is the cover sheet.`, '');
  return lines.join('\n');
}

/** The registry check over the real data; the prerender fails the build on any problem. */
export const checkRegistry = (): string[] =>
  checkRegistryWith({
    sheets,
    routePaths: routes.map((r) => r.path),
    articles,
    engineering,
    metaIds: Object.keys(META),
    hasDocument,
  });
