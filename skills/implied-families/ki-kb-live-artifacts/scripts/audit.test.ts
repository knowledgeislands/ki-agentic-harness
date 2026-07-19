import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const audit = join(scripts, 'audit.ts')
const conform = join(scripts, 'conform.ts')

const run = (
  script: string,
  target: string,
  ...arguments_: string[]
): { code: number; findings: Array<{ code: string; level: string }> } => {
  const result = spawnSync(process.execPath, [script, target, ...arguments_], { encoding: 'utf8' })
  const records = result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { record: string; code?: string; level?: string })
  return {
    code: result.status ?? 1,
    findings: records.filter((record) => record.record === 'finding' && record.code && record.level) as Array<{
      code: string
      level: string
    }>
  }
}

test('audit identifies safe index and render-declaration repairs', () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-live-artifacts-'))
  const artifacts = join(root, 'Admin', 'Operations', 'Live Artifacts')
  mkdirSync(artifacts, { recursive: true })
  const source = join(artifacts, 'Status Board.md')
  writeFileSync(source, '---\nstatus: active\n---\n\n# Status Board\n')
  writeFileSync(join(artifacts, 'Status Board.html'), '<h1>Status Board</h1>\n')
  try {
    const before = run(audit, root)
    expect(before.code).toBe(0)
    expect(before.findings.map((finding) => finding.code)).toEqual(expect.arrayContaining(['LA-S-1', 'LA-F-2']))

    const dryRun = run(conform, root, '--dry-run')
    expect(dryRun.code).toBe(0)
    expect(dryRun.findings.filter((finding) => finding.level === 'FIXED')).toHaveLength(2)
    expect(existsSync(join(artifacts, 'Live Artifacts.md'))).toBe(false)
    expect(readFileSync(source, 'utf8')).not.toContain('renders: html')

    const applied = run(conform, root)
    expect(applied.code).toBe(0)
    expect(existsSync(join(artifacts, 'Live Artifacts.md'))).toBe(true)
    expect(readFileSync(source, 'utf8')).toContain('renders: html')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
