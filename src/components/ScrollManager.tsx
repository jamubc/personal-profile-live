import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { articleBySlug } from '../data/articles';
import type { Sheet } from '../data/sheets';

/** Where the old single-page anchors now live. */
const LEGACY_HASH: Record<string, { to: string; replaceHash?: string }> = {
  '#works': { to: '/works' },
  '#contact': { to: '/contact' },
  '#projects': { to: '/', replaceHash: '#schedule-s' },
  '#engineering': { to: '/', replaceHash: '#schedule-e' },
};

/**
 * Route-change housekeeping: legacy URL handling, scroll to top (or to the hash), focus to #main,
 * and a polite announcement of the new sheet. Nothing else in the app reads window.location.
 */
export function ScrollManager({ sheet }: { sheet: Sheet }) {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const first = useRef(true);
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

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) target.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.getElementById('main')?.focus({ preventScroll: true });
    setMessage(`Sheet ${sheet.id}, ${sheet.title}`);
  }, [pathname, hash, sheet.id, sheet.title]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}
