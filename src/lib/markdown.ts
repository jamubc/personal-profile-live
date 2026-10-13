/**
 * One Markdown parser for every long-form surface on the site (project
 * case studies and writing posts). Dependency-free and deliberately small:
 * authoring stays "write a Markdown file".
 *
 * Block syntax
 *   # / ## / ### / #### Heading   → heading (level 1-4) with a stable id
 *   paragraph text                → paragraph (blank line separates)
 *   - item  /  * item             → unordered list
 *   1. item                       → ordered list
 *   > quote                       → blockquote
 *   ```lang … ```                 → fenced code block
 *   | a | b |  + |---|---|        → table
 *   ---                           → horizontal rule
 *   ![alt](src "caption")         → figure
 *   ::image[src]{caption="…" maxHeight=400 fit=contain width=80%}
 *                                 → figure (legacy directive, kept for the
 *                                   existing project write-ups)
 *
 * Inline emphasis, code and links are left verbatim and rendered by
 * renderInline at render time.
 */

export type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; code: string; lang?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'image'; src: string; alt: string; caption?: string; maxHeight?: number; fit?: 'cover' | 'contain'; width?: string }
  | { type: 'rule' };

export interface TocEntry { id: string; text: string; level: number }

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[*_`~]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Strip inline markdown markers for plain-text contexts (TOC, meta). */
export const plainText = (s: string): string =>
  s
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .trim();

const isTableSeparator = (line: string): boolean =>
  /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line);

const splitRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());

function parseImageDirective(line: string): Block | null {
  const m = line.match(/^::image\[(.+?)\](?:\{(.*)\})?$/);
  if (!m) return null;
  const attrs = m[2] ?? '';
  const block: Extract<Block, { type: 'image' }> = { type: 'image', src: m[1], alt: '' };
  const caption = attrs.match(/caption="([^"]*)"/);
  if (caption) { block.caption = caption[1].trim(); block.alt = block.caption; }
  const maxHeight = attrs.match(/maxHeight=(\d+)/);
  if (maxHeight) block.maxHeight = parseInt(maxHeight[1], 10);
  const fit = attrs.match(/fit=(cover|contain)/);
  if (fit) block.fit = fit[1] as 'cover' | 'contain';
  const width = attrs.match(/width=(\S+)/);
  if (width) block.width = width[1];
  return block;
}

function parseMarkdownImage(line: string): Block | null {
  const m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
  if (!m) return null;
  const block: Extract<Block, { type: 'image' }> = { type: 'image', src: m[2], alt: m[1] };
  if (m[3]) block.caption = m[3];
  return block;
}

export function parseMarkdown(raw: string): Block[] {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  const usedIds = new Map<string, number>();

  let para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'paragraph', text: para.join(' ') });
      para = [];
    }
  };

  const uniqueId = (text: string) => {
    const base = slugify(plainText(text)) || 'section';
    const n = usedIds.get(base) ?? 0;
    usedIds.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('```')) {
      flushPara();
      const lang = line.slice(3).trim() || undefined;
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      blocks.push({ type: 'code', code: code.join('\n'), lang });
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1].trim())) {
      flushPara();
      const headers = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().includes('|')) rows.push(splitRow(lines[i++]));
      i--;
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+?)\s*#*$/);
    if (heading) {
      flushPara();
      const text = heading[2].trim();
      blocks.push({ type: 'heading', level: heading[1].length as 1 | 2 | 3 | 4, text, id: uniqueId(text) });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushPara();
      blocks.push({ type: 'rule' });
      continue;
    }

    const image = parseImageDirective(line) ?? parseMarkdownImage(line);
    if (image) {
      flushPara();
      blocks.push(image);
      continue;
    }

    if (line.startsWith('>')) {
      flushPara();
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) quote.push(lines[i++].trim().replace(/^>\s?/, ''));
      i--;
      blocks.push({ type: 'quote', text: quote.join(' ') });
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^\d+[.)]\s+/, ''));
      i--;
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^[-*+]\s+/, ''));
      i--;
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    if (line === '') { flushPara(); continue; }

    para.push(line);
  }

  flushPara();
  return blocks;
}

export function extractToc(blocks: Block[], levels: number[] = [2]): TocEntry[] {
  return blocks
    .filter((b): b is Extract<Block, { type: 'heading' }> => b.type === 'heading' && levels.includes(b.level))
    .map((b) => ({ id: b.id, text: plainText(b.text), level: b.level }));
}

export function wordCount(blocks: Block[]): number {
  const count = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
  return blocks.reduce((n, b) => {
    switch (b.type) {
      case 'heading':
      case 'paragraph':
      case 'quote':
        return n + count(b.text);
      case 'list':
        return n + b.items.reduce((m, it) => m + count(it), 0);
      case 'table':
        return n + count(b.headers.join(' ')) + b.rows.reduce((m, r) => m + count(r.join(' ')), 0);
      case 'code':
        return n + count(b.code);
      case 'image':
        return n + count(b.caption ?? '');
      default:
        return n;
    }
  }, 0);
}

export const readingMinutes = (blocks: Block[], wpm = 220): number => Math.max(1, Math.round(wordCount(blocks) / wpm));

/** Count figures so captions can be numbered "Fig. 3". */
export const figureCount = (blocks: Block[]): number => blocks.filter((b) => b.type === 'image').length;
