import stats from './github-stats.json';
import { LINKS } from './site';

/**
 * Schedule of open-source components (sheet S-200).
 * Star and fork counts come from the committed snapshot in github-stats.json (recorded from
 * github.com/jamubc on the as-of date) and are refreshed by scripts/fetch-github-stats.mjs.
 * A count is shown only when the snapshot has one or more; otherwise the UI shows a dash.
 * Descriptions are the author's own llms.txt wording where the repo is in llms.txt, else the
 * GitHub description verbatim.
 */
export type SymbolKind = 'mcp' | 'cli' | 'sim' | 'app';

export interface RepoLink {
  label: string;
  href: string;
}

export interface Repo {
  name: string;
  description: string;
  language: string | null;
  symbol: SymbolKind;
  links: RepoLink[];
  /** Cross-reference to another sheet, e.g. "SEE E-104 (HOLD)". */
  crossRef?: string;
  /** Listed on the cover sheet. */
  selected?: boolean;
}

export const STARS_AS_OF = stats.fetchedAt.slice(0, 10);
export const PUBLIC_REPOS = 44;

const gh = (name: string): RepoLink => ({ label: 'GitHub', href: `https://github.com/jamubc/${name}` });

export const repos: Repo[] = [
  { name: 'gemini-mcp-tool', description: 'MCP server that lets AI assistants interface with the Google Gemini CLI to analyze large-context files and codebases.', language: 'TypeScript', symbol: 'mcp', links: [gh('gemini-mcp-tool')], selected: true },
  { name: 'logic-pro-mcp-website', description: 'Website for Logic Pro MCP, an experimental MCP for the Logic Pro DAW: AI-generated arrangements, chord progressions, and producer quality-of-life tooling.', language: 'TypeScript', symbol: 'mcp', links: [gh('logic-pro-mcp-website'), { label: 'Demo', href: 'https://logic-pro-mcp-website.vercel.app/' }], selected: true },
  { name: 'qwen-mcp-tool', description: 'MCP server for driving the Qwen CLI and any OpenAI-compatible endpoint for large-context analysis.', language: 'TypeScript', symbol: 'mcp', links: [gh('qwen-mcp-tool'), { label: 'npm (profile)', href: LINKS.npm }], selected: true },
  { name: 'grok-build-providers', description: 'Integration tool to run third-party models directly within Grok Build without external background services.', language: 'JavaScript', symbol: 'app', links: [gh('grok-build-providers')] },
  { name: 'Canvas_Downloader', description: 'Fast, strictly read-only CLI for downloading and organizing Canvas LMS course content.', language: 'Python', symbol: 'cli', links: [gh('Canvas_Downloader'), { label: 'PyPI (profile)', href: LINKS.pypi }] },
  { name: 'UBC-workday-to-calendar', description: 'Convert Workday Excel schedule (.xlsx) exports to iCalendar (.ics) format.', language: 'JavaScript', symbol: 'app', links: [gh('UBC-workday-to-calendar')], crossRef: 'SEE P-402' },
  { name: '2ManyTabs-MCP', description: 'Manage browser tabs (list, group, deduplicate, bulk-close) with natural language from any MCP client; runs locally over loopback.', language: 'JavaScript', symbol: 'mcp', links: [gh('2ManyTabs-MCP')], selected: true },
  { name: 'toolbox', description: 'Utilities for Claude Code', language: 'TypeScript', symbol: 'app', links: [gh('toolbox')] },
  { name: 'JarvisAtHome', description: 'Fully local, offline voice assistant pipeline (VAD, wake word, Whisper STT, intent matching, TTS). No cloud APIs.', language: 'JavaScript', symbol: 'app', links: [gh('JarvisAtHome')] },
  { name: 'jamcli', description: 'Efficient multi-model terminal CLI with Ollama and OpenRouter support.', language: 'TypeScript', symbol: 'cli', links: [gh('jamcli')] },
  { name: 'canvas-mcp-tool', description: 'MCP server that lets AI assistants query Canvas course details, assignments, and announcements.', language: 'TypeScript', symbol: 'mcp', links: [gh('canvas-mcp-tool')] },
  { name: 'opencode-langsearch', description: 'Unofficial OpenCode plugin adding LangSearch web search with optional filtering', language: 'TypeScript', symbol: 'app', links: [gh('opencode-langsearch')] },
  { name: 'meta-agent', description: 'Read-only meta-agent that audits other agents for safety risks', language: 'Shell', symbol: 'app', links: [gh('meta-agent')] },
  { name: 'Sound-Solver', description: 'Acoustic simulation suite for exhaust design', language: 'Rust', symbol: 'sim', links: [gh('Sound-Solver')], crossRef: 'SEE E-104 (HOLD)' },
  { name: 'SISO-Space', description: 'Interactive MATLAB apps for control theory (PID, Bode, root locus)', language: null, symbol: 'sim', links: [gh('SISO-Space')] },
];

type StatRepo = { stars: number; forks: number };
const snapshot = stats.repos as unknown as Record<string, StatRepo | undefined>;

/** Stars from the snapshot, or null when none are recorded (rendered as a dash). */
export const starsOf = (name: string): number | null => {
  const n = snapshot[name]?.stars ?? 0;
  return n > 0 ? n : null;
};

export const forksOf = (name: string): number | null => {
  const n = snapshot[name]?.forks ?? 0;
  return n > 0 ? n : null;
};

/** "2,289". Fixed locale so server and client render identically. */
export const formatStars = (n: number): string => n.toLocaleString('en-US');

/** "2.3k" for generated meta text only; the UI always shows the exact count. */
export const formatStarsShort = (n: number): string => (n >= 1000 ? `${(Math.round(n / 100) / 10).toFixed(1)}k` : String(n));

export const featured = repos[0];
export const selectedRepos = repos.filter((r) => r.selected);
