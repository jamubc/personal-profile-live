import { DimensionLine } from './DimensionLine';

interface SingleLineDiagramProps {
  from: string;
  to: string;
  length: string;
  caption: string;
}

/**
 * The E-103 cover: a single-line corridor diagram with a static dimension line, because the write-up
 * has a length and two end points and nothing else that could honestly be drawn (station positions
 * are not stated, so there are no ticks). Drawn in DOM so the labels stay 12px at every width.
 */
export function SingleLineDiagram({ from, to, length, caption }: SingleLineDiagramProps) {
  return (
    <figure className="m-0">
      <div role="img" aria-label={`Single-line diagram: ${from} to ${to}, ${length}`} className="border border-rule-strong bg-paper-2 px-6 py-8 md:px-12 md:py-10">
        <div className="px-[5px]">
          <DimensionLine value={length} />
        </div>
        <div className="mt-4 flex items-center">
          <span className="block h-[10px] w-[10px] shrink-0 border-[1.5px] border-ink bg-paper-2" />
          <span className="block h-0 flex-1 border-t-2 border-ink-2" />
          <span className="block h-[10px] w-[10px] shrink-0 border-[1.5px] border-ink bg-paper-2" />
        </div>
        <div className="t-label mt-3 flex justify-between text-ink-2">
          <span className="-ml-2">{from}</span>
          <span className="-mr-2">{to}</span>
        </div>
      </div>
      <figcaption className="t-caption mt-3">{caption}</figcaption>
    </figure>
  );
}
