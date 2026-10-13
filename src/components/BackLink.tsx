import type { ReactNode } from 'react';
import { AppLink } from './AppLink';

/** "← E-100 Engineering": the way back up from a case study or post. */
export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <AppLink to={to} className="t-label inline-flex min-h-[44px] items-center gap-2 text-ink-2 hover:text-pen">
      <span aria-hidden="true">←</span>
      {children}
    </AppLink>
  );
}
