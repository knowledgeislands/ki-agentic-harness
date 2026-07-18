#!/usr/bin/env bun

import { spawnSync } from 'node:child_process'
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const root = resolve(scripts, '../../../..')
const bootstrap = join(scripts, 'lib', 'repo-bootstrap.ts')
const engineeringConform = join(root, 'skills/foundations/ki-engineering/scripts/conform.ts')
const fixture = realpathSync(mkdtempSync(join(tmpdir(), 'ki-entrypoint-parity-')))
let failed = false

type Run = { status: number | null; stdout: string; stderr: string }

function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function canonicalScript(key: 'ki:audit' | 'ki:conform'): string {
  const source = readFileSync(engineeringConform, 'utf8')
  const match = source.match(new RegExp(`'${key.replace(':', '\\:')}': '([^']+)'`))
  if (!match?.[1]) throw new Error(`could not read canonical ${key} command from ${engineeringConform}`)
  return match[1]
}

function run(command: string, args: string[], cwd: string, env: Record<string, string> = {}): Run {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env } })
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
}

function semanticOutput(output: string): string {
  return output
    .split('\n')
    .filter((line) => line.includes('(FIX-1)]') || line.includes('summary:') || line.includes('totals:'))
    .join('\n')
}

function withoutBunTransport(output: string): string {
  return output
    .split('\n')
    .filter((line) => !line.startsWith('$ bun ') && !/^error: script ".+" exited with code \d+$/.test(line))
    .join('\n')
}

function snapshot(base: string): string {
  const rows: string[] = []
  function walk(dir: string): void {
    for (const name of readdirSync(dir).sort()) {
      const path = join(dir, name)
      const rel = relative(base, path)
      const stat = statSync(path)
      if (stat.isDirectory()) {
        rows.push(`d:${rel}`)
        walk(path)
      } else rows.push(`f:${rel}:${readFileSync(path).toString('base64')}`)
    }
  }
  walk(base)
  return rows.join('\n')
}

const auditFixture = `#!/usr/bin/env bun
const rootOk = process.cwd() === process.env.KI_EXPECT_ROOT && process.argv[2] === '.'
const forcedFailure = process.env.KI_FIXTURE_FAIL === '1'
const ok = rootOk && !forcedFailure
const msg = !rootOk ? 'aggregate did not run at the repo root' : forcedFailure ? 'synthetic failure' : 'synthetic audit passed'
const run = { version: 1, runId: crypto.randomUUID(), mode: 'audit', concern: 'fixture', target: process.cwd(), generatedAt: new Date().toISOString() }
const level = ok ? 'PASS' : 'FAIL'
for (const record of [
  { ...run, record: 'meta' },
  { ...run, record: 'finding', type: 'M', level, code: 'FIX-1', message: msg, ref: 'references/rubric.md' },
  { ...run, record: 'finding', type: 'J', level: 'ADVISORY', code: 'REVIEW-1', message: 'synthetic judgment prompt', ref: 'references/rubric.md' },
  { ...run, record: 'summary', summary: { fail: ok ? 0 : 1, warn: 0, polish: 0, advisory: 1, info: 0, na: 0, pass: ok ? 1 : 0 } }
]) process.stdout.write(JSON.stringify(record) + '\\n')
process.exit(ok ? 0 : 1)
`

