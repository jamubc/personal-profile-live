import type { ReactNode } from 'react';

/**
 * Inline Markdown → React nodes: `code`, [label](url), **bold**, *italic*.
 * Links to other hosts open in a new tab; in-site links stay in the SPA via
 * the optional `link` renderer (so React Router can handle them).
 */
export interface InlineOptions {
  link?: (href: string, children: ReactNode, key: number) => ReactNode;
  classes?: { code?: string; link?: string; strong?: string; em?: string };
}

const PATTERN = /(`([^`]+)`)|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;

export function renderInline(text: string, opts: InlineOptions = {}): ReactNode[] {
  const parts: ReactNode[] = [];
  const c = opts.classes ?? {};
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  PATTERN.lastIndex = 0;
  while ((m = PATTERN.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(<code key={key++} className={c.code}>{m[2]}</code>);
    } else if (m[3]) {
      const href = m[5];
      const children = renderInline(m[4], opts);
      const external = /^https?:\/\//i.test(href) || href.startsWith('mailto:');
      if (!external && opts.link) parts.push(opts.link(href, children, key++));
      else parts.push(
        <a key={key++} href={href} className={c.link} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>,
      );
    } else if (m[6]) {
      parts.push(<strong key={key++} className={c.strong}>{m[7]}</strong>);
    } else if (m[8]) {
      parts.push(<em key={key++} className={c.em}>{m[9]}</em>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : [text];
}
