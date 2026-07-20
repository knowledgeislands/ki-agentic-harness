#!/usr/bin/env bun

import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const harness = resolve(scripts, '../../../../../..')
const installer = join(scripts, 'user-install.ts')
const skills = join(harness, 'skills')
const hooks = join(harness, 'hooks')
const core = ['ki-bootstrap', 'ki-delegate', 'ki-next', 'ki-plan', 'ki-recap']
const fixture = mkdtempSync(join(tmpdir(), 'ki-user-install-'))
const home = join(fixture, 'home')
let failed = false

function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function run(...args: string[]): ReturnType<typeof spawnSync> {
  return runFor(home, ...args)
}

function runFor(targetHome: string, ...args: string[]): ReturnType<typeof spawnSync> {
  return spawnSync('bun', [installer, '--source', skills, '--hooks-source', hooks, '--home', targetHome, ...args], {
    encoding: 'utf8'
  })
}

function runCodex(...args: string[]): ReturnType<typeof spawnSync> {
  return run('--runtime', 'codex', ...args)
}

try {
  mkdirSync(home)
  mkdirSync(join(home, '.claude'))
  mkdirSync(join(home, '.agents'))
  const first = run()
  const codexTarget = join(home, '.agents', 'skills')
  const claudeTarget = join(home, '.claude', 'skills')
  check(
    'installs the core process skill set for every detected runtime by default',
    first.status === 0 && [claudeTarget, codexTarget].every((target) => core.every((skill) => existsSync(join(target, skill, 'SKILL.md'))))
  )
  check(
    'uses copied regular directories, not links',
    [claudeTarget, codexTarget].every((target) =>
      core.every((skill) => {
        const entry = lstatSync(join(target, skill))
        return entry.isDirectory() && !entry.isSymbolicLink()
      })
    )
  )
  check(
    'dereferences source-owned shared-module links into regular copied files',
    [claudeTarget, codexTarget].every((target) => {
      const entry = lstatSync(join(target, 'ki-bootstrap', 'scripts', 'vendored', 'ki-skills', 'checker.ts'))
      return entry.isFile() && !entry.isSymbolicLink()
    })
  )
  check(
    'writes an owned integrity marker for every copied skill',
    [claudeTarget, codexTarget].every((target) =>
      core.every((skill) => {
        const marker = JSON.parse(readFileSync(join(target, skill, '.ki-user-installed-skill.json'), 'utf8')) as Record<string, unknown>
        return marker.schema === 1 && marker.skill === skill && typeof marker.integrity === 'string'
      })
    )
  )
  check('check confirms a current copied installation', run('--check').status === 0)
  check('reinstalling is idempotent', run().status === 0)

  const codexOnlyHome = join(fixture, 'codex-only')
  mkdirSync(codexOnlyHome)
  mkdirSync(join(codexOnlyHome, '.agents'))
  check(
    'installs only into the runtime directories detected below the user home',
    runFor(codexOnlyHome).status === 0 &&
      core.every((skill) => existsSync(join(codexOnlyHome, '.agents', 'skills', skill, 'SKILL.md'))) &&
      !existsSync(join(codexOnlyHome, '.claude', 'skills'))
  )
  const noRuntimeHome = join(fixture, 'no-runtime')
  mkdirSync(noRuntimeHome)
  check('requires an explicit runtime when no supported runtime directory is present', runFor(noRuntimeHome).status !== 0)

  rmSync(join(codexTarget, 'ki-next'), { recursive: true, force: true })
  symlinkSync(join(skills, 'process', 'ki-next'), join(codexTarget, 'ki-next'), 'dir')
  check(
    'migrates a deliberate legacy development link to a copy',
    runCodex().status === 0 && !lstatSync(join(codexTarget, 'ki-next')).isSymbolicLink()
  )

  rmSync(join(codexTarget, 'ki-plan'), { recursive: true, force: true })
  writeFileSync(join(codexTarget, 'ki-plan'), 'unmanaged')
  check('refuses to replace an unmanaged global payload', runCodex().status !== 0)
} finally {
  rmSync(fixture, { recursive: true, force: true })
}

if (failed) process.exit(1)
console.log('\n\x1b[32muser-install.test.ts: all checks passed\x1b[0m')
