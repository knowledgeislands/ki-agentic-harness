#!/usr/bin/env bun
/**
 * Run-based behavioural test for `recap-grounding.ts`.
 *
 * ki-engineering §6 scopes unit-test coverage to `src/**` and names the harness as the
 * "run, not unit-tested" case for skill `scripts/`. So this spawns the real helper
 * against a throwaway repo + transcript fixture — matching the convention
 * `audit.test.ts` set.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HELPER = join(dirname(fileURLToPath(import.meta.url)), 'recap-grounding.ts')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function toolUseLine(name: string, input: unknown): string {
  return JSON.stringify({ message: { content: [{ type: 'tool_use', name, input }] } })
}

const repoDir = mkdtempSync(join(tmpdir(), 'ki-recap-repo-'))
spawnSync('git', ['init', '-q'], { cwd: repoDir })
writeFileSync(join(repoDir, 'tracked.txt'), 'hello\n')
spawnSync('git', ['add', 'tracked.txt'], { cwd: repoDir })
spawnSync('git', ['commit', '-q', '-m', 'init'], { cwd: repoDir })
writeFileSync(join(repoDir, 'tracked.txt'), 'hello again\n')
writeFileSync(join(repoDir, 'new-file.txt'), 'new\n')

const transcriptsDir = mkdtempSync(join(tmpdir(), 'ki-recap-transcripts-'))
const lines = [
  toolUseLine('Read', { file_path: '/x/big.ts' }),
  toolUseLine('Read', { file_path: '/x/big.ts' }),
  toolUseLine('Edit', { file_path: '/x/big.ts', old_string: 'a', new_string: 'b' }),
  toolUseLine('Bash', { command: 'ls' }),
  toolUseLine('Bash', { command: 'ls' }),
  toolUseLine('Bash', { command: 'ls' })
]
writeFileSync(join(transcriptsDir, 'session1.jsonl'), lines.join('\n'))

function run(): { code: number; out: string } {
  const res = spawnSync('bun', [HELPER, repoDir, '--json', '--transcripts-dir', transcriptsDir], { encoding: 'utf8' })
  return { code: res.status ?? 1, out: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

try {
  const { code, out } = run()
  check('exits 0', code === 0)
  const parsed = JSON.parse(out)
  check('finds the transcript', typeof parsed.transcript === 'string' && parsed.transcript.endsWith('session1.jsonl'))
  check('reports files touched', Array.isArray(parsed.filesTouched) && parsed.filesTouched.length >= 2)
  check('tallies tool calls', parsed.toolTally.Bash === 3 && parsed.toolTally.Read === 2)
  check(
    'flags repeated identical Bash call',
    parsed.highCostCandidates.some((c: string) => c.includes('repeated identical Bash'))
  )
  check(
    'flags re-read of big.ts',
    parsed.highCostCandidates.some((c: string) => c.includes('re-read of /x/big.ts'))
  )
} finally {
  rmSync(repoDir, { recursive: true, force: true })
  rmSync(transcriptsDir, { recursive: true, force: true })
}

// ── No transcript present → still succeeds, transcript null, no crash ──
const emptyTranscriptsDir = mkdtempSync(join(tmpdir(), 'ki-recap-empty-'))
const bareRepo = mkdtempSync(join(tmpdir(), 'ki-recap-bare-'))
spawnSync('git', ['init', '-q'], { cwd: bareRepo })
try {
  const res = spawnSync('bun', [HELPER, bareRepo, '--json', '--transcripts-dir', emptyTranscriptsDir], { encoding: 'utf8' })
  const parsed = JSON.parse(res.stdout ?? '{}')
  check('no transcript → null, exit 0', res.status === 0 && parsed.transcript === null)
} finally {
  rmSync(emptyTranscriptsDir, { recursive: true, force: true })
  rmSync(bareRepo, { recursive: true, force: true })
}

// ── Dotted repo path → resolves Claude's matching project-directory slug ──
const dottedFixtureRoot = mkdtempSync(join(tmpdir(), 'ki.recap-dotted-fixture-'))
const dottedRepo = join(dottedFixtureRoot, '.local', 'share', 'chezmoi')
const fixtureHome = join(dottedFixtureRoot, 'home')
const projectSlug = dottedRepo.replace(/[/.]/g, '-')
const dottedProjectDir = join(fixtureHome, '.claude', 'projects', projectSlug)
const dottedTranscript = join(dottedProjectDir, 'dotted-session.jsonl')
mkdirSync(dottedRepo, { recursive: true })
mkdirSync(dottedProjectDir, { recursive: true })
spawnSync('git', ['init', '-q'], { cwd: dottedRepo })
writeFileSync(dottedTranscript, toolUseLine('Read', { file_path: '/x/dotted.ts' }))
try {
  const res = spawnSync('bun', [HELPER, dottedRepo, '--json'], {
    encoding: 'utf8',
    env: { ...process.env, HOME: fixtureHome }
  })
  const parsed = JSON.parse(res.stdout ?? '{}')
  check('dotted repo path resolves its Claude project transcript', res.status === 0 && parsed.transcript === dottedTranscript)
} finally {
  rmSync(dottedFixtureRoot, { recursive: true, force: true })
}

if (failed) {
  console.log('\n\x1b[31mrecap-grounding.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mrecap-grounding.test.ts: all checks passed\x1b[0m')
