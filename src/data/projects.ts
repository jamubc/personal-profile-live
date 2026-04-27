import { Project, ProjectDetailSection } from '../types';
import { parseProjectContent } from '../lib/parseProjectContent';

/**
 * Dynamically load and parse a project's markdown content file.
 * The content is cached after the first load so subsequent opens are instant.
 */
const contentCache = new Map<string, ProjectDetailSection[]>();

export async function loadProjectContent(
  contentFile: string,
): Promise<ProjectDetailSection[]> {
  if (contentCache.has(contentFile)) {
    return contentCache.get(contentFile)!;
  }

  // Vite's dynamic import with ?raw suffix — each .md becomes its own chunk
  const modules: Record<string, () => Promise<{ default: string }>> =
    import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: false }) as any;

  const key = `../content/${contentFile}.md`;
  const loader = modules[key];
  if (!loader) {
    console.warn(`No content file found for "${contentFile}"`);
    return [];
  }

  const raw = await (loader as any)();
  // raw may be a string directly or { default: string } depending on Vite version
  const text = typeof raw === 'string' ? raw : raw.default ?? raw;
  const sections = parseProjectContent(text);
  contentCache.set(contentFile, sections);
  return sections;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Gemini MCP Tool',
    description: 'Give your favorite agent or tool access to Google Gemini models and their coding powers with this open source MCP.',
    image: 'https://jamubc.github.io/gemini-mcp-tool/icon.png',
    techStack: ['TypeScript', 'Node.js', 'Gemini CLI', 'AI Agents'],
    category: 'Open-Source Development',
    repoUrl: 'https://github.com/jamubc/gemini-mcp-tool',
    stars: '1.6k'
  },
  {
    id: '2',
    title: 'Logic Pro MCP',
    description: 'A creative, experimental MCP for Logic Pro DAW. Experiment with AI generated arrangements, chord progressions and quality of life improvements for music producers.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    techStack: ['Python', 'AppleScript', 'MCP Protocol', 'Music Theory', 'UV Package Manager'],
    category: 'Open-Source Development',
    repoUrl: 'https://github.com/jamubc/logic-pro-mcp',
    demoUrl: 'https://logic-pro-mcp-website.vercel.app/'
  },
  {
    id: '3',
    title: 'Env Manager TUI',
    description: 'A terminal-based environment variable manager with AES-256-GCM encryption for storing, organizing sensitive values. Created to optimize organization of multiple API keys.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    techStack: ['Python', 'Textual', 'Cryptography', 'Shell Scripting'],
    category: 'Open-Source Development',
    repoUrl: 'https://github.com/jamubc/env-manager'
  },
  {
    id: '4',
    title: 'Automated Apple Grade Classification',
    description: 'A CNN-based classification system deployed on a Raspberry Pi to grade apples as Good or Bad in near real time using machine vision, achieving 96% accuracy for our client on a $187 budget.',
    image: 'https://images.unsplash.com/photo-1589820296153-17d40996e538?auto=format&fit=crop&w=800&q=80',
    techStack: ['Python', 'TensorFlow Lite', 'OpenCV', 'Raspberry Pi', 'CNN', 'Edge ML', 'Embedded Systems'],
    category: 'Engineering & Research',
    assetsDir: '/projects/apple-classifier',
    icon: '/projects/apple-classifier/icon.webp',
    repoUrl: 'https://github.com/jamubc/apple_classifier_private_Capstone',
    contentFile: 'apple-classifier',
  },
  {
    id: '5',
    title: 'Analog PPG Heart Rate Monitor',
    description: 'Measuring heart rate via photoplethysmogram with a multi stage analog signal filter',
    image: '/projects/ppg-monitor/images/Circuit%20schematic%20including%20stage%202.webp',
    engineeringImageWidthPct: 80,
    engineeringImageFit: 'contain',
    techStack: ['Analog Circuit Design', 'LTSpice validation', 'Signals', 'Prototyping'],
    category: 'Engineering & Research',
    assetsDir: '/projects/ppg-monitor',
    icon: '/projects/ppg-monitor/icon.webp',
    contentFile: 'ppg-monitor',
  },
  {
    id: '6',
    title: 'Repairing a Damaged Exhaust System',
    description: '',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    techStack: ['Welding', 'Fabrication', 'Automotive'],
    category: 'Engineering & Research',
    assetsDir: '/projects/exhaust-system',
    icon: '/projects/exhaust-system/icon.webp',
  },
  {
    id: '7',
    title: 'Repairing and Restoring Rust Damage — Automotive',
    description: '',
    image: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=800&q=80',
    techStack: ['Body Work', 'Welding', 'Restoration', 'Automotive'],
    category: 'Engineering & Research',
    assetsDir: '/projects/rust-restoration',
    icon: '/projects/rust-restoration/icon.webp',
  },
  {
    id: '8',
    title: 'Rebuilding a 4-Cylinder Engine',
    description: '',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
    techStack: ['Engine Rebuild', 'Mechanical', 'Automotive'],
    category: 'Engineering & Research',
    assetsDir: '/projects/engine-rebuild',
    icon: '/projects/engine-rebuild/icon.webp',
  },
];
