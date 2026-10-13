/* eslint-disable jsx-a11y/no-redundant-roles, jsx-a11y/no-interactive-element-to-noninteractive-role -- ARIA table roles are re-asserted on purpose: the stacked layout turns the table elements into blocks, which strips native table semantics in some screen readers. */
import type { CSSProperties, ReactNode } from 'react';
import { AppLink } from './AppLink';
import './ScheduleTable.css';

/** Where a cell sits in the stacked layout (under 768px). */
export type StackSlot = 'lead' | 'line' | 'aside' | 'hide';

export interface Column {
  key: string;
  /** Header text. May carry a glyph; add visually hidden text if the glyph is the meaning. */
  label: ReactNode;
  /** Table layout width: a number is px, a string any CSS length. Columns without one share the rest. */
  width?: number | string;
  /**
   * 'lg': leave the column out of the table while the table is narrower than 900px (tablets, and
   * desktops from 1100px where the index column leaves 716px); the stacked layout still shows it.
   * 'md': leave it out of the stacked layout.
   */
  hideBelow?: 'md' | 'lg';
  /** Mono 14px, tabular figures. */
  mono?: boolean;
  /** Mono 12px, ink-3: tags and references. */
  quiet?: boolean;
  align?: 'right';
  /**
   * 'sheet': the sheet number. It is the row header, turns pen and grows a leader line on hover.
   * 'title': holds the row's link, thumbnail and abstract. With neither set, the first column is the
   * sheet and the second the title. Without a sheet column the title is the row header.
   */
  part?: 'sheet' | 'title';
  /**
   * Stacked placement. 'lead': on the first line beside the other lead cells, joined by a middle dot.
   * 'line' (default): its own line, in column order. 'aside': a 48px slot at the right, like the
   * thumbnail. 'hide': not shown. The sheet column defaults to 'lead'.
   */
  stack?: StackSlot;
  /** Stacked only: a small label before the value, where position does not say what it is. */
  stackLabel?: string;
}

export interface Row {
  id: string;
  /** In-site path, or an absolute URL together with `external`. Makes the whole row a link. */
  href?: string;
  external?: boolean;
  /** HOLD: not a link, not focusable, announced as disabled. */
  disabled?: boolean;
  /** Left of the title in the table, at the right in the stacked layout. 64 x 48; decorative. */
  thumb?: ReactNode;
  /** Shown under the title when the table has `showAbstract`. */
  abstract?: ReactNode;
  cells: Record<string, ReactNode>;
}

export interface ScheduleTableProps {
  /** Names the table for assistive technology; not shown. */
  caption: string;
  columns: Column[];
  rows: Row[];
  /** Header band, left: "E — Engineering & research". Decorative: the caption carries the name. */
  groupLabel?: string;
  /** Header band, right: "6 sheets · 3 issued". */
  groupCount?: string;
  /**
   * Show each row's `abstract` under its title. 'narrow': only while the table is under 900px or
   * stacked, standing in for a description column marked hideBelow 'lg' and stack 'hide'.
   */
  showAbstract?: boolean | 'narrow';
}

interface ColumnRole {
  column: Column;
  slot: StackSlot;
  isSheet: boolean;
  isTitle: boolean;
  isHeader: boolean;
}

const cx = (...parts: Array<string | false | undefined>): string => parts.filter(Boolean).join(' ');

function assignRoles(columns: Column[]): ColumnRole[] {
  const explicitSheet = columns.findIndex((c) => c.part === 'sheet');
  const explicitTitle = columns.findIndex((c) => c.part === 'title');
  const sheet = explicitSheet >= 0 ? explicitSheet : explicitTitle >= 0 ? -1 : 0;
  const title = explicitTitle >= 0 ? explicitTitle : columns.findIndex((_, i) => i !== sheet);
  const header = sheet >= 0 ? sheet : title;
  return columns.map((column, i) => {
    const isSheet = i === sheet;
    const isTitle = i === title;
    const fallback: StackSlot = isSheet ? 'lead' : column.hideBelow === 'md' ? 'hide' : 'line';
    return { column, slot: isTitle ? 'line' : (column.stack ?? fallback), isSheet, isTitle, isHeader: i === header };
  });
}

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 12 12" className="sched-arrow" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l6-6M4 3h5v5" />
    </svg>
  );
}

