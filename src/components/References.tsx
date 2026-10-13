import { renderInline } from '../lib/renderInline';

/** The "Sources" list of a case study: a native ordered list, so the numbers are real markers with a hanging indent. */
export function References({ items }: { items: string[] }) {
  return (
    <ol className="mt-6 list-[decimal-leading-zero] space-y-3 pl-9 text-ink-2 marker:font-mono marker:text-[0.8125rem] marker:text-ink-3">
      {items.map((item) => (
        <li key={item} className="[overflow-wrap:anywhere]">{renderInline(item)}</li>
      ))}
    </ol>
  );
}
