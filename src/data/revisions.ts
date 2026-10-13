import generated from '../generated/revisions.json';
import { SITE_REVISIONS } from './site';
import type { Revision } from './site';

/** Reissue date of set AM-PF; the last revision row of every sheet. */
export const REISSUE_DATE = '2026-10-13';

interface Generated {
  sheets: Record<string, Revision[]>;
  modified: Record<string, string>;
}

const data = generated as unknown as Generated;

/** Revision rows for a sheet's title block, newest first. G-001 carries the site's own history. */
export const revisionsFor = (sheetId: string): Revision[] =>
  sheetId === 'G-001'
    ? SITE_REVISIONS
    : (data.sheets[sheetId] ?? [{ rev: 'A', date: REISSUE_DATE, description: 'ISSUED IN SET AM-PF', by: 'AM' }]);

/** Date of the last content change (git), used for sitemap lastmod and structured data. */
export const modifiedFor = (sheetId: string): string => data.modified[sheetId] ?? REISSUE_DATE;
