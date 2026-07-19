import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createMcpContext } from './rubric/contexts/mcp.ts'
import { KI_MCP_FAMILY_CODES, KI_MCP_RUBRIC } from './rubric/items/index.ts'
import { parseCheckerJsonl, validateCheckerRecords } from './vendored/ki-skills/checker.ts'

const audit = resolve(import.meta.dir, 'audit.ts')
const fixture = (): string => mkdtempSync(join(tmpdir(), 'ki-mcp-audit-'))
const run = (root: string) => {
  const process = spawnSync('bun', [audit, root], { encoding: 'utf8' })
  const parsed = parseCheckerJsonl(process.stdout)
  const context = createMcpContext(root, true)
  const families = context.applicable || !context.rootExists ? KI_MCP_FAMILY_CODES : ['KI']
  expect(parsed.errors).toEqual([])
  expect(
    validateCheckerRecords({
      records: parsed.records,
      rubric: KI_MCP_RUBRIC,
      subjects: [{ familyCodes: families, context: () => context }],
      exitCode: process.status ?? 1
    })
  ).toEqual([])
  return { process, records: parsed.records }
}
const findings = (records: readonly unknown[]) =>
  records.filter(
    (record): record is { record: 'finding'; code: string; level: string } =>
      typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
  )

test('shows command help without running the checker', () => {
  const result = spawnSync('bun', [audit, '--help'], { encoding: 'utf8' })
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
  expect(result.stdout).not.toContain('"record"')
})

test('absent and irrelevant reports exactly one not-applicable result', () => {
  const root = fixture()
  try {
    const result = run(root)
    expect(result.process.status).toBe(0)
    expect(findings(result.records)).toEqual([expect.objectContaining({ code: 'KI-CONFIG', level: 'NOT_APPLICABLE' })])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('declaration and structural markers activate the full audit', () => {
  for (const arrange of [
    (root: string) => writeFileSync(join(root, '.ki-config.toml'), '[ki-mcp]\n'),
    (root: string) => mkdirSync(join(root, 'src', 'mcp-server'), { recursive: true })
  ]) {
    const root = fixture()
    try {
      arrange(root)
      const result = run(root)
      expect(result.process.status).toBe(1)
      expect(findings(result.records).some((finding) => finding.code === 'LAY-1' && finding.level === 'FAIL')).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }
})

test('vitest config activates the MCP coverage delta', () => {
  const root = fixture()
  try {
    writeFileSync(join(root, '.ki-config.toml'), '[ki-mcp]\n')
    writeFileSync(join(root, 'vitest.config.cjs'), 'module.exports = {}\n')
    expect(findings(run(root).records).some((finding) => finding.code === 'TEST-1' && finding.level === 'WARN')).toBe(true)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
