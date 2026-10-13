import { DISCIPLINE_NAMES, DISCIPLINE_SHORT } from '../data/sheets';
import type { Sheet } from '../data/sheets';

interface HeaderRailProps {
  sheet: Sheet;
  rev: string;
  date: string;
}

/** Sheet number and revision as printed on the rail of a drawing. */
export function HeaderRail({ sheet, rev, date }: HeaderRailProps) {
  return (
    <div className="t-micro flex min-h-8 items-center justify-between gap-4 border-b border-rule px-4 py-1.5 md:px-6 lg:min-h-10 lg:px-10">
      <span>
        Sheet {sheet.id} · <span className="md:hidden">{DISCIPLINE_SHORT[sheet.discipline]}</span>
        <span className="hidden md:inline">{sheet.rail ?? DISCIPLINE_NAMES[sheet.discipline]}</span>
      </span>
      <span className="whitespace-nowrap">
        Rev {rev}
        <span className="hidden md:inline"> · {date}</span>
      </span>
    </div>
  );
}
