import type { ComponentType } from 'react';
import { notFoundRoute, routes } from '../routes';
import type { PageProps } from '../routes';
import type { Sheet } from '../data/sheets';

/**
 * Route chunk and data cache (design spec 9.2). React.lazy cannot be prerendered with
 * renderToString, so routes load through this cache: the server and the client both await
 * preloadRoute() before rendering, and App reads the result synchronously. On client navigation a
 * missing entry suspends until the chunk and its data arrive.
 */
export interface RouteEntry {
  Page: ComponentType<PageProps<unknown>>;
  data: unknown;
  sheet: Sheet;
}

const normalize = (pathname: string): string => {
  const path = pathname.split(/[?#]/)[0];
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
};

export const resolveRoute = (pathname: string) => {
  const path = normalize(pathname);
  return routes.find((r) => r.path === path) ?? notFoundRoute;
};

const cache = new Map<string, RouteEntry>();
const pending = new Map<string, Promise<void>>();

export const readRoute = (pathname: string): RouteEntry | undefined => cache.get(resolveRoute(pathname).path);

export function preloadRoute(pathname: string): Promise<void> {
  const route = resolveRoute(pathname);
  if (cache.has(route.path)) return Promise.resolve();
  let promise = pending.get(route.path);
  if (!promise) {
    promise = (async () => {
      const mod = await route.load();
      const data = mod.loadData ? await mod.loadData(route.sheet) : undefined;
      cache.set(route.path, { Page: mod.default as ComponentType<PageProps<unknown>>, data, sheet: route.sheet });
    })();
    // A failed load must be retryable.
    promise.catch(() => pending.delete(route.path));
    pending.set(route.path, promise);
  }
  return promise;
}
