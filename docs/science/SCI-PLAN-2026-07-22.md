# Engineering Plan: `/science` Platform (Shell + North-Star Architecture)

| Field | Value |
|-------|--------|
| **Document ID** | SCI-PLAN-2026-07-22 |
| **Classification** | Internal engineering plan — implementation authority |
| **Domain** | `jandrewmanson.engineer` (same origin) |
| **Path prefix** | `/science` |
| **Repo** | `personal-profile-live` |
| **Current profile stack** | Vite 5 + React 18 + TS + Tailwind; Vercel; SPA rewrites for `/works`, `/writing` only |
| **Phase 0 (this delivery)** | Architectural shell — isolation + dual-output deploy proof |
| **Status** | Ready for build after approval |
| **Supersedes** | Informal brainstorm; `science/PLAN.md` is a working draft (also currently gitignored — do not treat as sole SoR) |

---

## 0. Executive summary

**Problem.** The personal site is production-quality and must remain so. The owner wants a Falstad-class interactive science/engineering toolkit on the **same domain**, without polluting profile UX, source, or deploy reliability.

**Solution.** Introduce a **statically deployed multi-page application (MPA)** under `/science/`, built by a **second Vite config** from a top-level `science/` source tree, merged into the same `dist/` artifact after the profile build. Phase 0 ships only a hub + plumbing stub. Phase 1+ adds real EE/DSP tools with honest solvers.

**Blast radius.** Mis-ordered builds, a global SPA rewrite, or fail-closed dual builds can take the **live portfolio offline** or serve broken `/science` assets. This plan hardens those failure modes first.

**One-line mandate.** *Profile stays green; science is isolated, honest, and expandable — never allowed to casually kill the homepage.*

---

## 1. Objectives and success metrics

### 1.1 Business / product objectives

| ID | Objective | Measure |
|----|-----------|---------|
| O1 | Preserve portfolio excellence | No intentional UX/content/nav changes to profile in Phase 0 |
| O2 | Same-domain science surface | `/science/` served from production CDN on existing project |
| O3 | Hard isolation | Zero runtime/build coupling of science modules into profile chunks |
| O4 | Expandable platform | Documented path from shell → EE tools → Falstad-scale catalog |
| O5 | Deploy safety | Profile production deploy cannot be blocked by unfinished science (Phase 0 policy) |

### 1.2 Phase 0 exit criteria (all must pass — binary gates)

| Gate | Pass condition | How verified |
|------|----------------|--------------|
| G0.1 Profile build unchanged in role | `npm run build` = profile only (`tsc && vite build`) | Script inspection + CI |
| G0.2 Dual artifact | After `npm run build:all`: `dist/index.html` and `dist/science/index.html` exist | File tree assert script |
| G0.3 Asset base correctness | Hub + stub load JS/CSS with status 200; no requests to wrong origin paths | Static server smoke + network log |
| G0.4 Profile routes intact | `/`, `/works`, `/writing` still serve SPA correctly on combined `dist` | Manual or Playwright smoke |
| G0.5 Science routes intact | `/science/` and stub URL return science HTML (not profile shell) | Content assert (`title` / marker string) |
| G0.6 Isolation | No import path `science→src` or `src→science` | `rg`/CI forbid-list |
| G0.7 Rewrite safety | `vercel.json` has no catch-all SPA rewrite; comment documents ban | Diff review |
| G0.8 No profile discovery | Sidebar/Footer/nav have no Science link | Code review |
| G0.9 Rollback path | Documented: revert Vercel build command and/or remove `dist/science` merge | Runbook §12 |

**Phase 0 is not complete until G0.1–G0.9 pass on a production-like preview.**

---

## 2. Scope

### 2.1 In scope — Phase 0 (Shell)

