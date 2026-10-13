import { useId } from 'react';
import type { CSSProperties } from 'react';
import './ResultStrip.css';

export interface ResultStripCell {
  value: string;
  label: string;
  note?: string;
}

interface ResultStripProps {
  /** Names the strip ("Schedule of results"); shown above it in label type. */
  label: string;
  cells: ResultStripCell[];
  /** lg: 44px numerals on the E sheets. md: 32px numerals inside the cover plate. */
  size: 'lg' | 'md';
  /** Provenance, appended to the label line ("Published figures — BORAY ET AL., 2024. ..."). */
  source?: string;
}

/** Values longer than this overflow a cell when four share the sheet at the lg numeral size. */
const MAX_FOUR_UP_CHARS = 8;

/** The headline numbers of a sheet: value over label over note, as equal cells that stack to rows on a phone. */
export function ResultStrip({ label, cells, size, source }: ResultStripProps) {
  const labelId = useId();
  if (cells.length === 0) return null;
  const long = cells.some((cell) => cell.value.length > MAX_FOUR_UP_CHARS);

  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className="rs-label t-label">
        {source ? `${label} — ${source}` : label}
      </p>
      <div className="rs-frame" data-count={cells.length} data-long={long || undefined}>
        <dl className="rs-cells" style={{ '--rs-n': cells.length } as CSSProperties}>
          {cells.map((cell) => (
            <div key={cell.label} className="rs-cell">
              <dt className="rs-term t-label">{cell.label}</dt>
              <dd className={`rs-value ${size === 'lg' ? 't-numeral-lg' : 't-numeral-md'}`}>{cell.value}</dd>
              {cell.note && <dd className="rs-note t-caption">{cell.note}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
