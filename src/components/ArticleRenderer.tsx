import { numberBlocks } from '../lib/markdown';
import type { Block } from '../lib/markdown';
import { renderInline } from '../lib/renderInline';
import { FigurePlate, figureProps } from './FigurePlate';
import { TextBlock } from './ProseRenderer';

/**
 * Writing-post body: Serif 18/17 at a 660 px measure, Sans 600 headings. Levels 1 and 2 render as h2 and
 * levels 3 and 4 as h3, so the post's own h1 stays the only one on the page. Code, tables and quotes share
 * TextBlock with the case studies.
 */
export function ArticleRenderer({ blocks }: { blocks: Block[] }) {
  const figures = numberBlocks(blocks, 'image');
  const tables = numberBlocks(blocks, 'table');
  return (
    <div className="t-post max-w-post [&>:first-child]:mt-0">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return block.level <= 2 ? (
              <h2 key={i} id={block.id} className="t-h2 mt-14 scroll-mt-20 lg:scroll-mt-6">{renderInline(block.text)}</h2>
            ) : (
              <h3 key={i} id={block.id} className="t-h3 mt-10 scroll-mt-20 lg:scroll-mt-6">{renderInline(block.text)}</h3>
            );
          case 'image': {
            const n = figures.get(i);
            if (n === undefined) return null;
            return (
              <div key={i} className="mt-8">
                <FigurePlate n={n} {...figureProps(block)} />
              </div>
            );
          }
          default:
            return <TextBlock key={i} block={block} tableNumber={tables.get(i)} />;
        }
      })}
    </div>
  );
}
