/**
 * Per-route document metadata that works in both render modes:
 *  - at prerender time the server collects it through SeoContext and writes
 *    real <head> tags into the static HTML (titles, descriptions, canonical,
 *    Open Graph, Twitter, JSON-LD), so shared links and crawlers see the
 *    right thing without JavaScript;
 *  - in the browser the same hook updates the live <head> on client-side
 *    navigation so the tab title and share buttons stay correct.
 */
import { createContext, useContext, useEffect } from 'react';

export const SITE_URL = 'https://www.jandrewmanson.engineer';
export const SITE_NAME = 'Andrew Manson';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export interface Seo {
  title: string;
  description: string;
  /** Route path, e.g. "/projects/apple-classifier". Used for canonical + og:url. */
  path: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  /** Extra JSON-LD objects appended to the @graph. */
  jsonLd?: Record<string, unknown>[];
  /** Set true on 404 so crawlers drop the URL. */
  noindex?: boolean;
}

export const SeoContext = createContext<{ collect?: (seo: Seo) => void }>({});

const upsert = (selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  apply(el);
};

const setMeta = (attr: 'name' | 'property', key: string, content: string) =>
  upsert(`meta[${attr}="${key}"]`, () => { const m = document.createElement('meta'); m.setAttribute(attr, key); return m; }, (el) => el.setAttribute('content', content));

export function useSeo(seo: Seo): void {
  const ctx = useContext(SeoContext);
  if (ctx.collect) ctx.collect(seo);

  useEffect(() => {
    const url = SITE_URL + seo.path;
    document.title = seo.title;
    setMeta('name', 'description', seo.description);
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', seo.type ?? 'website');
    setMeta('property', 'og:image', seo.image ?? DEFAULT_IMAGE);
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setMeta('name', 'twitter:image', seo.image ?? DEFAULT_IMAGE);
    setMeta('name', 'robots', seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    upsert('link[rel="canonical"]', () => { const l = document.createElement('link'); l.setAttribute('rel', 'canonical'); return l; }, (el) => el.setAttribute('href', url));
  }, [seo.title, seo.description, seo.path, seo.type, seo.image, seo.noindex]);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Serialize collected metadata to <head> markup for the prerenderer. */
export function renderHead(seo: Seo): string {
  const url = SITE_URL + seo.path;
  const image = seo.image ?? DEFAULT_IMAGE;
  const tags: string[] = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${seo.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(seo.imageAlt ?? seo.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ];
  if (seo.publishedTime) tags.push(`<meta property="article:published_time" content="${esc(seo.publishedTime)}" />`);
  if (seo.modifiedTime) tags.push(`<meta property="article:modified_time" content="${esc(seo.modifiedTime)}" />`);
  if (seo.jsonLd && seo.jsonLd.length) {
    const graph = { '@context': 'https://schema.org', '@graph': seo.jsonLd };
    tags.push(`<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}
