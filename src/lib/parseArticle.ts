/**
 * Parses a Markdown article into a flat list of typed blocks for the blog
 * reader. This is a richer sibling of parseProjectContent: blog posts need
 * sub-headings, ordered lists, inline code, links, blockquotes, and tables
 * that the lightweight project format does not cover.
 *
 * Authoring stays "just write a Markdown file" — supported block syntax:
 *   ## Heading            → h2
 *   ### / #### Heading    → h3
 *   paragraph text        → p (blank line separates paragraphs)
 *   - item  /  * item     → unordered list
 *   1. item               → ordered list
 *   > quote               → blockquote
 *   ```                   → fenced code block
 *   | a | b |             → table (second row of ---- is the separator)
 *
 * Inline emphasis/code/links inside text are handled at render time by
 * renderInline, so they are preserved verbatim here.
 */

export type ArticleBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

const isTableSeparator = (line: string): boolean =>
  /^\|?[\s:-]*\|[\s:|-]*$/.test(line) && line.includes('-');

const splitRow = (line: string): string[] =>
  line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());

export function parseArticle(raw: string): ArticleBlock[] {
  const lines = raw.split('\n');
  const blocks: ArticleBlock[] = [];

  let para: string[] = [];
  const flushPara = () => {
    if (para.length > 0) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // ── Fenced code block ──
    if (line.startsWith('```')) {
      flushPara();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', code: code.join('\n') });
      continue;
    }

    // ── Table: a pipe line immediately followed by a separator row ──
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1].trim())
    ) {
      flushPara();
      const headers = splitRow(line);
      const rows: string[][] = [];
      i += 2; // skip header + separator
      while (i < lines.length && lines[i].trim().includes('|') && lines[i].trim() !== '') {
        rows.push(splitRow(lines[i].trim()));
        i++;
      }
      i--; // step back; loop will advance
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // ── Headings ──
    if (line.startsWith('### ') || line.startsWith('#### ')) {
      flushPara();
      blocks.push({ type: 'h3', text: line.replace(/^#{3,4}\s+/, '').trim() });
      continue;
    }
    if (line.startsWith('## ') || line.startsWith('# ')) {
      flushPara();
      blocks.push({ type: 'h2', text: line.replace(/^#{1,2}\s+/, '').trim() });
      continue;
    }

    // ── Blockquote ──
    if (line.startsWith('> ')) {
      flushPara();
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quote.push(lines[i].trim().slice(2));
        i++;
      }
      i--;
      blocks.push({ type: 'quote', text: quote.join(' ') });
      continue;
    }

    // ── Ordered list ──
    if (/^\d+\.\s/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      i--;
      blocks.push({ type: 'ol', items });
      continue;
    }

    // ── Unordered list ──
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      i--;
      blocks.push({ type: 'ul', items });
      continue;
    }

    // ── Blank line → paragraph break ──
    if (line === '') {
      flushPara();
      continue;
    }

    // ── Regular text ──
    para.push(line);
  }

  flushPara();
  return blocks;
}
