import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/** Scallop pitch and depth in CSS pixels. */
const PITCH = 14;
const DEPTH = 5;
const PAD_X = 12;
const PAD_Y = 8;

/** A closed path of outward arcs around a w x h box, like a drafter's revision cloud. */
function cloudPath(w: number, h: number): string {
  const nx = Math.max(2, Math.round(w / PITCH));
  const ny = Math.max(2, Math.round(h / PITCH));
  const sx = w / nx;
  const sy = h / ny;
  const r = (s: number) => Math.sqrt((s / 2) ** 2 + DEPTH ** 2);
  const x0 = DEPTH;
  const y0 = DEPTH;
  let d = `M${x0} ${y0}`;
  for (let i = 1; i <= nx; i++) d += ` A${r(sx)} ${r(sx)} 0 0 1 ${x0 + i * sx} ${y0}`;
  for (let i = 1; i <= ny; i++) d += ` A${r(sy)} ${r(sy)} 0 0 1 ${x0 + w} ${y0 + i * sy}`;
  for (let i = nx - 1; i >= 0; i--) d += ` A${r(sx)} ${r(sx)} 0 0 1 ${x0 + i * sx} ${y0 + h}`;
  for (let i = ny - 1; i >= 0; i--) d += ` A${r(sy)} ${r(sy)} 0 0 1 ${x0} ${y0 + i * sy}`;
  return `${d} Z`;
}

/**
 * Markup-red revision cloud around inline content. Used once, on the 404 sheet, around the requested
 * path. The outline follows the content's measured size; before measurement (and on the server) it
 * draws a cloud sized to the content's estimated width so the markup still reads without scripts.
 */
export function RevisionCloud({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = (box?.w ?? 120) + PAD_X * 2;
  const h = (box?.h ?? 20) + PAD_Y * 2;
  return (
    <span className="relative inline-block" style={{ padding: `${PAD_Y + DEPTH}px ${PAD_X + DEPTH}px` }}>
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 overflow-visible"
        width="100%"
        height="100%"
        viewBox={`0 0 ${w + DEPTH * 2} ${h + DEPTH * 2}`}
        preserveAspectRatio="none"
      >
        <path d={cloudPath(w, h)} fill="none" stroke="var(--redline)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span ref={ref} className="relative inline-block">
        {children}
      </span>
    </span>
  );
}
