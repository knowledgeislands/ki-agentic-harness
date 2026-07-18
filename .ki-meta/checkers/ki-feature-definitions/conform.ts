#!/usr/bin/env bun
/** Mechanical, normalize-only CONFORM for Feature Definitions. Emits canonical JSONL only. */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const INDEX_FILE = 'index.md'
const DEFAULT_SUBDIR = 'docs/features'
const RUBRIC = 'references/rubric.md'
const REQ_HEADING_RE = /^###\s+([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)-(\d{3,})\s+—\s+(.+?)\s*$/
const H3_RE = /^###\s+(.+?)\s*$/
const NEAR_MISS_HEADING_RE = /^###\s+([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,})\s*(?:[–—-]{1,2})\s*(\S.*?)\s*$/

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

async function resolveFeaturesDir(target: string): Promise<string> {
  const nested = join(target, DEFAULT_SUBDIR)
  try {
    await stat(nested)
    return nested
  } catch {
    return target
  }
}

function emit(target: string, findings: CheckerFinding[]): never {
  findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'feature-definitions', target, findings })
  process.exit(checkerReporterExitCode(findings))
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const target = resolve(args.find((value) => !value.startsWith('-')) ?? '.')
  const resolvedDir = await resolveFeaturesDir(target)
  const findings: CheckerFinding[] = []
  const rec = (
    level: 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS',
    code: string,
    message: string,
    file?: string
  ): void => {
    findings.push({ type: 'M', level, code, message, ref: RUBRIC, ...(file ? { file } : {}) })
  }

  try {
    await stat(resolvedDir)
  } catch {
    rec('FAIL', 'SCOPE', `Features directory not found: ${resolvedDir}.`, resolvedDir)
    emit(resolvedDir, findings)
  }

  const entries = await readdir(resolvedDir)
  const areaFiles = entries.filter((file) => file.endsWith('.md') && file !== INDEX_FILE).sort()
  let headingFixes = 0
  for (const file of areaFiles) {
    const filePath = join(resolvedDir, file)
    const content = await readFile(filePath, 'utf8')
    const lines = content.split('\n')
    let changed = false
    let inGaps = false
    for (const [index, line] of lines.entries()) {
      const h2 = line.match(/^##\s+(.+?)\s*$/)
      if (h2) {
        inGaps = /^gaps\b/i.test((h2[1] as string).trim())
        continue
      }
      if (inGaps || !H3_RE.test(line) || REQ_HEADING_RE.test(line)) continue
      const near = line.match(NEAR_MISS_HEADING_RE)
      if (!near) continue
      const id = near[1] as string
      const canonical = `### ${id} — ${near[2] as string}`
      if (canonical === line) continue
      rec('POLISH', 'ID-1', `${id}: separator normalized to “ — ”${dryRun ? ' (dry run — not written)' : ''}.`, file)
      lines[index] = canonical
      changed = true
      headingFixes++
    }
    if (changed && !dryRun) await writeFile(filePath, lines.join('\n'))
  }
  if (headingFixes === 0) rec('PASS', 'ID-1', 'Requirement-heading separators are already canonical.')

  for (const [code, message] of [
    ['INDEX-1', 'Author a missing docs/features/index.md registry by hand.'],
    ['INDEX-2', 'Author a missing Prefix and File areas table by hand.'],
    ['AREA-1', 'Create a file listed by an areas table or remove its row.'],
    ['AREA-2', 'Register an unlisted area file in the areas table.'],
    ['ID-1', 'Author a malformed requirement heading by hand.'],
    ['ID-2', 'Reconcile an unregistered or mis-owned prefix in the areas table.'],
    ['ID-3', 'Renumber a duplicate ID by hand using the next free serial.'],
    ['REQ-1', 'Write a normative RFC-2119 requirement statement by hand.'],
    ['VERIFY-1', 'Add a concrete _Verify:_ hook by hand.']
  ])
    rec('ADVISORY', code, message)
  emit(resolvedDir, findings)
}

main().catch((error) => {
  const findings: CheckerFinding[] = [
    { type: 'M', level: 'FAIL', code: 'RUNTIME', message: `Checker failed: ${String(error)}.`, ref: RUBRIC }
  ]
  emit(resolve('.'), findings)
})
