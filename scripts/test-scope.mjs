// Acceptance test for Fig. 1's signal model (src/lib/scope.ts). Runs in `npm run build`.
//   node --experimental-strip-types --no-warnings scripts/test-scope.mjs
// Exits non-zero if the Schmitt trigger does not fire exactly once per beat, or if a plain threshold
// comparator does not double-trigger on the dicrotic bump (the behaviour the figure demonstrates).
import { fileURLToPath } from 'node:url';
import { BPM, HI, LO, RAW_MAX, T, makeSchmitt, ppg } from '../src/lib/scope.ts';

/** Same seeded generator the renderer uses for its +-0.01 noise. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const wander = (t) => 0.03 * Math.sin(2 * Math.PI * 0.25 * t);

/** Simulate `seconds` of signal at `rate` Hz with wander and noise; count edges both ways. */
export function simulate({ seconds = 120, rate = 60, naiveThreshold = 0.48, seed = 1 } = {}) {
  const rng = mulberry32(seed);
  const schmitt = makeSchmitt();
  let prev = false;
  let schmittEdges = 0;
  let naivePrev = false;
  let naiveEdges = 0;
  const n = Math.round(seconds * rate);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const v = ppg(t) + wander(t) + (rng() * 2 - 1) * 0.01;
    const out = schmitt(v);
    if (out && !prev) schmittEdges++;
    prev = out;
    const naive = v >= naiveThreshold;
    if (naive && !naivePrev) naiveEdges++;
    naivePrev = naive;
  }
  return { beats: Math.round((seconds * BPM) / 60), schmittEdges, naiveEdges };
}

/** Shape of one clean beat: peak, notch, bump and the step across the beat boundary. */
export function beatShape(samples = 10000) {
  let peak = 0;
  let peakPhase = 0;
  let rawMax = 0;
  for (let i = 0; i < samples; i++) {
    const p = i / samples;
    const v = ppg(p * T);
    if (v > peak) {
      peak = v;
      peakPhase = p;
    }
    rawMax = Math.max(rawMax, v * RAW_MAX);
  }
  let notch = 1;
  let notchPhase = 0;
  for (let i = Math.round(samples * 0.3); i < samples * 0.5; i++) {
    const v = ppg((i / samples) * T);
    if (v < notch) {
      notch = v;
      notchPhase = i / samples;
    }
  }
  let bump = 0;
  let bumpPhase = 0;
  for (let i = Math.round(samples * notchPhase); i < samples * 0.7; i++) {
    const v = ppg((i / samples) * T);
    if (v > bump) {
      bump = v;
      bumpPhase = i / samples;
    }
  }
  const step = Math.abs(ppg(T - 1e-6) - ppg(1e-6));
  return { peak, peakPhase, rawMax, notch, notchPhase, bump, bumpPhase, step };
}

export function check() {
  const failures = [];
  const shape = beatShape();
  const sim = simulate();
  const expect = (ok, message) => {
    if (!ok) failures.push(message);
  };
  expect(Math.abs(shape.rawMax - RAW_MAX) < 2e-3, `RAW_MAX ${RAW_MAX} does not match the computed maximum ${shape.rawMax.toFixed(4)}`);
  expect(Math.abs(shape.peak - 1) < 2e-3, `normalised peak is ${shape.peak.toFixed(4)}, not 1`);
  expect(shape.notch > LO + 0.05, `dicrotic notch ${shape.notch.toFixed(3)} is not safely above LO ${LO}`);
  expect(shape.bump < HI - 0.05, `diastolic bump ${shape.bump.toFixed(3)} is not safely below HI ${HI}`);
  expect(shape.step < 1e-3, `step at the beat boundary is ${shape.step.toExponential(2)}`);
  expect(sim.schmittEdges === sim.beats, `Schmitt trigger fired ${sim.schmittEdges} times for ${sim.beats} beats`);
  expect(sim.naiveEdges === 2 * sim.beats, `single-threshold comparator fired ${sim.naiveEdges} times for ${sim.beats} beats (expected ${2 * sim.beats})`);
  return { shape, sim, failures };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { shape, sim, failures } = check();
  console.log(
    `scope: peak ${shape.peak.toFixed(3)} at phase ${shape.peakPhase.toFixed(3)}, notch ${shape.notch.toFixed(3)} at ${shape.notchPhase.toFixed(3)}, ` +
      `bump ${shape.bump.toFixed(3)} at ${shape.bumpPhase.toFixed(3)}, boundary step ${shape.step.toExponential(1)}; ` +
      `${sim.schmittEdges}/${sim.beats} beats with hysteresis, ${sim.naiveEdges} edges from a single threshold`,
  );
  if (failures.length) {
    for (const f of failures) console.error(`FAIL: ${f}`);
    process.exit(1);
  }
}
