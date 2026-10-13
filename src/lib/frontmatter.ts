/**
 * Tiny YAML-subset frontmatter parser. Supports what the content files need
 * and nothing more: `key: scalar`, `key: [a, b]`, block lists under a key,
 * quoted strings, numbers, booleans, and `#` comments.
 */
export type Scalar = string | number | boolean | null;
export type FrontmatterValue = Scalar | Scalar[];
export type Frontmatter = Record<string, FrontmatterValue>;

const scalar = (raw: string): Scalar => {
  const v = raw.trim();
  if (v === '') return null;
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
};

const inlineList = (raw: string): Scalar[] =>
  raw
    .slice(1, -1)
    .split(',')
    .map((s) => scalar(s))
    .filter((s) => s !== null);

export function parseFrontmatter(text: string): { data: Frontmatter; body: string } {
  const src = text.replace(/\r\n?/g, '\n');
  if (!src.startsWith('---\n')) return { data: {}, body: src };
  const end = src.indexOf('\n---', 4);
  if (end === -1) return { data: {}, body: src };
  const header = src.slice(4, end).split('\n');
  const body = src.slice(end + 4).replace(/^[^\n]*\n?/, '').replace(/^\n+/, '');

  const data: Frontmatter = {};
  let listKey: string | null = null;
  for (const line of header) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = line.match(/^\s+-\s*(.*)$/);
    if (item && listKey) {
      (data[listKey] as Scalar[]).push(scalar(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    const value = rest.replace(/\s+#.*$/, '').trim();
    if (value === '') { data[key] = []; listKey = key; continue; }
    listKey = null;
    data[key] = value.startsWith('[') && value.endsWith(']') ? inlineList(value) : scalar(value);
  }
  return { data, body };
}
