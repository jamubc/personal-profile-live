import type { ReactNode } from 'react';
import { isSectionHeading, numberBlocks, plainText } from '../lib/markdown';
import type { Block, HeadingBlock, ImageBlock } from '../lib/markdown';
import { renderInline } from '../lib/renderInline';
import { FigurePlate, figureProps } from './FigurePlate';
import { References } from './References';

export type TextBlockData = Exclude<Block, HeadingBlock | ImageBlock>;

interface ScrollRegionProps {
  label: string;
  className: string;
  children: ReactNode;
}

function ScrollRegion({ label, className, children }: ScrollRegionProps) {
  return (
    // A scrollable region must be reachable by keyboard (WCAG 2.1.1), so it is focusable and named.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div role="region" aria-label={label} tabIndex={0} className={`scroll-region ${className}`}>
      {children}
    </div>
  );
}

/**
 * Paragraph, list, quote, code, table and rule: identical in case studies and posts, because the typeface
 * (Sans body or Serif post) is inherited from the container. Tables and code scroll inside a bordered,
 * focusable region instead of widening the page.
 */
export function TextBlock({ block, tableNumber }: { block: TextBlockData; tableNumber?: number }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="mt-5">{renderInline(block.text)}</p>;
    case 'list': {
      const items = block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>);
      if (block.ordered) return <ol className="mt-5 list-decimal space-y-2 pl-6 marker:font-mono marker:text-ink-3">{items}</ol>;
      return (
        // The Tailwind reset removes list-style, which makes Safari with VoiceOver drop the list semantics; the explicit role restores them.
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ul role="list" className="dash-list mt-5 space-y-2">
          {items}
        </ul>
      );
    }
    case 'quote':
      return (
        <blockquote className="mt-6 border-l-2 border-rule-strong pl-5 text-ink-2">
          <p>{renderInline(block.text)}</p>
        </blockquote>
      );
    case 'code':
      return (
        <ScrollRegion label={block.lang ? `${block.lang} code` : 'Code'} className="mt-6 border border-rule bg-paper-2">
          <pre className="p-4 font-mono text-sm leading-6"><code>{block.code}</code></pre>
        </ScrollRegion>
      );
    case 'table':
      return (
        <ScrollRegion label={`Table${tableNumber === undefined ? '' : ` ${tableNumber}`}, scrolls sideways`} className="mt-6 border border-rule-strong">
          <table className="t-table w-full" style={{ minWidth: `${block.headers.length * 7.5}rem` }}>
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} scope="col" className="t-label border-b border-rule-strong bg-paper-2 px-3 py-2 text-left align-bottom text-ink-3">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-rule first:border-t-0">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-3 py-2 text-left align-top font-normal">{renderInline(cell)}</th>
                    ) : (
                      <td key={c} className="px-3 py-2 align-top">{renderInline(cell)}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      );
    case 'rule':
      return <hr className="mt-10 border-0 border-t border-rule" />;
  }
}

interface Section {
  heading?: HeadingBlock;
  /** 1-based number of a headed section. */
  n?: number;
  entries: { block: Block; index: number }[];
}

/** Level 1-2 headings open a section; anything before the first one forms a headless intro. */
function splitSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  let numbered = 0;
  blocks.forEach((block, index) => {
    if (isSectionHeading(block)) {
      sections.push({ heading: block, n: ++numbered, entries: [] });
      return;
    }
    if (sections.length === 0) sections.push({ entries: [] });
    sections[sections.length - 1].entries.push({ block, index });
  });
  return sections;
}

interface SectionViewProps {
  section: Section;
  figures: Map<number, number>;
  tables: Map<number, number>;
  coverFig?: number;
  className?: string;
}

function SectionView({ section, figures, tables, coverFig, className }: SectionViewProps) {
  const { heading, n, entries } = section;
  const isSources = heading !== undefined && plainText(heading.text) === 'Sources';
  const Wrapper = heading ? 'section' : 'div';
  return (
    <Wrapper aria-labelledby={heading?.id} className={className}>
      {heading && (
        <h2 id={heading.id} className="t-h2 flex scroll-mt-20 items-baseline gap-3 lg:scroll-mt-6">
          <span aria-hidden="true" className="t-caption shrink-0 tabular-nums text-ink-3">{String(n).padStart(2, '0')}</span>
          <span>{renderInline(heading.text)}</span>
        </h2>
      )}
      <div className={`${heading ? 'mt-6 ' : ''}[&>:first-child]:mt-0`}>
        {entries.map(({ block, index }) => {
          switch (block.type) {
            case 'heading':
              return (
                <h3 key={index} id={block.id} className="t-h3 mt-10 scroll-mt-20 lg:scroll-mt-6">
                  {renderInline(block.text)}
                </h3>
              );
            case 'image': {
              const fig = figures.get(index);
              if (fig === undefined || fig === coverFig) return null;
              return (
                <div key={index} className="mt-8">
                  <FigurePlate n={fig} {...figureProps(block)} />
                </div>
              );
            }
            case 'list':
              return isSources ? <References key={index} items={block.items} /> : <TextBlock key={index} block={block} />;
            default:
              return <TextBlock key={index} block={block} tableNumber={tables.get(index)} />;
          }
        })}
      </div>
    </Wrapper>
  );
}

const SECTION_GAP = 'mt-16 md:mt-24';

export interface ProseRendererProps {
  blocks: Block[];
  /** Figure number the page hoists into its header. It is skipped here but keeps its number and its `fig-N` id there. */
  coverFig?: number;
}

/**
 * Case-study body. Every level 1-2 heading becomes a numbered h2 (01, 02, …) with its slug id, and blocks render
 * strictly in document order, so every figure appears. A section titled "Sources" renders through References.
 * Sections render eagerly (no content-visibility), so in-page jumps and #fig deep links land where they aim.
 */
export function ProseRenderer({ blocks, coverFig }: ProseRendererProps) {
  const figures = numberBlocks(blocks, 'image');
  const tables = numberBlocks(blocks, 'table');
  return (
    <div className="t-body max-w-measure">
      {splitSections(blocks).map((section, i) => {
        const key = section.heading?.id ?? 'intro';
        const view = { section, figures, tables, coverFig };
        return <SectionView key={key} {...view} className={i > 0 ? SECTION_GAP : undefined} />;
      })}
    </div>
  );
}
