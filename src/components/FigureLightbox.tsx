import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { figureMeta } from '../lib/figures';
import './FigureLightbox.css';

export interface FigureLightboxProps {
  open: boolean;
  n: number;
  src: string;
  alt: string;
  caption: string;
  onClose: () => void;
}

/**
 * Detail view of one figure in a native <dialog>: showModal() gives the focus trap, inert background and Esc.
 * It stays mounted so the close can animate; the picture and caption mount on first open, so a closed
 * lightbox adds neither a request nor duplicate text to the page. `onClose` fires for every way of closing
 * (Esc, the CLOSE button, a click on the scrim); the owner puts focus back on its trigger there.
 */
export function FigureLightbox({ open, n, src, alt, caption, onClose }: FigureLightboxProps) {
  const titleId = `lightbox-${n}-title`;
  const dialog = useRef<HTMLDialogElement>(null);
  const [seen, setSeen] = useState(open);
  if (open && !seen) setSeen(true);
  const meta = figureMeta(src);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // The scrim is the dialog's own ::backdrop, so a click that lands on the dialog element outside its box is a scrim click.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      if (e.target !== el) return;
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) el.close();
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      className="figure-lightbox"
      style={meta ? ({ '--figure-w': `${meta.w}px` } as CSSProperties) : undefined}
    >
      {seen && (
        <>
          <header className="flex items-center justify-between gap-4 border-b border-rule-strong px-4 py-2">
            <h2 id={titleId} className="t-label">Detail — Fig. {n}</h2>
            <button type="button" className="btn" onClick={() => dialog.current?.close()}>
              Close
              <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </header>
          {/* A scrollable region must be reachable by keyboard (WCAG 2.1.1), so it is focusable and named. */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <div role="region" aria-label={`Figure ${n}, full size`} tabIndex={0} className="figure-lightbox__scroll scroll-region">
            <img src={src} alt={alt} width={meta?.w} height={meta?.h} decoding="async" className="figure-lightbox__img" />
          </div>
          {caption && <p className="t-caption border-t border-rule-strong px-4 py-3">{caption}</p>}
        </>
      )}
    </dialog>
  );
}