1. Top-level `science/` source tree (hub + one stub page).
2. `vite.science.config.ts` with `base: '/science/'`, multi-page inputs, `outDir: 'dist/science'`, `emptyOutDir: true`.
3. Root scripts: `dev:science`, `build:science`, `build:all` (`build && build:science`).
4. Keep `build` = **profile only**.
5. Isolation enforcement (script or lint rule).
6. `vercel.json` defensive comment; optional `/science/assets` cache headers.
7. Production cutover policy (§6): when to switch Vercel from `build` → `build:all`.
8. Minimal hub UI (not empty 404): title, one-line purpose, link to stub, “experimental” notice.
9. Stub page: proves MPA + base path only (e.g. canvas clear + timestamp or trivial rAF sine). **Not** marketed as a science tool.
10. Authoritative plan committed under repo control (this document’s content; fix gitignore if needed).

### 2.2 Explicitly out of scope — Phase 0

| Item | Rationale |
|------|-----------|
| Real physics/EE demos | Shell is plumbing |
| Profile nav/footer link | Avoid half-empty gallery traffic |
| `catalog.ts` registry | Premature; hardcode hub link |
| Separate `science/package.json` | Glue cost without shell benefit (§4.1 graduation) |
| WASM / WebGPU / workers platform | Phase 1+ |
| Sitemap / `llms.txt` / science Analytics | After first real tool |
| Shared monorepo `packages/*` | Extract on second reuse |
| Accessibility audit of future sims | Stub: basic semantic HTML only |
| Certified engineering software claims | Never in scope without separate legal program |

### 2.3 Phase 1+ (north star — planned, not built in Phase 0)

Documented so implementers do not invent architecture under pressure.

- **Modular MPA:** each tool = own HTML entry; science-local shared libs.
- **EE/DSP first:** Scope+FFT → passive filters → interactive MNA schematic subset → digital filters.
- **Honest solvers:** MNA/SPICE-class, typed-array fields; no fake viz.
- **Stack doctrine:** TS; imperative rAF loop; Canvas2D→WebGL2→WebGPU; workers/WASM when measured.
- **Lifecycle:** `mount/dispose` contract before multi-tool complexity.
- **Catalog:** filesystem convention / meta at tool ≥3, not day one.

---

## 3. Constraints and non-negotiables

| ID | Constraint |
|----|------------|
| C1 | Same domain; path `/science` (not subdomain) for Phase 0–1 |
| C2 | Profile source under `src/` must not import `science/**` |
| C3 | Science must not import `src/**` (profile components, styles, data) |
| C4 | No global SPA fallback rewrite on the Vercel project |
| C5 | Build order: **always** profile first, then science into `dist/science` |
| C6 | Never put science HTML entries into profile Vite `rollupOptions.input` |
| C7 | No CircuitJS1 / GPLv2 source paste into this UNLICENSED repo (§9) |
| C8 | Educational disclaimers on real tools: not a substitute for licensed EDA / professional engineering judgment |
| C9 | Shell does not change profile SEO canonicals, OG tags, or sidebar IA |

---

## 4. Architecture

### 4.1 Packaging decision (vetted)

| Option | Decision |
|--------|----------|
| A. Same package, dual Vite config | **SELECTED for Phase 0–early Phase 1** |
| B. Separate `science/package.json` | Deferred — graduation rule below |
| C. Move profile to `apps/profile` | Rejected — invasive |

**Graduation rule (separate package):** Create `science/package.json` (or workspaces) only when science would force portfolio install of heavy/unique deps (WASM toolchains, GL stacks, audio, large numerics) that must not bloat profile `node_modules` or security surface.

**Isolation that matters:** separate **source root**, separate **build graph**, separate **output prefix**, enforced **import ban** — not a second lockfile.

### 4.2 Runtime topology

```
Browser
  ├─ /                  → profile SPA (React)
  ├─ /works, /writing   → vercel rewrite → profile index.html
  └─ /science/*         → static MPA files from dist/science/
        ├─ index.html   → hub
        └─ stub/…       → stub tool page
```

- Profile and science share **origin** only (cookies, Analytics project if added later).
- No shared React tree, no microfrontend runtime, no iframe bridge in Phase 0.

### 4.3 Repository layout (Phase 0 target)

