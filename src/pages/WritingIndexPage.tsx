import '../fonts-serif';
import { AppLink } from '../components/AppLink';
import { StatusChip } from '../components/StatusChip';
import { categoryLabels, sortedArticles } from '../data/articles';
import { loadDocument } from '../lib/content';
import { formatDate } from '../lib/format';
import { readingMinutes } from '../lib/markdown';
import { useSeo } from '../lib/seo';
import { collectionPageNode } from '../seo/graph';
import { META } from '../seo/meta';
import type { PageProps } from '../routes';

type Minutes = Record<string, number>;

export async function loadData(): Promise<Minutes> {
  const entries = await Promise.all(
    sortedArticles().map(async (a) => [a.slug, readingMinutes(await loadDocument(`writing/${a.slug}`))] as const),
  );
  return Object.fromEntries(entries);
}

export default function WritingIndexPage({ sheet, data: minutes }: PageProps<Minutes>) {
  const posts = sortedArticles();
  useSeo({
    ...META[sheet.id],
    path: sheet.route,
    jsonLd: [
      collectionPageNode({
        path: sheet.route,
        name: 'Writing',
        description: META[sheet.id].description,
        items: posts.map((a) => ({ name: a.title, path: `/writing/${a.slug}` })),
      }),
    ],
  });

  return (
    <>
      <header className="mb-12">
        <h1 className="t-h1">Writing</h1>
        <p className="mt-4 font-serif text-xl italic text-ink-2">Whatever I’m trying to understand this week.</p>
        <p className="t-caption mt-3">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} so far.
          {posts.every((a) => a.aiGenerated) ? ' Each was drafted with AI assistance, and says so at the top.' : ''}
        </p>
      </header>
      <ul className="border-t border-rule">
        {posts.map((a) => (
          <li key={a.slug} className="border-b border-rule">
            <AppLink
              to={`/writing/${a.slug}`}
              className="block min-h-[48px] px-1 py-8 hover:bg-paper-3 md:px-3"
            >
              <p className="t-micro flex flex-wrap items-center gap-x-3 gap-y-2">
                <span>{a.sheet}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={a.date}>{formatDate(a.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{categoryLabels[a.category]}</span>
                <span aria-hidden="true">·</span>
                <span>{minutes[a.slug]} min read</span>
                {a.aiGenerated && <StatusChip kind="ai" />}
              </p>
              <h2 className="mt-3 max-w-[40ch] font-serif text-xl leading-snug text-ink md:text-2xl">{a.title}</h2>
              <p className="mt-2 max-w-measure text-[15px] text-ink-2">{a.summary}</p>
            </AppLink>
          </li>
        ))}
      </ul>
    </>
  );
}
