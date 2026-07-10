#!/usr/bin/env bun
/**
 * User-guide test suite — the mechanical guardrail against guide drift.
 *
 *   bun evals/guide-suite.ts
 *
 * Extracts the fenced `bash` command blocks from docs/guides/user-guide/onboarding.md
 * and runs the documented onboarding steps against in-harness fixtures — a greenfield
 * repo and a legacy one — driving the bootstrap chain (INIT → the self-sufficiency
 * contract) with **no skills installed**. It then asserts each fixture ends in the
 * documented state: vendored script copies, the `ki:*` keys, and a working `ki:audit`
 * aggregate. Because the commands are extracted from the guide, the guide cannot drift
 * from what actually works. Deterministic; exits non-zero on any failed assertion.
 *
 * Unlike the behavioural `harness.ts` evals (non-deterministic, advisory), this is a
 * hard gate and is wired into `ki:verify`. Bun/Node built-ins only.
 */

import { execSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
  writeFileSync(join(dir, '.ki-config.toml'), `${tables.join('\n')}\nlicense = "MIT"\n`)
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

// ── extract the guide's bash blocks ──────────────────────────────────────────
const guide = readFileSync(GUIDE, 'utf8')
const blocks = [...guide.matchAll(/```bash\n([\s\S]*?)```/g)].map((m) => m[1].trim())
check(blocks.length >= 3, `extracted ${blocks.length} bash command blocks from onboarding.md`)
const greenfieldBlocks = blocks.filter((b) => /bootstrap\.ts|ki:audit/.test(b) && !/--legacy|--tracking|raw\.githubusercontent/.test(b))
const legacyBlocks = blocks.filter((b) => /--legacy/.test(b))
check(greenfieldBlocks.length >= 2, 'guide documents the greenfield bootstrap + audit steps')
check(legacyBlocks.length >= 1, 'guide documents the legacy --legacy step')

const tmp = mkdtempSync(join(tmpdir(), 'ki-guide-'))
try {
  // ── greenfield ─────────────────────────────────────────────────────────────
  console.log('\ngreenfield fixture (declares [ki-repo] + [ki-mcp]):')
  const gf = join(tmp, 'greenfield')
  greenfield(gf, ['[ki-repo]', '[ki-mcp]'])
  const gfEnv = { ...process.env, KI_HARNESS: HARNESS, TARGET: gf }
  for (const b of greenfieldBlocks) run(b, HARNESS, gfEnv)

  check(existsSync(join(gf, '.ki-meta/bin/aggregate.ts')), 'vendored the aggregate runner')
  const binAudit = join(gf, '.ki-meta/bin/ki-audit')
  check(existsSync(binAudit), 'wrote the package.json-free .ki-meta/bin/ki-audit entry point')
  check(existsSync(binAudit) && (lstatSync(binAudit).mode & 0o111) !== 0, '.ki-meta/bin/ki-audit is executable')
  const repoChecker = join(gf, '.ki-meta/skills/ki-repo/audit.ts')
  check(existsSync(repoChecker), 'vendored the ki-repo checker')
  check(existsSync(repoChecker) && !lstatSync(repoChecker).isSymbolicLink(), 'vendored checker is a copy, not a symlink (SCRIPT-7)')
  check(existsSync(join(gf, '.ki-meta/skills/ki-mcp/audit.ts')), 'declared [ki-mcp] pulled ki-mcp into the vendored set')
  const pkg = JSON.parse(readFileSync(join(gf, 'package.json'), 'utf8')) as { scripts: Record<string, string> }
  for (const k of ['ki:audit', 'ki:conform', 'ki:init', 'ki:repo:audit', 'ki:mcp:audit']) check(!!pkg.scripts[k], `installed key ${k}`)
  const audit = run('bun run ki:audit', gf, gfEnv)
  check(/==> ki:repo:audit/.test(audit), 'ki:audit aggregate invoked the vendored ki:repo:audit')
  check(/==> ki:mcp:audit/.test(audit), 'ki:audit aggregate invoked the vendored ki:mcp:audit')

  // ── legacy ───────────────────────────────────────────────────────────────
  console.log('\nlegacy fixture (--legacy: INIT then a full ki:conform):')
  const lg = join(tmp, 'legacy')
  greenfield(lg)
  // a stale hand-written key the re-vendor must leave intact (ensureScripts never clobbers)
  const lgPkg = JSON.parse(readFileSync(join(lg, 'package.json'), 'utf8')) as { scripts: Record<string, string> }
  lgPkg.scripts['ki:repo:audit'] = 'echo pre-existing'
  writeFileSync(join(lg, 'package.json'), `${JSON.stringify(lgPkg, null, 2)}\n`)
  const lgEnv = { ...process.env, KI_HARNESS: HARNESS, TARGET: lg }
  for (const b of legacyBlocks) run(b, HARNESS, lgEnv)

  check(existsSync(join(lg, '.ki-meta/skills/ki-repo/audit.ts')), '--legacy vendored the checkers')
  check(existsSync(join(lg, '.ki-meta/bin/aggregate.ts')), '--legacy installed the aggregate')
  const lgAfter = JSON.parse(readFileSync(join(lg, 'package.json'), 'utf8')) as { scripts: Record<string, string> }
  check(lgAfter.scripts['ki:repo:audit'] === 'echo pre-existing', '--legacy left a pre-existing key untouched (never clobbers)')
  check(!!lgAfter.scripts['ki:audit'], '--legacy installed the ki:audit aggregate key')

  // ── package.json-free (dotfiles/KB/tap shape) ────────────────────────────
  // A repo with NO package.json must still self-govern via .ki-meta/bin/ki-audit, and
  // the ki-engineering checker (pulled in by ki-repo's implies edge) must NA-out rather
  // than emit a wall of toolchain FAILs.
  console.log('\npackage.json-free fixture (no package.json):')
  const pf = join(tmp, 'pkgfree')
  mkdirSync(pf, { recursive: true })
  writeFileSync(join(pf, '.ki-config.toml'), '[ki-repo]\nlicense = "MIT"\n')
  execSync('git init -q', { cwd: pf })
  const pfEnv = { ...process.env, KI_HARNESS: HARNESS, TARGET: pf }
  run(`bun "${join(HARNESS, 'skills/ki-bootstrap/scripts/bootstrap.ts')}" "${pf}"`, HARNESS, pfEnv)
  check(!existsSync(join(pf, 'package.json')), 'bootstrap created no package.json')
  const pfBin = join(pf, '.ki-meta/bin/ki-audit')
  check(existsSync(pfBin) && (lstatSync(pfBin).mode & 0o111) !== 0, 'wrote an executable .ki-meta/bin/ki-audit')
  const pfAudit = run('./.ki-meta/bin/ki-audit audit', pf, pfEnv)
  check(/==> ki:engineering:audit/.test(pfAudit), 'aggregate ran the vendored ki:engineering checker')
  check(/not a TypeScript\/Bun repo/.test(pfAudit), 'ki-engineering NA-d out (no package.json) instead of failing')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(failures === 0 ? '\nguide suite: all assertions passed' : `\nguide suite: ${failures} assertion(s) failed`)
process.exit(failures === 0 ? 0 : 1)
