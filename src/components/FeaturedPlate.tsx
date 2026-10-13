import { AppLink } from './AppLink';
import { ResultStrip } from './ResultStrip';
import { engineeringBySheet } from '../data/engineering';
import figures from '../generated/figures.json';

type FigureInfo = { w: number; h: number };

/** The capstone on the cover sheet: the real working-setup photo, the abstract, and the three numbers. */
export function FeaturedPlate() {
  const entry = engineeringBySheet('E-101')!;
  const src = entry.cover?.kind === 'figure' ? entry.cover.src : '';
  const size = (figures as Record<string, FigureInfo>)[src];
  return (
    <section aria-labelledby="featured-e101" className="border border-rule-strong bg-paper-2 lg:grid lg:grid-cols-12">
      <AppLink to="/projects/apple-classifier" tabIndex={-1} aria-hidden="true" className="block lg:col-span-5">
        <img
          src={src}
          width={size?.w}
          height={size?.h}
          alt="The finished prototype ready to scan, with an apple positioned under the camera."
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </AppLink>
      <div className="p-4 md:p-6 lg:col-span-7">
        <p className="t-label text-ink-3">E-101 · Engineering &amp; research · Capstone</p>
        <h2 id="featured-e101" className="t-h2 mt-3">
          {entry.title}
        </h2>
        <p className="t-body mt-3 max-w-measure text-ink-2">{entry.description}</p>
        <div className="mt-6">
          <ResultStrip label="Schedule of results" cells={entry.results?.cells ?? []} size="md" />
        </div>
        <AppLink to="/projects/apple-classifier" className="btn btn-lg btn-primary mt-6">
          Open sheet E-101 <span aria-hidden="true">→</span>
        </AppLink>
      </div>
    </section>
  );
}
