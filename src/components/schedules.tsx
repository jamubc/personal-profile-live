import type { ReactNode } from 'react';
import { NotIssuedPlate } from './NotIssuedPlate';
import { SchematicSymbol } from './SchematicSymbol';
import type { Column, Row } from './ScheduleTable';
import { StatusChip } from './StatusChip';
import { engineering } from '../data/engineering';
import type { EngineeringEntry } from '../data/engineering';
import { formatStars, repos, starsOf } from '../data/oss';
import type { Repo } from '../data/oss';
import { sortedArticles, categoryLabels } from '../data/articles';
import { sheetById } from '../data/sheets';
import { works } from '../data/works';
import { SITE } from '../data/site';
import { formatDate } from '../lib/format';

/**
 * Data to table adapters. Every schedule on the site is built here from the data modules, so the
 * same facts appear identically on the cover, on the section sheet and in generated files.
 */

const External = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className="link-prose" href={href} target="_blank" rel="noopener noreferrer">
    {children}
    <span aria-hidden="true"> ↗</span>
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

/* ---------------------------------- Engineering (E) ---------------------------------- */

export const engineeringColumns: Column[] = [
  { key: 'sheet', label: 'Sheet', width: '72px', mono: true },
  { key: 'title', label: 'Title' },
  { key: 'key', label: 'Key figure', width: '220px' },
  { key: 'tags', label: 'Tags', width: '200px', hideBelow: 'lg' },
  { key: 'status', label: 'Status', width: '104px' },
];

/** E-103 has no photograph, so its thumbnail is a miniature of its single-line diagram. */
function CorridorThumb() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" role="img" aria-label="Corridor diagram" className="border border-rule bg-paper">
      <g stroke="var(--pen)" strokeWidth="1" fill="none">
        <path d="M10.5 12v8M53.5 12v8M10.5 16h43" />
      </g>
      <g fill="var(--ink-2)">
        <rect x="8" y="27" width="5" height="5" />
        <rect x="51" y="27" width="5" height="5" />
        <rect x="13" y="29" width="38" height="1.5" />
      </g>
    </svg>
  );
}

function EngineeringThumb({ entry }: { entry: EngineeringEntry }) {
  if (!entry.thumb) return <CorridorThumb />;
  return <img src={entry.thumb} width={64} height={48} alt="" loading="lazy" className="h-12 w-16 border border-rule object-cover" />;
}

export function engineeringRows(): Row[] {
  return engineering.map((e) => {
    const issued = e.status === 'issued';
    return {
      id: e.sheet,
      href: issued ? (sheetById(e.sheet)?.route ?? undefined) : undefined,
      disabled: !issued,
      thumb: issued ? <EngineeringThumb entry={e} /> : <NotIssuedPlate w={64} h={48} />,
      abstract: issued ? e.description : undefined,
      cells: {
        sheet: e.sheet,
        title: e.title,
        key: e.keyFigure ?? '—',
        tags: e.tags.slice(0, 3).join(' · '),
        status: issued ? (
          <StatusChip kind="issued" />
        ) : (
          <span>
            <StatusChip kind="hold" />
            <span className="t-micro mt-1 block">No write-up yet</span>
          </span>
        ),
      },
    };
  });
}

export const engineeringGroup = () => ({
  groupLabel: 'E — Engineering & research',
  groupCount: `${engineering.length} sheets · ${engineering.filter((e) => e.status === 'issued').length} issued`,
});

/* ---------------------------------- Open source (S) ---------------------------------- */

export function ossColumns(full: boolean): Column[] {
  return full
    ? [
        { key: 'item', label: 'Item', width: '48px', mono: true, stack: 'lead' },
        { key: 'symbol', label: 'Symbol', width: '56px', stack: 'aside' },
        { key: 'component', label: 'Component', width: '210px', part: 'title' },
        { key: 'description', label: 'Description' },
        { key: 'material', label: 'Material', width: '110px', hideBelow: 'lg' },
        { key: 'qty', label: 'QTY (★)', width: '88px', align: 'right', mono: true },
        { key: 'ref', label: 'Ref', width: '210px' },
      ]
    : [
        { key: 'symbol', label: 'Symbol', width: '56px', stack: 'aside' },
        { key: 'component', label: 'Component', part: 'title' },
        { key: 'material', label: 'Material', width: '120px', hideBelow: 'lg' },
        { key: 'qty', label: 'QTY (★)', width: '88px', align: 'right', mono: true },
      ];
}

const qtyOf = (r: Repo): string => {
  const n = starsOf(r.name);
  return n === null ? '—' : formatStars(n);
};

/** Full schedule (S-200): several links per row, so rows are not whole-row links. */
export function ossFullRows(): Row[] {
  return repos.map((r, i) => ({
    id: r.name,
    cells: {
      item: String(i + 1),
      symbol: <SchematicSymbol kind={r.symbol} size={40} />,
      component: r.name,
      description: r.description,
      material: r.language ?? '—',
      qty: qtyOf(r),
      ref: (
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {r.links.map((l) => (
            <External key={l.label} href={l.href}>
              {l.label}
            </External>
          ))}
          {r.crossRef && <span className="t-micro">{r.crossRef}</span>}
        </span>
      ),
    },
  }));
}

/** Cover selection: whole-row links to the repository, description beneath the name. */
export function ossSelectedRows(): Row[] {
  return repos
    .filter((r) => r.selected)
    .map((r) => ({
      id: r.name,
      href: r.links[0].href,
      external: true,
      thumb: undefined,
      abstract: r.description,
      cells: {
        symbol: <SchematicSymbol kind={r.symbol} size={40} />,
        component: r.name,
        material: r.language ?? '—',
        qty: qtyOf(r),
      },
    }));
}

/* ------------------------------------ Writing (W) ------------------------------------ */

export const writingColumns: Column[] = [
  { key: 'sheet', label: 'Sheet', width: '72px', mono: true },
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date', width: '170px' },
  { key: 'flags', label: 'Flags', width: '140px' },
];

export function writingRows(): Row[] {
  return sortedArticles().map((a) => ({
    id: a.sheet,
    href: `/writing/${a.slug}`,
    cells: {
      sheet: a.sheet,
      title: a.title,
      date: formatDate(a.date),
      flags: (
        <span className="flex flex-wrap items-center gap-2">
          <span className="t-micro">{categoryLabels[a.category]}</span>
          {a.aiGenerated && <StatusChip kind="ai" />}
        </span>
      ),
    },
  }));
}

/* ------------------------------------- Works (P) ------------------------------------- */

export const worksColumns: Column[] = [
  { key: 'sheet', label: 'Sheet', width: '72px', mono: true },
  { key: 'work', label: 'Work' },
  { key: 'scope', label: 'Scope', width: '260px' },
  { key: 'year', label: 'Year', width: '72px', mono: true },
  { key: 'ref', label: 'Ref', width: '150px' },
];

export function worksRows(): Row[] {
  return works.map((w) => ({
    id: w.sheet,
    href: w.href,
    external: true,
    cells: { sheet: w.sheet, work: w.title, scope: w.scope, year: w.year, ref: `${w.ref} ↗` },
  }));
}

/* ------------------------------------ Contact (C) ------------------------------------ */

export const contactColumns: Column[] = [
  { key: 'sheet', label: 'Sheet', width: '72px', mono: true },
  { key: 'title', label: 'Title' },
];

export const contactRows = (): Row[] => [
  { id: 'C-500', href: '/contact', cells: { sheet: 'C-500', title: `Contact · ${SITE.email}` } },
];
