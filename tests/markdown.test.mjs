import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  parseMarkdown, extractToc, figureCount, readingMinutes,
  figureBlocks, numberBlocks, documentToc, captionTitle, figureTitle, figureAlt, figureId, tokenizeInline,
} from '../src/lib/markdown.ts';

const content = (name) => readFileSync(new URL(`../src/content/${name}`, import.meta.url), 'utf8');
const firstImage = (md) => parseMarkdown(md)[0];

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

test('markdown: figure directive carries alt, plate, cut and readout', () => {
  const block = firstImage('::image[/a.webp]{caption="Raw capture — 38 mV" alt="Oscilloscope screen: raw PPG" cut=A plate=none readout="CH1 20.0 mV · M 500 ms · 27-Jan-24" fit=contain maxHeight=380 width=80%}');
  assert.deepEqual(block, {
    type: 'image',
    src: '/a.webp',
    alt: 'Oscilloscope screen: raw PPG',
    caption: 'Raw capture — 38 mV',
    maxHeight: 380,
    fit: 'contain',
    width: '80%',
    plate: 'none',
    cut: 'A',
    readout: 'CH1 20.0 mV · M 500 ms · 27-Jan-24',
  });
});

test('markdown: directive attributes work in any order and quoted values may hold = and spaces', () => {
  const a = firstImage('::image[/a.webp]{plate=light readout="gain = 2 V/div" caption="One" cut=b}');
  assert.equal(a.plate, 'light');
  assert.equal(a.readout, 'gain = 2 V/div');
  assert.equal(a.caption, 'One');
  assert.equal(a.cut, 'B', 'a lower-case cut letter is normalised');
  // A key-like word inside a quoted caption is not an attribute.
  const b = firstImage('::image[/a.webp]{caption="see alt=\'x\' and cut=C" fit=cover}');
  assert.equal(b.caption, 'see alt=\'x\' and cut=C');
  assert.equal(b.alt, '');
  assert.equal(b.cut, undefined);
  assert.equal(b.fit, 'cover');
});

test('markdown: invalid attribute values are ignored rather than guessed', () => {
  const block = firstImage('::image[/a.webp]{caption="C" plate=dark cut=D maxHeight=tall fit=fill readout=""}');
  assert.deepEqual(block, { type: 'image', src: '/a.webp', alt: '', caption: 'C' });
});

test('markdown: alt is never a copy of the caption', () => {
  const block = firstImage('::image[/a.webp]{caption="Early sketch — camera placement"}');
  assert.equal(block.alt, '');
  assert.equal(figureAlt(block), 'Early sketch');
  assert.equal(figureAlt({ alt: ' Explicit ', caption: 'Other — text' }), 'Explicit');
  assert.equal(figureAlt({ alt: '' }), '');
});

test('markdown: the ![alt](src "caption") form has no figure attributes', () => {
  const block = firstImage('![A scope](/s.webp "Scope — raw")');
  assert.deepEqual(block, { type: 'image', src: '/s.webp', alt: 'A scope', caption: 'Scope — raw' });
});

test('figures: numbered by document order across the whole document', () => {
  const blocks = parseMarkdown('## A\n\n::image[/1.webp]\n\n## B\n\n::image[/2.webp]\n\n### C\n\n![x](/3.webp)');
  assert.deepEqual(figureBlocks(blocks).map((f) => [f.n, f.block.src]), [[1, '/1.webp'], [2, '/2.webp'], [3, '/3.webp']]);
  assert.deepEqual([...numberBlocks(blocks, 'image')], [[1, 1], [3, 2], [5, 3]]);
  assert.equal(figureId(7), 'fig-7');
});

test('figures: title is the caption before its first em dash, at most 44 characters', () => {
  assert.equal(captionTitle('Early concept sketch — working out camera placement'), 'Early concept sketch');
  assert.equal(captionTitle('No dash here'), 'No dash here');
  assert.equal(captionTitle('**Bold** title — rest'), 'Bold title');
  assert.equal(figureTitle('State diagram — the full pipeline'), 'State diagram');
  const long = figureTitle('Raw unprocessed PPG pulse signal captured on the oscilloscope — 38 mV pk-pk');
  assert.equal(long, 'Raw unprocessed PPG pulse signal captured…');
  assert.ok(long.length <= 44);
  assert.ok(figureTitle('x'.repeat(100)).length <= 44, 'a single long word is still cut');
});

