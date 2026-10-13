/**
 * The drawing-set registry: the only place sheet numbers, routes and titles live.
 * It drives the index column, mobile index, breadcrumbs, header rail, title block, prev/next,
 * sitemap, llms.txt and the prerender route list. Numbers are permanent and never reused;
 * new sheets append within their discipline. W sheets are numbered by insertion, not date.
 */
export type Discipline = 'G' | 'E' | 'S' | 'W' | 'P' | 'C' | 'X';
export type SheetStatus = 'issued' | 'hold' | 'inline' | 'withheld';
export type SheetKind = 'cover' | 'schedule' | 'case' | 'post' | 'contact' | 'error';

export interface Sheet {
  id: string;
  discipline: Discipline;
  /** Always shown beside the number, never the number alone. */
  title: string;
  /** Short label for the drawing index. */
  short?: string;
  /** Text after "SHEET {id} ·" in the header rail. Defaults to the discipline name. */
  rail?: string;
  /** Null for hold, inline and withheld sheets: no route, no sitemap entry. */
  route: string | null;
  status: SheetStatus;
  kind: SheetKind;
  /** Case and post sheets. */
  slug?: string;
  /** Path under src/content without extension. */
  contentFile?: string;
}

export const DISCIPLINE_NAMES: Record<Discipline, string> = {
  G: 'General',
  E: 'Engineering & Research',
  S: 'Open source',
  W: 'Writing',
  P: 'Works',
  C: 'Contact',
  X: 'Error',
};

/** One-word discipline labels for the narrow header rail. */
export const DISCIPLINE_SHORT: Record<Discipline, string> = {
  G: 'Cover',
  E: 'Engineering',
  S: 'Open source',
  W: 'Writing',
  P: 'Works',
  C: 'Contact',
  X: 'Error',
};

export const sheets: Sheet[] = [
  { id: 'G-001', discipline: 'G', title: 'Andrew Manson: engineering and open-source portfolio', short: 'Cover', rail: 'Cover & drawing index', route: '/', status: 'issued', kind: 'cover' },
  { id: 'E-100', discipline: 'E', title: 'Engineering & Research', short: 'Engineering', route: '/projects', status: 'issued', kind: 'schedule' },
  { id: 'E-101', discipline: 'E', title: 'Automated Apple Grade Classification', route: '/projects/apple-classifier', status: 'issued', kind: 'case', slug: 'apple-classifier', contentFile: 'apple-classifier' },
  { id: 'E-102', discipline: 'E', title: 'Analog PPG Heart Rate Monitor', route: '/projects/ppg-monitor', status: 'issued', kind: 'case', slug: 'ppg-monitor', contentFile: 'ppg-monitor' },
  { id: 'E-103', discipline: 'E', title: 'Okanagan Hydrail: Economic Feasibility', route: '/projects/okanagan-hydrail', status: 'issued', kind: 'case', slug: 'okanagan-hydrail', contentFile: 'okanagan-hydrail' },
  { id: 'E-104', discipline: 'E', title: 'Repairing a Damaged Exhaust System', route: null, status: 'hold', kind: 'case' },
  { id: 'E-105', discipline: 'E', title: 'Repairing and Restoring Rust Damage — Automotive', route: null, status: 'hold', kind: 'case' },
  { id: 'E-106', discipline: 'E', title: 'Rebuilding a 4-Cylinder Engine', route: null, status: 'hold', kind: 'case' },
  { id: 'E-107', discipline: 'E', title: 'Photonics & Optical Systems', route: null, status: 'inline', kind: 'case', contentFile: 'photonics-optical-systems' },
  // Withheld: never listed anywhere public. The file stays untouched until the author rewrites it.
  { id: 'E-108', discipline: 'E', title: 'Wildfire robot', route: null, status: 'withheld', kind: 'case', contentFile: 'wildfire-robot' },
  { id: 'S-200', discipline: 'S', title: 'Open source', short: 'Open source', route: '/open-source', status: 'issued', kind: 'schedule' },
  { id: 'W-300', discipline: 'W', title: 'Writing', short: 'Writing', route: '/writing', status: 'issued', kind: 'schedule' },
  { id: 'W-301', discipline: 'W', title: 'How AI requirements, ARM processors, and foundry wars are redefining the light CPU market', route: '/writing/light-computing', status: 'issued', kind: 'post', slug: 'light-computing', contentFile: 'writing/light-computing' },
  { id: 'W-302', discipline: 'W', title: 'WeatherNext 2: AI weather forecasting for the scenario era', route: '/writing/weathernext-2', status: 'issued', kind: 'post', slug: 'weathernext-2', contentFile: 'writing/weathernext-2' },
  { id: 'P-400', discipline: 'P', title: 'Works', short: 'Works', route: '/works', status: 'issued', kind: 'schedule' },
  { id: 'C-500', discipline: 'C', title: 'Contact', short: 'Contact', route: '/contact', status: 'issued', kind: 'contact' },
  { id: 'X-404', discipline: 'X', title: 'Sheet not in set', route: '/404', status: 'issued', kind: 'error' },
];

/** The six top-level sheets shown in the drawing index. */
export const INDEX_SHEET_IDS = ['G-001', 'E-100', 'S-200', 'W-300', 'P-400', 'C-500'] as const;

export const sheetById = (id: string): Sheet | undefined => sheets.find((s) => s.id === id);

export const indexSheets: Sheet[] = INDEX_SHEET_IDS.map((id) => sheetById(id)!);

/** A sheet with a page: the type says so, so pages never have to assert that `route` is set. */
export type PublishedSheet = Sheet & { route: string };
export const hasRoute = (s: Sheet): s is PublishedSheet => s.route !== null;

/** Sheets that get a prerendered page, a sitemap entry and an llms.txt line. */
export const publishedSheets = (): PublishedSheet[] => sheets.filter((s): s is PublishedSheet => s.status === 'issued' && hasRoute(s) && s.kind !== 'error');

/** The index sheet a case or post belongs under (E-101 → E-100, W-301 → W-300). */
export const parentOf = (sheet: Sheet): Sheet | undefined =>
  sheet.kind === 'case' ? sheetById('E-100') : sheet.kind === 'post' ? sheetById('W-300') : undefined;

/** Previous and next issued sheet of the same kind, by sheet number. No wrap-around. */
export function neighbours(sheet: Sheet): { prev?: Sheet; next?: Sheet; index?: Sheet } {
  const series = sheets.filter((s) => s.kind === sheet.kind && s.discipline === sheet.discipline && s.status === 'issued' && s.route);
  const i = series.findIndex((s) => s.id === sheet.id);
  return { prev: i > 0 ? series[i - 1] : undefined, next: i >= 0 && i < series.length - 1 ? series[i + 1] : undefined, index: parentOf(sheet) };
}
