import { useLocation } from 'react-router-dom';
import { SheetShell } from './components/SheetShell';
import { revisionsFor } from './data/revisions';
import { preloadRoute, readRoute, routeFailure } from './lib/route-cache';

/** Resolves the current URL to a sheet, suspending on client navigation until its chunk is ready. */
export function App() {
  const { pathname } = useLocation();
  const entry = readRoute(pathname);
  if (!entry) {
    // A chunk that failed to load (a stale tab after a deploy) is a real error for RouteErrorBoundary,
    // not something to suspend on again.
    const failure = routeFailure(pathname);
    if (failure) throw failure;
    throw preloadRoute(pathname);
  }
  const { Page, data, sheet } = entry;
  return (
    <SheetShell sheet={sheet} revisions={revisionsFor(sheet.id)} scale={sheet.id === 'G-001' ? '1:1' : 'NTS'}>
      <Page sheet={sheet} data={data} />
    </SheetShell>
  );
}
