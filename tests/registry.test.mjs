import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRegistry } from '../src/seo/registry-check.ts';
import { sheets } from '../src/data/sheets.ts';
import { articles } from '../src/data/articles.ts';
import { engineering } from '../src/data/engineering.ts';

const sheet = (over) => ({ id: 'E-101', discipline: 'E', title: 'T', route: '/projects/t', status: 'issued', kind: 'case', slug: 't', contentFile: 't', ...over });
const sound = {
  sheets: [sheet({})],
  routePaths: ['/projects/t'],
  articles: [],
  engineering: [{ sheet: 'E-101', status: 'issued', title: 'T' }],
  metaIds: ['E-101'],
  hasDocument: () => true,
};

test('registry check: sound input has no problems', () => {
  assert.deepEqual(checkRegistry(sound), []);
});

test('registry check: each kind of drift is named', () => {
  const problems = checkRegistry({
    ...sound,
    sheets: [sheet({}), sheet({ id: 'E-101' }), sheet({ id: 'E-104', status: 'hold', route: '/projects/x' }), sheet({ id: 'W-301', kind: 'post', route: '/writing/p', slug: 'p', contentFile: 'writing/p' })],
    routePaths: ['/projects/t', '/ghost'],
    engineering: [{ sheet: 'E-101', status: 'hold', title: 'Other' }],
    metaIds: [],
    hasDocument: (f) => f === 't',
  });
  for (const expected of ['duplicate sheet id', 'is hold but has a route', 'has no document title', 'route /ghost has no registry row', 'status hold in engineering.ts', 'title differs between engineering.ts', 'no loader for content file writing/p', 'is a post with no article entry', 'route /projects/x is not served'])
    assert.ok(problems.some((p) => p.includes(expected)), `${expected}: ${problems.join(' | ')}`);
});

test('registry check: the real data passes (routes derived from the registry)', () => {
  const routePaths = sheets.filter((s) => s.route && (s.status === 'issued' || s.kind === 'error')).map((s) => s.route);
  // META is checked against the real data by the prerender; here every routed sheet counts as documented.
  const metaIds = sheets.filter((s) => s.route).map((s) => s.id);
  const problems = checkRegistry({ sheets, routePaths, articles, engineering, metaIds, hasDocument: () => true });
  assert.deepEqual(problems, []);
});
