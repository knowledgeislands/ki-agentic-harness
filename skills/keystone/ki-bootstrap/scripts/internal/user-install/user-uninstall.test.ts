#!/usr/bin/env bun
import { spawnSync } from 'node:child_process'
/** Focused safety checks for user-scoped Knowledge Islands UNINSTALL. */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const harness = resolve(scripts, '../../../../../..')
const install = join(scripts, 'user-install.ts')
const uninstall = join(scripts, '..', '..', 'user-uninstall.ts')
const skills = join(harness, 'skills')
const hooks = join(harness, 'hooks')
const core = ['ki-bootstrap', 'ki-delegate', 'ki-next', 'ki-plan', 'ki-recap', 'ki-repo-review']
let failed = false

function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function run(script: string, home: string, args: string[] = []): ReturnType<typeof spawnSync> {
  const installArgs = script === install ? ['--source', skills, '--hooks-source', hooks, '--home', home] : ['--home', home]
  return spawnSync('bun', [script, ...installArgs, ...args], { encoding: 'utf8' })
}

function homeFixture(): string {
  const home = mkdtempSync(join(tmpdir(), 'ki-user-uninstall-'))
  mkdirSync(join(home, '.claude'))
  mkdirSync(join(home, '.agents'))
  return home
}

const healthy = homeFixture()
try {
  writeFileSync(join(healthy, '.claude', 'settings.json'), '{"preserve":true}\n')
  check('user UNINSTALL fixture install succeeds', run(install, healthy).status === 0)
  const dryRun = run(uninstall, healthy, ['--dry-run'])
  check(
    'user UNINSTALL dry-run reports owned material and writes nothing',
    dryRun.status === 0 &&
      dryRun.stdout.includes('.claude/skills/ki-bootstrap') &&
      existsSync(join(healthy, '.claude', 'skills', 'ki-bootstrap')) &&
      existsSync(join(healthy, '.claude', 'hooks', 'knowledgeislands', 'ki-agentic-harness'))
  )
  check(
    'user UNINSTALL removes only managed global skills and the dedicated hook namespace',
    run(uninstall, healthy).status === 0 &&
      [join(healthy, '.claude', 'skills'), join(healthy, '.agents', 'skills')].every((root) =>
        core.every((skill) => !existsSync(join(root, skill)))
      ) &&
      !existsSync(join(healthy, '.claude', 'hooks', 'knowledgeislands', 'ki-agentic-harness'))
  )
  check(
    'user UNINSTALL preserves Claude settings',
    readFileSync(join(healthy, '.claude', 'settings.json'), 'utf8') === '{"preserve":true}\n'
  )
  check('user UNINSTALL is repeat-safe after a successful removal', run(uninstall, healthy).status === 0)
} finally {
  rmSync(healthy, { recursive: true, force: true })
}

const altered = homeFixture()
try {
  check('altered user UNINSTALL fixture install succeeds', run(install, altered).status === 0)
  const payload = join(altered, '.agents', 'skills', 'ki-next', 'SKILL.md')
  writeFileSync(payload, `${readFileSync(payload, 'utf8')}\nlocal change\n`)
  check('user UNINSTALL refuses an altered managed payload', run(uninstall, altered).status !== 0)
  check(
    'user UNINSTALL refusal preserves the selected user footprint',
    existsSync(payload) &&
      existsSync(join(altered, '.claude', 'skills', 'ki-bootstrap')) &&
      existsSync(join(altered, '.claude', 'hooks', 'knowledgeislands', 'ki-agentic-harness'))
  )
} finally {
  rmSync(altered, { recursive: true, force: true })
}

const linked = homeFixture()
const outside = mkdtempSync(join(tmpdir(), 'ki-user-uninstall-outside-'))
try {
  check('linked user UNINSTALL fixture install succeeds', run(install, linked).status === 0)
  writeFileSync(join(outside, 'sentinel'), 'outside\n')
  rmSync(join(linked, '.agents'), { recursive: true, force: true })
  symlinkSync(outside, join(linked, '.agents'))
  check('user UNINSTALL refuses a symlinked runtime parent', run(uninstall, linked, ['--runtime', 'codex']).status !== 0)
  check('user UNINSTALL never traverses a symlinked runtime parent', readFileSync(join(outside, 'sentinel'), 'utf8') === 'outside\n')
} finally {
  rmSync(linked, { recursive: true, force: true })
  rmSync(outside, { recursive: true, force: true })
}

if (failed) process.exit(1)
console.log('\n\x1b[32muser-uninstall.test.ts: all checks passed\x1b[0m')
