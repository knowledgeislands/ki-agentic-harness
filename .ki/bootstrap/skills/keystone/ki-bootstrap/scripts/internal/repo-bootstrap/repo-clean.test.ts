#!/usr/bin/env bun
/** Focused lifecycle and safety checks for source-owned repository CLEAN. */
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const bootstrap = join(scripts, 'repo-bootstrap.ts')
const clean = join(scripts, '..', '..', 'clean.ts')
const config = '[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n'

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function fixture(): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'ki-bootstrap-clean-')))
  writeFileSync(join(root, '.ki-config.toml'), config)
  return root
}

function writeLegacyKiSelf(root: string): string {
  const source = join(root, '.ki-self', 'SKILL.md')
  mkdirSync(dirname(source), { recursive: true })
  writeFileSync(source, ['---', 'name: ki-self', 'description: Local concerns.', '---', '', '# KI Self', ''].join('\n'))
  return source
}

function run(command: string, args: string[], root: string, env: Record<string, string> = {}): ReturnType<typeof spawnSync> {
  return spawnSync(command, args, { cwd: root, encoding: 'utf8', env: { ...process.env, ...env } })
}

function educate(root: string): ReturnType<typeof spawnSync> {
  return run('bun', [bootstrap, root], root)
}

function runClean(root: string, args: string[] = [], env: Record<string, string> = {}): ReturnType<typeof spawnSync> {
  return run('bun', [clean, root, ...args], root, env)
}

function snapshot(root: string): string {
  const rows: string[] = []
  const visit = (directory: string): void => {
    for (const name of readdirSync(directory).sort()) {
      const path = join(directory, name)
      const rel = relative(root, path)
      const stat = lstatSync(path)
      if (stat.isSymbolicLink()) rows.push(`l:${rel}`)
      else if (stat.isDirectory()) {
        rows.push(`d:${rel}`)
        visit(path)
      } else rows.push(`f:${rel}:${readFileSync(path).toString('base64')}`)
    }
  }
  visit(root)
  return rows.join('\n')
}

const ordinary = fixture()
try {
  check('fixture EDUCATE succeeds', educate(ordinary).status === 0)
  const beforeDryRun = snapshot(ordinary)
  const dryRun = runClean(ordinary, ['--dry-run'])
  check('CLEAN dry-run succeeds and reports generated state', dryRun.status === 0 && dryRun.stdout.includes('.ki/bootstrap'))
  check('CLEAN dry-run leaves every byte unchanged', snapshot(ordinary) === beforeDryRun)
  check(
    'CLEAN removes manifest-owned output and regular runtime copies',
    runClean(ordinary).status === 0 &&
      !existsSync(join(ordinary, '.ki', 'bootstrap')) &&
      !existsSync(join(ordinary, '.ki', 'manifest.json'))
  )
  check(
    'CLEAN removes every unchanged generated runtime copy',
    !existsSync(join(ordinary, '.claude', 'skills', 'ki-repo')) && !existsSync(join(ordinary, '.agents', 'skills', 'ki-repo'))
  )
  const afterClean = snapshot(ordinary)
  check('CLEAN is repeat-safe', runClean(ordinary).status === 0 && snapshot(ordinary) === afterClean)
  check(
    'EDUCATE after CLEAN restores a governed footprint',
    educate(ordinary).status === 0 &&
      existsSync(join(ordinary, '.ki', 'manifest.json')) &&
      existsSync(join(ordinary, '.claude', 'skills', 'ki-repo'))
  )
} finally {
  rmSync(ordinary, { recursive: true, force: true })
}

const altered = fixture()
try {
  check('altered fixture EDUCATE succeeds', educate(altered).status === 0)
  const payload = join(altered, '.claude', 'skills', 'ki-repo', 'SKILL.md')
  writeFileSync(payload, `${readFileSync(payload, 'utf8')}\nlocal change\n`)
  check(
    'CLEAN preserves changed runtime payloads',
    runClean(altered).status === 0 && readFileSync(payload, 'utf8').includes('local change')
  )
  check('CLEAN still removes separately proven .ki output', !existsSync(join(altered, '.ki', 'bootstrap')))
} finally {
  rmSync(altered, { recursive: true, force: true })
}

