import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// The revision tables and sitemap dates are generated from git history and committed (Vercel clones are
// shallow). This fails when content changed in a commit without `npm run revisions` being run after it.
test('revisions.json matches git history', { skip: !existsSync('.git') && 'no git history here' }, () => {
  const out = execFileSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'scripts/revisions.mjs', '--check'], { encoding: 'utf8' });
  assert.match(out, /current/);
});
