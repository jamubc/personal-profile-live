import generated from '../generated/figures.json';
import type { FigurePlateKind } from './markdown';

/** Measured by scripts/figure-meta.mjs for every raster in a project images folder. */
export interface FigureMeta {
  /** Intrinsic pixel size, so an <img> reserves its space before it loads. */
  w: number;
  h: number;
  /** Mean luminance 0-255. */
  lum: number;
  /** 'light' for pictures on a white page (schematics, handwritten notes, the poster), else 'none'. */
  plate: FigurePlateKind;
}

const table = generated as Record<string, FigureMeta | undefined>;

/** Metadata for a figure URL such as "/projects/ppg-monitor/images/scope-ppg-raw.webp"; undefined for anything else. */
export const figureMeta = (src: string): FigureMeta | undefined => table[src];

/** The plate a figure is drawn on: the directive's override, else the measured class, else none. */
export const figurePlate = (src: string, override?: FigurePlateKind): FigurePlateKind => override ?? table[src]?.plate ?? 'none';
