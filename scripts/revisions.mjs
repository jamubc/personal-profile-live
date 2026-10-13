// Seeds src/generated/revisions.json from git history. The output is committed because Vercel builds
// are shallow clones with no usable history.
//   node scripts/revisions.mjs           write the file
//   node scripts/revisions.mjs --check   exit 1 if committed output no longer matches git history
// Rules: first row INITIAL ISSUE, last row REISSUED IN SET AM-PF (2026-10-13), rows between are REVISED.
// Commits dated on or after the reissue are ignored so the check is stable on the reissue day.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src', 'generated', 'revisions.json');
const REISSUE = '2026-10-13';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const CASES = {
  'E-101': 'src/content/apple-classifier.md',
  'E-102': 'src/content/ppg-monitor.md',
  'E-103': 'src/content/okanagan-hydrail.md',
};
// A post's first row is its own publication date; the 2026-06-17 commit only added the file to this repo.
const POSTS = { 'W-301': '2025-11-16', 'W-302': '2025-11-17' };
const SINGLES = ['E-100', 'S-200', 'W-300', 'P-400', 'C-500'];

const gitDates = (file) =>
  execFileSync('git', ['log', '--follow', '--format=%as', '--', file], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);

const row = (i, date, description) => ({ rev: LETTERS[i], date, description, by: 'AM' });

function build() {
  const sheets = {};
  const modified = {};
  for (const [id, file] of Object.entries(CASES)) {
    const dates = [...new Set(gitDates(file))].filter((d) => d < REISSUE).sort();
    const rows = dates.map((date, i) => ({ date, description: i === 0 ? 'INITIAL ISSUE' : 'REVISED' }));
    rows.push({ date: REISSUE, description: 'REISSUED IN SET AM-PF' });
    sheets[id] = rows.map((r, i) => row(i, r.date, r.description)).reverse();
    modified[id] = dates.length ? dates[dates.length - 1] : REISSUE;
  }
  for (const [id, date] of Object.entries(POSTS)) {
    sheets[id] = [row(1, REISSUE, 'REISSUED IN SET AM-PF'), row(0, date, 'INITIAL ISSUE')];
    modified[id] = date;
  }
  for (const id of SINGLES) {
    sheets[id] = [row(0, REISSUE, 'ISSUED IN SET AM-PF')];
    modified[id] = REISSUE;
  }
  return { sheets, modified };
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
