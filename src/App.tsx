import { useLocation } from 'react-router-dom';
import { SheetShell } from './components/SheetShell';
import { revisionsFor } from './data/revisions';
import { preloadRoute, readRoute } from './lib/route-cache';

/** Resolves the current URL to a sheet, suspending on client navigation until its chunk is ready. */
export function App() {
  const { pathname } = useLocation();
  const entry = readRoute(pathname);
  if (!entry) throw preloadRoute(pathname);
  const { Page, data, sheet } = entry;
  return (
    <SheetShell sheet={sheet} revisions={revisionsFor(sheet.id)} scale={sheet.id === 'G-001' ? '1:1' : 'NTS'}>
      <Page sheet={sheet} data={data} />
    </SheetShell>
  );
}
