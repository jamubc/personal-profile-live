import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdown, extractToc, figureCount, readingMinutes } from '../src/lib/markdown.ts';
import { parseFrontmatter } from '../src/lib/frontmatter.ts';

test('frontmatter: scalars, inline lists, block lists, comments', () => {
  const { data, body } = parseFrontmatter(`---
title: "Analog PPG Heart Rate Monitor"
date: 2025-03-10
tech: [Analog Design, LTSpice, Signals]
featured: true
order: 2
links:
  - https://a
  - "https://b"
summary: Measuring heart rate. # trailing comment
---

## First

Body text.`);
  assert.equal(data.title, 'Analog PPG Heart Rate Monitor');
  assert.equal(data.date, '2025-03-10');
  assert.deepEqual(data.tech, ['Analog Design', 'LTSpice', 'Signals']);
  assert.equal(data.featured, true);
  assert.equal(data.order, 2);
  assert.deepEqual(data.links, ['https://a', 'https://b']);
  assert.equal(data.summary, 'Measuring heart rate.');
  assert.ok(body.startsWith('## First'));
});

test('frontmatter: absent block leaves the body untouched', () => {
  const { data, body } = parseFrontmatter('## Only body');
  assert.deepEqual(data, {});
  assert.equal(body, '## Only body');
});

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
