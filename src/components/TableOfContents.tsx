import { useActiveHeading } from '../lib/hooks';
import type { TocFigure, TocSection } from '../lib/markdown';

export interface TableOfContentsProps {
  sections: TocSection[];
  figures?: TocFigure[];
}

const pad = (n: number): string => String(n).padStart(2, '0');

/** Headings land 24-80 px from the top (scroll-mt), so the band that counts as "current" is the top quarter of the viewport. */
const ACTIVE_BAND = '0px 0px -75% 0px';

interface TocLinkProps {
  href: string;
  title: string;
  mark?: string;
  markWidth: string;
  current?: boolean;
}

function TocLink({ href, title, mark, markWidth, current = false }: TocLinkProps) {
  return (
    <a
      href={href}
      aria-current={current ? 'location' : undefined}
      className="group flex min-h-11 items-start gap-2 py-3 text-sm leading-5 text-ink-2 transition-colors duration-[120ms] ease-linear hover:text-ink aria-[current=location]:text-pen xl:min-h-8 xl:py-1.5"
    >
      <span className="flex h-5 shrink-0 items-center">
        <span className="leader" data-active={current} aria-hidden="true" />
      </span>
      {mark && (
        <span className={`t-caption shrink-0 tabular-nums text-ink-3 transition-colors duration-[120ms] ease-linear group-hover:text-pen group-aria-[current=location]:text-pen ${markWidth}`}>
          {mark}
        </span>
      )}
      <span className="min-w-0">{title}</span>
    </a>
  );
}

interface TocListsProps {
  heading: string;
  sections: TocSection[];
  figures: TocFigure[];
  active: string | null;
}

function TocLists({ heading, sections, figures, active }: TocListsProps) {
  return (
    <>
      <p className="t-micro pl-8">{heading}</p>
      <ol className="mt-1">
        {sections.map((s) => (
          <li key={s.id}>
            <TocLink href={`#${s.id}`} title={s.title} mark={s.n === undefined ? undefined : pad(s.n)} markWidth="w-5" current={active === s.id} />
          </li>
        ))}
      </ol>
      {figures.length > 0 && (
        <>
          <p className="t-micro mt-6 pl-8">Figures</p>
          <ol className="mt-1">
            {figures.map((f) => (
              <li key={f.id}>
                <TocLink href={`#${f.id}`} title={f.title} mark={`FIG. ${f.n}`} markWidth="w-14" />
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}

/**
 * Contents of a case study or post. From 1360 px up it is a sticky column (place it in a 240 px grid cell that
 * stretches to the prose); below that it is a native <details> that is closed by default. The section in view
 * (useActiveHeading) carries aria-current="location", a pen colour and an extended leader line.
 */
export function TableOfContents({ sections, figures = [] }: TableOfContentsProps) {
  const active = useActiveHeading(sections.map((s) => s.id), ACTIVE_BAND);
  const heading = 'Contents';
  const summary = `Contents (${sections.length})${figures.length > 0 ? ` · Figures (${figures.length})` : ''}`;
  const lists = <TocLists heading={heading} sections={sections} figures={figures} active={active} />;
  return (
    <div className="min-w-0">
      <details className="group/toc mb-8 border border-rule-ui transition-colors duration-[120ms] ease-linear hover:border-ink-2 xl:hidden">
        <summary className="t-label flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-4 [&::-webkit-details-marker]:hidden">
          <span>{summary}</span>
          <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
            <path d="M1 6h10" />
            <path d="M6 1v10" className="group-open/toc:hidden" />
          </svg>
        </summary>
        <nav aria-label={heading} className="border-t border-rule px-4 pb-3 pt-4">
          {lists}
        </nav>
      </details>
      <nav aria-label={heading} className="scroll-region sticky top-6 z-sticky hidden max-h-[calc(100dvh-3rem)] xl:block">
        {lists}
      </nav>
    </div>
  );
}
