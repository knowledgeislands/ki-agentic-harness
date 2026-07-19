#!/usr/bin/env bun
/** Proves decision-type consistency is checked but never mechanically rewritten. */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scripts = dirname(fileURLToPath(import.meta.url))
const AUDIT = join(scripts, 'audit.ts')
const CONFORM = join(scripts, 'conform.ts')
let failed = false

function check(label: string, condition: boolean): void {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${label}`)
  if (!condition) failed = true
}

function fixture(decisionType: string): { root: string; record: string } {
  const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-test-'))
  const decisions = join(root, 'Admin', 'Governance', 'Decisions')
  mkdirSync(decisions, { recursive: true })
  writeFileSync(join(root, '.ki-config.toml'), 'repo_type = "kb"\n')
  const filename = 'GDR-TEST-001-classification.md'
  const record = join(decisions, filename)
  writeFileSync(
    record,
    `---
type: admin/governance/decision
decision_type: ${decisionType}
---

# GDR-TEST-001: Classification

## Context

The repository records decisions.

## Decision

We use a deliberate record type.

## Consequences

Classification remains reviewable.
`
  )
  writeFileSync(join(decisions, 'Decisions.md'), `- [GDR-TEST-001](${filename}) — Classification\n`)
  return { root, record }
}

function run(script: string, root: string): { code: number; findings: Array<{ code?: string; level?: string }> } {
  const result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
  const events = result.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { record: string; code?: string; level?: string })
  return { code: result.status ?? 1, findings: events.filter((event) => event.record === 'finding') }
}

{
  const { root } = fixture('governance')
  try {
    const result = run(AUDIT, root)
    check('matching metadata passes FM-5', result.code === 0 && !result.findings.some((finding) => finding.code === 'FM-5'))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

{
  const { root, record } = fixture('architecture')
  try {
    const audit = run(AUDIT, root)
    check(
      'mismatched metadata reports one FM-5 failure, not the retired duplicate code',
      audit.code !== 0 &&
        audit.findings.some((finding) => finding.code === 'FM-5' && finding.level === 'FAIL') &&
        !audit.findings.some((finding) => finding.code === 'PREFIX-TYPE-1')
    )

    const before = readFileSync(record, 'utf8')
    const conform = run(CONFORM, root)
    check(
      'conform leaves a classification mismatch for human resolution',
      conform.code === 0 &&
        readFileSync(record, 'utf8') === before &&
        !conform.findings.some((finding) => ['FM-4', 'FM-5'].includes(finding.code ?? ''))
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

if (failed) process.exit(1)
