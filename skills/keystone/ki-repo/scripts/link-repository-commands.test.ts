#!/usr/bin/env bun
/**
 * Run-based behavioural test for the explicit repository-command linker.
 *
 * ki-engineering §6 scopes unit-test coverage to `src/**` and names the harness as
 * the "run, not unit-tested" case for skill `scripts/`. So rather than a vitest suite
 * this spawns the real CLI against throwaway `.ki-config.toml` fixtures and asserts on
 * its exit code and output — matching that convention and sidestepping the script's
 * CLI-on-import shape.
 *
 * Covers the orphaned-table regression: a `[ki-*]` table declared in `.ki-config.toml`
 * that resolves to no skill in the harness (e.g. left behind by a rename) must be a
 * BOOT-1 FAIL with a non-zero exit — while a repo whose tables all resolve stays clean.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPTS = dirname(fileURLToPath(import.meta.url))
const LINKER = join(SCRIPTS, 'link-repository-commands.ts')
const COPIER = join(SCRIPTS, '..', '..', 'ki-bootstrap', 'scripts', 'lib', 'publish-project-skills.ts')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

/**
 * Build a throwaway repo whose `.ki-config.toml` holds the given `[ki-*]` tables,
 * declaring `supported_runtimes`, which is required by the publisher.
 */
function fixture(tables: string[], runtimes: string[] = ['claude-code', 'codex']): string {
  // realpath: macOS aliases /tmp → /private/tmp (and /var → /private/var), so a raw
  // mkdtemp path has a different depth-to-root than its resolved one — since the
  // symlinks this creates are relative, that mismatch would make them dangle.
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'ki-boot-linktest-')))
  const runtimeTable = `[ki-repo]\nsupported_runtimes = [${runtimes.map((r) => `"${r}"`).join(', ')}]\n`
  const dependencies: Record<string, string[]> = {
    'ki-kb': ['ki-kb-activities', 'ki-kb-live-artifacts', 'ki-kb-streams'],
    'ki-repo': ['ki-authoring']
  }
  const declared = [...new Set([...tables, 'ki-repo'].flatMap((table) => [table, ...(dependencies[table] ?? [])]))]
  const nonRuntimeTables = declared.filter((table) => table !== 'ki-repo')
  writeFileSync(join(dir, '.ki-config.toml'), `${runtimeTable}${nonRuntimeTables.map((table) => `[${table}]`).join('\n')}\n`)
  return dir
}

