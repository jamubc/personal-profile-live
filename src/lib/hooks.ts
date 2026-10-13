import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';

/** True when the user asked for reduced motion. Server snapshot is false. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(REDUCED);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** Track the id of the heading currently nearest the top of the viewport. */
export function useActiveHeading(ids: string[], rootMargin = '-20% 0px -70% 0px'): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');
  const visible = useRef(new Set<string>());
  const handle = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const e of entries) {
      if (e.isIntersecting) visible.current.add(e.target.id);
      else visible.current.delete(e.target.id);
    }
    const first = key.split('|').find((id) => visible.current.has(id));
    if (first) setActive(first);
  }, [key]);
  useEffect(() => {
    if (!key) return;
    const io = new IntersectionObserver(handle, { rootMargin });
    key.split('|').forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key, rootMargin, handle]);
  return active;
}
