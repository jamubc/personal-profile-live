import { useEffect, useState } from 'react';
import type { ChainCut, ChainNode } from '../data/engineering';
import { SectionCutMark } from './SectionCutMark';
import './ChainDiagram.css';

interface ChainDiagramProps {
  nodes: ChainNode[];
  cuts: ChainCut[];
}

const PAD = 12;
const NODE_W = 144;
const NODE_H = 88;
const GAP = 32; // between nodes in a row: the arrow, and a cut mark when there is one
const ROW_GAP = 56; // between rows: the return path, and a cut mark when there is one
const TOP = 26;

/** Greedy word wrap on an estimated character budget (the SVG cannot wrap text itself). */
function wrap(text: string, perLine: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > perLine && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

/**
 * One layout of the chain with `cols` nodes per row. The signal runs left to right along each row and
 * returns to the start of the next row on a drawn path, so a phone gets three rows of two, a tablet two
 * rows of three and a wide sheet one row of six. Text stays 12px at every width.
 */
function Layout({ nodes, cuts, cols, active }: ChainDiagramProps & { cols: number; active: Set<string> }) {
  const rows = Math.ceil(nodes.length / cols);
  const width = PAD * 2 + cols * NODE_W + (cols - 1) * GAP;
  const height = TOP + rows * NODE_H + (rows - 1) * ROW_GAP + 26;
  const rowTop = (r: number) => TOP + r * (NODE_H + ROW_GAP);
  const axisOf = (r: number) => rowTop(r) + NODE_H / 2;
  const xOf = (c: number) => PAD + c * (NODE_W + GAP);
  const cutAfter = (id: string) => cuts.find((c) => c.after === id);
  const marks: JSX.Element[] = [];
  const paths: JSX.Element[] = [];

  nodes.forEach((n, i) => {
    if (i === nodes.length - 1) return;
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cut = cutAfter(n.id);
    const mark = (left: number, top: number) =>
      cut &&
      marks.push(
        <SectionCutMark key={cut.id} id={cut.id} active={active.has(cut.id)} href={`#fig-${cut.figures[0]}`} label={cut.label} figures={cut.figures} style={{ left, top }} />,
      );
    if (c < cols - 1) {
      // arrow to the next node in the row
      const x0 = xOf(c) + NODE_W;
      const y = axisOf(r);
      paths.push(
        <g key={`a${i}`} stroke="var(--ink-2)" strokeWidth="1" fill="none">
          <line x1={x0} y1={y} x2={x0 + GAP - 7} y2={y} />
          <path d={`M${x0 + GAP - 7} ${y - 3.5} l6 3.5 -6 3.5`} fill="var(--ink-2)" stroke="none" />
        </g>,
      );
      mark(x0 + GAP / 2 - 14, y - 32);
    } else {
      // return path: right edge of this row, down, back across, down into the first node of the next row
      const xr = xOf(c) + NODE_W;
      const y0 = axisOf(r);
      const yRet = rowTop(r) + NODE_H + ROW_GAP / 2;
      const y1 = axisOf(r + 1);
      paths.push(
        <g key={`r${i}`} stroke="var(--ink-2)" strokeWidth="1" fill="none">
          <path d={`M${xr} ${y0} h8 V${yRet} H4 V${y1} h${PAD - 4 - 7}`} />
          <path d={`M${PAD - 7} ${y1 - 3.5} l6 3.5 -6 3.5`} fill="var(--ink-2)" stroke="none" />
        </g>,
      );
      mark(width / 2 - 14, yRet - 32);
    }
  });

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false" className="block">
        {Array.from({ length: rows }, (_, r) => (
          <line key={r} x1="0" y1={axisOf(r)} x2={width} y2={axisOf(r)} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="8 3 2 3" />
        ))}
        {paths}
        {nodes.map((n, i) => {
          const x = xOf(i % cols);
          const y = rowTop(Math.floor(i / cols));
          const label = wrap(n.label.toUpperCase(), 15);
          const sub = n.sub ? wrap(n.sub, 19) : [];
          const total = label.length * 16 + (sub.length ? 4 + sub.length * 15 : 0);
          let ty = y + (NODE_H - total) / 2 + 12;
          const lines: JSX.Element[] = [];
          for (const l of label) {
            lines.push(
              <text key={`l${l}`} x={x + NODE_W / 2} y={ty} textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-mono)" fontSize="12" fontWeight="500" letterSpacing="0.06em">
                {l}
              </text>,
            );
            ty += 16;
          }
          ty += 4;
          for (const s of sub) {
            lines.push(
              <text key={`s${s}`} x={x + NODE_W / 2} y={ty} textAnchor="middle" fill="var(--ink-3)" fontFamily="var(--font-sans)" fontSize="12">
                {s}
              </text>,
            );
            ty += 15;
          }
          return (
            <g key={n.id}>
              <rect x={x + 0.5} y={y + 0.5} width={NODE_W - 1} height={NODE_H - 1} fill="var(--paper-2)" stroke="var(--rule-strong)" strokeWidth="1" />
              {lines}
            </g>
          );
        })}
      </svg>
      {marks}
    </div>
  );
}

/**
 * The E-102 signal chain as a single-line diagram with section cuts. The cuts are the point: a
 * section view shows what is at the cut, and here that is a scope capture of the signal, so each
 * mark links to its figure and thickens while that figure is in view. Three layouts are rendered
 * and CSS shows one per width, so nothing is measured and nothing shifts.
 */
export function ChainDiagram({ nodes, cuts }: ChainDiagramProps) {
  const [active, setActive] = useState<Set<string>>(() => new Set());

  // One observer over the cut figures: a cut is active while its figure is at least 40% in view.
  useEffect(() => {
    const figures = Array.from(document.querySelectorAll<HTMLElement>('figure[data-cut]'));
    if (figures.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        setActive((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            const id = (e.target as HTMLElement).dataset.cut ?? '';
            if (e.isIntersecting && e.intersectionRatio >= 0.4) next.add(id);
            else next.delete(id);
          }
          return next;
        });
      },
      { threshold: [0.4] },
    );
    figures.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <p className="t-label text-ink-3">Signal chain · Section cuts A–C</p>
      {/* A scrollable region must be reachable by keyboard (WCAG 2.1.1), so it is focusable and named. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div role="region" aria-label="Signal chain diagram" tabIndex={0} className="scroll-region mt-3 border border-rule-strong bg-paper-2">
        <div className="md:hidden">
          <Layout nodes={nodes} cuts={cuts} cols={2} active={active} />
        </div>
        <div className="hidden md:block xl:hidden">
          <Layout nodes={nodes} cuts={cuts} cols={3} active={active} />
        </div>
        <div className="hidden xl:block">
          <Layout nodes={nodes} cuts={cuts} cols={6} active={active} />
        </div>
      </div>
      <ol className="sr-only">
        {nodes.map((n) => (
          <li key={n.id}>
            {n.label}
            {n.sub ? `: ${n.sub}` : ''}
          </li>
        ))}
      </ol>
      <ul className="sr-only">
        {cuts.map((c) => (
          <li key={c.id}>
            Section {c.id}-{c.id}, after {nodes.find((n) => n.id === c.after)?.label ?? c.after}: {c.label} (figure{c.figures.length > 1 ? 's' : ''}{' '}
            {c.figures.join(' and ')})
          </li>
        ))}
      </ul>
    </div>
  );
}
