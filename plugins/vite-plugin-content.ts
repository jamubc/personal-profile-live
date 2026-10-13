/**
 * Build-time content index.
 *
 * Reads every Markdown file under src/content/projects and src/content/writing,
 * parses the frontmatter, validates required fields, and exposes the metadata
 * (never the bodies) as the virtual module `virtual:content`. Bodies stay lazy
 * via import.meta.glob so each write-up remains its own chunk.
 *
 * Publishing a new post or project = dropping one .md file in the right folder.
 */
import type { Plugin } from 'vite';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { parseFrontmatter, type Frontmatter } from '../src/lib/frontmatter';
import { parseMarkdown, extractToc, readingMinutes, figureCount, plainText } from '../src/lib/markdown';

const VIRTUAL_ID = 'virtual:content';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

const CONTENT_ROOT = resolve(process.cwd(), 'src/content');

interface Collection {
  dir: string;
  required: string[];
}

const COLLECTIONS: Record<'projects' | 'writing', Collection> = {
  projects: { dir: 'projects', required: ['title', 'summary', 'category'] },
  writing: { dir: 'writing', required: ['title', 'date', 'category', 'summary'] },
};


function readCollection(name: keyof typeof COLLECTIONS) {
  const { dir, required } = COLLECTIONS[name];
  const abs = join(CONTENT_ROOT, dir);
  let files: string[] = [];
  try { files = readdirSync(abs).filter((f) => f.endsWith('.md')).sort(); } catch { return []; }
  return files.map((file) => {
    const path = join(abs, file);
    const raw = readFileSync(path, 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const slug = basename(file, '.md');
    for (const key of required) {
      if (data[key] === undefined || data[key] === null || data[key] === '') {
        throw new Error(`[content] ${dir}/${file} is missing required frontmatter field "${key}"`);
      }
    }
    const blocks = parseMarkdown(body);
    const firstHeading = blocks.find((b) => b.type === 'heading');
    return {
      slug,
      ...data,
      readingMinutes: readingMinutes(blocks),
      figures: figureCount(blocks),
      sections: extractToc(blocks).length,
      firstHeading: firstHeading && firstHeading.type === 'heading' ? plainText(firstHeading.text) : null,
      hasBody: body.trim().length > 0,
      updatedAt: statSync(path).mtime.toISOString().slice(0, 10),
      file: `${dir}/${file}`,
    } as Frontmatter & { slug: string; readingMinutes: number; figures: number; sections: number; hasBody: boolean; updatedAt: string; file: string; firstHeading: string | null };
  });
}

function generate(): string {
  const projects = readCollection('projects');
  const writing = readCollection('writing');
  return [
    `export const projects = ${JSON.stringify(projects, null, 2)};`,
    `export const writing = ${JSON.stringify(writing, null, 2)};`,
  ].join('\n');
}

export default function contentPlugin(): Plugin {
  return {
    name: 'content-index',
    resolveId(id) { return id === VIRTUAL_ID ? RESOLVED_ID : null; },
    load(id) { return id === RESOLVED_ID ? generate() : null; },
    configureServer(server) {
      server.watcher.add(CONTENT_ROOT);
      const invalidate = (file: string) => {
        if (!file.startsWith(CONTENT_ROOT) || !file.endsWith('.md')) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', invalidate);
      server.watcher.on('unlink', invalidate);
      server.watcher.on('change', invalidate);
    },
  };
}
