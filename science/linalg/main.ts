/**
 * Open-ended R³ linear algebra workspace (Desmos-like).
 * Define names, write expressions, toggle plots. Keyboard-first (Tab / Enter).
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import '../styles.css';

// ── Values ─────────────────────────────────────────────────────────

type Vec3 = { kind: 'vec'; x: number; y: number; z: number };
type Scalar = { kind: 'scalar'; n: number };
type Value = Vec3 | Scalar;

const vec = (x: number, y: number, z: number): Vec3 => ({ kind: 'vec', x, y, z });
const scalar = (n: number): Scalar => ({ kind: 'scalar', n });

function isVec(v: Value): v is Vec3 {
  return v.kind === 'vec';
}
function isScalar(v: Value): v is Scalar {
  return v.kind === 'scalar';
}

function vadd(a: Vec3, b: Vec3): Vec3 {
  return vec(a.x + b.x, a.y + b.y, a.z + b.z);
}
function vsub(a: Vec3, b: Vec3): Vec3 {
  return vec(a.x - b.x, a.y - b.y, a.z - b.z);
}
function vscale(a: Vec3, s: number): Vec3 {
  return vec(a.x * s, a.y * s, a.z * s);
}
function vdot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
function vcross(a: Vec3, b: Vec3): Vec3 {
  return vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}
function vmag(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z);
}

function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return 'NaN';
  const t = Math.round(n * 1e6) / 1e6;
  return Object.is(t, -0) ? '0' : String(t);
}

function fmtVal(v: Value): string {
  if (isScalar(v)) return fmtNum(v.n);
  return `⟨${fmtNum(v.x)}, ${fmtNum(v.y)}, ${fmtNum(v.z)}⟩`;
}

// ── Vector text forms ──────────────────────────────────────────────
// Accepts: [1,2,3]  ⟨1, 2, 3⟩  <1 2 3>  (1,2,3)  1,2,3  1 2 3  etc.

const NUM_TOKEN = '[-+]?\\d*\\.?\\d+(?:[eE][-+]?\\d+)?';

/** Whole-string vector parse (assignment RHS or bare line). */
function tryParseVectorText(raw: string): { x: number; y: number; z: number } | null {
  let s = raw.trim();
  if (!s) return null;

  const pairs: [string, string][] = [
    ['[', ']'],
    ['⟨', '⟩'],
    ['<', '>'],
    ['(', ')'],
  ];
  for (const [a, b] of pairs) {
    if (s.startsWith(a) && s.endsWith(b) && s.length >= 2) {
      s = s.slice(a.length, s.length - b.length).trim();
      break;
    }
  }

  // Split on commas and/or whitespace; require exactly 3 numeric tokens
  const parts = s.split(/[\s,]+/).filter((p) => p.length > 0);
  if (parts.length !== 3) return null;

  const re = new RegExp(`^${NUM_TOKEN}$`);
  if (!parts.every((p) => re.test(p))) return null;

  const nums = parts.map((p) => parseFloat(p));
  if (nums.some((n) => !Number.isFinite(n))) return null;
  return { x: nums[0], y: nums[1], z: nums[2] };
}

// ── Lexer / parser ─────────────────────────────────────────────────

type Tok =
  | { t: 'num'; v: number }
  | { t: 'id'; v: string }
  | { t: 'op'; v: string }
  | { t: 'eof' };

function tokenize(input: string): Tok[] {
  const s = input.trim();
  const out: Tok[] = [];
  let i = 0;
  const isAlpha = (c: string) => /[A-Za-z_]/.test(c);
  const isAlnum = (c: string) => /[A-Za-z0-9_]/.test(c);

  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (s.startsWith('**', i)) {
      out.push({ t: 'op', v: '×' });
      i += 2;
      continue;
    }
    if (c === '·' || c === '⋅') {
      out.push({ t: 'op', v: '·' });
      i++;
      continue;
    }
    if (c === '×') {
      out.push({ t: 'op', v: '×' });
      i++;
      continue;
    }
    // vector / group brackets — normalize openers to [ and closers to ]
    if (c === '⟨' || c === '[' || c === '<') {
      out.push({ t: 'op', v: '[' });
      i++;
      continue;
    }
    if (c === '⟩' || c === ']' || c === '>') {
      out.push({ t: 'op', v: ']' });
      i++;
      continue;
    }
    if ('+-*/^(),='.includes(c)) {
      out.push({ t: 'op', v: c });
      i++;
      continue;
    }
    if (/\d/.test(c) || (c === '.' && /\d/.test(s[i + 1] ?? ''))) {
      let j = i;
      while (j < s.length && /[\d.]/.test(s[j])) j++;
      // optional scientific exponent
      if (j < s.length && (s[j] === 'e' || s[j] === 'E')) {
        let k = j + 1;
        if (k < s.length && (s[k] === '+' || s[k] === '-')) k++;
        const start = k;
        while (k < s.length && /\d/.test(s[k])) k++;
        if (k > start) j = k;
      }
      const n = parseFloat(s.slice(i, j));
      if (!Number.isFinite(n)) throw new Error('bad number');
      out.push({ t: 'num', v: n });
      i = j;
      continue;
    }
    if (isAlpha(c)) {
      let j = i + 1;
      while (j < s.length && isAlnum(s[j])) j++;
      out.push({ t: 'id', v: s.slice(i, j) });
      i = j;
      continue;
    }
    throw new Error(`unexpected “${c}”`);
  }
  out.push({ t: 'eof' });
  return out;
}

