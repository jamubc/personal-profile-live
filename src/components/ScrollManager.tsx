import { useEffect, useRef, useState } from 'react';
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

/** Scroll offsets by history entry, so Back and Forward land where the visitor left. */
const positions = new Map<string, number>();

/**
 * Route-change housekeeping: legacy URL handling, scroll (to the top, to the hash, or back to where a
 * history entry was left), focus (to #main on a new sheet, to the target on an in-page jump), and a
 * polite announcement of the new sheet. Nothing else in the app reads window.location.
 */
export function ScrollManager({ sheet }: { sheet: Sheet }) {
  const { pathname, hash, search, key } = useLocation();
  const navigationType = useNavigationType();
  const navigate = useNavigate();
  const previous = useRef<{ pathname: string; key: string } | null>(null);
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

  // The app owns scrolling, so the browser's own restoration must not race it.
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const prev = previous.current;
    previous.current = { pathname, key };
    if (!prev) return; // first render: the browser has already placed the prerendered page
    positions.set(prev.key, window.scrollY);

    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (prev.pathname === pathname) {
      // An in-page jump (table of contents, section cut): go to the target and continue the tab order from it.
      if (target) {
        target.scrollIntoView({ block: 'start' });
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
      return;
    }
    const saved = navigationType === 'POP' ? positions.get(key) : undefined;
    if (saved !== undefined) window.scrollTo({ top: saved, left: 0, behavior: 'instant' as ScrollBehavior });
    else if (target) target.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.getElementById('main')?.focus({ preventScroll: true });
    setMessage(`Sheet ${sheet.id}, ${sheet.title}`);
  }, [pathname, hash, key, navigationType, sheet.id, sheet.title]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
