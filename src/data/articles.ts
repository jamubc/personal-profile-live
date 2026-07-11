import { ArticleBlock, parseArticle } from '../lib/parseArticle';

export type ArticleCategory = 'ai' | 'engineering';

export interface Article {
  /** Matches the markdown filename in src/content/writing (without .md) */
  slug: string;
  title: string;
  subject: string;
  /** ISO date string, e.g. '2025-11-18' */
  date: string;
  category: ArticleCategory;
  summary: string;
  /** Flag posts that were drafted with AI assistance */
  aiGenerated?: boolean;
}

export const categoryLabels: Record<ArticleCategory, string> = {
  ai: 'AI',
  engineering: 'Engineering',
};

/**
 * Article metadata index. Bodies live as plain Markdown in
 * src/content/writing/<slug>.md — add a file there and an entry here to
 * publish. Order here is irrelevant; the view sorts by date.
 */
export const articles: Article[] = [
  // 'gemini-3-release' and 'coding-with-ai' are unpublished pending a rewrite;
  // their markdown stays in src/content/writing/.
  {
    slug: 'weathernext-2',
    title: 'WeatherNext 2: AI weather forecasting for the scenario era',
    subject:
      'How Google DeepMind’s new model delivers faster, higher-resolution forecasts that capture entire ranges of possible futures.',
    date: '2025-11-17',
    category: 'ai',
    aiGenerated: true,
    summary:
      'WeatherNext 2 is Google DeepMind and Google Research’s most advanced and efficient AI weather model yet, delivering high-resolution, scenario-rich forecasts in under a minute.',
  },
  {
    slug: 'light-computing',
    title:
      'How AI requirements, ARM processors, and foundry wars are redefining the light CPU market',
    subject:
      'The 2025 tectonic shift in low-power computing: AI, ARM, and the new CPU landscape',
    date: '2025-11-16',
    category: 'engineering',
    aiGenerated: true,
    summary:
      'A look at how the 40 TOPS AI requirement and ARM-based competitors are challenging the x86 duopoly in the light CPU market.',
  },
];

/** Articles newest-first. */
export const sortedArticles = (): Article[] =>
  [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

const WORDS_PER_MINUTE = 220;
const contentCache = new Map<string, ArticleBlock[]>();

/**
 * Lazily load and parse an article's markdown body. Mirrors the project
 * content loader: each .md becomes its own Vite chunk, cached after first read.
 */
export async function loadArticleContent(slug: string): Promise<ArticleBlock[]> {
  if (contentCache.has(slug)) return contentCache.get(slug)!;

  const modules = import.meta.glob('../content/writing/*.md', {
    query: '?raw',
    import: 'default',
    eager: false,
  }) as Record<string, () => Promise<string | { default: string }>>;

  const loader = modules[`../content/writing/${slug}.md`];
  if (!loader) {
    console.warn(`No article content found for "${slug}"`);
    return [];
  }

  const raw = await loader();
  const text = typeof raw === 'string' ? raw : raw.default ?? '';
  const blocks = parseArticle(text);
  contentCache.set(slug, blocks);
  return blocks;
}

/** Rough reading time in minutes from parsed blocks. */
export function readingTime(blocks: ArticleBlock[]): number {
  const words = blocks.reduce((n, b) => {
    if ('text' in b) return n + b.text.split(/\s+/).length;
    if ('items' in b) return n + b.items.join(' ').split(/\s+/).length;
    if (b.type === 'table') return n + (b.headers.length + b.rows.flat().length);
    if (b.type === 'code') return n + b.code.split(/\s+/).length;
    return n;
  }, 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
