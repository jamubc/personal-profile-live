import { useEffect, useRef } from 'react';
import { DEFAULT_SCHMITT, SchmittTrigger, ppgAt } from '../lib/signal';
import { useReducedMotion } from '../lib/hooks';

interface SignalTraceProps {
  className?: string;
  /** Seconds of signal visible across the scope. */
  windowSeconds?: number;
  bpm?: number;
  divisionsX?: number;
  divisionsY?: number;
  /** Accessible description. The visible FIG. caption lives outside the canvas. */
  label?: string;
}

const token = (el: Element, name: string, fallback: string): string =>
  getComputedStyle(el).getPropertyValue(name).trim() || fallback;

/**
 * Two-channel scope: CH1 is a synthetic PPG, CH2 is the output of a Schmitt
 * trigger fed by it (the comparator stage of the author's analog heart-rate
 * project). Dashed lines mark the hysteresis band. Animates only on devices
 * with hover and without a reduced-motion preference; otherwise it draws one
 * static frame. Pauses when off-screen or when the tab is hidden.
 */
export function SignalTrace({
  className,
  windowSeconds = 5,
  bpm = 72,
  divisionsX = 8,
  divisionsY = 6,
  label = 'Synthetic PPG waveform and the output of a Schmitt-trigger comparator',
}: SignalTraceProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = !reduced && !window.matchMedia('(hover: none)').matches;
    const colors = {
      pen: token(canvas, '--pen', '#5FD3F3'),
      grid: token(canvas, '--rule', '#2A313C'),
      gridStrong: token(canvas, '--rule-strong', '#3A4350'),
      muted: token(canvas, '--ink-3', '#8A94A3'),
      ink: token(canvas, '--ink-2', '#B6BEC9'),
    };

    let W = 1;
    let H = 1;
    let raf = 0;
    let visible = true;
    let lastFrame = 0;
    const startedAt = performance.now();
    const STATIC_T = windowSeconds + 0.4;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth = 1;
      for (let i = 0; i <= divisionsX; i++) {
        const x = Math.round((i / divisionsX) * W) + 0.5;
        ctx.strokeStyle = i === divisionsX / 2 ? colors.gridStrong : colors.grid;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let j = 0; j <= divisionsY; j++) {
        const y = Math.round((j / divisionsY) * H) + 0.5;
        ctx.strokeStyle = j === divisionsY / 2 ? colors.gridStrong : colors.grid;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const ppgTop = H * 0.08;
      const ppgH = H * 0.54;
      const cmpTop = H * 0.74;
      const cmpH = H * 0.18;
      const yPpg = (v: number) => ppgTop + (1 - v) * ppgH;

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = colors.muted;
      ctx.globalAlpha = 0.7;
      for (const level of [DEFAULT_SCHMITT.upper, DEFAULT_SCHMITT.lower]) {
        const y = Math.round(yPpg(level)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      const step = windowSeconds / W;
      const t0 = t - windowSeconds;
      const trigger = new SchmittTrigger();
      for (let i = -Math.ceil(1.5 / step); i < 0; i++) trigger.update(ppgAt(t0 + i * step, { bpm }));

      const out = new Array<number>(W + 1);
      ctx.beginPath();
      ctx.strokeStyle = colors.pen;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      for (let i = 0; i <= W; i++) {
        const v = ppgAt(t0 + i * step, { bpm });
        out[i] = trigger.update(v) ? 1 : 0;
        if (i === 0) ctx.moveTo(i, yPpg(v));
        else ctx.lineTo(i, yPpg(v));
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = colors.ink;
      for (let i = 0; i <= W; i++) {
        const y = cmpTop + (1 - out[i]) * cmpH;
        if (i === 0) ctx.moveTo(0, y);
        else {
          ctx.lineTo(i, cmpTop + (1 - out[i - 1]) * cmpH);
          ctx.lineTo(i, y);
        }
      }
      ctx.stroke();
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (now - lastFrame >= 33) {
        lastFrame = now;
        draw((now - startedAt) / 1000 + STATIC_T);
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (animate && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(STATIC_T);
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (!animate) draw(STATIC_T);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced, windowSeconds, bpm, divisionsX, divisionsY]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
