/**
 * Fig. 1: a synthetic photoplethysmogram and the Schmitt trigger that squares it up.
 *
 * Pure, dependency-free and erasable TypeScript, so `node --experimental-strip-types` can import it
 * for the acceptance test (scripts/test-scope.mjs). Nothing here is measured data: the waveform is
 * two Gaussians per beat (systolic peak, then the smaller diastolic bump that leaves the dicrotic
 * notch between them). The thresholds are chosen so the notch stays above LO and the bump below HI,
 * which is the design point of the comparator in the PPG write-up: a single threshold fires twice
 * per beat on this waveform; hysteresis fires once.
 */
export const BPM = 72, T = 60 / BPM;                 // synthetic heart rate; never printed on the page
export const HI = 0.64, LO = 0.33;                    // Schmitt thresholds, fractions of normalised CH1
const g = (d: number, s: number) => Math.exp(-0.5 * (d / s) ** 2);
const wrap = (d: number) => ((d + 0.5) % 1 + 1) % 1 - 0.5;   // circular phase distance: no step at the beat boundary
const raw = (p: number) => g(wrap(p - 0.22), 0.09) + 0.55 * g(wrap(p - 0.54), 0.13);
export const RAW_MAX = 1.0277;                        // max of raw() over one beat (checked by the acceptance test)
export const ppg = (t: number) => raw(((t / T) % 1 + 1) % 1) / RAW_MAX;    // systolic peak at 0.22, dicrotic notch about 0.43, bump about 0.54
export function makeSchmitt() { let out = false; return (v: number) => (out = !out && v >= HI ? true : out && v <= LO ? false : out); }
