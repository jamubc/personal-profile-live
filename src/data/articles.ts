/**
 * Writing index metadata. Bodies are Markdown files in src/content/writing, registered in
 * src/lib/content.ts; each published post also has a W sheet in src/data/sheets.ts. To publish a
 * post: add the file, add a loader, add a sheet, add an entry here.
 * 'gemini-3-release' and 'coding-with-ai' stay unpublished pending a rewrite.
 */
export type ArticleCategory = 'ai' | 'engineering';

export interface Article {
  /** Matches the Markdown filename (without .md) and the route /writing/<slug>. */
  slug: string;
  /** Registry sheet id, e.g. W-301. Numbered by insertion order, not by date. */
  sheet: string;
  title: string;
  subject: string;
  /** ISO date, e.g. '2025-11-17'. */
  date: string;
  category: ArticleCategory;
  summary: string;
  /** Drafted with AI assistance. */
  aiGenerated?: boolean;
  /** Document title (without the site suffix), kept under the 60 character limit. */
  seoTitle: string;
  /** Meta description, kept under the 155 character limit. */
  seoDescription: string;
}

export const categoryLabels: Record<ArticleCategory, string> = {
  ai: 'AI',
  engineering: 'Engineering',
};

export const articles: Article[] = [
  {
    slug: 'light-computing',
    sheet: 'W-301',
    title: 'How AI requirements, ARM processors, and foundry wars are redefining the light CPU market',
    subject: 'The 2025 tectonic shift in low-power computing: AI, ARM, and the new CPU landscape',
    date: '2025-11-16',
    category: 'engineering',
    aiGenerated: true,
    summary: 'A look at how the 40 TOPS AI requirement and ARM-based competitors are challenging the x86 duopoly in the light CPU market.',
    seoTitle: 'AI, ARM and the light CPU market',
    seoDescription: 'A look at how the 40 TOPS AI requirement and ARM-based competitors are challenging the x86 duopoly in the light CPU market.',
  },
  {
    slug: 'weathernext-2',
    sheet: 'W-302',
    title: 'WeatherNext 2: AI weather forecasting for the scenario era',
    subject: 'How Google DeepMind’s new model delivers faster, higher-resolution forecasts that capture entire ranges of possible futures.',
    date: '2025-11-17',
    category: 'ai',
    aiGenerated: true,
    summary: 'WeatherNext 2 is Google DeepMind and Google Research’s most advanced and efficient AI weather model yet, delivering high-resolution, scenario-rich forecasts in under a minute.',
    seoTitle: 'WeatherNext 2: AI weather forecasting',
    seoDescription: 'Google DeepMind and Google Research’s WeatherNext 2 makes high-resolution, scenario-rich forecasts in under a minute. An explainer on how it works.',
  },
];

/** Newest first. */
export const sortedArticles = (): Article[] => [...articles].sort((a, b) => b.date.localeCompare(a.date));

export const articleBySlug = (slug: string): Article | undefined => articles.find((a) => a.slug === slug);
