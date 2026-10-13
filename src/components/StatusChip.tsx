export type StatusKind = 'issued' | 'hold' | 'note' | 'ai';

const TEXT: Record<StatusKind, string> = { issued: 'Issued', hold: 'Hold', note: 'Note', ai: 'AI-assisted' };

/** Plain-language decoding of the drafting term, for a first-time visitor. */
const HINT: Record<StatusKind, string> = {
  issued: 'Published',
  hold: 'Listed, but there is no write-up yet',
  note: 'Coursework note, inline on this sheet',
  ai: 'Drafted with AI assistance',
};

const STYLE: Record<StatusKind, string> = {
  issued: 'border-rule-ui text-pen',
  hold: 'border-dashed border-rule-strong text-ink-3',
  note: 'border-rule text-ink-2',
  ai: 'border-rule text-ink-2',
};

/** A status word in a hairline box. Status is always text; the colour only repeats it. */
export function StatusChip({ kind }: { kind: StatusKind }) {
  return (
    <span title={HINT[kind]} className={`t-label inline-block whitespace-nowrap border px-[6px] py-[2px] ${STYLE[kind]}`}>
      {TEXT[kind]}
    </span>
  );
}
