import { useEffect, useState } from 'react';
import { formatClock, msUntilNextMinute } from './clockTime';

interface LocalClockProps {
  timeZone: string;
}

/** Wall-clock time in a fixed zone, "HH:MM TZ", refreshed on the minute. Not announced to screen readers. */
const PLACEHOLDER = 'PACIFIC TIME';

export function LocalClock({ timeZone }: LocalClockProps) {
  const [text, setText] = useState(PLACEHOLDER);

  useEffect(() => {
    let timer: number | undefined;
    const tick = () => {
      window.clearTimeout(timer);
      const now = Date.now();
      try {
        setText(formatClock(new Date(now), timeZone));
      } catch {
        return; // unknown zone: keep the placeholder
      }
      timer = window.setTimeout(tick, msUntilNextMinute(now));
    };
    // Timers are throttled in background tabs, so catch up as soon as the page is visible again.
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [timeZone]);

  return (
    <span aria-live="off" className="tabular-nums">
      {text}
    </span>
  );
}
