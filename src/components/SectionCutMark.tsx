import type { CSSProperties, MouseEvent } from 'react';
import './ChainDiagram.css';

export interface SectionCutMarkProps {
  id: 'A' | 'B' | 'C';
  active?: boolean;
  href: string;
  /** Plain-language description of what is at the cut; becomes the accessible name. */
  label: string;
  /** Figure numbers the cut covers, named in the accessible label; the link goes to the first. */
  figures?: number[];
  style?: CSSProperties;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A section cut in markup red: the cut line crosses the signal path, the ticks give the viewing
 * direction and the letter names the section. Links to the figure that shows what the signal looks
 * like at that point; hover, focus or a matching figure in view thickens the mark.
 * 28 x 64 px; the signal path crosses it at y = 32.
 */
const figureList = (figures: number[]): string => (figures.length > 1 ? `Figures ${figures.slice(0, -1).join(', ')} and ${figures[figures.length - 1]}` : `Figure ${figures[0]}`);

export function SectionCutMark({ id, active = false, href, label, figures = [], style, onClick }: SectionCutMarkProps) {
  const name = `Section ${id}-${id}${figures.length ? `, ${figureList(figures)}` : ''}: ${label}`;
  return (
    <a href={href} aria-label={name} data-active={active ? 'true' : undefined} className="cut-mark" style={style} onClick={onClick}>
      <svg width="28" height="64" viewBox="0 0 28 64" fill="none" aria-hidden="true" focusable="false">
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="butt">
          <path d="M14 16v9M14 39v9" />
          <path d="M14 17h7M14 47h7" />
        </g>
        <path d="M19 14l3 3-3 3M19 44l3 3-3 3" stroke="currentColor" strokeWidth="1.5" />
        <text x="14" y="11" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="12" fontWeight="500">
          {id}
        </text>
      </svg>
    </a>
  );
}
