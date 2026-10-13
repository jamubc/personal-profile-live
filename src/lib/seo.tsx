/**
 * Per-route document metadata that works in both render modes:
 *  - at prerender time the server collects it through SeoContext and writes real <head> tags into the
 *    static HTML (title, description, canonical, Open Graph, Twitter, JSON-LD), so shared links and
 *    crawlers see the right thing without JavaScript;
 *  - in the browser the same hook updates the live <head> on client-side navigation.
 */
import { createContext, useContext, useEffect } from 'react';
import { SITE, absoluteUrl } from '../data/site';
import { OG_IMAGE, buildGraph } from '../seo/graph';

const SITE_NAME = SITE.name;
const DEFAULT_IMAGE = OG_IMAGE;

export interface Seo {
  title: string;
  description: string;
  /** Route path, e.g. "/projects/apple-classifier". Used for canonical and og:url. */
  path: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  imageAlt?: string;
  /** Social-card text when it should differ from the meta description (the cover). */
  ogDescription?: string;
  publishedTime?: string;
  modifiedTime?: string;
  /** Page-specific JSON-LD nodes appended to the global graph. */
  jsonLd?: Record<string, unknown>[];
  /** Set true on the 404 so crawlers drop the URL. */
  noindex?: boolean;
}

export const SeoContext = createContext<{ collect?: (seo: Seo) => void }>({});

const INDEXABLE = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const canonicalOf = absoluteUrl;
const graphJson = (seo: Seo): string | null =>
  seo.noindex ? null : JSON.stringify({ '@context': 'https://schema.org', '@graph': buildGraph(seo.jsonLd, seo.path === '/') }).replace(/</g, '\\u003c');

/** One head tag the site manages: a meta by name or property, or the canonical link. */
type HeadTag = { kind: 'name' | 'property'; key: string; value: string } | { kind: 'canonical'; key: 'canonical'; value: string };

/**
 * Every tag a route's <head> carries besides <title> and the JSON-LD, in order. The prerenderer
 * serializes this list and the browser applies the same list on client navigation, so the two can
 * never disagree. A noindex page (the 404) carries only its robots rule: no description, canonical
 * or card.
 */
function headTags(seo: Seo): HeadTag[] {
  if (seo.noindex) return [{ kind: 'name', key: 'robots', value: 'noindex, nofollow' }];
  const url = canonicalOf(seo.path);
  const image = seo.image ?? DEFAULT_IMAGE;
  const social = seo.ogDescription ?? seo.description;
  const tags: HeadTag[] = [
    { kind: 'name', key: 'description', value: seo.description },
    { kind: 'name', key: 'robots', value: INDEXABLE },
    { kind: 'canonical', key: 'canonical', value: url },
    { kind: 'property', key: 'og:type', value: seo.type ?? 'website' },
    { kind: 'property', key: 'og:site_name', value: SITE_NAME },
    { kind: 'property', key: 'og:locale', value: 'en_US' },
    { kind: 'property', key: 'og:url', value: url },
    { kind: 'property', key: 'og:title', value: seo.title },
    { kind: 'property', key: 'og:description', value: social },
    { kind: 'property', key: 'og:image', value: image },
  ];
  // The site card's dimensions are known; a figure's are not declared.
  if (image === DEFAULT_IMAGE) {
    tags.push(
      { kind: 'property', key: 'og:image:type', value: 'image/png' },
      { kind: 'property', key: 'og:image:width', value: '1200' },
      { kind: 'property', key: 'og:image:height', value: '630' },
    );
  }
  tags.push(
    { kind: 'property', key: 'og:image:alt', value: seo.imageAlt ?? seo.title },
    { kind: 'name', key: 'twitter:card', value: 'summary_large_image' },
    { kind: 'name', key: 'twitter:title', value: seo.title },
    { kind: 'name', key: 'twitter:description', value: social },
    { kind: 'name', key: 'twitter:image', value: image },
  );
  if (seo.publishedTime) tags.push({ kind: 'property', key: 'article:published_time', value: seo.publishedTime });
  if (seo.modifiedTime) tags.push({ kind: 'property', key: 'article:modified_time', value: seo.modifiedTime });
  return tags;
}

/** Every element in the live <head> that headTags() may produce, so stale ones can be removed. */
const MANAGED =
  'meta[name="description"], meta[name="robots"], meta[name^="twitter:"], meta[property^="og:"], meta[property^="article:"], link[rel="canonical"]';

const selectorOf = (t: HeadTag): string => (t.kind === 'canonical' ? 'link[rel="canonical"]' : `meta[${t.kind}="${t.key}"]`);

/** Make the live <head> match `tags` exactly: update what exists, add what is missing, drop the rest. */
function applyHead(tags: HeadTag[]): void {
  const wanted = new Set(tags.map(selectorOf));
  document.head.querySelectorAll(MANAGED).forEach((el) => {
    const sel = el.tagName === 'LINK' ? 'link[rel="canonical"]' : el.hasAttribute('name') ? `meta[name="${el.getAttribute('name')}"]` : `meta[property="${el.getAttribute('property')}"]`;
    if (!wanted.has(sel)) el.remove();
  });
  for (const t of tags) {
    let el = document.head.querySelector(selectorOf(t));
    if (!el) {
      el = document.createElement(t.kind === 'canonical' ? 'link' : 'meta');
      if (t.kind === 'canonical') el.setAttribute('rel', 'canonical');
      else el.setAttribute(t.kind, t.key);
      document.head.appendChild(el);
    }
    el.setAttribute(t.kind === 'canonical' ? 'href' : 'content', t.value);
  }
}

export function useSeo(seo: Seo): void {
  const ctx = useContext(SeoContext);
  if (ctx.collect) ctx.collect(seo);

  const ld = JSON.stringify(seo.jsonLd ?? null);
  useEffect(() => {
    document.title = seo.title;
    applyHead(headTags(seo));
    const json = graphJson(seo);
    const existing = document.getElementById('ld-json');
    if (json === null) existing?.remove();
    else if (existing) existing.textContent = json;
    else {
      const s = document.createElement('script');
      s.id = 'ld-json';
      s.type = 'application/ld+json';
      s.textContent = json;
      document.head.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- jsonLd is tracked through its serialized form `ld`
  }, [seo.title, seo.description, seo.ogDescription, seo.path, seo.type, seo.image, seo.imageAlt, seo.noindex, seo.publishedTime, seo.modifiedTime, ld]);
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialize collected metadata to <head> markup for the prerenderer: the same tags useSeo applies. */
export function renderHead(seo: Seo): string {
  const tags = headTags(seo).map((t) =>
    t.kind === 'canonical' ? `<link rel="canonical" href="${esc(t.value)}" />` : `<meta ${t.kind}="${t.key}" content="${esc(t.value)}" />`,
  );
  const json = graphJson(seo);
  if (json) tags.push(`<script id="ld-json" type="application/ld+json">${json}</script>`);
  return [`<title>${esc(seo.title)}</title>`, ...tags].join('\n    ');
}
