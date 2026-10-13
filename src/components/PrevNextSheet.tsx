import type { Sheet } from '../data/sheets';
import { AppLink } from './AppLink';

interface PrevNextSheetProps {
  prev?: Sheet;
  next?: Sheet;
  /** The parent index sheet; stands in for the previous sheet on the first sheet of a series. */
  index?: Sheet;
}

const CELL =
  'group flex min-h-14 min-w-0 items-center gap-3 px-4 py-3 text-ink-2 transition-colors duration-[120ms] ease-linear hover:bg-paper-3 hover:text-ink focus-visible:-outline-offset-2';

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 fill-none stroke-current text-ink-3 transition-colors duration-[120ms] ease-linear group-hover:text-pen"
      strokeWidth="1.5"
    >
      {direction === 'left' ? <path d="M14 8H2M6 4L2 8l4 4" /> : <path d="M2 8h12M10 4l4 4-4 4" />}
    </svg>
  );
}

/**
 * The end of a sheet: a two-cell hairline row. Left, the previous sheet, or the index when there is
 * none; right, the next sheet. A missing cell leaves its half empty so the other never changes place.
 */
export function PrevNextSheet({ prev, next, index }: PrevNextSheetProps) {
  const back = prev ?? index;
  if (!back?.route && !next?.route) return null;

  return (
    <nav aria-label="Sheet navigation" className="relative grid grid-cols-2 border border-rule-strong">
      <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-rule-strong" />
      {back?.route && (
        <AppLink to={back.route} className={`${CELL} col-start-1`}>
          <Arrow direction="left" />
          <span className="min-w-0">
            <span className="sr-only">{prev ? 'Previous sheet: ' : 'Back to '}</span>
            <span className="t-label whitespace-nowrap text-ink transition-colors duration-[120ms] ease-linear group-hover:text-pen">{back.id}</span>{' '}
            <span className="font-sans text-sm leading-snug">{back.short ?? back.title}</span>
          </span>
        </AppLink>
      )}
      {next?.route && (
        <AppLink to={next.route} className={`${CELL} col-start-2 justify-end text-right`}>
          <span className="t-label">
            Next sheet{' '}
            <span className="whitespace-nowrap text-ink transition-colors duration-[120ms] ease-linear group-hover:text-pen">{next.id}</span>
            <span className="sr-only">: {next.title}</span>
          </span>
          <Arrow direction="right" />
        </AppLink>
      )}
    </nav>
  );
}
