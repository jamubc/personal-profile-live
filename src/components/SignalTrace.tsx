import { useEffect, useRef, useState } from 'react';
import { HI, LO, makeSchmitt, mulberry32, sample } from '../lib/scope';
import { useReducedMotion } from '../lib/hooks';
import './SignalTrace.css';

interface SignalTraceProps {
  ariaLabel: string;
}

const WINDOW = 4.0; // seconds across the plot
const GAP = 24; // px of blank ahead of the write-head
const FRAME_MS = 33; // 30 fps cap
const STATIC_OFFSET = 1.9; // start time of the static frame: three beats and their edges in view
const DIV_X = 8;

interface Colours {
  rule: string;
  ruleStrong: string;
  ch1: string;
  pen: string;
}

/** Everything that owns the canvas: sample buffers, the sweep, the loop and its gates. */
function createScope(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, colours: Colours) {
  let W = 1;
  let H = 1;
  let divY = 6;
  let ch1 = new Float32Array(0);
  let ch2 = new Uint8Array(0);
  let head = 0; // next column the write-head fills; W means "past the right edge"
  let carry = 0; // fractional column not yet written
  let time = 0; // virtual seconds of the next sample; only advances while running
  const schmitt = makeSchmitt();
  const rng = mulberry32(0x9e3779b1);
  let raf = 0;
  let last = 0;
  let running = false;
  let visible = true;

  const colDt = () => WINDOW / W;
  const write = (x: number) => {
    const v = sample(time, rng);
    ch1[x] = v;
    ch2[x] = schmitt(v) ? 1 : 0;
    time += colDt();
  };
  /** Fill the whole window in one go, head past the right edge: the static frame. */
  const fill = (from: number) => {
    time = from;
    for (let x = 0; x < W; x++) write(x);
    head = W;
    carry = 0;
  };
  const advance = (dt: number) => {
    carry += dt / colDt();
    let n = Math.min(W, Math.floor(carry));
    carry -= Math.floor(carry);
    while (n-- > 0) {
      if (head >= W) head = 0;
      write(head);
      head++;
    }
  };

  const yOf = (v: number) => H * (0.92 - 0.52 * v);
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    // graticule
    ctx.lineWidth = 1;
    ctx.strokeStyle = colours.rule;
    ctx.beginPath();
    for (let i = 1; i < DIV_X; i++) {
      const x = Math.round((i / DIV_X) * W) + 0.5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let j = 1; j < divY; j++) {
      const y = Math.round((j / divY) * H) + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
    // centre cross with five minor ticks per division
    const cx = Math.round(W / 2) + 0.5;
    const cy = Math.round(H / 2) + 0.5;
    ctx.strokeStyle = colours.ruleStrong;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, H);
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    const tx = W / DIV_X / 5;
    for (let x = tx; x < W; x += tx) {
      const xx = Math.round(x) + 0.5;
      ctx.moveTo(xx, cy - 3);
      ctx.lineTo(xx, cy + 3);
    }
    const ty = H / divY / 5;
    for (let y = ty; y < H; y += ty) {
      const yy = Math.round(y) + 0.5;
      ctx.moveTo(cx - 3, yy);
      ctx.lineTo(cx + 3, yy);
    }
    ctx.stroke();
    // thresholds
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (const level of [HI, LO]) {
      const y = Math.round(yOf(level)) + 0.5;
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    // traces, skipping the blank gap ahead of the write-head
    const inGap = (x: number) => head < W && x >= head && x < head + GAP;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = colours.ch1;
    ctx.beginPath();
    let pen = false;
    for (let x = 0; x < W; x++) {
      if (inGap(x) || x === head) {
        pen = false;
        continue;
      }
      const y = yOf(ch1[x]);
      if (pen) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
      pen = true;
    }
    ctx.stroke();
    ctx.strokeStyle = colours.pen;
    ctx.beginPath();
    pen = false;
    let prevY = 0;
    for (let x = 0; x < W; x++) {
      if (inGap(x) || x === head) {
        pen = false;
        continue;
      }
      const y = ch2[x] ? 0.14 * H : 0.3 * H;
      if (pen) {
        if (y !== prevY) ctx.lineTo(x, prevY);
        ctx.lineTo(x, y);
      } else ctx.moveTo(x, y);
      prevY = y;
      pen = true;
    }
    ctx.stroke();
  };

  const frame = (now: number) => {
    raf = 0;
    if (!running || !visible || document.hidden) return;
    if (now - last >= FRAME_MS) {
      advance(Math.min(WINDOW, (now - last) / 1000));
      last = now;
      draw();
    }
    raf = requestAnimationFrame(frame);
  };
  const gate = () => {
    const go = running && visible && !document.hidden;
    if (go && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!go && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    divY = H / W > 0.6 ? 6 : 4;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ch1 = new Float32Array(W);
    ch2 = new Uint8Array(W);
    fill(time > 0 ? time - WINDOW : STATIC_OFFSET);
    draw();
  };

  return {
    resize,
    setRunning(value: boolean) {
      running = value;
      gate();
    },
    setVisible(value: boolean) {
      visible = value;
      gate();
    },
    gate,
    stop() {
      running = false;
      gate();
    },
  };
}

/**
 * Fig. 1. CH1 is a synthetic PPG; CH2 is a literal Schmitt trigger fed by it, so the dicrotic notch
 * sits inside the dashed hysteresis band and the output steps once per beat. A classic sweep with a
 * write-head, 30 fps, paused when off-screen or in a background tab, and a visible RUN/STOP control.
 * Static mode (reduced motion, data saver, low memory) shows one frame and leaves the control live.
 */
export function SignalTrace({ ariaLabel }: SignalTraceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const reduced = useReducedMotion();
  // null until the client decides, so the server and the first client render agree (RUN).
  const [running, setRunning] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const css = getComputedStyle(canvas);
    const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const scope = createScope(canvas, ctx, {
      rule: token('--rule', '#2a313c'),
      ruleStrong: token('--rule-strong', '#3a4350'),
      ch1: token('--ch1', '#f2c14e'),
      pen: token('--pen', '#5fd3f3'),
    });
    scopeRef.current = scope;
    scope.resize();

    const ro = new ResizeObserver(() => scope.resize());
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => scope.setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.1), { threshold: [0, 0.1] });
    io.observe(canvas);
    document.addEventListener('visibilitychange', scope.gate);

    // Static mode is decided here, never during render.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const isStatic = window.matchMedia('(prefers-reduced-motion: reduce)').matches || nav.connection?.saveData === true || (nav.deviceMemory ?? 8) <= 2;
    setRunning(!isStatic);

    return () => {
      scope.stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', scope.gate);
      scopeRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (running !== null) scopeRef.current?.setRunning(running);
  }, [running]);

  // Honour a reduced-motion preference that changes while the page is open; the button can restart it.
  useEffect(() => {
    if (reduced) setRunning(false);
  }, [reduced]);

  return (
    <div className="scope">
      <div className="scope-bar scope-bar-top">
        <button
          type="button"
          className="scope-run no-print t-label"
          aria-label="Run or stop the trace"
          aria-pressed={running !== false}
          onClick={() => setRunning((r) => r === false)}
        >
          <span>{running === false ? 'Stop' : 'Run'}</span>
        </button>
        <span className="t-label text-ink-3" title="Simulated signal, not measured data">Synthetic</span>
      </div>
      <div role="img" aria-label={ariaLabel} className="scope-plot">
        <canvas ref={canvasRef} className="scope-canvas" />
        <div className="scope-overlay" aria-hidden="true">
          <span className="scope-vt t-micro" style={{ top: `${(0.92 - 0.52 * HI) * 100}%` }}>
            VTH
          </span>
          <span className="scope-vt t-micro" style={{ top: `${(0.92 - 0.52 * LO) * 100}%` }}>
            VTL
          </span>
        </div>
      </div>
      <div className="scope-bar scope-bar-bottom t-label" aria-hidden="true">
        <span className="scope-legend">
          <span className="text-ch1">CH1 PPG</span>
          <span className="text-pen">CH2 Schmitt out</span>
        </span>
      </div>
    </div>
  );
}
