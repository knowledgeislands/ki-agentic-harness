import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { parseCheckerJsonl } from './vendored/ki-skills/checker.ts'

const audit = resolve(import.meta.dir, 'audit.ts')

const writeAgent = (
  directory: string,
  filename: string,
  name: string,
  description = 'Owns review. Use for "review agent" tasks.'
): string => {
  mkdirSync(directory, { recursive: true })
  const file = join(directory, filename)
  writeFileSync(file, `---\nname: ${name}\ndescription: ${description}\nmodel: inherit\n---\n\n# Role\n\nReview the requested agent.\n`)
  return file
}

const findings = (output: string): Record<string, unknown>[] =>
  parseCheckerJsonl(output).records.filter(
    (record): record is Record<string, unknown> =>
      typeof record === 'object' && record !== null && (record as { record?: unknown }).record === 'finding'
  )

describe('ki-agents AUDIT wrapper', () => {
  test('shows useful help without running the checker', () => {
    const result = spawnSync('bun', [audit, '--help'], { encoding: 'utf8' })
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Usage: bun scripts/audit.ts')
    expect(result.stdout).toContain('--reporter <reporter>')
    expect(result.stdout).not.toContain('"record"')
  })

  test('emits canonical JSONL and counts judgment without synthetic findings', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-agents-audit-'))
    try {
      writeAgent(root, 'reviewer.md', 'reviewer')
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      const parsed = parseCheckerJsonl(result.stdout)
      const summary = parsed.records.at(-1) as { summary?: { judgment?: { unevaluated?: unknown } } } | undefined
      expect(result.status).toBe(0)
      expect(parsed.errors).toEqual([])
      expect(summary?.summary?.judgment?.unevaluated).toBe(33)
      expect(findings(result.stdout).some((finding) => finding.level === 'ADVISORY')).toBe(false)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('preserves mechanical severities including the FM-11 alias override', async () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-agents-audit-'))
    try {
      const file = writeAgent(root, 'expected-name.md', 'other-name', 'Owns <review>. Use for agent tasks.')
      const content = await Bun.file(file).text()
      expect(content).toContain('model: inherit')
      writeFileSync(file, content.replace('model: inherit', 'model: sonnet'))
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      const resultFindings = findings(result.stdout)
      expect(result.status).toBe(1)
      expect(resultFindings.some((finding) => finding.code === 'LAY-3' && finding.level === 'WARN')).toBe(true)
      expect(resultFindings.some((finding) => finding.code === 'DESC-3' && finding.level === 'FAIL')).toBe(true)
      expect(resultFindings.some((finding) => finding.code === 'FM-11' && finding.level === 'WARN')).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('checks duplicate names and shared quoted trigger phrases across a set', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-agents-audit-'))
    try {
      writeAgent(root, 'first.md', 'duplicate', 'Owns review. Use for "same task" requests.')
      writeAgent(root, 'second.md', 'duplicate', 'Owns review. Use for "same task" requests.')
      writeAgent(root, 'third.md', 'other', 'Owns review. Use for "same task" requests.')
      const result = spawnSync('bun', [audit, root], { encoding: 'utf8' })
      const resultFindings = findings(result.stdout)
      expect(result.status).toBe(1)
      expect(resultFindings.some((finding) => finding.code === 'NAME-5' && finding.level === 'FAIL')).toBe(true)
      expect(resultFindings.some((finding) => finding.code === 'COLL-1' && finding.level === 'WARN')).toBe(true)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  test('renders the same result through the terminal reporter', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-agents-audit-'))
    try {
      writeAgent(root, 'reviewer.md', 'reviewer')
      const result = spawnSync('bun', [audit, root, '--reporter=terminal', '--reporter-levels=all'], { encoding: 'utf8' })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('Summary: FAIL=')
      expect(result.stdout).not.toContain('"record"')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
