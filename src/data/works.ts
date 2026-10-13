export interface Work {
  sheet: string;
  title: string;
  scope: string;
  year: string;
  href: string;
  /** Short label for the REF column. */
  ref: string;
}

export const works: Work[] = [
  { sheet: 'P-401', title: "Oli's Oils", scope: 'Website development & design', year: '2025', href: 'https://www.olisoils.ca/', ref: 'olisoils.ca' },
  { sheet: 'P-402', title: 'UBC Workday to Calendar', scope: 'Schedule export utility', year: '2026', href: 'https://jamubc.github.io/UBC-workday-to-calendar/', ref: 'Web' },
  { sheet: 'P-403', title: 'Element Selector Tree Tool', scope: 'DOM selection utility', year: '2025', href: 'https://github.com/jamubc/Element-Selector-tree-tool', ref: 'GitHub' },
];
