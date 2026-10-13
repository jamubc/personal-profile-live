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

const upsert = <T extends HTMLElement>(selector: string, create: () => T, apply: (el: T) => void) => {
  let el = document.head.querySelector<T>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
};

const setMeta = (attr: 'name' | 'property', key: string, content: string) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement('meta');
      m.setAttribute(attr, key);
      return m;
    },
    (el) => el.setAttribute('content', content),
  );

export function useSeo(seo: Seo): void {
  const ctx = useContext(SeoContext);
  if (ctx.collect) ctx.collect(seo);

  const ld = JSON.stringify(seo.jsonLd ?? null);
  useEffect(() => {
    const url = canonicalOf(seo.path);
    const image = seo.image ?? DEFAULT_IMAGE;
    document.title = seo.title;
    setMeta('name', 'description', seo.description);
    setMeta('name', 'robots', seo.noindex ? 'noindex, nofollow' : INDEXABLE);
    setMeta('property', 'og:type', seo.type ?? 'website');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.ogDescription ?? seo.description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', seo.imageAlt ?? seo.title);
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.ogDescription ?? seo.description);
    setMeta('name', 'twitter:image', image);
    upsert(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      },
      (el) => el.setAttribute('href', url),
    );
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
  }, [seo.title, seo.description, seo.ogDescription, seo.path, seo.type, seo.image, seo.imageAlt, seo.noindex, ld]);
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialize collected metadata to <head> markup for the prerenderer. */
export function renderHead(seo: Seo): string {
  const url = canonicalOf(seo.path);
  const image = seo.image ?? DEFAULT_IMAGE;
  const social = seo.ogDescription ?? seo.description;
  // A noindex page (the 404) carries only its title and the robots rule: no canonical, no card.
  if (seo.noindex) return [`<title>${esc(seo.title)}</title>`, `<meta name="robots" content="noindex, nofollow" />`].join('\n    ');
  const tags: string[] = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${INDEXABLE}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${seo.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(social)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    // The site card's dimensions are known; a figure's are not declared.
    ...(image === DEFAULT_IMAGE
      ? [`<meta property="og:image:type" content="image/png" />`, `<meta property="og:image:width" content="1200" />`, `<meta property="og:image:height" content="630" />`]
      : []),
    `<meta property="og:image:alt" content="${esc(seo.imageAlt ?? seo.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(social)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ];
  if (seo.publishedTime) tags.push(`<meta property="article:published_time" content="${esc(seo.publishedTime)}" />`);
  if (seo.modifiedTime) tags.push(`<meta property="article:modified_time" content="${esc(seo.modifiedTime)}" />`);
  const json = graphJson(seo);
  if (json) tags.push(`<script id="ld-json" type="application/ld+json">${json}</script>`);
  return tags.join('\n    ');
}