test('toc: sections are the level 1-2 headings; numbers only for case studies', () => {
  const blocks = parseMarkdown('# One\n\n## Two **bold**\n\n### Sub\n\n::image[/a.webp]{caption="Plan view — full"}\n\n## Sources');
  const cs = documentToc(blocks, true);
  assert.deepEqual(cs.sections, [
    { id: 'one', n: 1, title: 'One' },
    { id: 'two-bold', n: 2, title: 'Two bold' },
    { id: 'sources', n: 3, title: 'Sources' },
  ]);
  assert.deepEqual(cs.figures, [{ n: 1, id: 'fig-1', title: 'Plan view' }]);
  assert.deepEqual(documentToc(blocks, false).sections[0], { id: 'one', title: 'One' });
});

test('content: no figure is lost (regression: the old parser kept one image per section)', () => {
  const apple = figureBlocks(parseMarkdown(content('apple-classifier.md')));
  const ppg = figureBlocks(parseMarkdown(content('ppg-monitor.md')));
  assert.equal(apple.length, 8);
  assert.equal(ppg.length, 13);
  assert.equal(apple[4].block.src, '/projects/apple-classifier/images/working-setup.webp', 'Fig. 5 is the apple cover');
  assert.equal(ppg[3].block.src, '/projects/ppg-monitor/images/ltspice-stage-2-schematic.webp', 'Fig. 4 is the PPG cover');
});

test('content: the PPG scope captures carry their section cuts, readouts and alt text', () => {
  const ppg = figureBlocks(parseMarkdown(content('ppg-monitor.md')));
  assert.deepEqual(ppg.filter((f) => f.block.cut).map((f) => [f.n, f.block.cut]), [[3, 'A'], [5, 'B'], [10, 'C'], [11, 'C']]);
  const readouts = Object.fromEntries(ppg.filter((f) => f.block.readout).map((f) => [f.n, f.block.readout]));
  assert.deepEqual(readouts, {
    3: 'CH1 20.0 mV · M 500 ms · 27-Jan-24',
    5: 'CH1 20.0 mV · CH2 2.00 V · M 250 ms · 10-Feb-24',
    11: 'CH1 2.00 V · CH2 2.00 V · M 250 ms · 3-Mar-24',
  });
  for (const n of [3, 5, 10, 11]) {
    const { alt, caption } = ppg[n - 1].block;
    assert.ok(alt.startsWith('Oscilloscope'), `Fig. ${n} has explicit alt text`);
    assert.notEqual(alt, caption);
  }
});

test('content: every figure file exists and has generated metadata', () => {
  const meta = JSON.parse(readFileSync(new URL('../src/generated/figures.json', import.meta.url), 'utf8'));
  for (const file of ['apple-classifier.md', 'ppg-monitor.md', 'okanagan-hydrail.md', 'photonics-optical-systems.md']) {
    for (const { block } of figureBlocks(parseMarkdown(content(file)))) {
      assert.ok(existsSync(new URL(`../public${block.src}`, import.meta.url)), `${block.src} exists`);
      const m = meta[block.src];
      assert.ok(m && m.w > 0 && m.h > 0 && (m.plate === 'light' || m.plate === 'none'), `${block.src} has metadata`);
    }
  }
});

test('inline: code, links, strong and em tokenise in order; the empty string has no tokens', () => {
  assert.deepEqual(tokenizeInline('a `b` [c](/d) **e** *f* g'), [
    { type: 'text', text: 'a ' }, { type: 'code', text: 'b' }, { type: 'text', text: ' ' },
    { type: 'link', href: '/d', text: 'c' }, { type: 'text', text: ' ' },
    { type: 'strong', text: 'e' }, { type: 'text', text: ' ' },
    { type: 'em', text: 'f' }, { type: 'text', text: ' g' },
  ]);
  assert.deepEqual(tokenizeInline('plain'), [{ type: 'text', text: 'plain' }]);
  assert.deepEqual(tokenizeInline(''), []);
});

test('inline: a token holds raw markdown, so a link label or bold run can be tokenised again (regression: renderer hang)', () => {
  const [link] = tokenizeInline('[the **TIA** stage](https://example.com/x)');
  assert.deepEqual(link, { type: 'link', href: 'https://example.com/x', text: 'the **TIA** stage' });
  // Walking the outer tokens while tokenising their insides must not change what the outer scan returns.
  const text = 'one **two `three`** four [five *six*](/s) seven';
  const outer = tokenizeInline(text);
  for (const t of outer) tokenizeInline(t.text);
  assert.deepEqual(tokenizeInline(text), outer);
  assert.deepEqual(tokenizeInline('two `three`').map((t) => t.type), ['text', 'code']);
});
