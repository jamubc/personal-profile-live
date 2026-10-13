import { BackLink } from '../components/BackLink';
import { ChainDiagram } from '../components/ChainDiagram';
import { FigurePlate } from '../components/FigurePlate';
import { MetaStrip } from '../components/MetaStrip';
import { PrevNextSheet } from '../components/PrevNextSheet';
import { ProseRenderer } from '../components/ProseRenderer';
import { ResultStrip } from '../components/ResultStrip';
import { SingleLineDiagram } from '../components/SingleLineDiagram';
import { TableOfContents } from '../components/TableOfContents';
import { engineeringBySheet } from '../data/engineering';
import { modifiedFor } from '../data/revisions';
import { neighbours } from '../data/sheets';
import type { Sheet } from '../data/sheets';
import { SITE } from '../data/site';
import figures from '../generated/figures.json';
import { loadDocument } from '../lib/content';
import { extractToc } from '../lib/markdown';
import type { Block } from '../lib/markdown';
import { useSeo } from '../lib/seo';
import { breadcrumbNode, techArticleNode } from '../seo/graph';
import { META } from '../seo/meta';
import type { PageProps } from '../routes';

type ImageBlock = Extract<Block, { type: 'image' }>;
type FigureInfo = { plate: 'light' | 'none' };

export const loadData = (sheet: Sheet): Promise<Block[]> => loadDocument(sheet.contentFile!);

/** Caption up to the first em dash, for the figure list in the table of contents. */
const figureTitle = (caption: string | undefined): string => {
  const head = (caption ?? '').split(' — ')[0];
  return head.length > 44 ? `${head.slice(0, 43).trimEnd()}…` : head;
};

export default function CaseStudyPage({ sheet, data: blocks }: PageProps<Block[]>) {
  const entry = engineeringBySheet(sheet.id)!;
  const images = blocks.filter((b): b is ImageBlock => b.type === 'image');
  const sections = extractToc(blocks, [2]);
  const coverFig = entry.cover?.kind === 'figure' ? entry.cover.n : undefined;
  const cover = coverFig ? images[coverFig - 1] : undefined;
  const { prev, next, index } = neighbours(sheet);
  const plateOf = (img: ImageBlock): 'light' | 'none' => img.plate ?? (figures as Record<string, FigureInfo>)[img.src]?.plate ?? 'none';

  useSeo({
    ...META[sheet.id],
    path: sheet.route!,
    type: 'article',
    // The share card stays the site's 1200 x 630 image: a figure's aspect ratio is not a card's.
    jsonLd: [
      techArticleNode({
        path: sheet.route!,
        title: sheet.title,
        description: META[sheet.id].description,
        image: cover ? `${SITE.url}${cover.src}` : undefined,
        dateModified: modifiedFor(sheet.id),
      }),
      breadcrumbNode([
        { name: 'Engineering & Research', path: '/projects' },
        { name: sheet.title, path: sheet.route! },
      ]),
    ],
  });

  return (
    <article>
      <BackLink to="/projects">E-100 Engineering</BackLink>
      <header className="mt-8">
        <p className="t-micro">Drawing title</p>
        <h1 className="t-h1 mt-2 max-w-[28ch]">{sheet.title}</h1>
        <p className="t-lead mt-4 max-w-measure">{entry.description}</p>
      </header>

      <div className="mt-10">
        <MetaStrip cells={entry.meta} />
      </div>

      {entry.results && (
        <div className="mt-10">
          <ResultStrip label={entry.results.label} source={entry.results.source} cells={entry.results.cells} size="lg" />
        </div>
      )}

      {cover && coverFig && (
        <div className="mt-12 max-w-[880px]">
          <FigurePlate
            n={coverFig}
            src={cover.src}
            caption={cover.caption ?? ''}
            alt={cover.alt ?? ''}
            readout={cover.readout}
            cut={cover.cut}
            plate={plateOf(cover)}
            maxHeight={cover.maxHeight}
            fit={cover.fit}
            eager
          />
        </div>
      )}
      {entry.cover?.kind === 'diagram' && (
        <div className="mt-12 max-w-[880px]">
          <SingleLineDiagram
            from="Kamloops"
            to="Osoyoos"
            length="342 km"
            caption="The corridor as described in the write-up: 342 km from Kamloops to Osoyoos on the existing CN freight corridor and Highway 97 right-of-way. Schematic only; not to scale; stations not shown."
          />
        </div>
      )}

      {entry.chain && (
        <div className="mt-12">
          <ChainDiagram nodes={entry.chain.nodes} cuts={entry.chain.cuts} />
        </div>
      )}

      <div className="mt-16 xl:grid xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-12">
        <TableOfContents
          sections={sections.map((s, i) => ({ id: s.id, n: i + 1, title: s.text }))}
          figures={images.map((img, i) => ({ n: i + 1, id: `fig-${i + 1}`, title: figureTitle(img.caption) }))}
        />
        <div className="min-w-0 max-w-measure">
          <ProseRenderer blocks={blocks} coverFig={coverFig} />
        </div>
      </div>

      <div className="mt-20">
        <PrevNextSheet prev={prev} next={next} index={index} />
      </div>
    </article>
  );
}
