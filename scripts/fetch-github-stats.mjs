// Refreshes src/data/github-stats.json from the public GitHub API. Run it by hand and commit the
// result; it is never part of the build, so a build never depends on the network.
//   node scripts/fetch-github-stats.mjs
// Records each public repo's stars, forks, language, description and last push, plus the profile's
// public repository count (forks included, as the GitHub profile counts them).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data', 'github-stats.json');
const USER = 'jamubc';

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'jandrewmanson.engineer build' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchJson(url) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
  return res.json();
}

async function fetchAll() {
  const repos = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&type=owner&sort=updated`, { headers, signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

let previous = { fetchedAt: null, repos: {} };
try { previous = JSON.parse(readFileSync(OUT, 'utf8')); } catch { /* first run */ }

try {
  const repos = await fetchAll();
  const user = await fetchJson(`https://api.github.com/users/${USER}`);
  const next = { fetchedAt: new Date().toISOString(), source: 'api.github.com', publicRepos: user.public_repos, repos: {} };
  for (const r of repos) {
    if (r.fork) continue;
    next.repos[r.name] = {
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      description: r.description,
      pushedAt: r.pushed_at.slice(0, 10),
    };
  }
  writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n');
  console.log(`github-stats: refreshed ${Object.keys(next.repos).length} repos`);
} catch (err) {
  console.warn(`github-stats: using committed snapshot (${previous.fetchedAt ?? 'none'}) because: ${err.message}`);
}
