import { ScheduleTable } from '../components/ScheduleTable';
import { StatusChip } from '../components/StatusChip';
import { engineeringColumns, engineeringGroup, engineeringRows } from '../components/schedules';
import { engineering } from '../data/engineering';
import { loadDocument } from '../lib/content';
import { renderInline } from '../lib/renderInline';
import type { Block } from '../lib/markdown';
import { useSeo } from '../lib/seo';
import { breadcrumbNode, collectionPageNode } from '../seo/graph';
import { META } from '../seo/meta';
import { SheetTitle } from '../components/SheetTitle';
import { sheetById } from '../data/sheets';
import type { PageProps } from '../routes';

const COURSEWORK_NOTE = sheetById('E-107')!;

export const loadData = (): Promise<Block[]> => loadDocument(COURSEWORK_NOTE.contentFile!);

export default function EngineeringIndexPage({ sheet, data: coursework }: PageProps<Block[]>) {
  const issued = engineering.filter((e) => e.status === 'issued');
  useSeo({
    ...META[sheet.id],
    path: sheet.route,
    jsonLd: [
      collectionPageNode({
        path: sheet.route,
        name: 'Engineering & Research',
        description: META[sheet.id].description,
        items: issued.map((e) => ({ name: e.title, path: sheetById(e.sheet)?.route ?? '/projects' })),
      }),
      breadcrumbNode([{ name: 'Engineering & Research', path: sheet.route }]),
    ],
  });

  // Only the Overview is shown. The four bullets in the Markdown give specific wavelength ranges and
  // measurements that read like unreviewed filler (see the audit); restore them once the author confirms them.
  const overview = coursework.find((b): b is Extract<Block, { type: 'paragraph' }> => b.type === 'paragraph');

  return (
    <>
      <SheetTitle
        title="Engineering & Research"
        lead="A capstone, two course projects, a coursework note and some hands-on work. E-101 to E-103 are written up in full. E-104 to E-106 are listed, but I have not written them up yet."
      />
      <ScheduleTable caption="Engineering and research sheets" columns={engineeringColumns} rows={engineeringRows()} showAbstract {...engineeringGroup()} />
      <p className="t-caption mt-4 max-w-measure">
        E-104 to E-106 are hands-on automotive jobs: welding, fabrication and a 4-cylinder engine rebuild. I have listed them so the record is complete. They have no sheet of their own.
      </p>

      <section aria-labelledby="coursework" className="mt-16 max-w-measure border border-rule-strong bg-paper-2 p-4 md:p-6">
        <p className="t-label flex flex-wrap items-center gap-3 text-ink-3">
          {COURSEWORK_NOTE.id} · Coursework note <StatusChip kind="note" />
        </p>
        <h2 id="coursework" className="t-h3 mt-3">
          {COURSEWORK_NOTE.title}
        </h2>
        {overview && <p className="t-body mt-3 text-ink-2">{renderInline(overview.text)}</p>}
        <p className="t-micro mt-5">No figures</p>
      </section>
    </>
  );
}
