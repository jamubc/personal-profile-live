import test from 'node:test';
import assert from 'node:assert/strict';
import { formatClock, msUntilNextMinute } from '../src/components/clockTime.ts';

const ZONE = 'America/Vancouver';

test('formats Pacific daylight time as HH:MM TZ', () => {
  assert.equal(formatClock(new Date('2026-10-13T21:05:30Z'), ZONE), '14:05 PDT');
});

test('formats Pacific standard time after the autumn change', () => {
  assert.equal(formatClock(new Date('2026-12-01T20:00:00Z'), ZONE), '12:00 PST');
});

test('uses 00 at midnight, never 24', () => {
  assert.equal(formatClock(new Date('2026-10-13T07:00:00Z'), ZONE), '00:00 PDT');
  assert.equal(formatClock(new Date('2026-10-13T07:59:59Z'), ZONE), '00:59 PDT');
});

test('zero-pads hours and minutes', () => {
  assert.equal(formatClock(new Date('2026-10-13T16:07:00Z'), ZONE), '09:07 PDT');
});

test('rejects an invalid zone so the caller can keep its placeholder', () => {
  assert.throws(() => formatClock(new Date(0), 'Not/AZone'), RangeError);
});

test('minute alignment: the delay always lands on a minute boundary', () => {
  for (const now of [0, 1, 59_999, 60_000, 1_760_000_123_456]) {
    const delay = msUntilNextMinute(now);
    assert.ok(delay >= 1 && delay <= 60_000, `delay ${delay}`);
    assert.equal((now + delay) % 60_000, 0);
  }
  assert.equal(msUntilNextMinute(0), 60_000);
  assert.equal(msUntilNextMinute(59_999), 1);
});
