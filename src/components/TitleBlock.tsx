import type { ReactNode } from 'react';
import type { Sheet } from '../data/sheets';
import type { Revision } from '../data/site';
import { SITE } from '../data/site';
import { RegistrationMark } from './RegistrationMark';
import { RevisionTable } from './RevisionTable';

interface TitleBlockProps {
  sheet: Sheet;
  /** Newest first. */
  revisions: Revision[];
  scale?: '1:1' | 'NTS';
}

function Cell({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  return (
    <div className={`bg-paper p-3 ${className}`}>
      <p className="t-micro">{label}</p>
      <div className="mt-1 font-mono text-sm text-ink">{children}</div>
    </div>
  );
}

/**
 * The title block that ends every sheet. Every field carries real data: CHECKED is always a dash
 * (an EIT does not carry a seal), BUILD is the commit that produced this page.
 */
export function TitleBlock({ sheet, revisions, scale = 'NTS' }: TitleBlockProps) {
  const current = revisions[0];
  const first = revisions[revisions.length - 1];
  const sha = __BUILD_SHA__;
  return (
    <div className="grid grid-cols-2 gap-px border-2 border-ink-3 bg-rule-strong md:grid-cols-12">
      <Cell label="Title" className="col-span-2 md:col-span-8">{sheet.title}</Cell>
      <Cell label="Sheet" className="md:col-span-2">{sheet.id}</Cell>
      <Cell label="Rev" className="md:col-span-2">{current.rev}</Cell>
      <Cell label="Drawn by" className="md:col-span-4">A. Manson, EIT</Cell>
      <Cell label="Checked" className="md:col-span-3">
        <span title="Empty on purpose: this site has no checker and no seal">—</span>
        <span className="sr-only"> (empty on purpose: this site has no checker and no seal)</span>
      </Cell>
      <Cell label="Set" className="md:col-span-3">
        <span title="This site's drawing-set code">{SITE.set}</span>
      </Cell>
      <Cell label="Scale" className="md:col-span-2">
        <span title={scale === 'NTS' ? 'Not to scale' : 'Full size'}>{scale}</span>
      </Cell>
      <Cell label="First issued" className="md:col-span-4">{first.date}</Cell>
      <Cell label="Build" className="md:col-span-5">
        {__BUILD_DATE__} ·{' '}
        {sha === 'dev' ? (
          sha
        ) : (
          <a className="link-prose" href={`${SITE.repo}/commit/${sha}`} target="_blank" rel="noopener noreferrer">
            {sha}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </Cell>
      <Cell label="Set mark" className="col-span-2 md:col-span-3">
        <span className="flex items-center gap-2">
          <RegistrationMark size={20} />
          <span className="text-[13px]">jandrewmanson.engineer</span>
        </span>
        <span className="mt-1 flex gap-3 text-[13px]">
          <a className="link-prose" href="/llms.txt">llms.txt</a>
          <a className="link-prose" href="/sitemap.xml">sitemap.xml</a>
        </span>
      </Cell>
      <div className="col-span-2 bg-paper p-3 md:col-span-12">
        <RevisionTable rows={revisions} collapseAfter={3} />
      </div>
    </div>
  );
}
