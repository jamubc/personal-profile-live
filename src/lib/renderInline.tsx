import React from 'react';

/**
 * Renders inline Markdown to React nodes.
 *
 * Supports, in any combination:
 *   **bold**            → <strong>
 *   *italic*            → <em>
 *   `code`              → <code>
 *   [label](https://…)  → <a> (opens external links in a new tab)
 *
 * Anything else passes through as plain text. Used by the article reader so
 * blog prose keeps its emphasis and links without a full Markdown engine.
 */
export function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];

  // Order matters: code first (so its contents aren't re-parsed), then links,
  // then bold, then italic.
  const regex =
    /(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // `code`
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[0.9em] font-mono text-white/90"
        >
          {match[2]}
        </code>
      );
    } else if (match[3]) {
      // [label](url)
      const href = match[5];
      const isExternal = /^https?:\/\//i.test(href);
      parts.push(
        <a
          key={key++}
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent transition-colors"
        >
          {renderInline(match[4])}
        </a>
      );
    } else if (match[6]) {
      // **bold**
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {match[7]}
        </strong>
      );
    } else if (match[8]) {
      // *italic*
      parts.push(<em key={key++}>{match[9]}</em>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
