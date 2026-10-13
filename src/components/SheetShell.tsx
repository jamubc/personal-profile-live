import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderRail } from './HeaderRail';
import { IndexColumn } from './IndexColumn';
import { MobileTopBar } from './MobileTopBar';
import { ScrollManager } from './ScrollManager';
import { SkipLink } from './SkipLink';
import { TitleBlock } from './TitleBlock';
import type { Sheet } from '../data/sheets';
import type { Revision } from '../data/site';

interface SheetShellProps {
  sheet: Sheet;
  revisions: Revision[];
  scale?: '1:1' | 'NTS';
  children: ReactNode;
}

/** Every page is a sheet: index column or top bar, a frame with a header rail, the content, a title block. */
export function SheetShell({ sheet, revisions, scale, children }: SheetShellProps) {
  const { pathname } = useLocation();
  // The rise-and-fade runs on client navigation only, never on the first render.
  const firstPath = useRef(pathname);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (pathname !== firstPath.current) setEntered(true);
  }, [pathname]);

  const rev = revisions[0];
  return (
    <>
      <SkipLink />
      <IndexColumn current={sheet} />
      <MobileTopBar current={sheet} />
      <div className="sheet-wrap lg:ml-[256px] lg:p-6">
        <div className="sheet-grid flex min-h-screen flex-col lg:min-h-[calc(100vh-48px)] lg:border lg:border-rule-strong">
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
            <HeaderRail sheet={sheet} rev={rev.rev} date={rev.date} />
            <div key={pathname} className={`mx-auto w-full max-w-[1136px] flex-1 px-4 pb-16 pt-8 md:px-6 lg:px-10 lg:pb-24 lg:pt-12 ${entered ? 'route-enter' : ''}`}>
              {children}
            </div>
          </main>
          <footer className="mx-auto w-full max-w-[1136px] px-4 pb-8 md:px-6 lg:px-10 lg:pb-10">
            <TitleBlock sheet={sheet} revisions={revisions} scale={scale} />
            <p className="t-micro mt-4">© {__BUILD_DATE__.slice(0, 4)} Andrew Manson. All rights reserved.</p>
          </footer>
        </div>
      </div>
      <ScrollManager sheet={sheet} />
    </>
  );
}
