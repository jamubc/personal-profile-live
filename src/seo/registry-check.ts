import type { Sheet } from '../data/sheets';

export interface RegistryInput {
  sheets: Sheet[];
  /** Paths the router serves. */
  routePaths: string[];
  articles: { slug: string; sheet: string; title: string }[];
  engineering: { sheet: string; status: 'issued' | 'hold'; title: string }[];
  /** Sheet ids that have a document title and description. */
  metaIds: string[];
  hasDocument: (file: string) => boolean;
}

/**
 * Consistency checks between the registry, the routes, the content loaders and the data files.
 * Returns problems (empty when sound); the prerender fails the build on any of them.
 */
export function checkRegistry({ sheets, routePaths, articles, engineering, metaIds, hasDocument }: RegistryInput): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  const byId = (id: string) => sheets.find((s) => s.id === id);
  for (const s of sheets) {
    if (seen.has(s.id)) problems.push(`duplicate sheet id ${s.id}`);
    seen.add(s.id);
    if (s.status !== 'issued' && s.route) problems.push(`${s.id} is ${s.status} but has a route`);
    if (s.status === 'issued' && s.kind !== 'error' && !s.route) problems.push(`${s.id} is issued but has no route`);
    if (s.route && !routePaths.includes(s.route)) problems.push(`${s.id}: route ${s.route} is not served`);
    if (s.route && s.kind !== 'post' && !metaIds.includes(s.id)) problems.push(`${s.id} has no document title and description`);
    if ((s.kind === 'case' || s.kind === 'post') && s.status === 'issued') {
      if (!s.slug || !s.contentFile) problems.push(`${s.id} needs a slug and a contentFile`);
      else if (!hasDocument(s.contentFile)) problems.push(`${s.id}: no loader for content file ${s.contentFile}`);
      const prefix = s.kind === 'case' ? '/projects/' : '/writing/';
      if (s.slug && s.route !== `${prefix}${s.slug}`) problems.push(`${s.id}: route ${s.route} does not match slug ${s.slug}`);
      if (s.kind === 'post' && !articles.some((a) => a.sheet === s.id)) problems.push(`${s.id} is a post with no article entry`);
      if (s.kind === 'case' && !engineering.some((e) => e.sheet === s.id)) problems.push(`${s.id} is a case study with no engineering entry`);
    }
  }
  const routed = new Set(sheets.filter((s) => s.route).map((s) => s.route));
  for (const p of routePaths) if (!routed.has(p)) problems.push(`route ${p} has no registry row`);
  for (const a of articles) {
    const sheet = byId(a.sheet);
    if (!sheet || sheet.slug !== a.slug) problems.push(`article ${a.slug} does not match sheet ${a.sheet}`);
    else if (sheet.title !== a.title) problems.push(`${a.sheet}: title differs between articles.ts and the registry`);
  }
  for (const e of engineering) {
    const sheet = byId(e.sheet);
    if (!sheet) problems.push(`engineering entry ${e.sheet} has no sheet`);
    else {
      if (sheet.status !== e.status) problems.push(`${e.sheet}: status ${e.status} in engineering.ts but ${sheet.status} in the registry`);
      if (sheet.title !== e.title) problems.push(`${e.sheet}: title differs between engineering.ts and the registry`);
    }
  }
  return problems;
}
