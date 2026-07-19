#!/usr/bin/env bun
/** Focused canonical-checker tests for ki-binding. */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { KI_BINDING_FAMILY_CODES, KI_BINDING_RUBRIC } from './rubric/items/index.ts'
import { parseCheckerJsonl, validateCheckerRecords } from './vendored/ki-skills/checker.ts'

const scripts = dirname(fileURLToPath(import.meta.url))
let failed = false
const check = (label: string, condition: boolean): void => {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${label}`)
  if (!condition) failed = true
}
type Run = { code: number; findings: Array<{ code: string; level: string }> }
const run = (script: string, args: string[]): Run => {
  const result = spawnSync(process.execPath, [join(scripts, script), ...args], { encoding: 'utf8' })
  const parsed = parseCheckerJsonl(result.stdout)
  const errors = [
    ...parsed.errors,
    ...validateCheckerRecords({
      records: parsed.records,
      rubric: KI_BINDING_RUBRIC,
      subjects: [{ familyCodes: KI_BINDING_FAMILY_CODES, context: () => undefined as never }],
      exitCode: result.status ?? 1
    })
  ]
  if (errors.length) throw new Error(`invalid canonical checker stream: ${errors.join('; ')}`)
  const findings = parsed.records.filter(
    (record): record is { record: 'finding'; code: string; level: string } =>
      typeof record === 'object' && record !== null && (record as { record?: string }).record === 'finding'
  )
  return { code: result.status ?? 1, findings }
}

const fixture = mkdtempSync(join(tmpdir(), 'ki-binding-checker-'))
try {
  const source = join(fixture, 'mcp-servers.yaml')
  writeFileSync(source, 'mcpServers: []\n')
  const audit = run('audit.ts', ['--source', source])
  check('AUDIT accepts a valid source', audit.code === 0)
  check('AUDIT reports the BIND-5 judgment as unevaluated', !audit.findings.some((finding) => finding.code === 'BIND-5'))
  const missing = run('audit.ts', ['--source', join(fixture, 'absent.yaml')])
  check(
    'AUDIT fails when the source is absent',
    missing.code !== 0 && missing.findings.some((finding) => finding.code === 'BIND-2' && finding.level === 'FAIL')
  )
  const legacy = spawnSync(process.execPath, [join(scripts, 'audit.ts'), '--json', '--source', source], { encoding: 'utf8' })
  check('AUDIT rejects the retired --json flag', legacy.status === 2)
  const conform = run('conform.ts', ['--dry-run'])
  check('CONFORM dry-run does not fail for absent Cowork settings', conform.code === 0)
  const help = spawnSync(process.execPath, [join(scripts, 'educate.ts'), '--help'], { encoding: 'utf8' })
  check('EDUCATE exposes --help', help.status === 0 && help.stdout.includes('Usage:'))
} finally {
  rmSync(fixture, { recursive: true, force: true })
}
if (failed) process.exit(1)
