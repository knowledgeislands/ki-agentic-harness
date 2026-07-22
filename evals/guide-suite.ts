#!/usr/bin/env bun
/**
 * User-guide test suite — the mechanical guardrail against guide drift.
 *
 *   bun evals/guide-suite.ts
 *
 * Extracts the fenced `bash` command blocks from docs/guides/user-guide/onboarding.md
 * and runs the documented onboarding steps against in-harness fixtures — driving the
 * bootstrap chain (EDUCATE → the self-sufficiency contract) with **no skills installed**.
 * It then asserts each fixture ends in the documented state: vendored governed entrypoint copies +
 * HELP snapshots, the four `.ki/bin/{ki-audit,ki-conform,ki-educate,ki-help}` entry
 * points, an untouched `package.json` (bootstrap wires no keys — that is ki-engineering's
 * job), a working aggregate, HELP readable with no bun on PATH, and byte-identical output
 * on a second run (idempotency). Because the commands are extracted from the guide, the
 * guide cannot drift from what actually works. Deterministic; exits non-zero on any
 * failed assertion.
 *
 * Unlike the behavioural `harness.ts` evals (non-deterministic, advisory), this is a
 * hard gate and is included in the repository's runner-neutral bare `test` suite.
 * Bun/Node built-ins only.
 */

import { execSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HARNESS = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const GUIDE = join(HARNESS, 'docs', 'guides', 'user-guide', 'onboarding.md')

let failures = 0
function check(cond: boolean, msg: string): void {
  console.log(`  ${cond ? '✓' : '✗'} ${msg}`)
  if (!cond) failures++
}

function greenfield(dir: string, tables: string[] = ['[ki-repo]']): void {
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'package.json'), `${JSON.stringify({ name: 'fixture', version: '0.0.0', scripts: {} }, null, 2)}\n`)
  writeFileSync(
    join(dir, '.ki-config.toml'),
    `[ki-repo]\nsupported_runtimes = ["claude-code"]\n${tables.filter((table) => table !== '[ki-repo]').join('\n')}\nlicense = "MIT"\n`
  )
  execSync('git init -q', { cwd: dir })
}

// Run a shell command tolerantly: the vendored ki:audit exits non-zero on a bare
// fixture's real findings — that is expected, so capture output and never throw.
function run(cmd: string, cwd: string, env: NodeJS.ProcessEnv): string {
  try {
    return execSync(cmd, { cwd, env, stdio: 'pipe', timeout: 120_000 }).toString()
  } catch (e: unknown) {
    const err = e as { stdout?: Buffer; stderr?: Buffer }
    return (err.stdout?.toString() ?? '') + (err.stderr?.toString() ?? '')
  }
}

function liveGuidanceFiles(root: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name)
    if (entry.isDirectory()) files.push(...liveGuidanceFiles(path))
    else if ((entry.name.endsWith('.md') || entry.name.endsWith('.ts')) && !entry.name.endsWith('.test.ts')) {
      files.push(path)
    }
  }
  return files
}

// ── extract the guide's bash blocks ──────────────────────────────────────────
const guide = readFileSync(GUIDE, 'utf8')
const blocks = [...guide.matchAll(/```bash\n([\s\S]*?)```/g)].map((m) => m[1].trim())
check(blocks.length >= 3, `extracted ${blocks.length} bash command blocks from onboarding.md`)
const primaryBlocks = blocks.filter((b) => /bootstrap\.ts|\.ki\/bin\/ki-audit/.test(b) && !/raw\.githubusercontent/.test(b))
check(primaryBlocks.length >= 2, 'guide documents the bootstrap + self-govern (ki-audit) steps')
check(!blocks.some((b) => /--legacy|--tracking/.test(b)), 'guide carries no legacy/tracking aggressiveness flags')

