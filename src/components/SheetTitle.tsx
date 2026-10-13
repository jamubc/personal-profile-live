import type { ReactNode } from 'react';

interface SheetTitleProps {
  title: string;
  lead?: ReactNode;
}

/** The h1 and optional lead paragraph that open every schedule sheet. */
export function SheetTitle({ title, lead }: SheetTitleProps) {
  return (
    <header className="mb-10 lg:mb-14">
      <h1 className="t-h1">{title}</h1>
      {lead && <p className="t-lead mt-4 max-w-measure">{lead}</p>}
    </header>
  );
}