```
personal-profile-live/
├── package.json                 # scripts only change
├── vite.config.ts               # profile — unchanged role
├── vite.science.config.ts       # NEW
├── scripts/
│   └── check-science-isolation.mjs  # NEW — CI-able
├── vercel.json                  # comment + optional science asset headers
├── src/                         # PROFILE ONLY
├── dist/                        # build artifact (gitignored)
│   ├── index.html
│   ├── assets/
│   └── science/
│       ├── index.html
│       ├── stub/… or stub.html
│       └── assets/
└── science/
    ├── PLAN.md                  # optional local copy; SoR is committed plan/docs
    ├── index.html
    ├── tools/stub/index.html    # LOCKED URL shape — see §4.4
    ├── hub.ts
    ├── tools/stub/main.ts
    └── styles.css
```

### 4.4 URL contract (locked — no ambiguity)

| Public URL | Source entry | Notes |
|------------|--------------|-------|
| `/science/` | `science/index.html` | Trailing slash preferred; configure Vite `base: '/science/'` |
| `/science/stub/` | `science/tools/stub/index.html` | Directory entry so MPA scales as `tools/<id>/` |

**Redirect policy:** If bare `/science` 404s or double-loads assets, add a single Vercel redirect `/science` → `/science/` (not a SPA rewrite). Test both.

**Future tools:** `/science/<id>/` via `science/tools/<id>/index.html`. Do not nest under `/science/tools/<id>/` in the public URL unless base+input mapping requires it; **public path = `/science/<id>/`** (clean Falstad-like URLs). Implementation note: Vite MPA emits HTML relative to project structure — configure input keys / structure so output is `dist/science/stub/index.html`, not `dist/science/tools/stub/index.html`, **or** accept `/science/tools/stub/` and document it.

**LOCKED DECISION for implementers:** Prefer file layout:

```
science/
  index.html                 → dist/science/index.html
  stub/index.html            → dist/science/stub/index.html
```

(not `tools/stub` in URL). Internal folders may use `science/src/…`; HTML entries live at `science/index.html` and `science/stub/index.html` for clean output paths.

### 4.5 Build pipeline (P0-critical)

```
npm run build:all
  1. npm run build          # profile → dist/  emptyOutDir=true (WIPES dist)
  2. npm run build:science  # science → dist/science/  emptyOutDir=true (only subdir)
```

| Rule | Reason |
|------|--------|
| Never reverse order | Profile wipe deletes science |
| Never parallel into same tree | Race on `dist` |
| Never science `outDir: 'dist'` | Contaminates/wipes profile |
| Fallback | Science → `science/dist` then `cp -a science/dist/. dist/science/` if Vite outDir-outside-root misbehaves |

### 4.6 Vite science config requirements

```ts
// vite.science.config.ts — requirements, not final code
base: '/science/'
build.outDir: 'dist/science'   // relative to repo root when config lives at root
build.emptyOutDir: true
build.rollupOptions.input: {
  main: resolve('science/index.html'),
  stub: resolve('science/stub/index.html'),
}
// Do NOT use @vitejs/plugin-react unless a page imports React
// root: may set root to 'science' ONLY if outDir/base/input paths revalidated
```

**Typecheck:** Either `tsc -p science/tsconfig.json` in `build:science`, or include science in a dedicated project reference. Profile `tsc` must **not** typecheck science files in a way that fails profile-only `build`.

### 4.7 Long-term modular MPA (Phase 1+)

```
science/
  index.html                 # hub
  stub/…                     # temporary
  <tool-id>/index.html
  lib/                       # math, render, ui — extracted on 2nd use
  styles/
```

Tool contract (first real tool, not Phase 0 stub):

```
mount(host, URLSearchParams) → { setParams?, dispose() }
// dispose: rAF, workers, GL loseContext, AudioContext, listeners
// Sim loop NEVER through React VDOM
```

---

## 5. Profile interaction policy

