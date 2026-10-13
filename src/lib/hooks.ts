import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';

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

/** Rounded content-box width of an element, kept current by ResizeObserver. */
export function useElementWidth<T extends HTMLElement>(): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(Math.round(el.getBoundingClientRect().width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/** Whether an element intersects the viewport. `once` stops observing after first hit. */
export function useInView<T extends Element>(options: { once?: boolean; rootMargin?: string; threshold?: number } = {}): [RefObject<T>, boolean] {
  const { once = false, rootMargin = '0px', threshold = 0 } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);
  return [ref, inView];
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