const conformFixture = `#!/usr/bin/env bun
import { writeFileSync } from 'node:fs'
const rootOk = process.cwd() === process.env.KI_EXPECT_ROOT && process.argv[2] === '.'
const dryRun = process.argv.includes('--dry-run')
if (!dryRun) writeFileSync('unexpected-conform-write', 'write occurred\\n')
const ok = rootOk && dryRun
const msg = !rootOk ? 'aggregate did not run at the repo root' : dryRun ? 'synthetic conform dry-run passed' : 'dry-run was not forwarded'
const run = { version: 1, runId: crypto.randomUUID(), mode: 'conform', concern: 'fixture', target: process.cwd(), generatedAt: new Date().toISOString() }
const level = ok ? 'PASS' : 'FAIL'
for (const record of [
  { ...run, record: 'meta' },
  { ...run, record: 'finding', type: 'M', level, code: 'FIX-1', message: msg, ref: 'references/rubric.md' },
  { ...run, record: 'summary', summary: { fail: ok ? 0 : 1, warn: 0, polish: 0, advisory: 0, info: 0, na: 0, pass: ok ? 1 : 0 } }
]) process.stdout.write(JSON.stringify(record) + '\\n')
process.exit(ok ? 0 : 1)
`

try {
  const bootstrapped = run('bun', [bootstrap, fixture], root)
  check('bootstrap fixture → exits cleanly', bootstrapped.status === 0)

  const fixtureSkill = join(fixture, '.ki-meta', 'checkers', 'ki-fixture', 'scripts')
  mkdirSync(fixtureSkill, { recursive: true })
  writeFileSync(join(fixtureSkill, 'audit.ts'), auditFixture)
  writeFileSync(join(fixtureSkill, 'conform.ts'), conformFixture)
  const fixtureRubric = join(fixture, '.ki-meta', 'checkers', 'ki-fixture', 'references')
  mkdirSync(fixtureRubric, { recursive: true })
  writeFileSync(join(fixtureRubric, 'rubric.md'), '- **FIX-1 [M]** Fixture health check.\n- **REVIEW-1 [J]** Fixture judgment review.\n')
  writeFileSync(
    join(fixture, '.ki-meta', 'checkers', 'ki-fixture', 'mode-elements.json'),
    JSON.stringify({
      version: 1,
      elements: [
        { id: 'audit', mode: 'audit', phase: 'inspect', entry: 'scripts/audit.ts', reads: ['fixture'], writes: [] },
        { id: 'conform', mode: 'conform', phase: 'write', entry: 'scripts/conform.ts', reads: ['fixture'], writes: ['fixture'] }
      ]
    })
  )
  chmodSync(join(fixture, '.ki-meta', 'bin', 'ki-audit'), 0o755)
  chmodSync(join(fixture, '.ki-meta', 'bin', 'ki-conform'), 0o755)

  const nested = join(fixture, 'nested', 'cwd')
  mkdirSync(nested, { recursive: true })
  const env = { KI_EXPECT_ROOT: fixture, KI_FIXTURE_FAIL: '0' }
  const auditWrapper = join(fixture, '.ki-meta', 'bin', 'ki-audit')
  const conformWrapper = join(fixture, '.ki-meta', 'bin', 'ki-conform')

  check('package-free fixture → package.json remains absent', !existsSync(join(fixture, 'package.json')))

  const wrapperPass = run(auditWrapper, [], nested, env)
  check('package-free audit wrapper → runs from a nested cwd', wrapperPass.status === 0)
  check('package-free audit wrapper → suppresses passing findings by default', !wrapperPass.stdout.includes('synthetic audit passed'))
  check('package-free audit wrapper → suppresses judgment prompts by default', !wrapperPass.stdout.includes('synthetic judgment prompt'))
  check('package-free audit wrapper → retains compact suppressed counts', wrapperPass.stdout.includes('suppressed: ADVISORY=1'))
  check(
    'package-free audit wrapper → default recap names the selected levels',
    wrapperPass.stdout.includes('no FAIL / WARN / POLISH findings')
  )

  const advisoryPass = run(auditWrapper, ['--reporter-levels=advisory'], nested, env)
  check('package-free audit wrapper → accepts a renderer-only level override', advisoryPass.status === 0)
  check('package-free audit wrapper → renders the selected judgment prompt', advisoryPass.stdout.includes('synthetic judgment prompt'))
  check('package-free audit wrapper → does not render unselected passing findings', !advisoryPass.stdout.includes('synthetic audit passed'))

  const allPass = run(auditWrapper, ['--reporter-levels=all'], nested, env)
  check(
    'package-free audit wrapper → all restores the full human report',
    allPass.status === 0 && allPass.stdout.includes('synthetic audit passed')
  )
  check('package-free audit wrapper → all includes judgment prompts', allPass.stdout.includes('synthetic judgment prompt'))
  check('package-free audit wrapper → all does not label shown levels as suppressed', allPass.stdout.includes('(all levels shown)'))

  const scopedPass = run(
    'bun',
    [join(fixture, '.ki-meta', 'bin', 'aggregate.ts'), 'audit', '--skill', 'ki-fixture', '--reporter-levels=all'],
    fixture,
    env
  )
  check(
    'aggregate scoped audit → renders only the selected checker through the standard reporter',
    scopedPass.status === 0 && scopedPass.stdout.includes('synthetic audit passed') && !scopedPass.stdout.includes('ki:authoring:audit')
  )

  const unknownScope = run('bun', [join(fixture, '.ki-meta', 'bin', 'aggregate.ts'), 'audit', '--skill', 'ki-missing'], nested, env)
  check(
    'aggregate scoped audit → rejects a missing vendored checker',
    unknownScope.status === 2 && unknownScope.stderr.includes('no vendored checker')
  )

  const invalidLevels = run(auditWrapper, ['--reporter-levels=broken'], nested, env)
  check(
    'package-free audit wrapper → rejects unknown reporter levels',
    invalidLevels.status === 2 && invalidLevels.stderr.includes('--reporter-levels accepts')
  )

  const wrapperFail = run(auditWrapper, [], nested, { ...env, KI_FIXTURE_FAIL: '1' })
  check('package-free audit wrapper → propagates checker failure', wrapperFail.status === 1)
  check('package-free audit wrapper → renders the failure finding', semanticOutput(wrapperFail.stdout).includes('synthetic failure'))

  const beforeDryRun = snapshot(fixture)
  const wrapperConform = run(conformWrapper, ['--dry-run'], nested, env)
  check('package-free conform wrapper → forwards --dry-run', wrapperConform.status === 0)
  check('package-free conform wrapper → dry-run is byte-stable', snapshot(fixture) === beforeDryRun)
  check('package-free wrappers → package.json remains absent after execution', !existsSync(join(fixture, 'package.json')))

  const packageScripts = {
    'ki:audit': canonicalScript('ki:audit'),
    'ki:conform': canonicalScript('ki:conform')
  }
  writeFileSync(join(fixture, 'package.json'), `${JSON.stringify({ private: true, scripts: packageScripts }, null, 2)}\n`)

  for (const scenario of [
    { label: 'audit pass', wrapper: auditWrapper, key: 'ki:audit', args: [] as string[], runEnv: env },
    { label: 'audit failure', wrapper: auditWrapper, key: 'ki:audit', args: [] as string[], runEnv: { ...env, KI_FIXTURE_FAIL: '1' } },
    { label: 'conform dry-run', wrapper: conformWrapper, key: 'ki:conform', args: ['--dry-run'], runEnv: env }
  ]) {
    const wrapper = run(scenario.wrapper, scenario.args, nested, scenario.runEnv)
    const packageRun = run('bun', ['run', scenario.key, ...scenario.args], fixture, scenario.runEnv)
    check(`${scenario.label} parity → exit status matches`, wrapper.status === packageRun.status)
    check(`${scenario.label} parity → aggregate stdout matches byte-for-byte`, wrapper.stdout === packageRun.stdout)
    check(
      `${scenario.label} parity → only Bun transport noise differs on stderr`,
      wrapper.stderr.trim() === withoutBunTransport(packageRun.stderr).trim()
    )
  }
} finally {
  rmSync(fixture, { recursive: true, force: true })
}

if (failed) process.exit(1)
console.log('\n\x1b[32mentrypoint-parity.test.ts: all checks passed\x1b[0m')
