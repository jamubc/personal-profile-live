import test from 'node:test';
import assert from 'node:assert/strict';
import { sheets, sheetById, neighbours, publishedSheets, indexSheets, parentOf } from '../src/data/sheets.ts';
import { formatDate } from '../src/lib/format.ts';

test('sheet ids are unique and every issued sheet except the 404 has a route', () => {
  const ids = sheets.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const s of sheets) {
    if (s.status === 'issued') assert.ok(s.route, `${s.id} is issued but has no route`);
    else assert.equal(s.route, null, `${s.id} is ${s.status} so it must not have a route`);
  }
});

test('routes are unique and case and post routes match their slugs', () => {
  const routes = sheets.filter((s) => s.route).map((s) => s.route);
  assert.equal(new Set(routes).size, routes.length);
  for (const s of sheets.filter((x) => x.status === 'issued' && (x.kind === 'case' || x.kind === 'post'))) {
    assert.equal(s.route, `${s.kind === 'case' ? '/projects/' : '/writing/'}${s.slug}`);
  }
});

test('published sheets exclude hold, inline, withheld and the 404', () => {
  const ids = publishedSheets().map((s) => s.id);
  assert.deepEqual(ids, ['G-001', 'E-100', 'E-101', 'E-102', 'E-103', 'S-200', 'W-300', 'W-301', 'W-302', 'P-400', 'C-500']);
  for (const hidden of ['E-104', 'E-105', 'E-106', 'E-107', 'E-108', 'X-404']) assert.ok(!ids.includes(hidden), hidden);
});

test('the drawing index lists the six top-level sheets in order', () => {
  assert.deepEqual(indexSheets.map((s) => s.id), ['G-001', 'E-100', 'S-200', 'W-300', 'P-400', 'C-500']);
});

test('neighbours stay inside the series and do not wrap', () => {
  const e101 = neighbours(sheetById('E-101'));
  assert.equal(e101.prev, undefined);
  assert.equal(e101.next.id, 'E-102');
  assert.equal(e101.index.id, 'E-100');
  assert.equal(neighbours(sheetById('E-103')).next, undefined);
  assert.equal(neighbours(sheetById('E-103')).prev.id, 'E-102');
  assert.equal(neighbours(sheetById('W-301')).next.id, 'W-302');
  assert.equal(parentOf(sheetById('W-302')).id, 'W-300');
});


test('formatDate prints the ISO date as given, so it can never shift a day', () => {
  process.env.TZ = 'America/Vancouver';
  assert.equal(formatDate('2025-11-17'), '2025-11-17');
  assert.equal(formatDate('2025-11-17T23:00:00Z'), '2025-11-17');
  assert.equal(formatDate('2026-01-01'), '2026-01-01');
});
