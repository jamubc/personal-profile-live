interface GeneralNotesProps {
  /** Note text without the "NOTE n:" prefix. */
  notes: string[];
  id?: string;
}

function NoteList({ notes }: { notes: string[] }) {
  return (
    <ol aria-label="General notes" className="m-0 grid list-none gap-2 p-0">
      {notes.map((note, i) => (
        <li key={note} className="t-label grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 tracking-[0.04em] text-ink-2">
          <span>NOTE {i + 1}:</span>
          <span>{note}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Numbered drawing notes. Always open from 768px; a native disclosure below. Both are rendered and
 * CSS picks one, so there is no layout shift and no script, and the closed state is never the
 * only way to read the notes on a wide screen.
 */
export function GeneralNotes({ notes, id = 'general-notes' }: GeneralNotesProps) {
  return (
    <div id={id}>
      <details className="group border border-rule-strong md:hidden">
        <summary className="t-label flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 text-ink [&::-webkit-details-marker]:hidden">
          <span>General notes ({notes.length})</span>
          <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 fill-none stroke-current" strokeWidth="1.5">
            <path d="M1 6h10" />
            <path d="M6 1v10" className="group-open:hidden" />
          </svg>
        </summary>
        <div className="border-t border-rule px-4 py-3">
          <NoteList notes={notes} />
        </div>
      </details>
      <div className="hidden md:block">
        <p className="t-label mb-3 text-ink-3">General notes</p>
        <NoteList notes={notes} />
      </div>
    </div>
  );
}