function runCheck(dir: string, development = false): { code: number; out: string } {
  const script = development ? LINKER : COPIER
  const res = spawnSync('bun', [script, '--check', ...(development ? ['--development'] : []), dir], { encoding: 'utf8' })
  return { code: res.status ?? 1, out: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

function runLink(dir: string, dryRun = false): { code: number; out: string } {
  const res = spawnSync('bun', [COPIER, dir, ...(dryRun ? ['--dry-run'] : [])], { encoding: 'utf8' })
  return { code: res.status ?? 1, out: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

// ── Stale: a declared table that resolves to no harness skill → BOOT-1 FAIL ──
const stale = fixture(['ki-kb', 'ki-websites-11ty'])
try {
  const { code, out } = runCheck(stale)
  check('stale table → non-zero exit', code !== 0)
  check('stale table → reports FAIL', /FAIL/.test(out))
  check('stale table → cites BOOT-1', out.includes('BOOT-1'))
  check('stale table → names the orphaned table', out.includes('ki-websites-11ty'))
} finally {
  rmSync(stale, { recursive: true, force: true })
}

// ── Write/dry-run reject dotted + duplicate unknown owners before any mutation ──
for (const dryRun of [false, true]) {
  const invalid = fixture(['ki-zeta-missing', 'ki-alpha-missing.checks', 'ki-zeta-missing.zones'])
  try {
    const before = readFileSync(join(invalid, '.ki-config.toml'), 'utf8')
    const { code, out } = runLink(invalid, dryRun)
    check(`${dryRun ? 'dry-run' : 'write'} unknown roots → non-zero exit`, code !== 0)
    check(`${dryRun ? 'dry-run' : 'write'} unknown roots → sorted names`, out.indexOf('ki-alpha-missing') < out.indexOf('ki-zeta-missing'))
    check(`${dryRun ? 'dry-run' : 'write'} unknown roots → no skills dir`, !existsSync(join(invalid, '.claude', 'skills')))
    check(`${dryRun ? 'dry-run' : 'write'} unknown roots → no .gitignore`, !existsSync(join(invalid, '.gitignore')))
    check(
      `${dryRun ? 'dry-run' : 'write'} unknown roots → config unchanged`,
      readFileSync(join(invalid, '.ki-config.toml'), 'utf8') === before
    )
  } finally {
    rmSync(invalid, { recursive: true, force: true })
  }
}

// ── Control: every declared table resolves → no orphan FAIL, exit 0 ──
const clean = fixture(['ki-kb'])
try {
  const { code, out } = runCheck(clean)
  check('clean tables → exit 0', code === 0)
  check('clean tables → no orphan FAIL line', !out.includes('ki-websites-11ty'))
} finally {
  rmSync(clean, { recursive: true, force: true })
}

// ── Missing dependency: a real skill's dependency must be an explicit table ──
const missingDependency = fixture([])
try {
  writeFileSync(join(missingDependency, '.ki-config.toml'), '[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-kb]\n')
  const before = readFileSync(join(missingDependency, '.ki-config.toml'), 'utf8')
  const { code, out } = runLink(missingDependency)
  check('missing dependency → non-zero exit', code !== 0)
  check('missing dependency → names the required skill', out.includes('ki-kb → ki-kb-activities'))
  check('missing dependency → creates no skill payload', !existsSync(join(missingDependency, '.claude', 'skills')))
  check('missing dependency → configuration remains unchanged', readFileSync(join(missingDependency, '.ki-config.toml'), 'utf8') === before)
} finally {
  rmSync(missingDependency, { recursive: true, force: true })
}

// ── Write mode auto-gitignores .claude/skills/ → BOOT-3 clears (no package.json) ──
const linkDir = fixture(['ki-kb'])
try {
  runLink(linkDir)
  const gitignore = readFileSync(join(linkDir, '.gitignore'), 'utf8')
  check('write mode → .gitignore contains .claude/skills/', /^\.claude\/skills\/?$/m.test(gitignore))
  const { out } = runCheck(linkDir)
  check('write mode → BOOT-3 no longer warns', !/WARN.*BOOT-3/.test(out))
} finally {
  rmSync(linkDir, { recursive: true, force: true })
}

// ── Codex-only: copies + gitignore land under .agents/skills, nothing under .claude/skills ──
const codexOnly = fixture(['ki-kb'], ['codex'])
try {
  runLink(codexOnly)
  check(
    'codex-only → .agents/skills/ki-kb regular payload created',
    lstatSync(join(codexOnly, '.agents', 'skills', 'ki-kb')).isDirectory() &&
      !lstatSync(join(codexOnly, '.agents', 'skills', 'ki-kb')).isSymbolicLink()
  )
  check(
    'codex-only → generated ownership marker is private skill metadata',
    existsSync(join(codexOnly, '.agents', 'skills', 'ki-kb', '.ki-meta', 'generated-runtime-skill.json')) &&
      !existsSync(join(codexOnly, '.agents', 'skills', 'ki-kb', '.ki-generated-runtime-skill'))
  )
  check('codex-only → nothing under .claude/skills', !existsSync(join(codexOnly, '.claude', 'skills')))
  const gitignore = readFileSync(join(codexOnly, '.gitignore'), 'utf8')
  check('codex-only → .gitignore contains .agents/skills/', /^\.agents\/skills\/?$/m.test(gitignore))
  const { code, out } = runCheck(codexOnly)
  check('codex-only → --check exit 0', code === 0)
  check('codex-only → --check reports [codex]', out.includes('[codex]'))
} finally {
  rmSync(codexOnly, { recursive: true, force: true })
}

// ── Dual-runtime: copies + gitignore land under both dirs, --check clean for both ──
const dual = fixture(['ki-kb'], ['claude-code', 'codex'])
try {
  runLink(dual)
  check('dual-runtime → .claude/skills/ki-kb copied', lstatSync(join(dual, '.claude', 'skills', 'ki-kb')).isDirectory())
  check('dual-runtime → .agents/skills/ki-kb copied', lstatSync(join(dual, '.agents', 'skills', 'ki-kb')).isDirectory())
  const gitignore = readFileSync(join(dual, '.gitignore'), 'utf8')
  check('dual-runtime → .gitignore contains .claude/skills/', /^\.claude\/skills\/?$/m.test(gitignore))
  check('dual-runtime → .gitignore contains .agents/skills/', /^\.agents\/skills\/?$/m.test(gitignore))
  const { code, out } = runCheck(dual)
  check('dual-runtime → --check exit 0', code === 0)
  check('dual-runtime → --check reports both runtimes', out.includes('[claude-code]') && out.includes('[codex]'))
} finally {
  rmSync(dual, { recursive: true, force: true })
}

// ── Unknown runtime → non-zero exit, fail-loud message (runtimeSkillsDir's throw) ──
const unknown = fixture(['ki-kb'], ['bogus-runtime'])
try {
  const { code, out } = runLink(unknown)
  check('unknown runtime → non-zero exit', code !== 0)
  check('unknown runtime → fail-loud message names the runtime', out.includes('bogus-runtime'))
} finally {
  rmSync(unknown, { recursive: true, force: true })
}

const quotedRuntime = fixture([])
try {
  writeFileSync(
    join(quotedRuntime, '.ki-config.toml'),
    '["ki-repo"]\nsupported_runtimes = ["codex"]\n["ki-authoring"]\n["ki-kb"]\n["ki-kb-activities"]\n["ki-kb-live-artifacts"]\n["ki-kb-streams"]\n'
  )
  const { code } = runLink(quotedRuntime)
  check('quoted repo/runtime table → exit 0', code === 0)
  check('quoted repo/runtime table → codex path selected', existsSync(join(quotedRuntime, '.agents', 'skills', 'ki-kb')))
  check('quoted repo/runtime table → default Claude path not selected', !existsSync(join(quotedRuntime, '.claude', 'skills')))
} finally {
  rmSync(quotedRuntime, { recursive: true, force: true })
}

const multilineRuntime = fixture([])
try {
  writeFileSync(
    join(multilineRuntime, '.ki-config.toml'),
    '[ki-repo]\n[ki-kb]\nnote = """\nsupported_runtimes = ["codex"]\n"""\n[ki-authoring]\n[ki-kb-activities]\n[ki-kb-live-artifacts]\n[ki-kb-streams]\n'
  )
  const { code } = runLink(multilineRuntime)
  check('multiline runtime lookalike → rejects missing declaration', code !== 0)
  check('multiline runtime lookalike → does not infer a Claude path', !existsSync(join(multilineRuntime, '.claude', 'skills', 'ki-kb')))
  check('multiline runtime lookalike → does not infer a Codex path', !existsSync(join(multilineRuntime, '.agents', 'skills')))
} finally {
  rmSync(multilineRuntime, { recursive: true, force: true })
}

const development = fixture(['ki-kb'])
try {
  const normal = runLink(development)
  const linked = spawnSync('bun', [LINKER, development, '--development'], { encoding: 'utf8' })
  check('normal copy → exits cleanly before local development linking', normal.code === 0)
  check('development link → requires and accepts explicit intent', linked.status === 0)
  check(
    'development link → replaces generated copy with a symlink',
    lstatSync(join(development, '.claude', 'skills', 'ki-kb')).isSymbolicLink()
  )
  const copiedCheck = runCheck(development)
  const developmentCheck = runCheck(development, true)
  check('development link → ordinary copy check reports reconciliation', copiedCheck.out.includes('needs copied-payload reconciliation'))
  check(
    'development link → explicit development check accepts the managed symlink',
    developmentCheck.code === 0 && !developmentCheck.out.includes('WARN')
  )
  const accidental = spawnSync('bun', [LINKER, development], { encoding: 'utf8' })
  check('legacy link entry point → refuses without explicit development intent', accidental.status !== 0)
} finally {
  rmSync(development, { recursive: true, force: true })
}

{
  const result = spawnSync('bun', [LINKER, '--help'], { encoding: 'utf8' })
  check('link command help exits cleanly', result.status === 0)
  check('link command help explains explicit development mode', (result.stdout ?? '').includes('--development'))
}

if (failed) {
  console.log('\n\x1b[31mlink-repository-commands.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mlink-repository-commands.test.ts: all checks passed\x1b[0m')
