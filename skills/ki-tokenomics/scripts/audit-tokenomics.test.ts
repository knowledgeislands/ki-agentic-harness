#!/usr/bin/env bun
/**
 * Run-based behavioural test for `audit-tokenomics.ts`.
 *
 * ki-engineering §6 scopes unit-test coverage to `src/**` and names the harness as the
 * "run, not unit-tested" case for skill `scripts/`. So this spawns the real checker
 * against a throwaway project directory and asserts on its output — matching the
 * convention `link-skills.test.ts` set.
 *
 * Covers TOOL-4 (headroom:learn entries in CLAUDE.md rooted in another repo) and the
 * remediation footer from the checker contract: a foreign-repo capture must WARN and
 * print the CONFORM footer; a clean own-repo block must not raise TOOL-4.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHECKER = join(dirname(fileURLToPath(import.meta.url)), 'audit-tokenomics.ts')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

/** Build a throwaway project dir named `repoName`, holding a CLAUDE.md learn block. */
function fixture(repoName: string, learnBody: string): { base: string; dir: string } {
  const base = mkdtempSync(join(tmpdir(), 'ki-tok-test-'))
  const dir = join(base, repoName)
  mkdirSync(dir, { recursive: true })
  const md = [
    '# CLAUDE.md',
    '',
    'Some orientation prose.',
    '',
    '<!-- headroom:learn:start -->',
    learnBody,
    '<!-- headroom:learn:end -->',
    ''
  ].join('\n')
  writeFileSync(join(dir, 'CLAUDE.md'), md)
  return { base, dir }
}

function run(dir: string): { code: number; out: string } {
  const res = spawnSync('bun', [CHECKER, dir, '--no-user'], { encoding: 'utf8' })
  return { code: res.status ?? 1, out: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

// ── Foreign: CLAUDE.md learn block rooted in another KI repo → TOOL-4 WARN + footer ──
{
  const { base, dir } = fixture('ki-agentic-harness', '- `cd /Users/x/kis/knowledgeislands/arcadia-agentic-harness && bun run x` — use Y.')
  try {
    const { out } = run(dir)
    check('foreign root → raises cross-repo learn warn', out.includes('headroom:learn block has'))
    check('foreign root → names the other repo', out.includes('arcadia-agentic-harness'))
    check('foreign root → prints remediation footer', out.includes('/ki-tokenomics CONFORM'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

// ── Control: CLAUDE.md learn block referencing only this repo → no TOOL-4 ──
{
  const { base, dir } = fixture(
    'ki-agentic-harness',
    '- `bun skills/ki-mcp/scripts/audit-mcp.ts ../mcp-gsuite` from knowledgeislands/ki-agentic-harness.'
  )
  try {
    const { out } = run(dir)
    check('own-repo block → no cross-repo learn warn', !out.includes('headroom:learn block has'))
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31maudit-tokenomics.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32maudit-tokenomics.test.ts: all checks passed\x1b[0m')