| Surface | Phase 0 | Later |
|---------|---------|-------|
| Sidebar / nav | No link | Optional after ≥1 real tool |
| Footer | No link | Optional |
| Homepage sections | No change | Optional “Experiments” only with product approval |
| `public/sitemap.xml` | No change | Add `/science/` + tool URLs at first real tool |
| `public/robots.txt` | Already allows `/` | No change required |
| `public/llms.txt` | No change | Optional mention later |
| SEO of profile | Untouched | Untouched |

---

## 6. Deploy, environments, cutover

### 6.1 Single Vercel project (Phase 0)

| Setting | Value |
|---------|-------|
| Install | Root `npm ci` / `npm install` (one lockfile) |
| Output directory | `dist` |
| Build command — **until cutover** | `npm run build` |
| Build command — **after cutover** | `npm run build:all` |

### 6.2 Cutover checklist (production `build:all`)

Do **not** flip Vercel until:

1. Local `build:all` green twice on clean install.
2. Preview deployment (branch) with `build:all` validated against G0.2–G0.6.
3. Profile smoke on that preview: home, works, writing, project overlay if used.
4. Science smoke: hub, stub, hard-refresh, direct asset URL load.
5. Rollback owner identified (§12).

### 6.3 Forbidden Vercel changes

```json
// FORBIDDEN — would capture /science/* into profile SPA
{ "source": "/(.*)", "destination": "/index.html" }
```

Existing rewrites for `/works` and `/writing` remain. Add comment in `vercel.json`:

```text
// Do not add a global SPA fallback. /science is a static MPA subtree under dist/science.
```

### 6.4 Headers

| Path | Action |
|------|--------|
| Existing security headers `/(.*)` | Keep (nosniff, DENY frame, referrer) |
| `/assets/(.*)` immutable | Profile only today |
| `/science/assets/(.*)` | **Add** same immutable cache as profile assets at cutover or in Phase 0 PR |
| X-Frame-Options: DENY | Acceptable — tools not embeddable in third-party iframes (document for Phase 1 if embeds desired) |

### 6.5 Preview vs production

- PR previews must use the same build command as intended production policy for that branch.
- If production still uses profile-only build, a PR that only adds science files won’t show `/science` in production until cutover — **expected**. Communicate in PR description.

---

## 7. Security

| Topic | Phase 0 requirement | Phase 1+ |
|-------|---------------------|----------|
| XSS | No user HTML; static pages | Sanitize any netlist/URL state; avoid `eval` |
| Supply chain | Prefer zero new runtime deps for shell | Pin versions; review WASM binaries |
| Framing | DENY — tools not third-party embeddable | Revisit CSP/`frame-ancestors` if embeds needed |
| WASM/SAB | N/A | May need COOP/COEP — plan headers carefully (breaks some analytics) |
| Secrets | None in science static site | No API keys in client tools |
| Mixed content | HTTPS only (Vercel default) | Same |

Threat model Phase 0: static content; primary risk is **deploy misconfig** taking down portfolio, not science RCE.

---

## 8. Legal, licensing, IP

| Issue | Policy |
|-------|--------|
| Portfolio license | `UNLICENSED` today — science inherits repo license unless split later |
| CircuitJS1 / Falstad ports | **GPLv2** — do **not** copy source into this repo without a conscious license change to GPL-compatible for that code |
| Algorithms / ideas | Clean-room: reimplement from public domain theory, papers, own derivations; cite inspirations in tool About UI |
| Branding | Do not imply endorsement by Falstad, PhET, or commercial EDA vendors |
| Professional use | Tools are **educational / experimental**. No claim of IEC/IEEE certification, PE stamp, or production circuit sign-off |
| Third-party libs | Prefer MIT/Apache/BSD; document any copyleft before merge |

**Failure mode if ignored:** GPLv2 contamination of proprietary site → forced license change or takedown. Corporate severity: high.

---

## 9. Quality, testing, CI

### 9.1 Phase 0 test matrix

