import type { ComponentType } from 'react';
import { hasRoute, publishedSheets, sheetById } from './data/sheets';
import type { PublishedSheet, Sheet } from './data/sheets';

export interface PageProps<T> {
  sheet: PublishedSheet;
  data: T;
}

/** A page module: the component and, optionally, the data it needs before it can render. */
export interface PageModule {
  default: ComponentType<PageProps<never>>;
  loadData?: (sheet: Sheet) => Promise<unknown>;
}

export interface RouteDef {
  path: string;
  sheet: PublishedSheet;
  load: () => Promise<PageModule>;
}

function pageFor(sheet: Sheet): () => Promise<PageModule> {
  switch (sheet.id) {
    case 'G-001': return () => import('./pages/CoverPage');
    case 'E-100': return () => import('./pages/EngineeringIndexPage');
    case 'S-200': return () => import('./pages/OpenSourcePage');
    case 'W-300': return () => import('./pages/WritingIndexPage');
    case 'P-400': return () => import('./pages/WorksPage');
  }
  switch (sheet.kind) {
    case 'case': return () => import('./pages/CaseStudyPage');
    case 'post': return () => import('./pages/PostPage');
    case 'contact': return () => import('./pages/ContactPage');
    case 'error': return () => import('./pages/NotFoundPage');
  }
  throw new Error(`No page for sheet ${sheet.id}`);
}

/**
 * One route per published sheet, generated from the registry so the two cannot drift, plus the 404
 * sheet. Unknown paths resolve to the 404 route.
 */
const notFoundSheet = sheetById('X-404');
if (!notFoundSheet || !hasRoute(notFoundSheet)) throw new Error('The registry needs an X-404 sheet with a route');
export const routes: RouteDef[] = [...publishedSheets(), notFoundSheet].map((sheet) => ({
  path: sheet.route,
  sheet,
  load: pageFor(sheet),
}));

export const notFoundRoute: RouteDef = routes.find((r) => r.sheet.id === 'X-404')!;
