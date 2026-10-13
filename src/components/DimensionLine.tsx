import type { ReactNode } from 'react';
import { useElementWidth } from '../lib/hooks';

interface DimensionLineProps {
  children: ReactNode;
  className?: string;
  unit?: string;
}

const HEIGHT = 18;
const ARROW = 6;

/**
 * Wraps inline content and draws a dimension line beneath it that prints the
 * content's measured width. The number is real: it comes from ResizeObserver,
 * so it changes when the window is resized. Renders nothing extra until the
 * first measurement (so prerendered HTML carries no placeholder number).
 */
export function DimensionLine({ children, className, unit = 'px' }: DimensionLineProps) {
  const [ref, width] = useElementWidth<HTMLSpanElement>();
  const mid = HEIGHT / 2;
  const pen = 'var(--pen, #5FD3F3)';

  return (
    <span className={className} style={{ display: 'inline-block', maxWidth: '100%' }}>
      <span ref={ref} style={{ display: 'inline-block', maxWidth: '100%' }}>
        {children}
      </span>
      <span aria-hidden="true" style={{ display: 'block', height: HEIGHT, position: 'relative' }}>
        {width > 0 && (
          <>
            <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} style={{ position: 'absolute', left: 0, top: 0 }}>
              <g stroke={pen} strokeWidth="1" fill="none">
                <line x1="0.5" y1="0" x2="0.5" y2={HEIGHT} />
                <line x1={width - 0.5} y1="0" x2={width - 0.5} y2={HEIGHT} />
                <line x1={ARROW} y1={mid} x2={width - ARROW} y2={mid} />
              </g>
              <g fill={pen}>
                <path d={`M0.5 ${mid} l${ARROW} -3 v6 z`} />
                <path d={`M${width - 0.5} ${mid} l-${ARROW} -3 v6 z`} />
              </g>
            </svg>
            <span
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                padding: '0 8px',
                background: 'var(--paper, #0B0E14)',
                color: pen,
                font: '500 12px/18px var(--font-mono, ui-monospace, monospace)',
                whiteSpace: 'nowrap',
              }}
            >
              {width} {unit}
            </span>
          </>
        )}
      </span>
    </span>
  );
}