class Parser {
  private i = 0;
  constructor(
    private toks: Tok[],
    private env: Map<string, Value>
  ) {}

  peek(): Tok {
    return this.toks[this.i] ?? { t: 'eof' };
  }
  private eat(): Tok {
    return this.toks[this.i++] ?? { t: 'eof' };
  }
  private expectOp(v: string) {
    const t = this.eat();
    if (t.t !== 'op' || t.v !== v) throw new Error(`expected “${v}”`);
  }

  parseAll(): Value {
    const v = this.parseAdd();
    if (this.peek().t !== 'eof') throw new Error('unexpected input after expression');
    return v;
  }

  private parseAdd(): Value {
    let left = this.parseMul();
    for (;;) {
      const t = this.peek();
      if (t.t === 'op' && (t.v === '+' || t.v === '-')) {
        this.eat();
        const right = this.parseMul();
        left = applyAdd(left, right, t.v);
      } else break;
    }
    return left;
  }

  private parseMul(): Value {
    let left = this.parseUnary();
    for (;;) {
      const t = this.peek();
      if (t.t === 'op' && (t.v === '*' || t.v === '/' || t.v === '·' || t.v === '×')) {
        this.eat();
        const right = this.parseUnary();
        if (t.v === '·') left = applyDot(left, right);
        else if (t.v === '×') left = applyCross(left, right);
        else if (t.v === '*') left = applyMul(left, right);
        else left = applyDiv(left, right);
      } else break;
    }
    return left;
  }

