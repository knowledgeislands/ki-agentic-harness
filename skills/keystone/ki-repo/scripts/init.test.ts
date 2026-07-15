#!/usr/bin/env bun
/**
 * Run-based behavioural tests for ki-repo's `.ki-config.toml` scaffolding.
 *
 * The scripts are CLI-shaped operational tooling, so this exercises their real
 * subprocess entrypoints against throwaway repos instead of importing internals.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPTS = dirname(fileURLToPath(import.meta.url))
const AUDIT = join(SCRIPTS, 'audit.ts')
const CONFORM = join(SCRIPTS, 'conform.ts')
const INIT = join(SCRIPTS, 'init.ts')

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function fixture(initial: string | null): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'ki-repo-init-test-')))
  if (initial !== null) writeFileSync(join(dir, '.ki-config.toml'), initial)
  return dir
}

function run(script: string, args: string[], env: NodeJS.ProcessEnv = process.env): { code: number; out: string } {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env })
  return { code: result.status ?? 1, out: `${result.stdout ?? ''}${result.stderr ?? ''}` }
}

function runInit(dir: string, dryRun = false): { code: number; out: string } {
  return run(INIT, [dir, '--scaffold-config-only', ...(dryRun ? ['--dry-run'] : [])])
}

function rootCount(text: string, table: string): number {
  return text.split(/\r?\n/).filter((raw) => raw.replace(/#.*$/, '').trim() === `[${table}]`).length
}

function fakeGh(dir: string): NodeJS.ProcessEnv {
  const bin = join(dir, 'fake-bin')
  mkdirSync(bin)
  const gh = join(bin, 'gh')
  writeFileSync(
    gh,
    `#!/bin/sh
case "$*" in
  "api repos/acme/config-test/branches/main/protection") exit 1 ;;
  "api repos/acme/config-test/automated-security-fixes") echo '{"enabled":true}' ;;
  "api repos/acme/config-test/actions/permissions") echo '{"enabled":true,"allowed_actions":"all"}' ;;
  "api repos/acme/config-test/vulnerability-alerts") exit 0 ;;
  "api repos/acme/config-test") echo '{"private":true,"has_wiki":false,"has_projects":false,"has_issues":true,"allow_merge_commit":false,"allow_rebase_merge":false,"allow_squash_merge":true,"delete_branch_on_merge":true,"allow_update_branch":true}' ;;
  *) exit 0 ;;
esac
`
  )
  chmodSync(gh, 0o755)
  return { ...process.env, PATH: `${bin}:${process.env.PATH ?? ''}` }
}

function prepareConformFixture(initial: string | null): { dir: string; env: NodeJS.ProcessEnv } {
  const dir = fixture(initial)
  execFileSync('git', ['init', '-q', dir])
  execFileSync('git', ['-C', dir, 'remote', 'add', 'origin', 'git@github.com:acme/config-test.git'])
  return { dir, env: fakeGh(dir) }
}

const templateRun = run(AUDIT, ['--init'])
const template = templateRun.out
check('audit --init exits cleanly', templateRun.code === 0)

// Missing file: the owner emits the complete canonical template.
const missing = fixture(null)
try {
  const result = runInit(missing)
  const actual = readFileSync(join(missing, '.ki-config.toml'), 'utf8')
  check('INIT missing file exits cleanly', result.code === 0)
  check('INIT missing file matches audit --init byte-for-byte', actual === template)
  check('canonical template has exactly one [ki-repo] root', rootCount(actual, 'ki-repo') === 1)
  check('canonical template has exactly one [ki-authoring] root', rootCount(actual, 'ki-authoring') === 1)
} finally {
  rmSync(missing, { recursive: true, force: true })
}

// Both partial directions preserve the existing file byte-for-byte as a prefix.
const authoringOnlyText = '# keep this comment and ordering\r\n[ki-authoring]\r\ncustom = "untouched"'
const authoringOnly = fixture(authoringOnlyText)
try {
  const result = runInit(authoringOnly)
  const actual = readFileSync(join(authoringOnly, '.ki-config.toml'), 'utf8')
  check('INIT authoring-only exits cleanly', result.code === 0)
  check('INIT authoring-only preserves every existing byte as prefix', actual.startsWith(authoringOnlyText))
  check('INIT authoring-only appends one repo root', rootCount(actual, 'ki-repo') === 1)
  check('INIT authoring-only does not duplicate authoring root', rootCount(actual, 'ki-authoring') === 1)
} finally {
  rmSync(authoringOnly, { recursive: true, force: true })
}

const repoOnlyText = '# keep repo values\n[ki-repo]\nvisibility = "public"\nlicense = "Apache-2.0"\n'
const repoOnly = fixture(repoOnlyText)
try {
  const result = runInit(repoOnly)
  const actual = readFileSync(join(repoOnly, '.ki-config.toml'), 'utf8')
  check('INIT repo-only exits cleanly', result.code === 0)
  check('INIT repo-only preserves every existing byte as prefix', actual.startsWith(repoOnlyText))
  check('INIT repo-only does not duplicate repo root', rootCount(actual, 'ki-repo') === 1)
  check('INIT repo-only appends one authoring root', rootCount(actual, 'ki-authoring') === 1)
} finally {
  rmSync(repoOnly, { recursive: true, force: true })
}

// A dotted subtable is not the required parent marker, and a second run is inert.
const subtableText = '# subtable is not the root\n[ki-repo.checks]\nwiki = false'
const subtable = fixture(subtableText)
try {
  const first = runInit(subtable)
  const afterFirst = readFileSync(join(subtable, '.ki-config.toml'), 'utf8')
  const second = runInit(subtable)
  const afterSecond = readFileSync(join(subtable, '.ki-config.toml'), 'utf8')
  check('INIT subtable-only exits cleanly', first.code === 0)
  check('INIT subtable-only preserves every existing byte as prefix', afterFirst.startsWith(subtableText))
  check('INIT subtable-only appends the exact repo root', rootCount(afterFirst, 'ki-repo') === 1)
  check('INIT is idempotent', second.code === 0 && afterSecond === afterFirst)
} finally {
  rmSync(subtable, { recursive: true, force: true })
}

const multilineLookalikes = `[ki-repo.checks]
note = """
[ki-repo]
[ki-authoring]
"""
`
const multiline = fixture(multilineLookalikes)
try {
  const first = runInit(multiline)
  const afterFirst = readFileSync(join(multiline, '.ki-config.toml'), 'utf8')
  const second = runInit(multiline)
  const afterSecond = readFileSync(join(multiline, '.ki-config.toml'), 'utf8')
  check('INIT multiline lookalikes → exits cleanly', first.code === 0)
  check('INIT multiline lookalikes → preserves the string bytes as prefix', afterFirst.startsWith(multilineLookalikes))
  check(
    'INIT multiline lookalikes → appends real roots after the string closes',
    afterFirst.lastIndexOf('[ki-repo]') > afterFirst.lastIndexOf('"""')
  )
  check('INIT multiline lookalikes → second run is byte-identical', second.code === 0 && afterSecond === afterFirst)
} finally {
  rmSync(multiline, { recursive: true, force: true })
}

const quotedRootsText = '["ki-repo"]\nvisibility = "private"\n["ki-authoring"]\n'
const quotedRoots = fixture(quotedRootsText)
try {
  const result = runInit(quotedRoots)
  check('INIT quoted exact roots → exits cleanly', result.code === 0)
  check(
    'INIT quoted exact roots → recognised without a rewrite',
    readFileSync(join(quotedRoots, '.ki-config.toml'), 'utf8') === quotedRootsText
  )
} finally {
  rmSync(quotedRoots, { recursive: true, force: true })
}

const dry = fixture(null)
try {
  const result = runInit(dry, true)
  check('INIT dry-run exits cleanly', result.code === 0)
  check('INIT dry-run reports both missing roots', result.out.includes('[ki-repo]') && result.out.includes('[ki-authoring]'))
  check('INIT dry-run does not write config', !existsSync(join(dry, '.ki-config.toml')))
} finally {
  rmSync(dry, { recursive: true, force: true })
}

// CONFORM uses the same template and repairs each partial direction. GitHub is a
// deterministic local stub so the real conform CLI can reach its scaffold leg.
const conformMissing = prepareConformFixture(null)
try {
  const result = run(CONFORM, [conformMissing.dir], conformMissing.env)
  const actual = readFileSync(join(conformMissing.dir, '.ki-config.toml'), 'utf8')
  check('CONFORM missing file exits cleanly', result.code === 0)
  check('CONFORM missing file matches audit --init byte-for-byte', actual === template)
} finally {
  rmSync(conformMissing.dir, { recursive: true, force: true })
}

// Local FILES-1/FILES-3 convergence is independent of GitHub. These fixtures are
// not git repos and have no remote; CONFORM may still stop before its live layer,
// but the local config repair must already be complete.
const localConformMissing = fixture(null)
try {
  run(CONFORM, [localConformMissing])
  const actual = readFileSync(join(localConformMissing, '.ki-config.toml'), 'utf8')
  check('CONFORM without a remote repairs a missing config', actual === template)
} finally {
  rmSync(localConformMissing, { recursive: true, force: true })
}

const localConformPartial = fixture(authoringOnlyText)
try {
  run(CONFORM, [localConformPartial])
  const actual = readFileSync(join(localConformPartial, '.ki-config.toml'), 'utf8')
  check('CONFORM without a remote preserves partial config bytes', actual.startsWith(authoringOnlyText))
  check(
    'CONFORM without a remote appends only the missing root',
    rootCount(actual, 'ki-repo') === 1 && rootCount(actual, 'ki-authoring') === 1
  )
} finally {
  rmSync(localConformPartial, { recursive: true, force: true })
}

const localConformDry = fixture(null)
try {
  run(CONFORM, [localConformDry, '--dry-run'])
  check('CONFORM without a remote keeps dry-run no-write', !existsSync(join(localConformDry, '.ki-config.toml')))
} finally {
  rmSync(localConformDry, { recursive: true, force: true })
}

const conformDry = prepareConformFixture(null)
try {
  const result = run(CONFORM, [conformDry.dir, '--dry-run'], conformDry.env)
  check('CONFORM dry-run exits cleanly', result.code === 0)
  check('CONFORM dry-run does not write config', !existsSync(join(conformDry.dir, '.ki-config.toml')))
} finally {
  rmSync(conformDry.dir, { recursive: true, force: true })
}

const conformAuthoring = prepareConformFixture(authoringOnlyText)
try {
  const result = run(CONFORM, [conformAuthoring.dir], conformAuthoring.env)
  const actual = readFileSync(join(conformAuthoring.dir, '.ki-config.toml'), 'utf8')
  check('CONFORM authoring-only exits cleanly', result.code === 0)
  check('CONFORM authoring-only preserves existing bytes', actual.startsWith(authoringOnlyText))
  check('CONFORM authoring-only appends only the repo root', rootCount(actual, 'ki-repo') === 1 && rootCount(actual, 'ki-authoring') === 1)
} finally {
  rmSync(conformAuthoring.dir, { recursive: true, force: true })
}

const conformRepo = prepareConformFixture(repoOnlyText)
try {
  const result = run(CONFORM, [conformRepo.dir], conformRepo.env)
  const actual = readFileSync(join(conformRepo.dir, '.ki-config.toml'), 'utf8')
  check('CONFORM repo-only exits cleanly', result.code === 0)
  check('CONFORM repo-only preserves existing bytes', actual.startsWith(repoOnlyText))
  check('CONFORM repo-only appends only the authoring root', rootCount(actual, 'ki-repo') === 1 && rootCount(actual, 'ki-authoring') === 1)
} finally {
  rmSync(conformRepo.dir, { recursive: true, force: true })
}

if (failed) {
  console.log('\n\x1b[31minit.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32minit.test.ts: all checks passed\x1b[0m')