| Test | Type | Command / method |
|------|------|------------------|
| Profile unit (existing) | as today | unchanged |
| Isolation forbid-list | script | `node scripts/check-science-isolation.mjs` |
| Dual build | integration | `npm run build:all` |
| Artifact assert | script | exists `dist/science/index.html`, `dist/science/stub/index.html` |
| Preview smoke | manual or Playwright | `/`, `/science/`, `/science/stub/`, `/works` |
| Asset 200 | smoke | Parse hub HTML for script src; fetch |

### 9.2 CI recommendations (minimum)

If CI exists or is added:

1. `npm run build` must pass on every PR (portfolio).
2. PRs touching `science/**` or `vite.science.config.ts` must run `build:all` + isolation script.
3. Optional: fail if `vercel.json` gains catch-all rewrite (regex check).

### 9.3 Phase 1+ testing (documented now)

| Layer | Practice |
|-------|----------|
| Solvers | Vitest golden vectors (RC step, FFT peaks, KCL residual) |
| Lifecycle | mount → N frames → dispose → no leaked listeners (mock) |
| Visual | Optional screenshot smoke; not pixel-perfect physics |
| Perf budget | Per-tool: main-thread long task &lt; 50ms target at default settings; document if exceeded |

---

## 10. Performance and browser support

### 10.1 Phase 0 budgets

| Metric | Budget |
|--------|--------|
| Hub transfer (HTML+CSS+JS, brotli) | &lt; 50 KB preferred; fail review if &gt; 150 KB without justification |
| Stub | Same |
| Profile bundle delta | **0 expected** — science not in profile graph; verify chunk names |

### 10.2 Browser support (tools, Phase 1+)

| Tier | Browsers | Expectation |
|------|----------|-------------|
| A | Last 2 Chrome/Edge/Firefox/Safari desktop | Full |
| B | iOS Safari / Android Chrome recent | Best effort; reduced grid sizes |
| C | IE / very old browsers | Unsupported — show static message |

WebGPU optional progressive enhancement; **WebGL2/Canvas fallback required** for real field tools.

### 10.3 Sim doctrine (Phase 1+)

- Fixed or semi-fixed timestep; clamp dt.
- Cap substeps per frame.
- Typed arrays; no per-cell objects.
- Dispose GL/audio/workers on leave.

---

## 11. Observability and ops

| Item | Phase 0 | Later |
|------|---------|-------|
| Vercel Analytics | Profile only | Optional science pageviews |
| Error tracking | None required for static stub | Add if tools grow complex |
| Uptime | Vercel project health | Alert if production homepage 5xx |
| Logging | Build logs only | — |

---

## 12. Rollback and incident runbook

### 12.1 Science broken, profile fine

1. Confirm `/` works.
2. If `build:all` in production: set Vercel build command back to `npm run build`, redeploy last good commit **or** redeploy without science merge.
3. `/science` may 404 — acceptable temporary state; communicate if linked.

### 12.2 Profile broken after science PR

1. Revert PR immediately (preferred) or redeploy previous deployment in Vercel UI.
2. Root-cause: `emptyOutDir` order, rewrite, shared config bleed, accidental `src` import.
3. Do not “fix forward” on production without local `build:all` reproduction.

### 12.3 Rollback owners

| Action | Owner |
|--------|-------|
| Vercel build command | Deploy admin (site owner) |
| Git revert | Implementer / reviewer |
| Comms if public link existed | Owner (Phase 0: no public nav link — low urgency) |

---

## 13. Implementation work breakdown (Phase 0)

### Workstream A — Scaffold

| Task | Files | Done when |
|------|-------|-----------|
| A1 Hub HTML/TS/CSS | `science/index.html`, `hub.ts`, `styles.css` | Renders title + stub link + experimental notice |
| A2 Stub page | `science/stub/index.html`, `stub.ts` | Loads; optional trivial canvas |
| A3 Science Vite config | `vite.science.config.ts` | `build:science` emits under `dist/science` |
| A4 Scripts | `package.json` | `dev:science`, `build:science`, `build:all` |
| A5 Isolation script | `scripts/check-science-isolation.mjs` | Exit 1 on forbidden imports |
| A6 tsconfig science | `science/tsconfig.json` if needed | `build:science` typechecks without breaking profile `tsc` |

