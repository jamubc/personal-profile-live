import { CopyButton } from '../components/CopyButton';
import { LocalClock } from '../components/LocalClock';
import { SheetTitle } from '../components/SheetTitle';
import { LINKS, SITE } from '../data/site';
import { useSeo } from '../lib/seo';
import { contactPageNode } from '../seo/graph';
import { META } from '../seo/meta';
import type { PageProps } from '../routes';

interface ChannelProps {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

function Channel({ label, value, href, external = true }: ChannelProps) {
  return (
    <li className="border-b border-rule">
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group flex min-h-[56px] flex-col justify-center gap-1 px-1 py-2 hover:bg-paper-3 sm:flex-row sm:items-center sm:gap-4 sm:py-0 md:px-3"
      >
        <span className="t-label shrink-0 text-ink-3 sm:w-28 md:w-36">{label}</span>
        <span className="min-w-0 flex-1 break-words text-ink group-hover:text-pen">
          {value}
          {external && (
            <>
              <span aria-hidden="true" className="ml-2 text-ink-3">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </>
          )}
        </span>
      </a>
    </li>
  );
}

export default function ContactPage({ sheet }: PageProps<undefined>) {
  useSeo({ ...META[sheet.id], path: sheet.route, jsonLd: [contactPageNode(sheet.route)] });

  return (
    <>
      <SheetTitle title="Contact" lead="Hiring, a question about a project, or something to say about the open-source tools: any of the channels below reaches me." />
      <section aria-labelledby="transmittal" className="max-w-[44rem] border border-rule-strong bg-paper-2 p-4 md:p-6">
        <h2 id="transmittal" className="t-label text-ink-3">
          Transmittal · Set {SITE.set}
        </h2>
        <dl className="mt-5 grid grid-cols-[7rem_1fr] gap-x-4 gap-y-3 md:grid-cols-[9rem_1fr]">
          <dt className="t-micro self-center">From</dt>
          <dd>Andrew Manson, EIT (EGBC)</dd>
          <dt className="t-micro self-center">Location</dt>
          <dd>{SITE.location}</dd>
          <dt className="t-micro self-center">Local time</dt>
          <dd className="font-mono text-sm">
            <LocalClock timeZone={SITE.timeZone} />
          </dd>
        </dl>

        <ul className="mt-6 border-t border-rule">
          {/* The row wraps below 480px so the address keeps its shape and the button drops under it. */}
          <li className="flex flex-wrap items-center justify-between gap-x-3 border-b border-rule">
            <a
              href={`mailto:${SITE.email}`}
              className="group flex min-h-[56px] min-w-[16rem] flex-1 flex-col justify-center gap-1 px-1 py-2 hover:bg-paper-3 sm:flex-row sm:items-center sm:gap-4 sm:py-0 md:px-3"
            >
              <span className="t-label shrink-0 text-ink-3 sm:w-28 md:w-36">Email</span>
              <span className="min-w-0 flex-1 break-words text-ink group-hover:text-pen">{SITE.email}</span>
            </a>
            <span className="mb-2 ml-auto sm:mb-0">
              <CopyButton text={SITE.email} label="Copy email address" />
            </span>
          </li>
          <Channel label="LinkedIn" value="linkedin.com/in/jandrewmanson" href={LINKS.linkedin} />
          <Channel label="GitHub" value="github.com/jamubc" href={LINKS.github} />
        </ul>

        <h3 className="t-label mt-8 text-ink-3">Distribution</h3>
        <ul className="mt-3 border-t border-rule">
          <Channel label="PyPI" value="pypi.org/user/jamubc" href={LINKS.pypi} />
          <Channel label="npm" value="npmjs.com/~filecrop" href={LINKS.npm} />
          <Channel label="Greasy Fork" value="greasyfork.org/en/users/1402921-jamubc" href={LINKS.greasyfork} />
        </ul>

        <a className="btn btn-lg btn-primary mt-8 w-full sm:w-auto" href={`mailto:${SITE.email}`}>
          Send email
        </a>
      </section>
    </>
  );
}
