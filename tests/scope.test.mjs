import test from 'node:test';
import assert from 'node:assert/strict';
import { HI, LO, RAW_MAX, makeSchmitt, ppg } from '../src/lib/scope.ts';
import { beatShape, check, simulate } from '../scripts/test-scope.mjs';

test('one beat has a single peak at 1, a dicrotic notch and a diastolic bump inside the hysteresis band', () => {
  const s = beatShape();
  assert.ok(Math.abs(s.peak - 1) < 2e-3, `peak ${s.peak}`);
  assert.ok(Math.abs(s.rawMax - RAW_MAX) < 2e-3, `raw max ${s.rawMax}`);
  assert.ok(s.notch > LO && s.notch < s.bump && s.bump < HI, `notch ${s.notch}, bump ${s.bump}`);
  assert.ok(s.step < 1e-3, `boundary step ${s.step}`);
});

test('the Schmitt trigger fires once per beat for 120 s with wander and noise', () => {
  const r = simulate();
  assert.equal(r.beats, 144);
  assert.equal(r.schmittEdges, r.beats);
});

test('a single threshold at 0.48 fires twice per beat on the same signal', () => {
  const r = simulate();
  assert.equal(r.naiveEdges, 2 * r.beats);
});

test('makeSchmitt holds state between the thresholds', () => {
  const s = makeSchmitt();
  assert.equal(s(0.5), false);
  assert.equal(s(HI), true);
  assert.equal(s(0.5), true);
  assert.equal(s(LO + 0.001), true);
  assert.equal(s(LO), false);
  assert.equal(ppg(0) >= 0 && ppg(0) <= 1, true);
});

test('the acceptance script reports no failures', () => {
  assert.deepEqual(check().failures, []);
});
