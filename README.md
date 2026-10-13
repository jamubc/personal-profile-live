# jandrewmanson.engineer

Andrew Manson's portfolio, issued as a drawing set (set AM-PF). Every page is a numbered sheet, the
sidebar is the drawing index, and every drafting mark on screen carries real information: a sheet
number is a route, a dimension is a measured pixel width, a revision row is a dated commit, a section
cut points at a real oscilloscope capture.

React 18, TypeScript (strict), Vite 5, Tailwind 3, react-router-dom 6. Every route is prerendered to
static HTML at build time and hydrated, so each case study and post has its own URL, its own
`<title>`, canonical, Open Graph tags and JSON-LD, and works without JavaScript. Deploys to Vercel as
static output.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server (client rendered) |
| `npm run build` | typecheck, client build, server build, prerender every sheet, check the page weight budget |
| `npm run preview` | serve `dist` the way Vercel does (real 404 status, no trailing slash) on :4173 |
| `npm test` | unit tests (`node:test`): parsers, registry, the PPG and Schmitt trigger model |
| `npm run lint` | ESLint with typescript-eslint, react-hooks and jsx-a11y |
| `npm run figures` | regenerate `src/generated/figures.json` (image sizes, light or dark plate) and thumbnails |
| `npm run revisions` | regenerate `src/generated/revisions.json` from git history (committed: Vercel builds are shallow); `-- --check` fails if it is stale |
| `npm run icons` | rasterise the registration mark into the PNG icons |
| `npm run images` | convert new project images to WebP (`scripts/optimize-images.mjs`) |
| `npm run stats` | refresh `src/data/github-stats.json` (stars, forks, public repo count) from the GitHub API; commit the result |
| `npm run og` | re-render `public/og-image.png` with Playwright (local only) |

## How the site is organised

- `src/data/sheets.ts` is the registry: the only place sheet numbers, routes and titles live. It drives
  the index column, breadcrumbs, title blocks, prev/next, `sitemap.xml`, `llms.txt` and the prerender
  route list. A build check fails if a route, a content file or a data entry disagrees with it.
- `src/data/*.ts` hold the facts: `engineering.ts`, `oss.ts` (with `github-stats.json`), `works.ts`,
  `articles.ts`, `site.ts`. Counts of figures, sections and reading time are derived, never typed.
- `src/content/*.md` are the long-form write-ups. `src/lib/content.ts` lists the *published* ones
  explicitly, so drafts are never bundled. `src/lib/markdown.ts` is the one block parser.
- `src/pages/*` are the sheets; `src/components/*` the shell, tables, figures and drafting marks.
- `src/index.css` and `tailwind.config.js` hold the design tokens (colours, type scale, surfaces).
  Colours are solid tokens behind CSS variables; there are no opacity modifiers, gradients, shadows
  or blur anywhere.

## Adding things

**A post.** Add `src/content/writing/<slug>.md`, add its loader in `src/lib/content.ts`, add a W sheet
in `src/data/sheets.ts` (numbered by insertion, never renumbered), add an entry in
`src/data/articles.ts` (its `date` is the post's first revision row), run `npm run revisions`.

**A case study.** Same, with an `E-1xx` sheet and an entry in `src/data/engineering.ts` (meta cells,
result cells, cover figure). Put images in `public/projects/<slug>/images/` with short kebab-case
names (`npm run images` converts them to WebP), run `npm run figures` (it also renders the 64 x 48 row thumbnail
named in the entry's `thumb`), and use the figure directive in the Markdown:

```
::image[/projects/<slug>/images/name.webp]{caption="What it shows — why it matters" alt="What is visible" plate=light cut=A readout="CH1 20.0 mV · M 500 ms"}
```

`alt`, `plate`, `cut` and `readout` are optional. Figures are numbered by document order.

**An open-source repo.** Add a row to `src/data/oss.ts`. Star counts and the public repository count come
from `src/data/github-stats.json` (`npm run stats` refreshes it; it never runs in the Vercel build). A star
count is shown only when the snapshot has one or more.

## Honest by construction

Missing content is omitted, shown as a dash, or designed as a state: the three automotive projects are
`HOLD` rows with hatched "figure not issued" plates, not placeholders. `CHECKED` on every title block
is a dash (an EIT does not carry a seal). Hydrail numbers are labelled as published figures, not the
author's own calculations. Fig. 1 on the cover is labelled synthetic.

## Checks

`npm run build` runs the typecheck, the Fig. 1 acceptance test, the registry consistency check and the
page-weight budget. `npm test`, `npm run lint` and `npm run revisions -- --check` are separate; run them
before pushing (there is no CI on this repository yet). Node 22.6 or newer is required: the test and
revision scripts import TypeScript directly with `--experimental-strip-types`.

## Deploy notes

`vercel.json` has no rewrites: every route is a real prerendered file, and unknown paths fall through
to the static `404.html` with a real 404 status. The cache header for project images is scoped to
`/projects/:slug/images/:file` so it does not catch the HTML pages.