### Workstream B — Verify locally

| Task | Done when |
|------|-----------|
| B1 Clean `build:all` | G0.2 |
| B2 Static preview smoke | G0.3–G0.5 |
| B3 Isolation script | G0.6 |
| B4 Profile chunk check | No science modules in `dist/assets` profile bundles (spot-check) |

### Workstream C — Deploy hygiene

| Task | Done when |
|------|-----------|
| C1 `vercel.json` comment (+ optional science asset headers) | G0.7 |
| C2 PR description documents cutover policy | Reviewer ack |
| C3 Production cutover (separate change if desired) | Preview green → set `build:all` |

### Workstream D — Documentation control

| Task | Done when |
|------|-----------|
| D1 This plan approved | Stakeholder sign-off |
| D2 Ensure plan is **not** gitignored if committed to repo | `.gitignore` must not exclude SoR path |
| D3 Optional: copy plan to `docs/science/SCI-PLAN-2026-07-22.md` for corp share | Linkable path |

**Note:** Current `.gitignore` contains `science/PLAN.md` — that is a **process defect** for source-of-truth. Fix in Phase 0: stop ignoring the SoR path or commit under `docs/`.

### Estimated effort (Phase 0)

| Workstream | Rough effort |
|------------|--------------|
| A+B | 2–6 engineering hours |
| C | 1–2 hours + preview wait |
| D | 1 hour |

Single PR acceptable; split C cutover if risk-averse.

---

## 14. Phase 1 roadmap (post-shell — not Phase 0 build)

Ordered for EE-first value and platform learning:

| Step | Deliverable | Unlocks |
|------|-------------|---------|
| 1.1 | Scope + signal gen + FFT tool | Loop, plots, audio path, dispose hygiene |
| 1.2 | Passive R/L/C filter + Bode | AC analysis honesty |
| 1.3 | Interactive MNA schematic (subset) | Falstad-class circuits without GPL paste |
| 1.4 | Digital filter applet | DSP catalog entry |
| 1.5 | Extract `science/lib/{math,render,ui}` | Scale without copy-paste |
| 1.6 | Sitemap + optional profile link | Discovery |
| 1.7 | Package graduation if deps demand | Install isolation |
| 1.8 | Field sims (ripple, EM) | Broader Falstad domains |

Each tool PR must include: honest method note, dispose path, deep link URL, hub entry, golden test if numeric.

---

## 15. Risk register (severity-ranked)

| Sev | Risk | Likelihood | Impact | Mitigation | Residual |
|-----|------|------------|--------|------------|----------|
| P0 | Science build fails production portfolio | Med if fail-closed | Site down | Profile-only default; cutover gates | Low |
| P0 | Profile build wipes science / reverse order | Med | Missing /science | Script order; document; CI | Low |
| P0 | Global SPA rewrite added later | Low–Med | /science serves profile HTML | Comment + CI check + review checklist | Low |
| P0 | `base` misconfig asset 404 | Med | Broken science UX | Smoke G0.3 | Low |
| P0 | GPL contamination from CircuitJS | Med later | Legal | Clean-room policy §8 | Med (process) |
| P1 | Over-engineering catalog/shell | Med | Delay | Phase 0 out-of-scope list | Low |
| P1 | Dual package early | Med | Glue / CI cost | Graduation rule | Low |
| P1 | React on sim hot path later | Med | Jank / wrong architecture | Doctrine + review | Med |
| P2 | Cache headers miss science assets | Med | Slower repeat visits | Add `/science/assets` headers | Low |
| P2 | Trailing slash inconsistency | Med | Broken relative assets | Locked URL + redirect | Low |
| P2 | No nav link → low discovery | High | Low traffic | Intentional Phase 0 | Accepted |
| P3 | Stub mistaken for product quality | Low | Reputation | “Plumbing only” notice on stub | Low |

---

## 16. Decision log

