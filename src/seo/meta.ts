import { articles } from '../data/articles';
import { STARS_AS_OF, formatStars, formatStarsShort, starsOf } from '../data/oss';

/** Document titles and descriptions per sheet (design spec 9.1). Counts and star numbers come from data. */
export const TITLE_SUFFIX = ' | Andrew Manson';

const geminiStars = starsOf('gemini-mcp-tool');
const geminiNote = geminiStars ? ` (${formatStars(geminiStars)} GitHub stars as of ${STARS_AS_OF})` : '';
const postCount = articles.length;
const aiNote = articles.every((a) => a.aiGenerated) ? ', all drafted with AI assistance' : '';

export const META: Record<string, { title: string; description: string; ogDescription?: string }> = {
  'G-001': {
    title: 'Andrew Manson | Electrical Engineer (EGBC EIT)',
    // copy.md section 10: the social card has its own line; the star count follows the stats snapshot.
    ogDescription: `Electrical engineer (UBC Okanagan, EGBC EIT). Built a machine-vision apple grader (96% in controlled tests). Maintains open-source MCP tools${geminiStars ? ` (${formatStarsShort(geminiStars)} stars)` : ''}.`,
    description: `Electrical engineer (UBC Okanagan, EGBC EIT) in Victoria, BC. Machine vision, analog design and open-source MCP tools, led by gemini-mcp-tool${geminiStars ? ` (${formatStarsShort(geminiStars)} stars)` : ''}.`,
  },
  'E-100': {
    title: `Engineering & Research${TITLE_SUFFIX}`,
    description: 'Engineering write-ups by Andrew Manson: a machine-vision apple grader, an analog PPG heart-rate monitor and an economic case for Okanagan hydrail.',
  },
  'E-101': {
    title: `Automated Apple Grade Classification${TITLE_SUFFIX}`,
    description: 'Capstone: a CNN apple grader on a Raspberry Pi. 96% accuracy in controlled tests (target 80%), under 5 s per apple, $187.11 build against a $500 budget.',
  },
  'E-102': {
    title: `Analog PPG Heart Rate Monitor${TITLE_SUFFIX}`,
    description: 'ENGR 352 analog PPG heart-rate monitor: TIA, bandpass filter, Schmitt-trigger comparator, monostable and LED driver, with LTSpice and scope captures.',
  },
  'E-103': {
    title: `Okanagan Hydrail: Economic Feasibility${TITLE_SUFFIX}`,
    description: 'Engineering economics debate on a 342 km hydrogen tram-train from Kamloops to Osoyoos, using published NPV, BCR and IRR figures (Boray et al., 2024).',
  },
  'S-200': {
    title: `Open-Source Software${TITLE_SUFFIX}`,
    description: `Open-source work by Andrew Manson: MCP servers and AI tooling, led by gemini-mcp-tool${geminiNote}.`,
  },
  'W-300': {
    title: `Writing${TITLE_SUFFIX}`,
    description: `Writing by Andrew Manson: whatever I'm trying to understand this week. ${postCount} ${postCount === 1 ? 'post' : 'posts'} on AI and engineering${aiNote}.`,
  },
  'P-400': {
    title: `Works${TITLE_SUFFIX}`,
    description: "Selected works by Andrew Manson: Oli's Oils (website development and design), UBC Workday to Calendar, and the Element Selector Tree Tool.",
  },
  'C-500': {
    title: `Contact${TITLE_SUFFIX}`,
    description: 'Contact Andrew Manson, electrical engineer and EGBC EIT in Victoria, BC: email, LinkedIn, GitHub, PyPI, npm and Greasy Fork.',
  },
  'X-404': {
    title: `Sheet not in set${TITLE_SUFFIX}`,
    description: 'No sheet with this path exists in set AM-PF.',
  },
};
