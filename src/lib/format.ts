const dateFmt = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** "November 17, 2025". Formatted in UTC so a date-only ISO string never shifts a day west of Greenwich. */
export const formatDate = (iso: string): string => dateFmt.format(new Date(`${iso}T00:00:00Z`));
