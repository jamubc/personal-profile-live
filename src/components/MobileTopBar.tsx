import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppLink } from './AppLink';
import { MobileIndexDialog } from './MobileIndexDialog';
import type { Sheet } from '../data/sheets';

/** Sticky 56px bar for phones and tablets: name on the left, the drawing index on the right. */
export function MobileTopBar({ current }: { current: Sheet }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="no-print sticky top-0 z-chrome flex h-14 items-center justify-between border-b border-rule bg-paper px-4 md:px-6 lg:hidden">
        <AppLink to="/" className="inline-flex min-h-[44px] items-center font-mono text-[13px] font-medium text-ink">
          Andrew Manson
        </AppLink>
        <button type="button" className="btn border-0" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
          Index
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M0 1h16M0 6h16M0 11h16" />
          </svg>
        </button>
      </header>
      <MobileIndexDialog open={open} onClose={close} current={current} />
    </>
  );
}
