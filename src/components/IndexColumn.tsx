import { AppLink } from './AppLink';
import { RegistrationMark } from './RegistrationMark';
import { CURRENT_REV, LINKS, SITE } from '../data/site';
import { indexSheets, parentOf } from '../data/sheets';
import type { Sheet } from '../data/sheets';

/** The drawing index: the old sidebar, now listing the sheets of set AM-PF. Desktop only (>= 1100px). */
export function IndexColumn({ current }: { current: Sheet }) {
  const parent = parentOf(current);
  return (
    <header className="no-print scroll-region fixed inset-y-0 left-0 z-chrome hidden w-[256px] flex-col border-r border-rule bg-paper p-6 lg:flex">
      <div className="flex items-center gap-3">
        <AppLink to="/" aria-label="Andrew Manson, home" className="shrink-0 text-ink">
          <RegistrationMark size={24} />
        </AppLink>
        <span className="font-mono text-base font-semibold text-ink">Andrew Manson</span>
      </div>
      <p className="t-label mt-5 text-pen">Electrical engineer</p>
      <p className="t-micro mt-1">EGBC EIT · {SITE.location}</p>

      <nav aria-label="Drawing index" className="mt-8 border-t border-rule pt-6">
        <p className="t-label text-ink-3">Drawing index</p>
        <div className="t-micro mt-3 grid grid-cols-[4rem_1fr] pb-1" aria-hidden="true">
          <span>Sheet</span>
          <span>Title</span>
        </div>
        <ul>
          {indexSheets.map((s) => (
            <li key={s.id}>
              <AppLink
                to={s.route ?? '/'}
                aria-current={s.id === current.id ? 'page' : parent?.id === s.id ? 'true' : undefined}
                className="group relative grid min-h-[40px] grid-cols-[4rem_1fr] items-center text-ink-2 hover:text-ink aria-[current=page]:text-pen aria-[current=true]:text-ink"
              >
                <span className="leader absolute -left-6 top-1/2 w-4" data-active={s.id === current.id} aria-hidden="true" />
                <span className="font-mono text-[13px] text-ink-3 group-hover:text-pen group-aria-[current=page]:text-pen">{s.id}</span>
                <span className="text-[14px]">{s.short ?? s.title}</span>
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 border-t border-rule pt-6">
        <AppLink to="/contact" className="btn w-full hover:border-pen hover:text-pen">
          Hire me
        </AppLink>
        <ul className="mt-5 space-y-1 text-[14px]">
          <li>
            <a className="inline-flex min-h-[32px] items-center text-ink-2 hover:text-ink" href={LINKS.github} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">&nbsp;↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a className="inline-flex min-h-[32px] items-center text-ink-2 hover:text-ink" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">&nbsp;↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a className="inline-flex min-h-[32px] items-center text-ink-2 hover:text-ink" href={`mailto:${SITE.email}`}>
              Email
            </a>
          </li>
        </ul>
      </div>

      <p className="t-micro mt-auto pt-6">
        Set {SITE.set} · Rev {CURRENT_REV.rev}
      </p>
    </header>
  );
}
