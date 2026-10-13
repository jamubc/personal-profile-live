import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppLink } from '../components/AppLink';
import { RevisionCloud } from '../components/RevisionCloud';
import { indexSheets, sheetById } from '../data/sheets';
import { useSeo } from '../lib/seo';
import { META } from '../seo/meta';
import type { PageProps } from '../routes';

export default function NotFoundPage({ sheet }: PageProps<undefined>) {
  useSeo({ ...META[sheet.id], path: sheet.route!, noindex: true });

  // The server cannot know which address was requested, so it renders a neutral phrase and the
  // client fills in the path after hydration.
  const { pathname } = useLocation();
  const [shown, setShown] = useState<string | null>(null);
  useEffect(() => setShown(pathname), [pathname]);

  const list = [...indexSheets, ...['E-101', 'E-102', 'E-103'].map((id) => sheetById(id)!)];
  return (
    <>
      <h1 className="t-h1">Sheet not in set.</h1>
      <p className="mt-8 font-mono text-sm">
        <RevisionCloud>{shown ?? 'this address'}</RevisionCloud>
      </p>
      <p className="t-lead mt-8 max-w-measure">No sheet with this path exists in set AM-PF.</p>
      <p className="t-body mt-3 max-w-measure text-ink-2">The link may be mistyped, or the page may have moved. Every sheet in the set is listed below.</p>
      <nav aria-label="Sheets in this set" className="mt-12 max-w-measure">
        <h2 className="t-label text-ink-3">Sheets in this set</h2>
        <ul className="mt-3 border-t border-rule">
          {list.map((s) => (
            <li key={s.id} className="border-b border-rule">
              <AppLink to={s.route ?? '/'} className="flex min-h-[48px] items-center justify-between gap-4 px-1 hover:bg-paper-3 md:px-3">
                <span>{s.short ?? s.title}</span>
                <span className="font-mono text-[13px] text-ink-3">{s.id}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>
      <AppLink to="/" className="t-label mt-8 inline-flex min-h-[44px] items-center gap-2 text-pen hover:text-pen-hover">
        Back to the cover <span aria-hidden="true">→</span>
      </AppLink>
    </>
  );
}
