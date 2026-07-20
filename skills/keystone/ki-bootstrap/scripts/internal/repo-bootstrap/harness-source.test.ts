#!/usr/bin/env bun
/** Focused provenance regressions for same-root harness source resolution. */
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { nearestHarnessSource, resolveHarnessSource, sourceHarnessSkill } from './harness-source.ts'

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function harness(root: string): void {
  mkdirSync(join(root, 'skills'), { recursive: true })
  writeFileSync(join(root, '.ki-config.toml'), '[ki-harness]\n')
}

function skill(root: string, cluster: string, name: string): string {
  const directory = join(root, 'skills', cluster, name)
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'SKILL.md'), `---\nname: ${name}\ndescription: fixture.\n---\n`)
  return directory
}

function rejects(action: () => unknown): boolean {
  try {
    action()
    return false
  } catch {
    return true
  }
}

const fixture = realpathSync(mkdtempSync(join(tmpdir(), 'ki-harness-source-')))
try {
  harness(fixture)
  const outerProvider = skill(fixture, 'outer', 'ki-provider')
  const outerConsumer = skill(fixture, 'outer', 'ki-consumer')
  const nested = join(fixture, 'skills', 'outer', 'nested')
  harness(nested)
  const nestedConsumer = skill(nested, 'inner', 'ki-consumer')
  const nestedProvider = skill(nested, 'inner', 'ki-provider')

  const outer = nearestHarnessSource(outerConsumer)
  const inner = nearestHarnessSource(nestedConsumer)
  check('nearest physical root → outer consumer uses outer harness', outer?.root === fixture)
  check('nested physical root → closest regular config wins', inner?.root === nested)
  check(
    'same root → provider resolves from the consumer harness',
    outer?.root === fixture && sourceHarnessSkill(outer, 'ki-provider') === outerProvider
  )
  check(
    'nested root → provider resolves from nested harness',
    inner?.root === nested && sourceHarnessSkill(inner, 'ki-provider') === nestedProvider
  )

  const missing = join(fixture, 'skills', 'outer', 'missing')
  mkdirSync(missing)
  writeFileSync(join(missing, 'SKILL.md'), '---\nname: ki-missing\n---\n')
  check(
    'missing provider → rejects without global fallback',
    outer?.root === fixture && rejects(() => sourceHarnessSkill(outer, 'ki-not-present'))
  )

  const duplicate = join(fixture, 'skills', 'duplicate', 'ki-provider')
  mkdirSync(duplicate, { recursive: true })
  writeFileSync(join(duplicate, 'SKILL.md'), '---\nname: ki-provider\n---\n')
  check(
    'duplicate canonical identity → source harness rejects',
    rejects(() => resolveHarnessSource(fixture))
  )
  rmSync(join(fixture, 'skills', 'duplicate'), { recursive: true })

  const outside = mkdtempSync(join(tmpdir(), 'ki-harness-source-outside-'))
  try {
    skill(outside, 'outside', 'ki-escape')
    symlinkSync(join(outside, 'skills', 'outside', 'ki-escape'), join(fixture, 'skills', 'outer', 'ki-escape'))
    const refreshed = resolveHarnessSource(fixture)
    check(
      'symlinked canonical source → unavailable, never followed',
      rejects(() => sourceHarnessSkill(refreshed, 'ki-escape'))
    )
  } finally {
    rmSync(outside, { recursive: true, force: true })
  }
} finally {
  rmSync(fixture, { recursive: true, force: true })
}

if (failed) process.exit(1)
console.log('harness-source.test.ts: all checks passed')
