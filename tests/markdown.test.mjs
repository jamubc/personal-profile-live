import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdown, extractToc, figureCount, readingMinutes } from '../src/lib/markdown.ts';

test('markdown: every block type, in source order', () => {
  const blocks = parseMarkdown([
    '## Results', '', 'Paragraph with **bold**.', '',
    '| a | b |', '|---|---|', '| 1 | 2 |', '',
    '![Scope](/x.webp "Fig caption")', '',
    '::image[/projects/y.webp]{caption="Legacy" maxHeight=300 fit=contain}', '',
    '---', '', '1. one', '2. two', '', '> quoted', '> more', '', '- a', '- b', '', '```js', 'let x', '```',
  ].join('\n'));
  assert.deepEqual(blocks.map((b) => b.type), ['heading', 'paragraph', 'table', 'image', 'image', 'rule', 'list', 'quote', 'list', 'code']);
  assert.equal(blocks[3].caption, 'Fig caption');
  assert.equal(blocks[3].alt, 'Scope');
  assert.equal(blocks[4].maxHeight, 300);
  assert.equal(blocks[4].fit, 'contain');
  assert.equal(blocks[6].ordered, true);
  assert.equal(blocks[7].text, 'quoted more');
  assert.equal(blocks[9].lang, 'js');
});

test('markdown: images keep their position relative to prose (regression: figures were dropped)', () => {
  const blocks = parseMarkdown('## A\n\nBefore.\n\n::image[/1.webp]\n\nMiddle.\n\n::image[/2.webp]\n\nAfter.');
  assert.deepEqual(blocks.map((b) => (b.type === 'image' ? b.src : b.type)), ['heading', 'paragraph', '/1.webp', 'paragraph', '/2.webp', 'paragraph']);
  assert.equal(figureCount(blocks), 2);
});

test('markdown: duplicate headings get unique ids and the TOC lists them in order', () => {
  const blocks = parseMarkdown('## Results\n\n## Results\n\n### Sub\n\n## Last');
  assert.deepEqual(extractToc(blocks).map((t) => t.id), ['results', 'results-2', 'last']);
  assert.ok(readingMinutes(blocks) >= 1);
});