const localSelf = fixture()
try {
  const legacy = writeLegacyKiSelf(localSelf)
  const source = join(localSelf, '.ki', 'self', 'skill', 'SKILL.md')
  check('local ki-self fixture EDUCATE succeeds', educate(localSelf).status === 0)
  const claudeProjection = join(localSelf, '.claude', 'skills', 'ki-self')
  const codexProjection = join(localSelf, '.agents', 'skills', 'ki-self')
  check(
    'CLEAN fixture projects local ki-self into both runtimes',
    lstatSync(claudeProjection).isSymbolicLink() && lstatSync(codexProjection).isSymbolicLink()
  )
  check(
    'CLEAN migrates and preserves the local ki-self source and projections',
    runClean(localSelf).status === 0 &&
      existsSync(source) &&
      !existsSync(legacy) &&
      lstatSync(claudeProjection).isSymbolicLink() &&
      lstatSync(codexProjection).isSymbolicLink()
  )
} finally {
  rmSync(localSelf, { recursive: true, force: true })
}

const duplicatedLocalSelf = fixture()
try {
  const legacy = writeLegacyKiSelf(duplicatedLocalSelf)
  const canonical = join(duplicatedLocalSelf, '.ki', 'self', 'skill', 'SKILL.md')
  mkdirSync(dirname(canonical), { recursive: true })
  writeFileSync(canonical, readFileSync(legacy, 'utf8'))
  check(
    'EDUCATE prunes a matching legacy ki-self duplicate after rebasing projections',
    educate(duplicatedLocalSelf).status === 0 && existsSync(canonical) && !existsSync(legacy)
  )
} finally {
  rmSync(duplicatedLocalSelf, { recursive: true, force: true })
}

const linked = fixture()
const outside = realpathSync(mkdtempSync(join(tmpdir(), 'ki-bootstrap-clean-outside-')))
try {
  check('linked fixture EDUCATE succeeds', educate(linked).status === 0)
  const payload = join(linked, '.claude', 'skills', 'ki-repo')
  writeFileSync(join(outside, 'sentinel'), 'outside\n')
  rmSync(payload, { recursive: true })
  symlinkSync(outside, payload)
  check('CLEAN preserves an explicit runtime link', runClean(linked).status === 0 && lstatSync(payload).isSymbolicLink())
  check('CLEAN never follows a preserved runtime link', readFileSync(join(outside, 'sentinel'), 'utf8') === 'outside\n')
} finally {
  rmSync(linked, { recursive: true, force: true })
  rmSync(outside, { recursive: true, force: true })
}

const unfamiliarGeneratedState = fixture()
try {
  check('unfamiliar generated-state fixture EDUCATE succeeds', educate(unfamiliarGeneratedState).status === 0)
  writeFileSync(join(unfamiliarGeneratedState, '.ki', 'bootstrap', 'authored-note'), 'preserve\n')
  const before = snapshot(unfamiliarGeneratedState)
  check('CLEAN refuses generated state with unfamiliar content', runClean(unfamiliarGeneratedState).status !== 0)
  check('CLEAN refusal leaves generated state untouched', snapshot(unfamiliarGeneratedState) === before)
} finally {
  rmSync(unfamiliarGeneratedState, { recursive: true, force: true })
}

const raced = fixture()
try {
  check('concurrent-mutation fixture EDUCATE succeeds', educate(raced).status === 0)
  const result = runClean(raced, [], { NODE_ENV: 'test', KI_BOOTSTRAP_TEST_CLEAN_MUTATE: '1' })
  check('CLEAN detects a mutation before deletion', result.status !== 0 && existsSync(join(raced, '.ki', 'manifest.json')))
  check('CLEAN preserves runtime copies when a concurrent mutation is detected', existsSync(join(raced, '.claude', 'skills', 'ki-repo')))
} finally {
  rmSync(raced, { recursive: true, force: true })
}

if (failed) process.exit(1)
console.log('\n\x1b[32mrepo-clean.test.ts: all checks passed\x1b[0m')
