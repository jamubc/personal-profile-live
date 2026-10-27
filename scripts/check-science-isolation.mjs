#!/usr/bin/env node
/**
 * Fail if profile and science import across the isolation boundary.
 * SCI-PLAN-2026-07-22 §7 / G0.6
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.cwd()

async function walk(dir, acc = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git') continue
    const p = join(dir, ent.name)
    if (ent.isDirectory()) await walk(p, acc)
    else if (/\.(ts|tsx|js|jsx|mjs|cjs|css|html)$/.test(ent.name)) acc.push(p)
  }
  return acc
}

function lineViolations(file, text, patterns) {
  const hits = []
  const lines = text.split(/\r?\n/)
  lines.forEach((line, i) => {
    for (const { re, msg } of patterns) {
      if (re.test(line)) hits.push({ file, line: i + 1, msg, text: line.trim() })
    }
  })
  return hits
}

const scienceFiles = await walk(join(root, 'science'))
const profileFiles = await walk(join(root, 'src'))

const violations = []

// science → profile src
for (const file of scienceFiles) {
  const text = await readFile(file, 'utf8')
  violations.push(
    ...lineViolations(file, text, [
      {
        re: /from\s+['"](?:\.\.\/)+src\//,
        msg: 'science must not import profile src via relative path',
      },
      {
        re: /from\s+['"]@?\/?src\//,
        msg: 'science must not import profile src',
      },
      {
        re: /import\s+['"](?:\.\.\/)+src\//,
        msg: 'science must not side-effect import profile src',
      },
    ])
  )
}

// profile → science
for (const file of profileFiles) {
  const text = await readFile(file, 'utf8')
  violations.push(
    ...lineViolations(file, text, [
      {
        re: /from\s+['"](?:\.\.\/)*science\//,
        msg: 'profile must not import science',
      },
      {
        re: /from\s+['"]@?\/?science\//,
        msg: 'profile must not import science',
      },
      {
        re: /import\s+['"](?:\.\.\/)*science\//,
        msg: 'profile must not side-effect import science',
      },
    ])
  )
}

if (violations.length) {
  console.error('Science isolation check FAILED:\n')
  for (const v of violations) {
    console.error(`  ${relative(root, v.file)}:${v.line}`)
    console.error(`    ${v.msg}`)
    console.error(`    ${v.text}\n`)
  }
  process.exit(1)
}

// Ensure science tree exists (shell present)
try {
  await stat(join(root, 'science', 'index.html'))
  await stat(join(root, 'science', 'stub', 'index.html'))
  await stat(join(root, 'science', 'linalg', 'index.html'))
} catch {
  console.error(
    'Science isolation check FAILED: missing science/index.html, stub, or linalg entry'
  )
  process.exit(1)
}

console.log('Science isolation check passed (no cross-imports; shell entries present).')
