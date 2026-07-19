#!/usr/bin/env bun
/** Focused safety tests for ki-engineering CONFORM. */
import { spawnSync } from 'node:child_process'
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runChecker } from './vendored/ki-skills/checker.ts'
import type { RubricDefinition } from './vendored/ki-skills/rubric.ts'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'conform.ts')
let failed = false
const check = (label: string, condition: boolean): void => {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

const fixture = ({ biomeRepair = false }: { biomeRepair?: boolean } = {}): string => {
  const dir = mkdtempSync(join(tmpdir(), 'ki-engineering-conform-'))
  const bin = join(dir, '.fake-bin')
  mkdirSync(bin)
  for (const command of ['bun', 'bunx']) {
    const path = join(bin, command)
    const body =
      command === 'bunx' && biomeRepair
        ? '#!/bin/sh\nif [ "$1" = "@biomejs/biome" ] && [ "$2" = "check" ] && [ "$3" != "--write" ]; then exit 1; fi\nif [ "$1" = "@biomejs/biome" ] && [ "$2" = "check" ] && [ "$3" = "--write" ]; then printf "fixed\\n" > "$PWD/biome-fixed.txt"; fi\nexit 0\n'
        : '#!/bin/sh\nexit 0\n'
    writeFileSync(path, body)
    chmodSync(path, 0o755)
  }
  writeFileSync(join(dir, 'package.json'), '{"name":"fixture","version":"0.0.0","scripts":{},"devDependencies":{}}\n')
  return dir
}

const run = (dir: string, args: readonly string[] = []) =>
  spawnSync(process.execPath, [SCRIPT, dir, ...args], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${join(dir, '.fake-bin')}:${process.env.PATH ?? ''}` }
  })

{
  const dir = fixture()
  try {
    const before = readFileSync(join(dir, 'package.json'), 'utf8')
    const result = spawnSync(process.execPath, [SCRIPT, '--help'], { encoding: 'utf8' })
    check('help exits zero', result.status === 0)
    check(
      'help does not write target files',
      readFileSync(join(dir, 'package.json'), 'utf8') === before && !existsSync(join(dir, 'mise.toml'))
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

{
  const dir = fixture()
  try {
    const before = readFileSync(join(dir, 'package.json'), 'utf8')
    const result = run(dir, ['--dry-run'])
    check('dry-run may report residual findings without writing', result.status === 0 || result.status === 1)
    check('dry-run reports planned fixes', (result.stdout ?? '').includes('"level":"FIXED"'))
    check(
      'dry-run preserves package bytes and avoids scaffolds',
      readFileSync(join(dir, 'package.json'), 'utf8') === before && !existsSync(join(dir, 'mise.toml'))
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

{
  const dir = fixture()
  try {
    const first = run(dir)
    const packageAfterFirst = readFileSync(join(dir, 'package.json'), 'utf8')
    const second = run(dir)
    check('live conform tolerates expected checker status', first.status === 0 || first.status === 1)
    check(
      'live conform performs safe local scaffolds',
      existsSync(join(dir, 'mise.toml')) &&
        existsSync(join(dir, 'tsconfig.json')) &&
        existsSync(join(dir, 'biome.json')) &&
        existsSync(join(dir, 'knip.json'))
    )
    check('live conform normalises package metadata', packageAfterFirst.includes('"type": "module"'))
    check(
      'second conform is idempotent for package bytes',
      readFileSync(join(dir, 'package.json'), 'utf8') === packageAfterFirst && (second.status === 0 || second.status === 1)
    )
    check('second conform does not claim clean write tools fixed files', !(second.stdout ?? '').includes('changed target files'))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

{
  const dir = fixture({ biomeRepair: true })
  try {
    const result = run(dir)
    check(
      'a write tool that changes a target is reported FIXED',
      (result.stdout ?? '').includes('biome check --write changed target files')
    )
    check('the reported write-tool change exists', readFileSync(join(dir, 'biome-fixed.txt'), 'utf8') === 'fixed\n')
    check(
      'a successful no-op write tool is reported PASS',
      (result.stdout ?? '').includes('biome format --write completed without target changes')
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

{
  let factoryCalls = 0
  const invalid = {
    name: 'invalid',
    concern: 'invalid',
    families: [
      {
        code: 'BAD',
        title: 'bad',
        description: 'bad',
        standard: 'standards.md',
        selectContext: (value: object) => value,
        items: [
          {
            code: 'BAD-1',
            title: 'bad',
            description: 'bad',
            sources: ['standards.md'],
            mechanical: { level: 'FAIL', audit: { phase: 'INVALID', run: () => [{ status: 'PASS', message: 'nope' }] } }
          }
        ]
      }
    ]
  } as unknown as RubricDefinition<object>
  try {
    runChecker({
      mode: 'conform',
      concern: 'invalid',
      target: '.',
      rubric: invalid,
      subjects: [
        {
          familyCodes: ['BAD'],
          context: () => {
            factoryCalls++
            return {}
          }
        }
      ]
    })
  } catch {
    // Catalogue validation must fail before any context (and therefore any write capability) is created.
  }
  check('invalid rubric phase prevents context factory execution', factoryCalls === 0)
}

if (failed) process.exit(1)
console.log('\n\x1b[32mconform.test.ts: all checks passed\x1b[0m')
