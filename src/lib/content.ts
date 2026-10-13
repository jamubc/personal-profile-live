import { parseMarkdown } from './markdown';
import type { Block } from './markdown';

type RawLoader = () => Promise<{ default: string }>;

/**
 * Published long-form content only. Drafts and withheld files (wildfire-robot, gemini-3-release,
 * coding-with-ai) are deliberately absent, so they are never bundled or served. Each document is its
 * own lazy chunk.
 */
const loaders: Record<string, RawLoader> = {
  'apple-classifier': () => import('../content/apple-classifier.md?raw'),
  'ppg-monitor': () => import('../content/ppg-monitor.md?raw'),
  'okanagan-hydrail': () => import('../content/okanagan-hydrail.md?raw'),
  'photonics-optical-systems': () => import('../content/photonics-optical-systems.md?raw'),
  'writing/light-computing': () => import('../content/writing/light-computing.md?raw'),
  'writing/weathernext-2': () => import('../content/writing/weathernext-2.md?raw'),
};

const cache = new Map<string, Block[]>();

export const hasDocument = (file: string): boolean => file in loaders;

/** Load and parse a published Markdown document into blocks. Cached after the first read. */
export async function loadDocument(file: string): Promise<Block[]> {
  const cached = cache.get(file);
  if (cached) return cached;
  const load = loaders[file];
  if (!load) throw new Error(`No published document "${file}"`);
  const { default: raw } = await load();
  const blocks = parseMarkdown(raw);
  cache.set(file, blocks);
  return blocks;
}
