import { useRef } from 'react';
import { AppLink } from '../components/AppLink';
import { DimensionLine } from '../components/DimensionLine';
import { FeaturedPlate } from '../components/FeaturedPlate';
import { GeneralNotes } from '../components/GeneralNotes';
import { ScheduleTable } from '../components/ScheduleTable';
import { SignalTrace } from '../components/SignalTrace';
import {
  contactColumns,
  contactRows,
  engineeringColumns,
  engineeringGroup,
  engineeringRows,
  ossColumns,
  ossSelectedRows,
  worksColumns,
  worksRows,
  writingColumns,
  writingRows,
} from '../components/schedules';
import { articles } from '../data/articles';
import { repos, selectedRepos } from '../data/oss';
import { COVER_LEAD, GENERAL_NOTES } from '../data/site';
import { works } from '../data/works';
import { useSeo } from '../lib/seo';
import { META } from '../seo/meta';
import type { PageProps } from '../routes';

export default function CoverPage({ sheet }: PageProps<undefined>) {
  useSeo({
    ...META[sheet.id],
    path: sheet.route,
    imageAlt: 'Andrew Manson, Electrical Engineer (EGBC EIT)',
  });
  const nameRef = useRef<HTMLHeadingElement>(null);

  return (
    <>
      <section aria-labelledby="cover-title" className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <DimensionLine targetRef={nameRef} />
          <h1 id="cover-title" ref={nameRef} className="t-display mt-1 w-fit">
            Andrew Manson
          </h1>
          <p className="t-label mt-4 text-pen">Electrical engineer · EGBC EIT · Victoria,{'\u00a0'}BC</p>
          <div className="mt-8 max-w-[52ch] space-y-4">
            {COVER_LEAD.map((p) => (
              <p key={p} className="t-lead">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <AppLink to="/projects/apple-classifier" className="btn btn-lg btn-primary w-full whitespace-nowrap sm:w-auto">
              View sheet E-101 — capstone <span aria-hidden="true">→</span>
            </AppLink>
            <AppLink to="/open-source" className="btn btn-lg w-full whitespace-nowrap sm:w-auto">
              Open-source schedule (S-200)
            </AppLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <figure id="fig-1" className="m-0">
            <SignalTrace ariaLabel="Synthetic photoplethysmogram and Schmitt-trigger output, modelled on the PPG heart rate monitor project" />
            <figcaption className="mt-3 grid grid-cols-[3.5rem_1fr] gap-x-3">
              <span className="t-label text-ink-2">Fig. 1</span>
              <span className="t-caption">
                Synthetic photoplethysmogram (CH1, yellow) and Schmitt-trigger output (CH2, cyan), modelled on the comparator capture in
                Fig. 11 of sheet E-102. Not measured data. Trace colours follow my Tektronix TDS 2012B captures.{' '}
                <AppLink to="/projects/ppg-monitor#fig-11" className="link-prose">
                  See sheet E-102 →
                </AppLink>
              </span>
            </figcaption>
          </figure>
          <div className="mt-6">
            <GeneralNotes notes={GENERAL_NOTES} />
          </div>
        </div>
      </section>

      <div className="mt-16">
        <FeaturedPlate />
      </div>

      <section aria-labelledby="index-title" className="mt-24">
        <h2 id="index-title" className="t-h2">
          Drawing index
        </h2>
        <p className="t-caption mt-2">Every page here is a numbered sheet in set AM-PF. Sheet numbers never change; new sheets are added at the end of their series.</p>

        <div className="mt-10 space-y-14">
          <div id="schedule-e" className="scroll-mt-20 lg:scroll-mt-6">
            <ScheduleTable caption="Engineering and research sheets" columns={engineeringColumns} rows={engineeringRows()} {...engineeringGroup()} />
          </div>

          <div id="schedule-s" className="scroll-mt-20 lg:scroll-mt-6">
            <ScheduleTable
              caption="Open-source components, selected"
              columns={ossColumns(false)}
              rows={ossSelectedRows()}
              showAbstract
              groupLabel="S — Open source (selected)"
              groupCount={`${selectedRepos.length} of ${repos.length} components`}
            />
            <AppLink to="/open-source" className="t-label mt-2 inline-flex min-h-[44px] items-center gap-2 text-pen hover:text-pen-hover">
              All open-source components → S-200
            </AppLink>
          </div>

          <div id="schedule-w" className="scroll-mt-20 lg:scroll-mt-6">
            <ScheduleTable
              caption="Writing"
              columns={writingColumns}
              rows={writingRows()}
              groupLabel="W — Writing"
              groupCount={`${articles.length} sheets`}
            />
          </div>

          <div id="schedule-p" className="scroll-mt-20 lg:scroll-mt-6">
            <ScheduleTable caption="Works" columns={worksColumns} rows={worksRows()} groupLabel="P — Works" groupCount={`${works.length} sheets`} />
          </div>

          <div id="schedule-c" className="scroll-mt-20 lg:scroll-mt-6">
            <ScheduleTable caption="Contact" columns={contactColumns} rows={contactRows()} groupLabel="C — Contact" groupCount="1 sheet" />
          </div>
        </div>
      </section>
    </>
  );
}
