import type { ReactNode } from 'react';
import { AppLink } from '../components/AppLink';
import { tokenizeInline } from './markdown';

/**
 * Inline Markdown → React nodes: `code`, [label](url), **bold**, *italic* (grammar: tokenizeInline).
 * '/…' links stay in the SPA through AppLink (route chunk preloading); http(s) links open in a new tab with
 * a visually hidden notice; everything else (mailto:, #anchors) is a plain anchor. `link` overrides the
 * in-site renderer.
 */
export interface InlineClasses {
  code?: string;
  link?: string;
  strong?: string;
  em?: string;
}

export interface InlineOptions {
  link?: (href: string, children: ReactNode, key: number) => ReactNode;
  classes?: InlineClasses;
}

/** Prose defaults shared by case studies and posts. */
const DEFAULT_CLASSES: Required<InlineClasses> = {
  code: 'border border-rule bg-paper-2 px-1 font-mono text-[0.875em]',
  link: 'link-prose',
  strong: 'font-semibold',
  em: 'italic',
};

const isInSite = (href: string): boolean => href.startsWith('/') && !href.startsWith('//');
const isWeb = (href: string): boolean => /^https?:\/\//i.test(href);

export function renderInline(text: string, opts: InlineOptions = {}): ReactNode[] {
  const c = { ...DEFAULT_CLASSES, ...opts.classes };
  return tokenizeInline(text).map((token, key): ReactNode => {
    switch (token.type) {
      case 'text':
        return token.text;
      case 'code':
        return <code key={key} className={c.code}>{token.text}</code>;
      case 'strong':
        return <strong key={key} className={c.strong}>{renderInline(token.text, opts)}</strong>;
      case 'em':
        return <em key={key} className={c.em}>{renderInline(token.text, opts)}</em>;
      case 'link': {
        const children = renderInline(token.text, opts);
        if (isInSite(token.href)) {
          return opts.link ? opts.link(token.href, children, key) : <AppLink key={key} to={token.href} className={c.link}>{children}</AppLink>;
        }
        if (isWeb(token.href)) {
          return (
            <a key={key} href={token.href} className={c.link} target="_blank" rel="noopener noreferrer">
              {children}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        }
        return <a key={key} href={token.href} className={c.link}>{children}</a>;
      }
    }
  });
}
