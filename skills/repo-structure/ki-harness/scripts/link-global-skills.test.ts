#!/usr/bin/env bun
/** Regression tests for the explicit harness-author global development links. */

import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readlinkSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'link-global-skills.ts')
const ROOT = resolve(dirname(SCRIPT), '..', '..', '..', '..')
const SKILLS = ['ki-bootstrap', 'ki-delegate', 'ki-next', 'ki-plan', 'ki-recap', 'ki-repo-review']

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function run(args: string[]): { status: number; stdout: string; stderr: string } {
  const result = spawnSync('bun', [SCRIPT, ...args], { encoding: 'utf8' })
  return { status: result.status ?? 1, stdout: result.stdout, stderr: result.stderr }
}

const home = mkdtempSync(join(tmpdir(), 'ki-global-links-'))
try {
  const help = run(['--help'])
  check(
    'help exits cleanly and describes the command',
    help.status === 0 && help.stdout.includes('Usage: bun scripts/link-global-skills.ts')
  )

  mkdirSync(join(home, '.claude', 'skills'), { recursive: true })
  for (const skill of SKILLS) {
    const destination = join(home, '.claude', 'skills', skill)
    mkdirSync(destination)
    writeFileSync(join(destination, '.ki-user-installed-skill.json'), `${JSON.stringify({ skill })}\n`)
  }

  const linked = run(['--home', home])
  check('detected Claude runtime links the global development set', linked.status === 0)
  for (const skill of SKILLS) {
    const destination = join(home, '.claude', 'skills', skill)
    check(`${skill} replaces the managed copy with a link`, lstatSync(destination).isSymbolicLink())
    check(`${skill} targets this harness checkout`, resolve(dirname(destination), readlinkSync(destination)).startsWith(ROOT))
  }
  check('default detection does not create an absent Agents runtime', !existsSync(join(home, '.agents')))

  const absentForcedCheck = run(['--home', home, '--runtime', 'codex', '--check'])
  check('forced check does not create an absent runtime', absentForcedCheck.status !== 0 && !existsSync(join(home, '.agents')))

  const checked = run(['--home', home, '--check'])
  check('check verifies the linked development set without writing', checked.status === 0)

  const forced = run(['--home', home, '--runtime', 'codex'])
  check('explicit runtime can create and link the Agents/Codex runtime', forced.status === 0)
  check('forced Codex runtime links ki-next', lstatSync(join(home, '.agents', 'skills', 'ki-next')).isSymbolicLink())

  rmSync(join(home, '.claude', 'skills', 'ki-plan'))
  const missing = run(['--home', home, '--check'])
  check('check fails when a required link is missing', missing.status !== 0 && missing.stderr.includes('missing development link'))

  mkdirSync(join(home, '.claude', 'skills', 'ki-plan'))
  writeFileSync(join(home, '.claude', 'skills', 'ki-plan', 'local.txt'), 'do not replace\n')
  const unmanaged = run(['--home', home])
  check(
    'linking refuses an unmanaged regular payload',
    unmanaged.status !== 0 && unmanaged.stderr.includes('unmanaged global skill payload')
  )
} finally {
  rmSync(home, { recursive: true, force: true })
}

if (failed) process.exit(1)
console.log('\n\x1b[32mlink-global-skills.test.ts: all checks passed\x1b[0m')
