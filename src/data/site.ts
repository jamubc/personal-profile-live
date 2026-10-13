export const SITE = {
  url: 'https://www.jandrewmanson.engineer',
  name: 'Andrew Manson',
  set: 'AM-PF',
  email: 'taros_archers4u@icloud.com',
  location: 'Victoria, BC',
  timeZone: 'America/Vancouver',
  repo: 'https://github.com/jamubc/personal-profile-live',
} as const;

export const LINKS = {
  github: 'https://github.com/jamubc',
  linkedin: 'https://www.linkedin.com/in/jandrewmanson/',
  pypi: 'https://pypi.org/user/jamubc/',
  npm: 'https://www.npmjs.com/~filecrop',
  greasyfork: 'https://greasyfork.org/en/users/1402921-jamubc',
} as const;

/** The author's own two paragraphs from the previous Hero, kept verbatim. */
export const COVER_LEAD = [
  "I'm an electrical engineering graduate from UBCO and a registered EIT with Engineers and Geoscientists BC. I love to solve real-world problems with simple solutions to make life easier.",
  "For my capstone I designed and built a machine vision system that grades apples in real time on a Raspberry Pi. I also work extensively with AI systems, testing and hardening them. Here is where I share what I'm building.",
];

/** Notes 1 and 2 are the author's own words from the November 2025 title block. */
export const GENERAL_NOTES = [
  'ALL DIMENSIONS IN PIXELS UNLESS OTHERWISE SPECIFIED.',
  'INTERFACE TOLERANCES ACCORDING TO WCAG 2.1.',
  'NO STOCK IMAGERY. FIGURES ARE FROM THE PROJECTS THEY DESCRIBE, EXCEPT FIG. 1 (SYNTHETIC).',
  'MACHINE-READABLE INDEX AT /llms.txt.',
];

export interface Revision {
  rev: string;
  date: string;
  description: string;
  by: 'AM';
}

/** Site revision history (sheet G-001). Dates are real commit dates; descriptions are hand-written from them. */
export const SITE_REVISIONS: Revision[] = [
  { rev: 'H', date: '2026-10-13', description: 'Reissued as drawing set AM-PF', by: 'AM' },
  { rev: 'G', date: '2026-07-11', description: 'Repositioned electrical engineer first; OG image; analytics', by: 'AM' },
  { rev: 'F', date: '2026-06-17', description: 'Writing section', by: 'AM' },
  { rev: 'E', date: '2026-06-03', description: 'SEO and AI discovery', by: 'AM' },
  { rev: 'D', date: '2026-04-27', description: 'Works page', by: 'AM' },
  { rev: 'C', date: '2026-02-05', description: 'Project write-ups and restyle', by: 'AM' },
  { rev: 'B', date: '2025-11-18', description: 'Technical blueprint aesthetic; title block 2025-PF-001', by: 'AM' },
  { rev: 'A', date: '2025-10-02', description: 'Initial commit', by: 'AM' },
];

export const CURRENT_REV = SITE_REVISIONS[0];

/** Absolute URL of a site path. */
export const absoluteUrl = (path: string): string => `${SITE.url}${path === '/' ? '/' : path}`;