function RowLink({ href, external, children }: { href: string; external?: boolean; children: ReactNode }) {
  if (external) {
    return (
      <a className="sched-link" href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
        <ArrowUpRight />
      </a>
    );
  }
  return (
    <AppLink className="sched-link" to={href}>
      {children}
    </AppLink>
  );
}

interface CellProps {
  role: ColumnRole;
  row: Row;
  interactive: boolean;
  showAbstract: boolean | 'narrow';
}

function Cell({ role, row, interactive, showAbstract }: CellProps) {
  const { column, slot, isSheet, isTitle, isHeader } = role;
  const content = row.cells[column.key];
  const className = cx(
    'sched-cell',
    column.mono && 'sched-cell--mono',
    column.quiet && 'sched-cell--quiet',
    column.align === 'right' && 'sched-cell--right',
    isSheet && 'sched-cell--sheet',
    column.hideBelow === 'lg' && 'sched-hide-lg',
  );

  let body: ReactNode = content;
  if (isTitle) {
    body = (
      <div className="sched-title">
        {row.thumb && (
          <span className="sched-thumb" aria-hidden="true">
            {row.thumb}
          </span>
        )}
        <div className="sched-title-text">
          {interactive && row.href ? (
            <RowLink href={row.href} external={row.external}>
              {content}
            </RowLink>
          ) : (
            <span className="sched-name">{content}</span>
          )}
          {showAbstract && row.abstract && <div className={cx('sched-abstract', showAbstract === 'narrow' && 'sched-abstract--narrow')}>{row.abstract}</div>}
        </div>
      </div>
    );
  } else if (isSheet) {
    body = (
      <>
        <span>{content}</span>
        {interactive && <span className="leader sched-leader" aria-hidden="true" />}
      </>
    );
  }

  return isHeader ? (
    <th scope="row" role="rowheader" className={className} data-stack={slot} data-label={column.stackLabel}>
      {body}
    </th>
  ) : (
    <td role="cell" className={className} data-stack={slot} data-label={column.stackLabel}>
      {body}
    </td>
  );
}

function BodyRow({ row, roles, showAbstract }: { row: Row; roles: ColumnRole[]; showAbstract: boolean | 'narrow' }) {
  const interactive = Boolean(row.href) && !row.disabled;
  const hasAside = Boolean(row.thumb) || roles.some((r) => r.slot === 'aside' && row.cells[r.column.key] != null);
  return (
    <tr
      role="row"
      className={cx('sched-row', interactive && 'group')}
      data-link={interactive || undefined}
      data-aside={hasAside || undefined}
      aria-disabled={row.disabled || undefined}
    >
      {roles.map((role) => (
        <Cell key={role.column.key} role={role} row={row} interactive={interactive} showAbstract={showAbstract} />
      ))}
    </tr>
  );
}

/**
 * A drawing-set schedule. A real table from 768px up; below that the same markup stacks into rows
 * (see ScheduleTable.css). Rows with an `href` are whole-row links: the title is the link and a
 * stretched ::after makes the row its hit area. `disabled` rows are HOLD sheets.
 */
export function ScheduleTable({ caption, columns, rows, groupLabel, groupCount, showAbstract = false }: ScheduleTableProps) {
  if (rows.length === 0) return null;
  const roles = assignRoles(columns);
  const asideWidth = rows.some((r) => r.thumb) ? '4rem' : '3rem';

  return (
    <div className="sched" style={{ '--aside-w': asideWidth } as CSSProperties}>
      {(groupLabel || groupCount) && (
        <div className="sched-band" aria-hidden="true">
          <span className="t-label text-ink">{groupLabel}</span>
          <span className="t-label text-ink-3">{groupCount}</span>
        </div>
      )}
      <table className="sched-table" role="table">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          {roles.map(({ column }) => (
            <col key={column.key} style={{ width: column.width }} className={column.hideBelow === 'lg' ? 'sched-hide-lg' : undefined} />
          ))}
        </colgroup>
        <thead role="rowgroup">
          <tr role="row" className="sched-head-row">
            {roles.map(({ column }) => (
              <th
                key={column.key}
                scope="col"
                role="columnheader"
                className={cx('sched-th t-label', column.align === 'right' && 'sched-th--right', column.hideBelow === 'lg' && 'sched-hide-lg')}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row) => (
            <BodyRow key={row.id} row={row} roles={roles} showAbstract={showAbstract} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