const retiredCommand = /\bbun run ki:(?:lint(?::[a-z0-9*:_-]+)?|deps(?::[a-z0-9*:_-]+)?|knip|verify)(?=[\s`'"),.;:&|\]]|$)/i
check(
  retiredCommand.test(['Run bun run ', 'ki:verify; do not postpone it.'].join('')),
  'retired-command guard cannot be escaped by unrelated retirement language'
)
const staleGuidance = [
  join(HARNESS, 'AGENTS.md'),
  ...['agents', 'evals', 'skills', join('docs', 'guides')].flatMap((dir) => liveGuidanceFiles(join(HARNESS, dir)))
]
  .flatMap((file) =>
    readFileSync(file, 'utf8')
      .split('\n')
      .map((line, index) => ({ file, line, number: index + 1 }))
  )
  .filter(({ line }) => retiredCommand.test(line))
check(
  staleGuidance.length === 0,
  staleGuidance.length === 0
    ? 'live guidance recommends no retired per-tool command'
    : `retired command remains live at ${staleGuidance.map(({ file, number }) => `${file}:${number}`).join(', ')}`
)

const tmp = mkdtempSync(join(tmpdir(), 'ki-guide-'))
try {
  // ── primary: bootstrap builds .ki, wires no package.json ─────────────────────
  console.log('\nprimary fixture (declares [ki-repo] + [ki-mcp], carries a package.json):')
  const gf = join(tmp, 'primary')
  greenfield(gf, ['[ki-repo]', '[ki-mcp]'])
  const gfEnv = { ...process.env, KI_HARNESS: HARNESS, TARGET: gf }
  for (const b of primaryBlocks) run(b, HARNESS, gfEnv)

  check(existsSync(join(gf, '.ki/bin/aggregate.ts')), 'vendored the aggregate runner')
  // All four package.json-free entry points, each executable.
  for (const bin of ['ki-audit', 'ki-conform', 'ki-educate', 'ki-help']) {
    const p = join(gf, '.ki/bin', bin)
    check(existsSync(p) && (lstatSync(p).mode & 0o111) !== 0, `wrote executable .ki/bin/${bin}`)
  }
  const repoEntrypoint = join(gf, '.ki/bootstrap/checkers/ki-repo/scripts/govern.ts')
  check(existsSync(repoEntrypoint), 'vendored the ki-repo governed entrypoint')
  check(
    existsSync(repoEntrypoint) && !lstatSync(repoEntrypoint).isSymbolicLink(),
    'vendored governed entrypoint is a copy, not a symlink (SCRIPT-7)'
  )
  check(existsSync(join(gf, '.ki/bootstrap/checkers/ki-repo/help.md')), 'rendered the ki-repo HELP snapshot')
  check(existsSync(join(gf, '.ki/bootstrap/checkers/ki-mcp/scripts/govern.ts')), 'declared [ki-mcp] pulled ki-mcp into the vendored set')

  // Bootstrap touches no package.json — the ki:* keys are ki-engineering's to wire.
  const pkg = JSON.parse(readFileSync(join(gf, 'package.json'), 'utf8')) as { scripts: Record<string, string> }
  check(Object.keys(pkg.scripts).length === 0, 'bootstrap wrote no package.json keys (scripts still empty)')

  // The aggregate fans out over the vendored checkers, via the bin (no package.json key).
  const audit = run('./.ki/bin/ki-audit audit --reporter-levels=all', gf, gfEnv)
  check(/==> ki:repo:audit/.test(audit), 'aggregate invoked the vendored ki-repo checker')
  check(/==> ki:mcp:audit/.test(audit), 'aggregate invoked the vendored ki-mcp checker')

  // HELP is pure bash over the vendored snapshot — readable with no bun on PATH.
  const help = run('./.ki/bin/ki-help ki-repo', gf, { ...gfEnv, PATH: '/usr/bin:/bin' })
  check(/ki-repo/.test(help), 'ki-help prints a skill snapshot with bun off PATH (pure bash)')

  // Idempotency — re-running the chain at the same ref reproduces an identical manifest.
  const manifest1 = readFileSync(join(gf, '.ki/manifest.json'), 'utf8')
  run(`bun "${join(HARNESS, 'skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts')}" "${gf}"`, HARNESS, gfEnv)
  const manifest2 = readFileSync(join(gf, '.ki/manifest.json'), 'utf8')
  check(manifest1 === manifest2, 're-running bootstrap is idempotent (identical manifest)')

  // ── package.json-free (dotfiles/KB/tap shape) ────────────────────────────
  // A repo with NO package.json must still self-govern via .ki/bin/ki-audit. Since
  // ki-engineering is coverage-detected (not implied by ki-repo), a repo that never
  // declares [ki-engineering] must never vendor it at all.
  console.log('\npackage.json-free fixture (no package.json):')
  const pf = join(tmp, 'pkgfree')
  mkdirSync(pf, { recursive: true })
  writeFileSync(join(pf, '.ki-config.toml'), '[ki-repo]\nlicense = "MIT"\n')
  execSync('git init -q', { cwd: pf })
  const pfEnv = { ...process.env, KI_HARNESS: HARNESS, TARGET: pf }
  run(`bun "${join(HARNESS, 'skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts')}" "${pf}"`, HARNESS, pfEnv)
  check(!existsSync(join(pf, 'package.json')), 'bootstrap created no package.json')
  const pfBin = join(pf, '.ki/bin/ki-audit')
  check(existsSync(pfBin) && (lstatSync(pfBin).mode & 0o111) !== 0, 'wrote an executable .ki/bin/ki-audit')
  check(!existsSync(join(pf, '.ki/bootstrap/checkers/ki-engineering')), 'ki-engineering NOT vendored (coverage-detected, not declared)')
  const pfAudit = run('./.ki/bin/ki-audit audit', pf, pfEnv)
  check(!/==> ki:engineering:audit/.test(pfAudit), 'aggregate never invoked a ki-engineering checker')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(failures === 0 ? '\nguide suite: all assertions passed' : `\nguide suite: ${failures} assertion(s) failed`)
process.exit(failures === 0 ? 0 : 1)
