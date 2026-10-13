import '../fonts-serif';
import { ArticleRenderer } from '../components/ArticleRenderer';
import { BackLink } from '../components/BackLink';
import { PrevNextSheet } from '../components/PrevNextSheet';
import { StatusChip } from '../components/StatusChip';
import { TableOfContents } from '../components/TableOfContents';
import { articleBySlug, categoryLabels } from '../data/articles';
import { neighbours } from '../data/sheets';
import type { Sheet } from '../data/sheets';
import { loadDocument } from '../lib/content';
import { formatDate } from '../lib/format';
import { extractToc, readingMinutes } from '../lib/markdown';
import type { Block } from '../lib/markdown';
import { useSeo } from '../lib/seo';
import { blogPostingNode, breadcrumbNode } from '../seo/graph';
import { TITLE_SUFFIX } from '../seo/meta';
import type { PageProps } from '../routes';

export const loadData = (sheet: Sheet): Promise<Block[]> => loadDocument(sheet.contentFile!);

export default function PostPage({ sheet, data: blocks }: PageProps<Block[]>) {
  const article = articleBySlug(sheet.slug!)!;
  const toc = extractToc(blocks, [1, 2]);
  const { prev, next, index } = neighbours(sheet);

  useSeo({
    title: `${article.seoTitle}${TITLE_SUFFIX}`,
    description: article.seoDescription,
    path: sheet.route!,
    type: 'article',
    publishedTime: article.date,
    jsonLd: [
      blogPostingNode({ path: sheet.route!, title: article.title, description: article.summary, datePublished: article.date }),
      breadcrumbNode([
        { name: 'Writing', path: '/writing' },
        { name: article.title, path: sheet.route! },
      ]),
    ],
  });

  return (
    <article>
      <BackLink to="/writing">W-300 Writing</BackLink>
      {article.aiGenerated && (
        <p className="t-label mt-6 flex w-fit items-center gap-3 border border-rule-strong bg-paper-2 px-3 py-2 text-ink-2">
          <StatusChip kind="ai" />
          Note — drafted with AI assistance.
        </p>
      )}
      <header className="mt-10 max-w-[44rem]">
        <h1 className="t-h1 font-serif font-normal">{article.title}</h1>
        <p className="mt-4 font-serif text-lg italic text-ink-2 md:text-xl">{article.subject}</p>
        <p className="t-label mt-5 text-ink-3">
          {categoryLabels[article.category]} · <time dateTime={article.date}>{formatDate(article.date)}</time> · {readingMinutes(blocks)} min read
        </p>
      </header>
      <div className="mt-12 xl:grid xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-12">
        <TableOfContents sections={toc.map((t) => ({ id: t.id, title: t.text }))} />
        <div className="min-w-0">
          <ArticleRenderer blocks={blocks} />
        </div>
      </div>
      <div className="mt-20">
        <PrevNextSheet prev={prev} next={next} index={index} />
      </div>
    </article>
  );
}
