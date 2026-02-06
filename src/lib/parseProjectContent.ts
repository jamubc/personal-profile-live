import { ProjectDetailSection } from '../types';

/**
 * Parses a lightweight Markdown content file into ProjectDetailSection[].
 *
 * Format rules:
 *   ## Heading          → starts a new section
 *   Regular text        → paragraph body (consecutive lines joined by spaces,
 *                         blank lines create separate paragraphs — rendered as
 *                         multiple <p> tags by the reader)
 *   - Item              → bullet point
 *   ::image[url]{opts}  → image with granular control
 *
 * Image directive options (all optional):
 *   caption="..."       → figcaption text
 *   maxHeight=400       → max-height in px
 *   fit=contain|cover   → object-fit mode
 *   width=80%           → CSS width value
 *
 * Example:
 *   ## Overview
 *
 *   First paragraph of text that can wrap across
 *   multiple lines comfortably.
 *
 *   Second paragraph after the blank line.
 *
 *   - Bullet one
 *   - Bullet two
 *
 *   ::image[/projects/foo/img.png]{caption="The circuit" maxHeight=400 fit=contain}
 */

interface ImageDirective {
  src: string;
  caption?: string;
  maxHeight?: number;
  fit?: 'cover' | 'contain';
  width?: string;
}

function parseImageDirective(line: string): ImageDirective | null {
  const match = line.match(/^::image\[(.+?)\](?:\{(.+?)\})?$/);
  if (!match) return null;

  const src = match[1];
  const attrs = match[2] || '';
  const directive: ImageDirective = { src };

  const captionMatch = attrs.match(/caption="([^"]+)"/);
  if (captionMatch) directive.caption = captionMatch[1];

  const maxHeightMatch = attrs.match(/maxHeight=(\d+)/);
  if (maxHeightMatch) directive.maxHeight = parseInt(maxHeightMatch[1]);

  const fitMatch = attrs.match(/fit=(cover|contain)/);
  if (fitMatch) directive.fit = fitMatch[1] as 'cover' | 'contain';

  const widthMatch = attrs.match(/width=(\S+)/);
  if (widthMatch) directive.width = widthMatch[1];

  return directive;
}

export function parseProjectContent(raw: string): ProjectDetailSection[] {
  const lines = raw.split('\n');
  const sections: ProjectDetailSection[] = [];
  let current: ProjectDetailSection | null = null;

  // Text accumulation: consecutive non-blank text lines form one paragraph,
  // blank lines between text blocks become paragraph separators (\n\n).
  let textBuffer: string[] = [];
  let paragraphs: string[] = [];

  /** Flush the current line buffer into a finished paragraph. */
  const flushTextBuffer = () => {
    if (textBuffer.length > 0) {
      paragraphs.push(textBuffer.join(' '));
      textBuffer = [];
    }
  };

  /** Flush all accumulated paragraphs into the current section's `text`. */
  const flushParagraphs = () => {
    flushTextBuffer();
    if (current && paragraphs.length > 0) {
      const joined = paragraphs.join('\n\n');
      current.text = current.text ? current.text + '\n\n' + joined : joined;
      paragraphs = [];
    }
  };

  /** Commit the current section and reset. */
  const pushSection = () => {
    flushParagraphs();
    if (current) sections.push(current);
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // ── New section heading ──
    if (trimmed.startsWith('## ')) {
      pushSection();
      current = { heading: trimmed.slice(3).trim() };
      continue;
    }

    // Skip until we have a section (ignore leading blanks / front-matter)
    if (!current) {
      if (trimmed === '') continue;
      current = {};
    }

    // ── Image directive ──
    const img = parseImageDirective(trimmed);
    if (img) {
      flushTextBuffer();
      current.image = img.src;
      if (img.caption) current.imageCaption = img.caption;
      if (img.maxHeight) current.imageMaxHeight = img.maxHeight;
      if (img.fit) current.imageFit = img.fit;
      if (img.width) current.imageWidth = img.width;
      continue;
    }

    // ── Bullet ──
    if (trimmed.startsWith('- ')) {
      flushTextBuffer();
      if (!current.bullets) current.bullets = [];
      current.bullets.push(trimmed.slice(2));
      continue;
    }

    // ── Blank line → paragraph break ──
    if (trimmed === '') {
      flushTextBuffer();
      continue;
    }

    // ── Regular text line ──
    textBuffer.push(trimmed);
  }

  pushSection();
  return sections;
}
