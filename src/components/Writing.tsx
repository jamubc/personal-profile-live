import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  Article,
  ArticleCategory,
  articles,
  categoryLabels,
  loadArticleContent,
  readingTime,
  sortedArticles,
} from '../data/articles';
import { ArticleBlock } from '../lib/parseArticle';
import { renderInline } from '../lib/renderInline';

const dateFmt = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const getSlugFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('a');
};

/* ── Block renderer: editorial styling, intentionally unlike ProjectDetail ── */
function renderBlock(block: ArticleBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="font-serif text-2xl md:text-3xl text-white mt-14 mb-5 leading-tight">
          {renderInline(block.text)}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i} className="font-serif text-xl md:text-2xl text-white/90 mt-10 mb-4 leading-snug">
          {renderInline(block.text)}
        </h3>
      );
    case 'p':
      return (
        <p key={i} className="text-[1.0625rem] md:text-lg text-white/75 leading-[1.85] mb-6">
          {renderInline(block.text)}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className="mb-6 space-y-2.5 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-white/75 leading-relaxed">
              <span className="mt-[0.65rem] h-1.5 w-1.5 flex-none rounded-full bg-accent/70" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i} className="mb-6 space-y-2.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-white/75 leading-relaxed">
              <span className="font-serif text-accent/80 tabular-nums">{j + 1}.</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote key={i} className="my-8 border-l-2 border-accent/50 pl-5 italic text-white/70 text-lg leading-relaxed">
          {renderInline(block.text)}
        </blockquote>
      );
    case 'code':
      return (
        <pre key={i} className="my-6 overflow-x-auto rounded-md bg-black/40 border border-white/10 p-4 text-sm font-mono text-white/85 custom-scrollbar">
          <code>{block.code}</code>
        </pre>
      );
    case 'table':
      return (
        <div key={i} className="my-8 overflow-x-auto custom-scrollbar rounded-md border border-white/10">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-white/[0.04]">
                {block.headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 text-left font-semibold text-white/90 border-b border-white/10 whitespace-nowrap">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-white/[0.06] last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-3 text-white/70 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

/* ── Reader ── */
function ArticleReader({ article, onClose }: { article: Article; onClose: () => void }) {
  const [blocks, setBlocks] = useState<ArticleBlock[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBlocks(null);
    loadArticleContent(article.slug).then((b) => {
      if (!cancelled) setBlocks(b);
    });
    return () => {
      cancelled = true;
    };
  }, [article.slug]);

  const mins = blocks ? readingTime(blocks) : null;

  return (
    <article className="mx-auto max-w-[44rem] px-6 md:px-10 pt-16 pb-28">
      <button
        onClick={onClose}
        className="mb-12 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All writing
      </button>

      <header className="mb-12">
        <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/45">
          <span className="text-accent">{categoryLabels[article.category]}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{dateFmt.format(new Date(article.date))}</span>
          {mins !== null && (
            <>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{mins} min read</span>
            </>
          )}
          {article.aiGenerated && (
            <span className="rounded-full border border-secondary/40 px-2 py-0.5 text-[10px] text-secondary normal-case tracking-normal">
              AI-assisted
            </span>
          )}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] text-white mb-5">
          {article.title}
        </h1>
        <p className="text-lg md:text-xl text-white/60 leading-relaxed font-serif italic">
          {article.subject}
        </p>
      </header>

      {!blocks ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse space-y-3">
              <div className="h-3 w-full rounded bg-white/[0.06]" />
              <div className="h-3 w-5/6 rounded bg-white/[0.06]" />
              <div className="h-3 w-4/6 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      ) : (
        <div>{blocks.map((b, i) => renderBlock(b, i))}</div>
      )}

      <div className="mt-20 border-t border-white/10 pt-8">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All writing
        </button>
      </div>
    </article>
  );
}

/* ── Index list ── */
export const Writing = () => {
  const [activeSlug, setActiveSlug] = useState<string | null>(getSlugFromUrl());
  const [filter, setFilter] = useState<ArticleCategory | 'all'>('all');

  // Keep state in sync with browser back/forward.
  useEffect(() => {
    const onPop = () => setActiveSlug(getSlugFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Scroll to top whenever the active article changes.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeSlug]);

  const openArticle = (slug: string) => {
    window.history.pushState({}, '', `/writing?a=${slug}`);
    setActiveSlug(slug);
  };

  const closeArticle = () => {
    window.history.pushState({}, '', '/writing');
    setActiveSlug(null);
  };

  const active = useMemo(
    () => (activeSlug ? articles.find((a) => a.slug === activeSlug) ?? null : null),
    [activeSlug]
  );

  const categories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))) as ArticleCategory[],
    []
  );

  const list = useMemo(
    () => sortedArticles().filter((a) => filter === 'all' || a.category === filter),
    [filter]
  );

  if (active) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <ArticleReader article={active} onClose={closeArticle} />
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 pt-16 pb-28">
      <header className="mb-12">
        <h1 className="font-serif text-5xl md:text-6xl text-white mb-4">Writing</h1>
        <p className="text-lg text-white/55 font-serif italic">
          Whatever I’m trying to understand this week.
        </p>
      </header>

      <div className="mb-12 flex flex-wrap gap-2">
        {(['all', ...categories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
              filter === c
                ? 'border-accent/60 bg-accent/10 text-white'
                : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white/80'
            }`}
          >
            {c === 'all' ? 'All' : categoryLabels[c as ArticleCategory]}
          </button>
        ))}
      </div>

      <div className="border-t border-white/10">
        {list.map((article) => (
          <button
            key={article.slug}
            onClick={() => openArticle(article.slug)}
            className="group block w-full border-b border-white/10 py-8 text-left transition-colors hover:bg-white/[0.02]"
          >
            <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/40">
              <span className="text-accent/80">{categoryLabels[article.category]}</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span>{dateFmt.format(new Date(article.date))}</span>
              {article.aiGenerated && (
                <span className="rounded-full border border-secondary/40 px-2 py-0.5 text-[10px] text-secondary normal-case tracking-normal">
                  AI-assisted
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-white/90 leading-snug group-hover:text-white transition-colors">
              {article.title}
            </h2>
            <p className="mt-3 text-white/55 leading-relaxed">{article.summary}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
