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
 *   ::image[src]{caption="…" alt="…" plate=light|none cut=A|B|C readout="…"
 *                maxHeight=400 fit=contain width=80%}
 *                                 → figure; every attribute is optional and
 *                                   they may come in any order
 *
 * Figures are numbered by document order (1, 2, …) across the whole document.
 * Inline emphasis, code and links are left verbatim and rendered by
 * renderInline at render time.
 */

export type FigureCut = 'A' | 'B' | 'C';
export type FigurePlateKind = 'light' | 'none';

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4;
  text: string;
  id: string;
}

export interface ImageBlock {
  type: 'image';
  src: string;
  /** Explicit alt text, or '' when the author gave none: use figureAlt(). Never a copy of the caption. */
  alt: string;
  caption?: string;
  maxHeight?: number;
  fit?: 'cover' | 'contain';
  width?: string;
  /** Plate override. Absent means "decide from the luminance measured in src/generated/figures.json". */
  plate?: FigurePlateKind;
  /** Section cut this picture was taken at (E-102 signal chain). */
  cut?: FigureCut;
  /** Text legible on an instrument screen in the picture, transcribed by the author. */
  readout?: string;
}

export type Block =
  | HeadingBlock
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; code: string; lang?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | ImageBlock
  | { type: 'rule' };

export interface TocEntry { id: string; text: string; level: number }
export interface TocSection { id: string; n?: number; title: string }
export interface TocFigure { n: number; id: string; title: string }

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
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
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

/** key="quoted value" or key=bare. Scanning left to right means a quoted value is never re-scanned for keys. */
const ATTRIBUTE = /([A-Za-z]+)=(?:"([^"]*)"|(\S+))/g;

function parseAttributes(source: string): Record<string, string | undefined> {
  const attrs: Record<string, string | undefined> = {};
  for (const m of source.matchAll(ATTRIBUTE)) attrs[m[1]] = (m[2] ?? m[3]).trim();
  return attrs;
}

function parseImageDirective(line: string): ImageBlock | null {
  const m = line.match(/^::image\[(.+?)\](?:\{(.*)\})?$/);
  if (!m) return null;
  const attrs = parseAttributes(m[2] ?? '');
  const block: ImageBlock = { type: 'image', src: m[1], alt: attrs.alt ?? '' };
  if (attrs.caption) block.caption = attrs.caption;
  if (attrs.maxHeight && /^\d+$/.test(attrs.maxHeight)) block.maxHeight = parseInt(attrs.maxHeight, 10);
  if (attrs.fit === 'cover' || attrs.fit === 'contain') block.fit = attrs.fit;
  if (attrs.width) block.width = attrs.width;
  if (attrs.plate === 'light' || attrs.plate === 'none') block.plate = attrs.plate;
  const cut = attrs.cut?.toUpperCase();
  if (cut === 'A' || cut === 'B' || cut === 'C') block.cut = cut;
  if (attrs.readout) block.readout = attrs.readout;
  return block;
}

function parseMarkdownImage(line: string): ImageBlock | null {
  const m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
  if (!m) return null;
  const block: ImageBlock = { type: 'image', src: m[2], alt: m[1] };
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

    if (/^\d+[.)]\s+/.test(line) && (para.length === 0 || /^1[.)]\s/.test(line))) {
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
    .filter((b): b is HeadingBlock => b.type === 'heading' && levels.includes(b.level))
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

/* ---- Numbering, titles and tables of contents ------------------------------------------------ */

/** Anchor id of figure n. FigurePlate, the TOC and the signal-chain diagram all link through it. */
export const figureId = (n: number): string => `fig-${n}`;

/** Level 1-2 headings are the sections of a document (rendered as h2); levels 3-4 are sub-headings (h3). */
export const isSectionHeading = (b: Block): b is HeadingBlock => b.type === 'heading' && b.level <= 2;

/** Document-order numbers (1, 2, …) of the blocks of one type, keyed by block index. */
export function numberBlocks(blocks: Block[], type: Block['type']): Map<number, number> {
  const numbers = new Map<number, number>();
  blocks.forEach((b, i) => {
    if (b.type === type) numbers.set(i, numbers.size + 1);
  });
  return numbers;
}

/** Every figure with its document-order number. */
export function figureBlocks(blocks: Block[]): { n: number; block: ImageBlock }[] {
  const figures: { n: number; block: ImageBlock }[] = [];
  for (const b of blocks) if (b.type === 'image') figures.push({ n: figures.length + 1, block: b });
  return figures;
}

/** The caption up to its first em dash, as plain text. Used as the default alt text and as the TOC title. */
export const captionTitle = (caption: string): string => plainText(caption.split('—')[0]);

/** Alt text of a figure: the author's own, else the caption before its first em dash. */
export const figureAlt = (b: Pick<ImageBlock, 'alt' | 'caption'>): string => b.alt.trim() || captionTitle(b.caption ?? '');

/** Caption title for the figure list in the TOC: at most `max` characters, cut at a word and ended with an ellipsis. */
export function figureTitle(caption: string, max = 44): string {
  const title = captionTitle(caption);
  if (title.length <= max) return title;
  const head = title.slice(0, max - 1);
  const space = head.lastIndexOf(' ');
  return `${(space > max / 2 ? head.slice(0, space) : head).trimEnd()}…`;
}

/**
 * Props for TableOfContents. Case studies pass numbered = true (sections get 01, 02, …); posts pass false.
 * Sections are the level 1-2 headings, exactly the ones ProseRenderer and ArticleRenderer render as h2.
 */
export function documentToc(blocks: Block[], numbered: boolean): { sections: TocSection[]; figures: TocFigure[] } {
  const sections = blocks.filter(isSectionHeading).map((b, i) => ({
    id: b.id,
    ...(numbered ? { n: i + 1 } : {}),
    title: plainText(b.text),
  }));
  const figures = figureBlocks(blocks).map(({ n, block }) => ({ n, id: figureId(n), title: figureTitle(block.caption ?? '') }));
  return { sections, figures };
}

/* ---- Inline grammar -------------------------------------------------------------------------- */

export type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'link'; href: string; text: string }
  | { type: 'strong'; text: string }
  | { type: 'em'; text: string };

const INLINE = /(`([^`]+)`)|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;

/**
 * Splits one run of inline Markdown into tokens: `code`, [label](href), **strong** and *em*. A token's own
 * text is raw Markdown again (a link label may hold bold), so the renderer tokenises it in turn. matchAll
 * iterates a private copy of the pattern: tokenising inside a token never disturbs the outer scan.
 */
export function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) tokens.push({ type: 'text', text: text.slice(last, m.index) });
    if (m[1]) tokens.push({ type: 'code', text: m[2] });
    else if (m[3]) tokens.push({ type: 'link', href: m[5], text: m[4] });
    else if (m[6]) tokens.push({ type: 'strong', text: m[7] });
    else tokens.push({ type: 'em', text: m[9] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ type: 'text', text: text.slice(last) });
  return tokens;
}
