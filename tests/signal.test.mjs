import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleTrace, naiveRisingEdges, schmittRisingEdges, ppgBeat, DEFAULT_SCHMITT } from '../src/lib/signal.ts';

const SECONDS = 10;
const RATE = 200;
const BPM = 72;
const beats = Math.floor((BPM / 60) * SECONDS);

test('beat has a systolic peak near 1 and a dicrotic notch below the diastolic bump', () => {
  const peak = ppgBeat(0.17);
  const notch = Math.min(...Array.from({ length: 100 }, (_, i) => ppgBeat(0.25 + i * 0.0015)));
  const bump = ppgBeat(0.43);
  assert.ok(peak > 0.95 && peak < 1.1, `peak ${peak}`);
  assert.ok(notch < bump, `notch ${notch} < bump ${bump}`);
  assert.ok(bump < DEFAULT_SCHMITT.upper, 'diastolic bump stays under the upper threshold');
  assert.ok(bump > DEFAULT_SCHMITT.lower, 'diastolic bump sits inside the dead band');
});

test('a single-threshold comparator double-triggers on the dicrotic bump', () => {
  const s = sampleTrace(SECONDS, RATE, { bpm: BPM, wander: 0, noise: 0 });
  const edges = naiveRisingEdges(s, 0.3);
  assert.ok(edges >= 2 * beats - 2, `naive edges ${edges} for ${beats} beats`);
});

test('the Schmitt trigger fires exactly once per beat, even with wander and noise', () => {
  const s = sampleTrace(SECONDS, RATE, { bpm: BPM, wander: 0.04, noise: 0.02 });
  const edges = schmittRisingEdges(s);
  assert.ok(Math.abs(edges - beats) <= 1, `schmitt edges ${edges} for ${beats} beats`);
});

test('the Schmitt result is stable across heart rates', () => {
  for (const bpm of [55, 72, 95, 120]) {
    const s = sampleTrace(12, 240, { bpm });
    const expected = Math.floor((bpm / 60) * 12);
    const edges = schmittRisingEdges(s);
    assert.ok(Math.abs(edges - expected) <= 1, `bpm ${bpm}: ${edges} vs ${expected}`);
  }
});
