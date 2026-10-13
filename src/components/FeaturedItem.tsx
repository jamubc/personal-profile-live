import { forksOf, formatStars, starsOf, STARS_AS_OF } from '../data/oss';
import type { Repo } from '../data/oss';

interface FeaturedItemProps {
  repo: Repo;
  /** Path of the repo's own icon under /public. */
  icon: string;
}

/** The featured component on the open-source schedule: the largest star count in the set, shown as data. */
export function FeaturedItem({ repo, icon }: FeaturedItemProps) {
  const stars = starsOf(repo.name);
  const forks = forksOf(repo.name);
  const href = repo.links[0].href;
  return (
    <section aria-labelledby="featured-item" className="border border-rule-strong bg-paper-2 p-4 md:p-6">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <img src={icon} width={96} height={96} alt="" className="h-24 w-24 shrink-0 border border-rule-strong bg-paper" />
        <div className="min-w-0">
          <p className="t-micro">Featured component</p>
          <h2 id="featured-item" className="t-h2 mt-2 break-words">
            {repo.name}
          </h2>
          <p className="t-lead mt-3 max-w-measure">{repo.description}</p>
          <dl className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-4">
            {stars !== null && (
              <div>
                <dt className="t-micro">Stars ★</dt>
                <dd className="t-numeral-md mt-1">{formatStars(stars)}</dd>
              </div>
            )}
            {forks !== null && (
              <div>
                <dt className="t-micro">Forks</dt>
                <dd className="t-numeral-md mt-1">{formatStars(forks)}</dd>
              </div>
            )}
            {repo.language && (
              <div>
                <dt className="t-micro">Material</dt>
                <dd className="t-label mt-2">{repo.language}</dd>
              </div>
            )}
            <div>
              <dt className="t-micro">As of</dt>
              <dd className="t-label mt-2">{STARS_AS_OF}</dd>
            </div>
          </dl>
          <a className="btn btn-lg btn-primary mt-6" href={href} target="_blank" rel="noopener noreferrer">
            Repository <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