  private parseUnary(): Value {
    const t = this.peek();
    if (t.t === 'op' && t.v === '-') {
      this.eat();
      const v = this.parseUnary();
      return isScalar(v) ? scalar(-v.n) : vscale(v, -1);
    }
    if (t.t === 'op' && t.v === '+') {
      this.eat();
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Value {
    const t = this.peek();

    // [ … ] / ( … ) — group or 3-vector (commas and/or spaces between components)
    if (t.t === 'op' && (t.v === '[' || t.v === '(')) {
      const close = t.v === '[' ? ']' : ')';
      this.eat();
      const first = this.parseAdd();
      const next = this.peek();

      // empty close after one expr → group: (a+b) or [x] single (treated as group)
      if (next.t === 'op' && next.v === close) {
        this.eat();
        return first;
      }

      // vector: three scalar components; commas optional (space-separated OK)
      if (!isScalar(first)) throw new Error('vector components must be numbers');
      const comps = [first.n];
      while (comps.length < 3) {
        let p = this.peek();
        if (p.t === 'op' && p.v === ',') this.eat();
        p = this.peek();
        if (p.t === 'op' && p.v === close) break;
        const comp = this.parseAdd();
        if (!isScalar(comp)) throw new Error('vector components must be numbers');
        comps.push(comp.n);
      }
      this.expectOp(close);
      if (comps.length !== 3) throw new Error('vector needs 3 components');
      return vec(comps[0], comps[1], comps[2]);
    }

    if (t.t === 'num') {
      this.eat();
      return scalar(t.v);
    }

    if (t.t === 'id') {
      this.eat();
      const name = t.v;
      if (this.peek().t === 'op' && (this.peek() as { v: string }).v === '(') {
        return this.parseCall(name);
      }
      const lower = name.toLowerCase();
      if (lower === 'i') return vec(1, 0, 0);
      if (lower === 'j') return vec(0, 1, 0);
      if (lower === 'k') return vec(0, 0, 1);
      const found = this.env.get(name);
      if (!found) throw new Error(`unknown “${name}”`);
      return found;
    }

    throw new Error('expected expression');
  }

  private parseCall(name: string): Value {
    this.expectOp('(');
    const args: Value[] = [];
    if (!(this.peek().t === 'op' && (this.peek() as { v: string }).v === ')')) {
      args.push(this.parseAdd());
      while (this.peek().t === 'op' && (this.peek() as { v: string }).v === ',') {
        this.eat();
        args.push(this.parseAdd());
      }
    }
    this.expectOp(')');
    return applyCall(name, args);
  }
}

function applyAdd(a: Value, b: Value, op: string): Value {
  if (isScalar(a) && isScalar(b)) return scalar(op === '+' ? a.n + b.n : a.n - b.n);
  if (isVec(a) && isVec(b)) return op === '+' ? vadd(a, b) : vsub(a, b);
  throw new Error('add/subtract needs two scalars or two vectors');
}

function applyMul(a: Value, b: Value): Value {
  if (isScalar(a) && isScalar(b)) return scalar(a.n * b.n);
  if (isScalar(a) && isVec(b)) return vscale(b, a.n);
  if (isVec(a) && isScalar(b)) return vscale(a, b.n);
  throw new Error('use · for dot or × for cross (or cross(u,v))');
}

function applyDiv(a: Value, b: Value): Value {
  if (isScalar(a) && isScalar(b)) {
    if (b.n === 0) throw new Error('division by zero');
    return scalar(a.n / b.n);
  }
  if (isVec(a) && isScalar(b)) {
    if (b.n === 0) throw new Error('division by zero');
    return vscale(a, 1 / b.n);
  }
  throw new Error('invalid division');
}

function applyDot(a: Value, b: Value): Value {
  if (!isVec(a) || !isVec(b)) throw new Error('· needs two vectors');
  return scalar(vdot(a, b));
}

function applyCross(a: Value, b: Value): Value {
  if (!isVec(a) || !isVec(b)) throw new Error('× needs two vectors');
  return vcross(a, b);
}

function applyCall(name: string, args: Value[]): Value {
  const n = name.toLowerCase();
  if (n === 'dot') {
    if (args.length !== 2) throw new Error('dot(u, v)');
    return applyDot(args[0], args[1]);
  }
  if (n === 'cross') {
    if (args.length !== 2) throw new Error('cross(u, v)');
    return applyCross(args[0], args[1]);
  }
  if (n === 'norm' || n === 'mag' || n === 'abs' || n === 'length') {
    if (args.length !== 1) throw new Error('norm(v)');
    const a = args[0];
    return isScalar(a) ? scalar(Math.abs(a.n)) : scalar(vmag(a));
  }
  if (n === 'unit' || n === 'normalize') {
    if (args.length !== 1) throw new Error('unit(v)');
    if (!isVec(args[0])) throw new Error('unit(v) needs a vector');
    const m = vmag(args[0]);
    if (m === 0) throw new Error('zero vector');
    return vscale(args[0], 1 / m);
  }
  if (n === 'proj' || n === 'project') {
    if (args.length !== 2) throw new Error('proj(a, b) — project a onto b');
    if (!isVec(args[0]) || !isVec(args[1])) throw new Error('proj needs vectors');
    const bb = vdot(args[1], args[1]);
    if (bb === 0) throw new Error('proj onto zero');
    return vscale(args[1], vdot(args[0], args[1]) / bb);
  }
  if (n === 'vec' || n === 'vector') {
    if (args.length !== 3 || !args.every(isScalar)) throw new Error('vec(x, y, z)');
    return vec(args[0].n, args[1].n, args[2].n);
  }
  throw new Error(`unknown function “${name}”`);
}

/** Built-in basis names — not rebindable */
const RESERVED_NAMES = new Set(['i', 'j', 'k']);

function evalLine(
  raw: string,
  priorEnv: Map<string, Value>,
  defined: ReadonlySet<string>
): { env: Map<string, Value>; value: Value | null; assign: string | null; error?: string } {
  try {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) {
      return { env: priorEnv, value: null, assign: null };
    }

    // assignment name = expr
    const eq = line.indexOf('=');
    if (eq > 0) {
      const left = line.slice(0, eq).trim();
      const right = line.slice(eq + 1).trim();
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(left) && right.length > 0) {
        if (RESERVED_NAMES.has(left) || RESERVED_NAMES.has(left.toLowerCase())) {
          return {
            env: priorEnv,
            value: null,
            assign: null,
            error: `“${left}” is reserved (basis vector)`,
          };
        }
        if (defined.has(left)) {
          return {
            env: priorEnv,
            value: null,
            assign: null,
            error: `“${left}” is already defined`,
          };
        }
        const env = new Map(priorEnv);
        // Flexible vector RHS: a = <1 2 3>, a = 1,2,3, …
        const asVec = tryParseVectorText(right);
        const value = asVec
          ? vec(asVec.x, asVec.y, asVec.z)
          : new Parser(tokenize(right), env).parseAll();
        env.set(left, value);
        return { env, value, assign: left };
      }
    }

    // Bare vector line: 1 2 3  or  <1,2,3>
    const bare = tryParseVectorText(line);
    if (bare) {
      return { env: priorEnv, value: vec(bare.x, bare.y, bare.z), assign: null };
    }

    const value = new Parser(tokenize(line), priorEnv).parseAll();
    return { env: priorEnv, value, assign: null };
  } catch (e) {
    return {
      env: priorEnv,
      value: null,
      assign: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

// ── Notebook rows ──────────────────────────────────────────────────

type Row = { id: string; source: string; plot: boolean; color: string };

const PLOT_COLORS = ['#00f7ff', '#ef522e', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#94a3b8'];

let rowSeq = 0;
function newId() {
  rowSeq += 1;
  return `r${rowSeq}`;
}

const rows: Row[] = [
  { id: newId(), source: 'a = [2, 1, 0.5]', plot: true, color: PLOT_COLORS[0] },
  { id: newId(), source: 'b = [0.5, 2, 1]', plot: true, color: PLOT_COLORS[1] },
  { id: newId(), source: 's = a + b', plot: true, color: PLOT_COLORS[2] },
  { id: newId(), source: 'a · b', plot: false, color: PLOT_COLORS[3] },
  { id: newId(), source: 'a × b', plot: true, color: PLOT_COLORS[4] },
  { id: newId(), source: '', plot: true, color: PLOT_COLORS[5] },
];

type RowResult = { value: Value | null; error?: string; assign: string | null };

function recomputeAll(): RowResult[] {
  let env = new Map<string, Value>();
  const defined = new Set<string>();
  const results: RowResult[] = [];
  for (const row of rows) {
    const r = evalLine(row.source, env, defined);
    if (!r.error && r.assign) {
      env = r.env;
      defined.add(r.assign);
    }
    // Failed redefinition does not bind; earlier binding stays in env
    results.push({ value: r.value, error: r.error, assign: r.assign });
  }
  return results;
}

// ── DOM ────────────────────────────────────────────────────────────

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('linalg: #app missing');

app.innerHTML = `
  <div class="tool">
    <header class="topbar">
      <div class="topbar-brand">
        <strong>Science</strong>
        <span class="sep">/</span>
        <span>Linear algebra</span>
      </div>
      <div class="topbar-meta">
        <a class="topbar-link" href="../">Index</a>
        <span>Enter = next line · ⌫ empty = delete line</span>
      </div>
    </header>

    <div class="tool-body">
      <aside class="panel sheet-panel">
        <div class="sheet-ref" aria-label="Syntax">
          <span class="sheet-ref-line">
            <span class="k">assign</span> a = …
            <span class="sep">|</span>
            <span class="k">vector</span> [1,2,3] · &lt;1 2 3&gt; · 1,2,3 · 1 2 3
            <span class="sep">|</span>
            + − * / · × · norm proj unit cross
          </span>
          <span class="sheet-ref-line sheet-ref-hint">
            One definition per name. i, j, k are basis. × removes a line. ⟨⟩ edits components.
          </span>
        </div>
        <div class="sheet" id="sheet" role="list"></div>
        <button type="button" class="btn sheet-add" id="add-row">+ line</button>
      </aside>

      <div class="viewport-wrap">
        <div class="viewport" id="viewport"></div>
        <div class="viewport-hint">Drag orbit · scroll zoom</div>
      </div>
    </div>
  </div>
`;

const sheetNode = document.querySelector<HTMLDivElement>('#sheet');
const viewportNode = document.querySelector<HTMLDivElement>('#viewport');
const addRowBtn = document.querySelector<HTMLButtonElement>('#add-row');
if (!sheetNode || !viewportNode || !addRowBtn) throw new Error('linalg: missing UI');
const sheet = sheetNode;
const viewport = viewportNode;

/** Stable vector-edit session (survives re-renders; not passed as opts) */
type VecEditSession = {
  rowId: string;
  name: string | null;
  snapshot: string;
  focusComp: 0 | 1 | 2;
};

let vecEdit: VecEditSession | null = null;

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(s: string): string {
  return escapeAttr(s);
}

/** a = …vector… in any accepted vector spelling */
function parseVectorAssign(src: string): { name: string; x: number; y: number; z: number } | null {
  const m = src.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
  if (!m) return null;
  const v = tryParseVectorText(m[2]);
  if (!v) return null;
  return { name: m[1], x: v.x, y: v.y, z: v.z };
}

function parseVectorLiteral(src: string): { x: number; y: number; z: number } | null {
  return tryParseVectorText(src);
}

function formatVectorSource(name: string | null, x: number, y: number, z: number): string {
  const body = `[${fmtNum(x)}, ${fmtNum(y)}, ${fmtNum(z)}]`;
  return name ? `${name} = ${body}` : body;
}

function ensureNextRow(afterIndex: number): string {
  if (afterIndex >= rows.length - 1) {
    rows.push({
      id: newId(),
      source: '',
      plot: true,
      color: PLOT_COLORS[rows.length % PLOT_COLORS.length],
    });
  }
  return rows[afterIndex + 1].id;
}

function readCompsFromDom(rowId: string): { x: number; y: number; z: number } | null {
  const comps = sheet.querySelectorAll<HTMLInputElement>(
    `.sheet-row[data-id="${rowId}"] .vec-comp`
  );
  if (comps.length !== 3) return null;
  const nums = [...comps].map((c) => {
    const n = parseFloat(c.value.trim());
    return Number.isFinite(n) ? n : 0;
  });
  return { x: nums[0], y: nums[1], z: nums[2] };
}

function focusVecComp(rowId: string, comp: 0 | 1 | 2) {
  requestAnimationFrame(() => {
    const el = sheet.querySelector<HTMLInputElement>(
      `.sheet-row[data-id="${rowId}"] .vec-comp[data-comp="${comp}"]`
    );
    if (!el) return;
    el.focus({ preventScroll: true });
    el.select();
  });
}

function focusExpr(rowId: string) {
  requestAnimationFrame(() => {
    const el = sheet.querySelector<HTMLInputElement>(
      `.sheet-row[data-id="${rowId}"] .sheet-input`
    );
    if (!el) return;
    el.focus({ preventScroll: true });
    const len = el.value.length;
    el.setSelectionRange(len, len);
  });
}

/** Resolve name + components for opening the editor, or null if not a vector line */
function resolveVecEditTarget(
  row: Row
): { name: string | null; x: number; y: number; z: number } | null {
  const assigned = parseVectorAssign(row.source);
  if (assigned) return assigned;

  const lit = parseVectorLiteral(row.source);
  if (lit) return { name: null, ...lit };

  const idx = rows.findIndex((r) => r.id === row.id);
  const res = recomputeAll()[idx];
  if (res?.value && isVec(res.value) && !res.error) {
    const assignName = row.source.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1] ?? null;
    return {
      name: assignName,
      x: res.value.x,
      y: res.value.y,
      z: res.value.z,
    };
  }
  return null;
}

function openVecEdit(rowId: string, focusComp: 0 | 1 | 2 = 0) {
  const row = rows.find((r) => r.id === rowId);
  if (!row) return;

  // Already editing this row — just focus
  if (vecEdit?.rowId === rowId) {
    vecEdit.focusComp = focusComp;
    focusVecComp(rowId, focusComp);
    return;
  }

  // Switching rows: commit current session first
  if (vecEdit) {
    commitVecEdit({ goNextLine: false, focusExprAfter: false });
  }

  const target = resolveVecEditTarget(row);
  if (!target) return;

  vecEdit = {
    rowId,
    name: target.name,
    snapshot: row.source,
    focusComp,
  };
  // Normalize source so live preview / commit stay consistent
  row.source = formatVectorSource(target.name, target.x, target.y, target.z);
  renderSheet();
  rebuildPlots();
  focusVecComp(rowId, focusComp);
}

function commitVecEdit(opts: { goNextLine: boolean; focusExprAfter: boolean }) {
  if (!vecEdit) return;
  const { rowId, name } = vecEdit;
  const row = rows.find((r) => r.id === rowId);
  const comps = readCompsFromDom(rowId);
  if (row && comps) {
    row.source = formatVectorSource(name, comps.x, comps.y, comps.z);
  }
  const idx = rows.findIndex((r) => r.id === rowId);
  vecEdit = null;

  if (opts.goNextLine && idx >= 0) {
    const nextId = ensureNextRow(idx);
    renderSheet();
    rebuildPlots();
    focusExpr(nextId);
    return;
  }

  renderSheet();
  rebuildPlots();
  if (opts.focusExprAfter) focusExpr(rowId);
}

function cancelVecEdit() {
  if (!vecEdit) return;
  const { rowId, snapshot } = vecEdit;
  const row = rows.find((r) => r.id === rowId);
  if (row) row.source = snapshot;
  vecEdit = null;
  renderSheet();
  rebuildPlots();
  focusExpr(rowId);
}

function renderSheet() {
  const results = recomputeAll();
  sheet.innerHTML = '';

  rows.forEach((row, index) => {
    const res = results[index];
    const canPlot = !!(res.value && isVec(res.value) && !res.error);
    const plotOn = row.plot && canPlot;
    const inVec = vecEdit?.rowId === row.id;

    const el = document.createElement('div');
    el.className =
      'sheet-row' + (res.error ? ' has-error' : '') + (inVec ? ' is-vec-edit' : '');
    el.dataset.id = row.id;
    el.setAttribute('role', 'listitem');

    const outHtml = res.error
      ? escapeHtml(res.error)
      : res.value
        ? escapeHtml(fmtVal(res.value))
        : '';

    const canCompEdit = !!resolveVecEditTarget(row);

    if (inVec && vecEdit) {
      const parsed = parseVectorAssign(row.source) ?? {
        name: vecEdit.name ?? '',
        ...(parseVectorLiteral(row.source) ?? { x: 0, y: 0, z: 0 }),
      };
      const name = vecEdit.name;
      const { x, y, z } = parsed;
      el.innerHTML = `
        <button type="button" class="plot-tog ${plotOn ? 'is-on' : ''} ${canPlot ? '' : 'is-disabled'}"
          data-act="plot" title="Plot" aria-pressed="${plotOn}" ${canPlot ? '' : 'disabled'}>
          <span class="plot-dot" style="background:${row.color}"></span>
        </button>
        <span class="sheet-idx">${index + 1}</span>
        <div class="vec-edit" data-act="vec-edit">
          ${
            name
              ? `<span class="vec-edit-name">${escapeHtml(name)}</span><span class="vec-edit-eq">=</span>`
              : ''
          }
          <span class="vec-edit-br">⟨</span>
          <input class="vec-comp" data-comp="0" inputmode="decimal" value="${escapeAttr(String(x))}" aria-label="x" />
          <span class="vec-edit-comma">,</span>
          <input class="vec-comp" data-comp="1" inputmode="decimal" value="${escapeAttr(String(y))}" aria-label="y" />
          <span class="vec-edit-comma">,</span>
          <input class="vec-comp" data-comp="2" inputmode="decimal" value="${escapeAttr(String(z))}" aria-label="z" />
          <span class="vec-edit-br">⟩</span>
        </div>
        <div class="sheet-out">${outHtml}</div>
        <button type="button" class="row-del" data-act="del" title="Remove line">×</button>
      `;
    } else {
      el.innerHTML = `
        <button type="button" class="plot-tog ${plotOn ? 'is-on' : ''} ${canPlot ? '' : 'is-disabled'}"
          data-act="plot" title="Plot" aria-pressed="${plotOn}" ${canPlot ? '' : 'disabled'}>
          <span class="plot-dot" style="background:${row.color}"></span>
        </button>
        <span class="sheet-idx">${index + 1}</span>
        <input class="sheet-input" type="text" spellcheck="false" autocomplete="off" autocorrect="off"
          autocapitalize="off" data-act="src" value="${escapeAttr(row.source)}"
          placeholder="a = [1, 0, 0]" />
        <div class="sheet-out">${outHtml}</div>
        <button type="button" class="row-comp ${canCompEdit ? '' : 'is-hidden'}" data-act="comp"
          title="Edit components" ${canCompEdit ? '' : 'tabindex="-1"'}>⟨⟩</button>
        <button type="button" class="row-del" data-act="del" title="Remove line">×</button>
      `;
    }
    sheet.appendChild(el);
  });

  bindSheetEvents();
}

function removeRow(rowId: string) {
  if (rows.length <= 1) {
    // clear last line instead of removing
    const only = rows[0];
    if (only) {
      only.source = '';
      if (vecEdit?.rowId === rowId) vecEdit = null;
      renderSheet();
      rebuildPlots();
      focusExpr(only.id);
    }
    return;
  }
  const idx = rows.findIndex((r) => r.id === rowId);
  if (idx < 0) return;
  if (vecEdit?.rowId === rowId) vecEdit = null;
  const focusId = rows[Math.max(0, idx - 1)]?.id ?? rows[0].id;
  rows.splice(idx, 1);
  renderSheet();
  rebuildPlots();
  focusExpr(focusId);
}

function bindSheetEvents() {
  sheet.querySelectorAll('.sheet-row').forEach((rowEl) => {
    const id = (rowEl as HTMLElement).dataset.id!;
    const plotBtn = rowEl.querySelector<HTMLButtonElement>('[data-act="plot"]');
    const delBtn = rowEl.querySelector<HTMLButtonElement>('[data-act="del"]');
    const compBtn = rowEl.querySelector<HTMLButtonElement>('[data-act="comp"]');
    const input = rowEl.querySelector<HTMLInputElement>('.sheet-input');
    const vecEditEl = rowEl.querySelector<HTMLElement>('[data-act="vec-edit"]');

    // Click empty padding on row → focus the text field (not plot/del/comp)
    rowEl.addEventListener('mousedown', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, input, .vec-edit, .sheet-input')) return;
      const field =
        rowEl.querySelector<HTMLInputElement>('.sheet-input') ??
        rowEl.querySelector<HTMLInputElement>('.vec-comp');
      if (field) {
        e.preventDefault();
        field.focus();
      }
    });

    plotBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const row = rows.find((r) => r.id === id);
      if (!row || plotBtn.disabled) return;
      row.plot = !row.plot;
      const resultsNow = recomputeAll();
      const idx = rows.findIndex((r) => r.id === id);
      const res = resultsNow[idx];
      const can = !!(res?.value && isVec(res.value) && !res.error);
      const on = row.plot && can;
      plotBtn.classList.toggle('is-on', on);
      plotBtn.setAttribute('aria-pressed', String(on));
      rebuildPlots();
    });

    delBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeRow(id);
    });

    compBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openVecEdit(id, 0);
    });

    // ── Component editor (opt-in via ⟨⟩ only) ──
    if (vecEditEl && vecEdit?.rowId === id) {
      const comps = [...vecEditEl.querySelectorAll<HTMLInputElement>('.vec-comp')];
      const name = vecEdit.name;

      const livePreview = () => {
        const row = rows.find((r) => r.id === id);
        if (!row || !vecEdit || vecEdit.rowId !== id) return;
        const c = readCompsFromDom(id);
        if (!c) return;
        row.source = formatVectorSource(name, c.x, c.y, c.z);
        refreshOutputsOnly();
        rebuildPlots();
      };

      comps.forEach((comp, ci) => {
        comp.addEventListener('input', livePreview);
        // Delete/Backspace work natively inside fields — do not intercept
        comp.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            cancelVecEdit();
            return;
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            if (ci < 2) {
              comps[ci + 1]?.focus();
              comps[ci + 1]?.select();
            } else {
              commitVecEdit({ goNextLine: true, focusExprAfter: false });
            }
            return;
          }
          if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
              if (ci > 0) {
                comps[ci - 1]?.focus();
                comps[ci - 1]?.select();
              }
            } else if (ci < 2) {
              comps[ci + 1]?.focus();
              comps[ci + 1]?.select();
            } else {
              commitVecEdit({ goNextLine: false, focusExprAfter: true });
            }
          }
        });
      });
    }

    // ── Expression line: normal typing; no steal of Delete ──
    if (input) {
      input.addEventListener('input', () => {
        const row = rows.find((r) => r.id === id);
        if (!row) return;
        row.source = input.value;
        refreshOutputsOnly();
        rebuildPlots();
      });

      input.addEventListener('keydown', (e) => {
        const rowIndex = rows.findIndex((r) => r.id === id);

        // Remove line: empty field + Backspace or Delete
        if (
          (e.key === 'Backspace' || e.key === 'Delete') &&
          input.value === '' &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.altKey
        ) {
          e.preventDefault();
          removeRow(id);
          return;
        }

        // Also: entire line selected + Delete/Backspace → clear, second press removes
        // (native handles clear; empty case above removes)

        if (e.key === 'Escape') {
          // if component mode on another row, ignore
          input.blur();
          return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          // Always next line — component mode is only via ⟨⟩ button
          if (vecEdit) commitVecEdit({ goNextLine: false, focusExprAfter: false });
          const nextId = ensureNextRow(rowIndex);
          renderSheet();
          rebuildPlots();
          focusExpr(nextId);
          return;
        }

        if (e.key === 'Tab' && !e.shiftKey) {
          const inputs = [...sheet.querySelectorAll<HTMLInputElement>('.sheet-input')];
          if (inputs.indexOf(input) === inputs.length - 1 && rowIndex === rows.length - 1) {
            e.preventDefault();
            const nextId = ensureNextRow(rowIndex);
            renderSheet();
            rebuildPlots();
            focusExpr(nextId);
          }
          // otherwise default Tab moves focus
        }
      });
    }
  });
}

