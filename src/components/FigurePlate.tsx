import { useCallback, useRef, useState } from 'react';
import { figureMeta, figurePlate } from '../lib/figures';
import type { FigureMeta } from '../lib/figures';
import { captionTitle, figureAlt, figureId } from '../lib/markdown';
import type { FigureCut, FigurePlateKind, ImageBlock } from '../lib/markdown';
import { FigureLightbox } from './FigureLightbox';

export interface FigurePlateProps {
  /** Document-order figure number; becomes the anchor id `fig-{n}`. */
  n: number;
  src: string;
  caption: string;
  /** What is visible in the picture. Defaults to the caption before its first em dash. */
  alt?: string;
  /** Text legible on an instrument screen in the picture. */
  readout?: string;
  /** Section cut (E-102): labels the figure and sets data-cut for the signal-chain diagram. */
  cut?: FigureCut;
  /** Defaults to the class measured by scripts/figure-meta.mjs (src/generated/figures.json). */
  plate?: FigurePlateKind;
  maxHeight?: number;
  fit?: 'contain' | 'cover';
  /** CSS max-width of the whole figure, for example "880px". */
  width?: string;
  /** Eager loading, for the cover figure only. */
  eager?: boolean;
}

/** Props for a parsed ::image block. The page adds `n`, and `eager` for the cover figure. */
export function figureProps(block: ImageBlock): Omit<FigurePlateProps, 'n' | 'eager'> {
  return {
    src: block.src,
    caption: block.caption ?? '',
    alt: figureAlt(block),
    readout: block.readout,
    cut: block.cut,
    plate: block.plate,
    maxHeight: block.maxHeight,
    fit: block.fit,
    width: block.width,
  };
}

/** A raster is never drawn larger than its own pixels: stretching a 300 px scope capture only softens it. */
const MAX_UPSCALE = 1;
/** Pixels the plate adds around the picture: 16 px matte padding each side, or the 1 px frame. */
const FRAME: Record<FigurePlateKind, number> = { light: 32, none: 2 };

function plateMaxWidth(meta: FigureMeta | undefined, plate: FigurePlateKind, maxHeight: number | undefined): number | undefined {
  if (!meta) return undefined;
  const byHeight = maxHeight ? (maxHeight * meta.w) / meta.h : Infinity;
  return Math.round(Math.min(meta.w * MAX_UPSCALE, byHeight)) + FRAME[plate];
}

/** The L-shaped corner ticks that signal "opens a detail view"; drawn with borders so they transition with the colour. */
const TICKS = [
  'left-1 top-1 border-l border-t',
  'right-1 top-1 border-r border-t',
  'bottom-1 left-1 border-b border-l',
  'bottom-1 right-1 border-b border-r',
] as const;
const TICK_COLOUR: Record<FigurePlateKind, string> = {
  light: 'group-hover:border-paper-3 group-focus-visible:border-paper-3',
  none: 'group-hover:border-ink-3 group-focus-visible:border-ink-3',
};

/**
 * One numbered figure: the picture on its plate, a button that opens FigureLightbox, then the caption row
 * (FIG. n, the section cut, the caption, the instrument readout).
 */
export function FigurePlate({ n, src, caption, alt, readout, cut, plate, maxHeight, fit = 'contain', width, eager = false }: FigurePlateProps) {
  const meta = figureMeta(src);
  const kind = figurePlate(src, plate);
  const text = alt?.trim() || captionTitle(caption) || `Figure ${n}`;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  const fixedHeight = fit === 'cover' && maxHeight !== undefined;
  const cap = fixedHeight ? undefined : plateMaxWidth(meta, kind, maxHeight);

  return (
    <>
      <figure id={figureId(n)} data-cut={cut} className="scroll-mt-20 lg:scroll-mt-6" style={width ? { maxWidth: width } : undefined}>
        <button
          ref={trigger}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="group relative block w-full cursor-zoom-in text-left"
          style={cap ? { maxWidth: cap } : undefined}
        >
          <span className={kind === 'light' ? 'plate-light block p-4' : 'block border border-rule bg-paper-2'}>
            <img
              src={src}
              alt={text}
              width={meta?.w}
              height={meta?.h}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
              className={`block h-auto w-full ${kind === 'light' ? 'mix-blend-multiply' : ''}`}
              style={fixedHeight ? { height: maxHeight, objectFit: 'cover' } : undefined}
            />
          </span>
          {TICKS.map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`pointer-events-none absolute h-2 w-2 border-transparent transition-colors duration-[120ms] ease-linear ${pos} ${TICK_COLOUR[kind]}`}
            />
          ))}
          <span className="sr-only"> (opens detail view)</span>
        </button>
        <figcaption className="mt-3 grid grid-cols-[4rem_minmax(0,1fr)] items-baseline gap-x-3">
          <span className="t-label text-ink-3">Fig. {n}</span>
          <span className="block">
            {cut && <span className="t-label block text-redline">Section {cut}-{cut}</span>}
            {caption && <span className="t-caption block">{caption}</span>}
            {readout && (
              <span className="t-caption mt-1 block text-ink-3">
                <span className="sr-only">Screen readout: </span>
                {readout}
              </span>
            )}
          </span>
        </figcaption>
      </figure>
      <FigureLightbox open={open} n={n} src={src} alt={text} caption={caption} onClose={close} />
    </>
  );
}
