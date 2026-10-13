/**
 * Synthetic photoplethysmogram (PPG) and the Schmitt-trigger comparator from
 * the author's ENGR 352 analog heart-rate project.
 *
 * The waveform is a sum of two Gaussians (systolic peak, smaller diastolic
 * bump) which leaves the characteristic dicrotic notch between them, plus a
 * slow baseline wander and deterministic noise. It is labelled SYNTHETIC
 * wherever it is shown. Nothing here is measured data.
 *
 * A naive single-threshold comparator re-triggers on the diastolic bump
 * (two pulses per beat). A Schmitt trigger whose hysteresis band contains the
 * bump fires exactly once per beat, which is the design point of the real
 * circuit (R8 = 220 kΩ, R9 = 680 kΩ in the write-up).
 */

export interface TraceOptions {
  /** Heart rate in beats per minute. */
  bpm?: number;
  /** Baseline wander amplitude, 0..1 of the peak. */
  wander?: number;
  /** Peak-to-peak noise amplitude, 0..1 of the peak. */
  noise?: number;
}

export interface SchmittThresholds {
  upper: number;
  lower: number;
}

/** Thresholds chosen so the diastolic bump (~0.42) sits inside the dead band. */
export const DEFAULT_SCHMITT: SchmittThresholds = { upper: 0.6, lower: 0.3 };

const gauss = (x: number, mu: number, sigma: number): number =>
  Math.exp(-0.5 * ((x - mu) / sigma) ** 2);

/** Deterministic pseudo-noise in [-0.5, 0.5) from an integer-ish seed. */
const hash = (n: number): number => {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s) - 0.5;
};

/** One cardiac cycle. `phase` is wrapped to [0, 1); result is ~0..1. */
export function ppgBeat(phase: number): number {
  const p = phase - Math.floor(phase);
  const systolic = gauss(p, 0.17, 0.06);
  const diastolic = 0.42 * gauss(p, 0.43, 0.075);
  return systolic + diastolic;
}

/** Signal value at time `t` seconds. */
export function ppgAt(t: number, options: TraceOptions = {}): number {
  const { bpm = 72, wander = 0.04, noise = 0.02 } = options;
  const beatsPerSecond = bpm / 60;
  const base = ppgBeat(t * beatsPerSecond);
  const drift = wander * Math.sin(2 * Math.PI * t * 0.23);
  const jitter = noise * hash(Math.round(t * 240));
  return base + drift + jitter;
}

/** Sample `ppgAt` uniformly. */
export function sampleTrace(seconds: number, sampleRate: number, options: TraceOptions = {}): number[] {
  const n = Math.floor(seconds * sampleRate);
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) out[i] = ppgAt(i / sampleRate, options);
  return out;
}

/** Stateful Schmitt trigger: high above `upper`, low below `lower`, holds in between. */
export class SchmittTrigger {
  high = false;
  thresholds: SchmittThresholds;
  constructor(thresholds: SchmittThresholds = DEFAULT_SCHMITT) {
    this.thresholds = thresholds;
  }
  update(value: number): boolean {
    if (this.high) {
      if (value < this.thresholds.lower) this.high = false;
    } else if (value > this.thresholds.upper) {
      this.high = true;
    }
    return this.high;
  }
}

/** Rising edges of a plain threshold comparator. */
export function naiveRisingEdges(samples: number[], threshold: number): number {
  let edges = 0;
  let above = samples.length > 0 && samples[0] > threshold;
  for (const v of samples) {
    const now = v > threshold;
    if (now && !above) edges++;
    above = now;
  }
  return edges;
}

/** Rising edges of the Schmitt comparator output. */
export function schmittRisingEdges(samples: number[], thresholds: SchmittThresholds = DEFAULT_SCHMITT): number {
  const trigger = new SchmittTrigger(thresholds);
  let edges = 0;
  let previous = false;
  for (const v of samples) {
    const out = trigger.update(v);
    if (out && !previous) edges++;
    previous = out;
  }
  return edges;
}