function refreshOutputsOnly() {
  const results = recomputeAll();
  sheet.querySelectorAll('.sheet-row').forEach((rowEl, index) => {
    const res = results[index];
    const out = rowEl.querySelector('.sheet-out');
    const plotBtn = rowEl.querySelector<HTMLButtonElement>('[data-act="plot"]');
    const row = rows[index];
    if (!out || !plotBtn || !row) return;
    rowEl.classList.toggle('has-error', !!res.error);
    out.textContent = res.error ? res.error : res.value ? fmtVal(res.value) : '';
    const canPlot = !!(res.value && isVec(res.value) && !res.error);
    plotBtn.disabled = !canPlot;
    plotBtn.classList.toggle('is-disabled', !canPlot);
    plotBtn.classList.toggle('is-on', !!(row.plot && canPlot));
  });
}

addRowBtn.addEventListener('click', () => {
  if (vecEdit) commitVecEdit({ goNextLine: false, focusExprAfter: false });
  const id = newId();
  rows.push({
    id,
    source: '',
    plot: true,
    color: PLOT_COLORS[rows.length % PLOT_COLORS.length],
  });
  renderSheet();
  rebuildPlots();
  focusExpr(id);
});

// ── Viewport ───────────────────────────────────────────────────────

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x020308, 1);
viewport.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 200);
camera.position.set(6.2, 4.4, 7.2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dir = new THREE.DirectionalLight(0xffffff, 0.75);
dir.position.set(5, 9, 4);
scene.add(dir);

const root = new THREE.Group();
scene.add(root);
root.add(new THREE.AxesHelper(3.2));
const grid = new THREE.GridHelper(10, 10, 0x2a3344, 0x151a24);
grid.rotation.x = Math.PI / 2;
root.add(grid);

const plotGroup = new THREE.Group();
root.add(plotGroup);

function clearPlots() {
  while (plotGroup.children.length) plotGroup.remove(plotGroup.children[0]);
}

function makeArrow(v: Vec3, color: string): THREE.ArrowHelper {
  const d = new THREE.Vector3(v.x, v.y, v.z);
  const len = d.length();
  if (len < 1e-9) d.set(0, 1, 0);
  else d.normalize();
  const headLen = Math.min(0.38, Math.max(0.14, len * 0.14));
  return new THREE.ArrowHelper(
    d,
    new THREE.Vector3(0, 0, 0),
    Math.max(len, 1e-6),
    new THREE.Color(color).getHex(),
    headLen,
    headLen * 0.55
  );
}

function rebuildPlots() {
  clearPlots();
  const results = recomputeAll();
  rows.forEach((row, i) => {
    const res = results[i];
    if (!row.plot || res.error || !res.value || !isVec(res.value)) return;
    if (vmag(res.value) < 1e-12) return;
    plotGroup.add(makeArrow(res.value, row.color));
  });
}

function resize() {
  const w = viewport.clientWidth;
  const h = viewport.clientHeight;
  if (w < 1 || h < 1) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}

let raf = 0;
let running = true;
function frame() {
  if (!running) return;
  raf = requestAnimationFrame(frame);
  controls.update();
  renderer.render(scene, camera);
}

function dispose() {
  running = false;
  cancelAnimationFrame(raf);
  controls.dispose();
  renderer.dispose();
  viewport.replaceChildren();
  ro.disconnect();
}

const ro = new ResizeObserver(() => resize());
ro.observe(viewport);
window.addEventListener('pagehide', dispose);
window.addEventListener('beforeunload', dispose);

renderSheet();
rebuildPlots();
resize();
raf = requestAnimationFrame(frame);
