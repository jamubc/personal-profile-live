// Pure helpers for LocalClock. Erasable TypeScript only, so node can import this file in tests.

/** "14:05 PDT": the wall-clock time of an instant in an IANA time zone. */
export function formatClock(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('hour')}:${part('minute')} ${part('timeZoneName')}`;
}

/** Milliseconds until the next whole minute; a full minute when `nowMs` is already on one. */
export function msUntilNextMinute(nowMs: number): number {
  return 60_000 - (nowMs % 60_000);
}
