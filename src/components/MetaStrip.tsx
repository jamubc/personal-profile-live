export interface MetaStripCell {
  label: string;
  /** Cells without a value are left out, never padded with a dash. */
  value?: string | null;
}

interface MetaStripProps {
  cells: MetaStripCell[];
}

type FilledCell = { label: string; value: string };

/**
 * Hairline-separated facts about a sheet: a micro label over a 14px value. Two columns on a phone,
 * as many 220px columns as fit from 768px. Rules are cell borders rather than a filled grid gap,
 * so an incomplete last row leaves empty paper, not empty rule colour.
 */
export function MetaStrip({ cells }: MetaStripProps) {
  const filled = cells.filter((c): c is FilledCell => Boolean(c.value?.trim()));
  if (filled.length === 0) return null;

  return (
    <dl className="m-0 grid grid-cols-2 border-l border-t border-rule md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      {filled.map((cell) => (
        <div key={cell.label} className="min-w-0 border-b border-r border-rule px-4 py-3">
          <dt className="t-micro">{cell.label}</dt>
          <dd className="m-0 mt-1 font-sans text-sm leading-normal text-ink [overflow-wrap:anywhere]">{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}
