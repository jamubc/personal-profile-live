import { FeaturedItem } from '../components/FeaturedItem';
import { ScheduleTable } from '../components/ScheduleTable';
import { SheetTitle } from '../components/SheetTitle';
import { ossColumns, ossFullRows } from '../components/schedules';
import { PUBLIC_REPOS, STARS_AS_OF, featured, repos } from '../data/oss';
import { LINKS } from '../data/site';
import { useSeo } from '../lib/seo';
import { collectionPageNode, softwareSourceCodeNode } from '../seo/graph';
import { META } from '../seo/meta';
import type { PageProps } from '../routes';

export default function OpenSourcePage({ sheet }: PageProps<undefined>) {
  useSeo({
    ...META[sheet.id],
    path: sheet.route,
    jsonLd: [
      collectionPageNode({
        path: sheet.route,
        name: 'Open source',
        description: META[sheet.id].description,
        items: repos.map((r) => ({
          name: r.name,
          url: r.links[0].href,
          extra: softwareSourceCodeNode({ name: r.name, href: r.links[0].href, language: r.language, description: r.description }),
        })),
      }),
    ],
  });

  return (
    <>
      <SheetTitle
        title="Open source"
        lead={`Everything I create is to solve a problem I have, so I test my solutions thoroughly. I have ${PUBLIC_REPOS} public repositories on GitHub; this table lists ${repos.length}.`}
      />
      <FeaturedItem repo={featured} icon="/oss/gemini-mcp-tool.webp" />

      <div className="mt-14">
        <ScheduleTable
          caption="Schedule of open-source components"
          columns={ossColumns(true)}
          rows={ossFullRows()}
          groupLabel="S — Schedule of open-source components"
          groupCount={`${repos.length} components`}
          showAbstract="narrow"
        />
      </div>

      <p className="t-caption mt-4 max-w-measure">
        QTY is GitHub stars as of {STARS_AS_OF}. A dash means none recorded in the snapshot. {PUBLIC_REPOS} public repositories on GitHub.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a className="btn btn-lg btn-primary" href={LINKS.github} target="_blank" rel="noopener noreferrer">
          All repositories on GitHub <span aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
      <ul className="t-body mt-6 flex flex-wrap gap-x-6 gap-y-1 text-ink-2">
        <li>
          <a className="link-prose inline-flex min-h-[44px] items-center" href={LINKS.pypi} target="_blank" rel="noopener noreferrer">
            PyPI profile<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a className="link-prose inline-flex min-h-[44px] items-center" href={LINKS.npm} target="_blank" rel="noopener noreferrer">
            npm profile<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a className="link-prose inline-flex min-h-[44px] items-center" href={LINKS.greasyfork} target="_blank" rel="noopener noreferrer">
            Greasy Fork profile<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </>
  );
}
