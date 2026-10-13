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
const GAP = 32;
const TOP = 26;
const AXIS = TOP + NODE_H / 2;
const HEIGHT = TOP + NODE_H + 26;

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
 * The E-102 signal chain as a single-line diagram with section cuts. The cuts are the point: a
 * section view shows what is at the cut, and here that is a scope capture of the signal, so each
 * mark links to its figure and thickens while that figure is in view.
 */
export function ChainDiagram({ nodes, cuts }: ChainDiagramProps) {
  const width = PAD * 2 + nodes.length * NODE_W + (nodes.length - 1) * GAP;
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

  const xOf = (i: number) => PAD + i * (NODE_W + GAP);
  const cutAfter = (id: string) => cuts.find((c) => c.after === id);

  return (
    <div>
      <p className="t-label text-ink-3">Signal chain · Section cuts A–C</p>
      {/* A scrollable region must be reachable by keyboard (WCAG 2.1.1), so it is focusable and named. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div role="region" aria-label="Signal chain diagram; scrolls horizontally" tabIndex={0} className="scroll-region relative mt-3 border border-rule-strong bg-paper-2">
        <div className="relative" style={{ width, height: HEIGHT }}>
          <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} aria-hidden="true" focusable="false" className="block">
            {/* centerline axis */}
            <line x1="0" y1={AXIS} x2={width} y2={AXIS} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="8 3 2 3" />
            {nodes.map((n, i) => {
              const x = xOf(i);
              const label = wrap(n.label.toUpperCase(), 15);
              const sub = n.sub ? wrap(n.sub, 19) : [];
              const total = label.length * 16 + (sub.length ? 4 + sub.length * 15 : 0);
              let ty = TOP + (NODE_H - total) / 2 + 12;
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
                  <rect x={x + 0.5} y={TOP + 0.5} width={NODE_W - 1} height={NODE_H - 1} fill="var(--paper-2)" stroke="var(--rule-strong)" strokeWidth="1" />
                  {lines}
                  {i < nodes.length - 1 && (
                    <g stroke="var(--ink-2)" strokeWidth="1" fill="none">
                      <line x1={x + NODE_W} y1={AXIS} x2={x + NODE_W + GAP - 7} y2={AXIS} />
                      <path d={`M${x + NODE_W + GAP - 7} ${AXIS - 3.5} l6 3.5 -6 3.5`} fill="var(--ink-2)" stroke="none" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          {nodes.map((n, i) => {
            const cut = cutAfter(n.id);
            if (!cut || i >= nodes.length - 1) return null;
            const cx = xOf(i) + NODE_W + GAP / 2;
            return (
              <SectionCutMark
                key={cut.id}
                id={cut.id}
                active={active.has(cut.id)}
                href={`#fig-${cut.figures[0]}`}
                label={cut.label}
                figure={cut.figures[0]}
                style={{ left: cx - 14, top: AXIS - 32 }}
              />
            );
          })}
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
