#!/usr/bin/env bun
// Vendored by ki-bootstrap. Discovers the vendored checkers in this .ki-meta/ dir
// and runs each in sequence for the given verb — no package.json required.
// Usage: bun .ki-meta/aggregate.ts <audit|conform|init>
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const verb = process.argv[2]
if (!verb) {
  console.error('usage: aggregate.ts <audit|conform|init>')
  process.exit(2)
}
const metaDir = dirname(fileURLToPath(import.meta.url))
const SKIP = new Set(['audits', 'conform']) // derived report dirs, not skill checkers
// audit → the checkers; conform → the conform scripts; init has no vendored scripts (no-op).
const pattern = verb === 'audit' ? /^(audit|lint)-.*\.ts$/ : verb === 'conform' ? /^conform-.*\.ts$/ : null
if (!pattern) process.exit(0)
const skills = readdirSync(metaDir, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !SKIP.has(e.name))
  .map((e) => e.name)
  .sort()
let failed = 0
for (const skill of skills) {
  const dir = join(metaDir, skill)
  const script = readdirSync(dir).find((f) => pattern.test(f))
  if (!script) continue
  const key = 'ki:' + skill.replace(/^ki-/, '') + ':' + verb
  console.log('\n\x1b[36m==> ' + key + '\x1b[0m')
  try {
    execFileSync('bun', [join(dir, script), '.'], { stdio: 'inherit' })
  } catch {
    failed++
  }
}
process.exit(failed > 0 ? 1 : 0)