| Decision | Choice | Rejected alternative | Why |
|----------|--------|----------------------|-----|
| Phase 0 scope | Shell only | Shell + real demos | Isolation risk first |
| Packaging | Same package dual Vite | Separate package day one | Lower glue; isolation still real |
| Tool topology | MPA | Mega SPA | Isolation, deep links, load independence |
| Shared code | Extract on 2nd use | Upfront monorepo packages | YAGNI |
| Discovery | No profile link | Sidebar item | Protect portfolio narrative |
| Deploy default | Profile-only `build` | Always `build:all` | Portfolio uptime |
| Public stub URL | `/science/stub/` | `/science/tools/stub/` | Cleaner public API |
| Inspiration | Falstad UX/depth | Fork CircuitJS | License + modernization |
| Post-shell domain | EE/DSP first | Quantum/waves first | Owner background + proven web stacks |

---

## 17. Acceptance sign-off checklist (Phase 0)

Print and complete before calling Phase 0 done:

- [ ] G0.1–G0.9 all pass on preview with intended build command  
- [ ] No profile nav/content regressions  
- [ ] Isolation script in repo and run in CI or documented manual gate  
- [ ] `vercel.json` ban comment present  
- [ ] Cutover status explicit: **not cut over** / **cut over to build:all** (circle one)  
- [ ] Rollback path tested or tabletop-reviewed  
- [ ] Legal note understood (no GPL paste)  
- [ ] Plan stored in non-ignored repo path if this is corporate SoR  
- [ ] Stakeholder approval recorded (name/date)

---

## 18. Open items (closed for Phase 0 start)

| Item | Resolution |
|------|------------|
| Stub URL shape | `/science/stub/` via `science/stub/index.html` |
| Package split | Deferred to graduation rule |
| Catalog module | Deferred to ≥3 tools |
| Profile link | Deferred to post real tool |
| Production build command | Profile-only until cutover checklist |
| SoR location | This plan document; fix `science/PLAN.md` gitignore if using that path |

**No blocking open questions remain for Phase 0 implementation.**

---

## 19. Appendix A — Anti-patterns (do not ship)

1. React state as the 60 Hz simulator  
2. Fake field/current visualization without underlying solve  
3. Catch-all SPA rewrite  
4. Merging science into profile Rollup input  
5. Copying CircuitJS1/GWT sources into UNLICENSED tree  
6. Fail-closed dual build on day one without preview proof  
7. Building “full monorepo packages” before second consumer  
8. Marketing stub as a science product  

## 20. Appendix B — Reference architecture mentors (non-dependencies)

| Project | Use as |
|---------|--------|
| myPhysicsLab | Lifecycle / Clock / AdvanceStrategy patterns |
| CircuitJS1 | Algorithm study only — **GPLv2**, no paste |
| spice-ts / EEcircuit | Modern EE browser solver patterns |
| Ten Minute Physics | Minimal honest demos |
| Vite MPA docs | Multi-page `input` + `base` |

## 21. Appendix C — Glossary

| Term | Meaning |
|------|---------|
| MPA | Multi-page application — each tool has its own HTML document |
| Shell | Phase 0 foundation without real scientific tools |
| Profile | Existing personal portfolio SPA at site root |
| Cutover | Switching Vercel production build to `build:all` |
| Honest solver | Numerical method that implements the claimed physics/circuit equations |

---

## 22. Implementation sequence (ordered commits / PR steps)

1. Fix SoR gitignore issue if plan lives under `science/PLAN.md`.  
2. Add `science/index.html`, `science/stub/index.html`, entries, CSS.  
3. Add `vite.science.config.ts` + package scripts.  
4. Add isolation check script; run locally.  
5. `npm run build:all`; fix base/paths until G0.2–G0.5 pass.  
6. Update `vercel.json` comment + science asset cache headers.  
7. Open PR; preview with `build:all` if possible.  
8. Merge; leave production on `npm run build` until cutover checklist.  
9. Cut over production build command; verify live G0 gates.  
10. Stop Phase 0. Phase 1 tools are separate approved work.

---

**END OF PLAN SCI-PLAN-2026-07-22**
