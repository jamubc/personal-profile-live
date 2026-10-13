import { SITE, LINKS } from '../data/site';

/** JSON-LD builders. The Person and WebSite nodes are the author's, kept verbatim from the old index.html. */
type Node = Record<string, unknown>;

export const PERSON_ID = `${SITE.url}/#person`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const OG_IMAGE = `${SITE.url}/og-image.png`;

const url = (path: string): string => (path === '/' ? `${SITE.url}/` : SITE.url + path);

export const personNode = (): Node => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.name,
  url: `${SITE.url}/`,
  image: OG_IMAGE,
  jobTitle: 'Electrical Engineer-in-Training (EGBC) & Open-Source Developer',
  email: SITE.email,
  description:
    'Electrical engineering graduate from UBC Okanagan and registered EGBC Engineer-in-Training. Builds machine vision and embedded systems, plus open-source MCP servers and AI tooling.',
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of British Columbia, Okanagan (UBCO)' },
  knowsAbout: [
    'Electrical Engineering',
    'Machine Vision',
    'Embedded Systems',
    'Analog Circuit Design',
    'Engineering Economics',
    'Robotics',
    'Model Context Protocol (MCP)',
    'AI Tooling & Agents',
    'TypeScript',
    'Python',
  ],
  sameAs: [LINKS.linkedin, LINKS.github, LINKS.pypi, LINKS.npm, LINKS.greasyfork],
});

export const websiteNode = (): Node => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE.url}/`,
  name: 'Andrew Manson — Portfolio',
  description: 'Portfolio of Andrew Manson: electrical engineering and open-source AI / MCP development.',
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
});

export const profilePageNode = (): Node => ({
  '@type': 'ProfilePage',
  '@id': `${SITE.url}/#profilepage`,
  url: `${SITE.url}/`,
  name: 'Andrew Manson | Electrical Engineer (EGBC EIT)',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': PERSON_ID },
  mainEntity: { '@id': PERSON_ID },
});

export const breadcrumbNode = (trail: { name: string; path: string }[]): Node => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: url(t.path) })),
});

export const techArticleNode = (o: { path: string; title: string; description: string; image?: string; dateModified?: string }): Node => ({
  '@type': 'TechArticle',
  '@id': `${url(o.path)}#article`,
  headline: o.title,
  description: o.description,
  url: url(o.path),
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: 'en',
  ...(o.image ? { image: o.image } : {}),
  ...(o.dateModified ? { dateModified: o.dateModified } : {}),
});

export const blogPostingNode = (o: { path: string; title: string; description: string; datePublished: string }): Node => ({
  '@type': 'BlogPosting',
  '@id': `${url(o.path)}#post`,
  headline: o.title,
  description: o.description,
  url: url(o.path),
  datePublished: o.datePublished,
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
  isPartOf: { '@id': WEBSITE_ID },
  mainEntityOfPage: url(o.path),
  inLanguage: 'en',
});

export const collectionPageNode = (o: { path: string; name: string; description: string; items: { name: string; path?: string; url?: string; extra?: Node }[] }): Node => ({
  '@type': 'CollectionPage',
  '@id': `${url(o.path)}#collection`,
  url: url(o.path),
  name: o.name,
  description: o.description,
  isPartOf: { '@id': WEBSITE_ID },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: o.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url ?? url(it.path ?? '/'), ...(it.extra ? { item: it.extra } : {}) })),
  },
});

export const softwareSourceCodeNode = (r: { name: string; href: string; language: string | null; description: string }): Node => ({
  '@type': 'SoftwareSourceCode',
  name: r.name,
  codeRepository: r.href,
  ...(r.language ? { programmingLanguage: r.language } : {}),
  description: r.description,
  author: { '@id': PERSON_ID },
});

export const contactPageNode = (path: string): Node => ({
  '@type': 'ContactPage',
  '@id': `${url(path)}#contact`,
  url: url(path),
  name: 'Contact',
  isPartOf: { '@id': WEBSITE_ID },
  mainEntity: { '@id': PERSON_ID },
});

/** Global graph on every indexable page, plus the page's own nodes. */
export const buildGraph = (pageNodes: Node[] | undefined, isHome: boolean): Node[] => [
  personNode(),
  websiteNode(),
  ...(isHome ? [profilePageNode()] : []),
  ...(pageNodes ?? []),
];
