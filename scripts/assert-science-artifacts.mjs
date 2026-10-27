#!/usr/bin/env node
/**
 * Assert dual-build artifacts exist (G0.2).
 * Run after: npm run build:all
 */
import { access } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.cwd()
const required = [
  'dist/index.html',
  'dist/science/index.html',
  'dist/science/stub/index.html',
  'dist/science/linalg/index.html',
]

let failed = false
for (const rel of required) {
  try {
    await access(join(root, rel))
    console.log(`ok  ${rel}`)
  } catch {
    console.error(`MISSING  ${rel}`)
    failed = true
  }
}

if (failed) {
  console.error('\nArtifact assert failed. Run: npm run build:all')
  process.exit(1)
}

console.log('\nArtifact assert passed.')
