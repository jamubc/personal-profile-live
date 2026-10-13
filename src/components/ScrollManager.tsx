import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { articleBySlug } from '../data/articles';
import type { Sheet } from '../data/sheets';

/** Where the old single-page anchors now live. */
const LEGACY_HASH: Record<string, { to: string; replaceHash?: string }> = {
  '#works': { to: '/works' },
  '#contact': { to: '/contact' },
  '#projects': { to: '/', replaceHash: '#schedule-s' },
  '#engineering': { to: '/', replaceHash: '#schedule-e' },
};

const STORE = 'scroll-positions';

/** Scroll offsets by history entry key, kept for the tab's life (so reload and cross-document Back work too). */
const positions: Map<string, number> = (() => {
  try {
    return new Map<string, number>(JSON.parse(sessionStorage.getItem(STORE) ?? '[]'));
  } catch {
    return new Map<string, number>();
  }
})();

const persist = () => {
  try {
    sessionStorage.setItem(STORE, JSON.stringify([...positions].slice(-50)));
  } catch {
    /* storage unavailable: positions still work within the page's life */
  }
};

// Runs as a layout effect in the browser (before the new sheet is painted or scrolled); a no-op on the server.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const scrollToY = (top: number) => window.scrollTo({ top, left: 0, behavior: 'instant' as ScrollBehavior });

/** Scroll a jump target into view and give it focus, so the tab order continues from it. */
const focusTarget = (target: HTMLElement) => {
  target.scrollIntoView({ block: 'start' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
};

/**
 * Route-change housekeeping: legacy URL handling, scroll and focus, and a polite announcement of the
 * new sheet. Nothing else in the app reads window.location.
 *
 * - A new sheet (push or replace) lands at the top, or at its #hash, with focus on #main and an announcement.
 * - Back and Forward land where that history entry was left, including across reloads.
 * - An in-page jump (table of contents, section cut) is a history entry of its own: it scrolls to the
 *   target and focuses it, and Back returns to where the jump started.
 */
export function ScrollManager({ sheet }: { sheet: Sheet }) {
  const { pathname, hash, search, key } = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const current = useRef<{ pathname: string; key: string } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (pathname === '/' && hash) {
      const legacy = LEGACY_HASH[hash];
      if (legacy) navigate(legacy.replaceHash ? { pathname: legacy.to, hash: legacy.replaceHash } : legacy.to, { replace: true });
    }
    if (pathname === '/writing') {
      const slug = new URLSearchParams(search).get('a');
      if (slug !== null) navigate(articleBySlug(slug) ? `/writing/${slug}` : '/writing', { replace: true });
    }
  }, [pathname, hash, search, navigate]);

  // The app owns scrolling. Positions are recorded as the visitor scrolls, under the entry they are on,
  // so a value is never read after the next sheet has already replaced (and clamped) the page.
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const onScroll = () => {
      if (current.current) positions.set(current.current.key, window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', persist);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', persist);
    };
  }, []);

  // Same-page #links become router navigations, so every jump has its own history entry and key.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a || a.classList.contains('skip-link')) return;
      const id = a.getAttribute('href')!.slice(1);
      if (!id || !document.getElementById(decodeURIComponent(id))) return;
      e.preventDefault();
      navigate({ pathname: window.location.pathname, search: window.location.search, hash: `#${id}` });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  useIsomorphicLayoutEffect(() => {
    const prev = current.current;
    current.current = { pathname, key };
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    const saved = positions.get(key);

    if (!prev) {
      // First render. A reload or a cross-document Back returns to the saved position; a fresh visit
      // keeps where the browser put it (the top, or the #hash).
      const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (saved !== undefined && (nav?.type === 'reload' || nav?.type === 'back_forward')) scrollToY(saved);
      else if (target) target.scrollIntoView({ block: 'start' });
      return;
    }
    if (navigationType === 'POP' && saved !== undefined) {
      scrollToY(saved);
    } else if (prev.pathname === pathname && navigationType === 'PUSH') {
      if (target) focusTarget(target);
      return; // the same sheet: no focus move to #main and no announcement
    } else if (target) {
      target.scrollIntoView({ block: 'start' });
    } else {
      scrollToY(0);
    }
    if (prev.pathname !== pathname || navigationType === 'REPLACE') {
      document.getElementById('main')?.focus({ preventScroll: true });
      setMessage(`Sheet ${sheet.id}, ${sheet.title}`);
    }
  }, [pathname, hash, key, navigationType, sheet.id, sheet.title]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
