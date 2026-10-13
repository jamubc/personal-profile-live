import { useEffect, useRef } from 'react';
import { AppLink } from './AppLink';
import { CURRENT_REV, LINKS, SITE } from '../data/site';
import { indexSheets } from '../data/sheets';
import type { Sheet } from '../data/sheets';
import './MobileIndexDialog.css';

interface MobileIndexDialogProps {
  open: boolean;
  onClose: () => void;
  current: Sheet;
}

/** Full-screen drawing index for phones and tablets. A native <dialog>: focus trap, Esc, inert page. */
export function MobileIndexDialog({ open, onClose, current }: MobileIndexDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // If the window grows to the desktop layout while the index is open, close it.
  useEffect(() => {
    if (!open) return;
    const mql = window.matchMedia('(min-width: 1100px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [open, onClose]);

  return (
    <dialog ref={ref} className="mobile-index" aria-labelledby="mobile-index-title" onClose={onClose}>
      <div className="flex h-14 items-center justify-between border-b border-rule px-4 md:px-6">
        <h2 id="mobile-index-title" className="t-label text-ink-3">
          Drawing index
        </h2>
        <button type="button" className="btn border-0" onClick={onClose}>
          Close
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </button>
      </div>
      <nav aria-label="Drawing index">
        <ul>
          {indexSheets.map((s) => (
            <li key={s.id} className="border-b border-rule">
              <AppLink
                to={s.route ?? '/'}
                onClick={onClose}
                aria-current={s.id === current.id ? 'page' : undefined}
                className="flex min-h-[56px] items-center justify-between px-4 text-ink hover:bg-paper-3 aria-[current=page]:text-pen md:px-6"
              >
                <span className="text-lg">{s.short ?? s.title}</span>
                <span className="font-mono text-[13px] text-ink-3">{s.id}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-6 md:px-6">
        <AppLink to="/contact" onClick={onClose} className="btn btn-lg w-full">
          Hire me
        </AppLink>
        <ul className="mt-4">
          <li>
            <a className="flex min-h-[48px] items-center text-ink-2" href={LINKS.github} target="_blank" rel="noopener noreferrer">
              GitHub<span aria-hidden="true">&nbsp;↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a className="flex min-h-[48px] items-center text-ink-2" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn<span aria-hidden="true">&nbsp;↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a className="flex min-h-[48px] items-center text-ink-2" href={`mailto:${SITE.email}`}>
              Email
            </a>
          </li>
        </ul>
        <p className="t-micro mt-6">
          Set {SITE.set} · Rev {CURRENT_REV.rev}
        </p>
      </div>
    </dialog>
  );
}
