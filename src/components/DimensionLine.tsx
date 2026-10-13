import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import './DimensionLine.css';

interface DimensionLineProps {
  /** Measure this element: the line spans its rendered width and prints it in pixels. */
  targetRef?: RefObject<HTMLElement>;
  /** A static value instead of a measurement, for a dimension the page already knows. */
  value?: string;
  unit?: string;
  className?: string;
}

/**
 * A dimension line in the drafting sense: extension lines, arrowheads and a value. With `targetRef`
 * the value is the real rendered width of that element, measured after the fonts are in and kept
 * current by a ResizeObserver, so NOTE 1 ("all dimensions in pixels") is true of it. The block is
 * 20px tall on the server too, so hydration moves nothing; it stays invisible until it has a number.
 */
export function DimensionLine({ targetRef, value, unit = 'px', className }: DimensionLineProps) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = targetRef?.current;
    if (!el) return;
    let ro: ResizeObserver | undefined;
    let cancelled = false;
    const measure = () => setWidth(Math.round(el.getBoundingClientRect().width));
    const ready = typeof document !== 'undefined' && 'fonts' in document ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      measure();
      ro = new ResizeObserver(measure);
      ro.observe(el);
    });
    return () => {
      cancelled = true;
      ro?.disconnect();
    };
  }, [targetRef]);

  const measuring = targetRef !== undefined;
  const label = measuring ? (width === null ? '' : `${width} ${unit}`) : value ?? '';
  return (
    <span
      aria-hidden="true"
      className={`dim ${className ?? ''}`}
      data-measuring={measuring && width === null ? 'true' : undefined}
      style={measuring && width !== null ? { width } : undefined}
    >
      <span className="dim-line" />
      <span className="dim-label">{label}</span>
    </span>
  );
}
