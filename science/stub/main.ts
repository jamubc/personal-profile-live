import '../styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('Science stub: #app missing');
}

app.innerHTML = `
  <header class="topbar">
    <div class="topbar-brand">
      <strong>Science</strong>
      <span class="sep">/</span>
      <span>Shell verify</span>
    </div>
    <div class="topbar-meta">
      <a class="topbar-link" href="../">Index</a>
    </div>
  </header>

  <main class="page">
    <div class="workspace">
      <div class="workspace-head">
        <span>CH1 sine</span>
        <span>plumbing only</span>
      </div>
      <div class="workspace-body">
        <canvas id="stub-canvas" width="800" height="240" aria-label="Stub sine"></canvas>
      </div>
      <div class="readout">
        <div>Frame <b id="r-frame">0</b></div>
        <div>t <b id="r-t">0 ms</b></div>
        <div>State <b id="r-state">RUN</b></div>
      </div>
    </div>
  </main>
`;

const canvasEl = document.querySelector<HTMLCanvasElement>('#stub-canvas');
const rFrameEl = document.querySelector<HTMLElement>('#r-frame');
const rTEl = document.querySelector<HTMLElement>('#r-t');
const rStateEl = document.querySelector<HTMLElement>('#r-state');
if (!canvasEl || !rFrameEl || !rTEl || !rStateEl) {
  throw new Error('Science stub: missing nodes');
}
const canvas = canvasEl;
const rFrame = rFrameEl;
const rT = rTEl;
const rState = rStateEl;

const ctxEl = canvas.getContext('2d');
if (!ctxEl) throw new Error('Science stub: no 2d context');
const ctx = ctxEl;

let raf = 0;
let frame = 0;
let running = true;

function draw(t: number) {
  if (!running) return;
  const w = canvas.width;
  const h = canvas.height;
  const mid = h / 2;
  ctx.fillStyle = '#020308';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#00f7ff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const y = mid + Math.sin(x * 0.035 + t * 0.004) * (h * 0.3);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  frame += 1;
  if (frame % 10 === 0) {
    rFrame.textContent = String(frame);
    rT.textContent = `${Math.round(t)} ms`;
  }
  raf = requestAnimationFrame(draw);
}

function dispose() {
  running = false;
  cancelAnimationFrame(raf);
  rState.textContent = 'STOP';
}

window.addEventListener('pagehide', dispose);
window.addEventListener('beforeunload', dispose);
raf = requestAnimationFrame(draw);
