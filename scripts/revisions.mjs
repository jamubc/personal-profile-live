// Seeds src/generated/revisions.json from git history. The output is committed because Vercel builds
// are shallow clones with no usable history.
//   node scripts/revisions.mjs           write the file
//   node scripts/revisions.mjs --check   exit 1 if committed output no longer matches git history
// Rules: one row per day a sheet's content file changed: the first is INITIAL ISSUE, the reissue day is
// REISSUED IN SET AM-PF, every other day is REVISED. A sheet's `modified` date is its latest row, which is
// what the title block shows and what the sitemap and the structured data report.
// Runs under `node --experimental-strip-types` so the sheet list comes from the registry itself.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sheets } from '../src/data/sheets.ts';
import { articles } from '../src/data/articles.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src', 'generated', 'revisions.json');
const REISSUE = '2026-10-13';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Issued case studies track their content file; posts carry their own publication date (the commit
// that added them only imported an existing article); every other issued sheet was first issued here.
const CASES = Object.fromEntries(sheets.filter((s) => s.kind === 'case' && s.status === 'issued').map((s) => [s.id, `src/content/${s.contentFile}.md`]));
const POSTS = Object.fromEntries(articles.map((a) => [a.sheet, a.date]));
const SINGLES = sheets.filter((s) => s.status === 'issued' && s.route && !['case', 'post', 'error'].includes(s.kind)).map((s) => s.id);

const gitDates = (file) =>
  execFileSync('git', ['log', '--follow', '--format=%as', '--', file], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);

const row = (i, date, description) => ({ rev: LETTERS[i], date, description, by: 'AM' });

function build() {
  const out = {};
  const modified = {};
  for (const [id, file] of Object.entries(CASES)) {
    const dates = [...new Set([...gitDates(file), REISSUE])].sort();
    const rows = dates.map((date, i) => ({ date, description: i === 0 ? 'INITIAL ISSUE' : date === REISSUE ? 'REISSUED IN SET AM-PF' : 'REVISED' }));
    out[id] = rows.map((r, i) => row(i, r.date, r.description)).reverse();
    modified[id] = dates[dates.length - 1];
  }
  for (const [id, date] of Object.entries(POSTS)) {
    out[id] = [row(1, REISSUE, 'REISSUED IN SET AM-PF'), row(0, date, 'INITIAL ISSUE')];
    modified[id] = REISSUE;
  }
  for (const id of SINGLES) {
    out[id] = [row(0, REISSUE, 'ISSUED IN SET AM-PF')];
    modified[id] = REISSUE;
  }
  return { sheets: out, modified };
}

const next = JSON.stringify(build(), null, 2) + '\n';
if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== next) {
    console.error('revisions.json is out of date with git history; run: node scripts/revisions.mjs');
    process.exit(1);
  }
  console.log('revisions.json is current');
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, next);
  console.log(`wrote ${OUT}`);
  console.log(next);
}
