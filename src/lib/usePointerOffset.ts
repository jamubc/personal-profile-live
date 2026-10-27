import { useEffect } from 'react';
import type { RefObject } from 'react';

const HOVER = '(hover: hover)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export function usePointerOffset(ref: RefObject<HTMLElement>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia(HOVER).matches || window.matchMedia(REDUCED).matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const write = () => {
      raf = 0;
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX / window.innerWidth - 0.5;
      y = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(write);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [ref]);
}
