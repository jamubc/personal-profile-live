import type { Revision } from '../data/site';

interface RevisionTableProps {
  rows: Revision[];
  /** Rows shown before the rest move into a native disclosure. */
  collapseAfter?: number;
}

function Rows({ rows, caption }: { rows: Revision[]; caption: string }) {
  return (
    <table className="t-table w-full text-left">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="t-micro">
          <th scope="col" className="w-12 py-1 pr-3 font-normal">Rev</th>
          <th scope="col" className="w-28 py-1 pr-3 font-normal">Date</th>
          <th scope="col" className="py-1 pr-3 font-normal">Description</th>
          <th scope="col" className="w-10 py-1 font-normal">By</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.rev} className="border-t border-rule align-top">
            <th scope="row" className="py-2 pr-3 font-medium text-ink">{r.rev}</th>
            <td className="py-2 pr-3 text-ink-2">{r.date}</td>
            <td className="py-2 pr-3 uppercase text-ink-2">{r.description}</td>
            <td className="py-2 text-ink-2">{r.by}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Revision history, newest first. Real dates only: see scripts/revisions.mjs. */
export function RevisionTable({ rows, collapseAfter = 3 }: RevisionTableProps) {
  const shown = rows.slice(0, collapseAfter);
  const rest = rows.slice(collapseAfter);
  return (
    <div>
      <Rows rows={shown} caption="Revision history" />
      {rest.length > 0 && (
        <details className="mt-1 border-t border-rule">
          <summary className="t-label flex min-h-[44px] cursor-pointer items-center text-ink-2 hover:text-ink">
            All revisions ({rows.length})
          </summary>
          <Rows rows={rest} caption="Earlier revisions" />
        </details>
      )}
    </div>
  );
}
