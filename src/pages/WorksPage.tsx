import { AppLink } from '../components/AppLink';
import { ScheduleTable } from '../components/ScheduleTable';
import { SheetTitle } from '../components/SheetTitle';
import { worksColumns, worksRows } from '../components/schedules';
import { works } from '../data/works';
import { useSeo } from '../lib/seo';
import { collectionPageNode } from '../seo/graph';
import { META } from '../seo/meta';
import type { PageProps } from '../routes';

export default function WorksPage({ sheet }: PageProps<undefined>) {
  useSeo({
    ...META[sheet.id],
    path: sheet.route!,
    jsonLd: [
      collectionPageNode({
        path: sheet.route!,
        name: 'Works',
        description: META[sheet.id].description,
        items: works.map((w) => ({ name: w.title, url: w.href })),
      }),
    ],
  });

  return (
    <>
      <SheetTitle title="Works" lead="An isolated index of professional works and contributions." />
      <ScheduleTable caption="Selected works" columns={worksColumns} rows={worksRows()} groupLabel="P — Works" groupCount={`${works.length} sheets`} />
      <AppLink to="/contact" className="t-label mt-6 inline-flex min-h-[44px] items-center gap-2 text-pen hover:text-pen-hover">
        Get in touch → C-500
      </AppLink>
    </>
  );
}
