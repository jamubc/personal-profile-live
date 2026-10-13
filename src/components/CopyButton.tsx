import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'copied' | 'failed';

const RESET_MS = 1500;
const VISIBLE: Record<Status, string> = { idle: 'COPY', copied: 'COPIED', failed: 'COPY FAILED' };
const ANNOUNCEMENT: Record<Status, string> = { idle: '', copied: 'Copied to clipboard.', failed: 'Could not copy.' };

interface CopyButtonProps {
  /** What goes on the clipboard. */
  text: string;
  /** Accessible name, naming the thing copied ("Copy email address"). It starts with the visible word COPY. */
  label: string;
}

/** Copies `text` and says so, visibly for 1.5 s and through a polite live region. */
export function CopyButton({ text, label }: CopyButtonProps) {
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (next: Status) => {
    window.clearTimeout(timer.current);
    setStatus(next);
    timer.current = window.setTimeout(() => setStatus('idle'), RESET_MS);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash('copied');
    } catch {
      // No Clipboard API (insecure context, old browser) or permission refused: say so, never throw.
      flash('failed');
    }
  };

  return (
    <span className="inline-flex">
      <button type="button" className="btn min-w-[8rem]" aria-label={label} onClick={copy}>
        {VISIBLE[status]}
      </button>
      <span aria-live="polite" className="sr-only">
        {ANNOUNCEMENT[status]}
      </span>
    </span>
  );
}
