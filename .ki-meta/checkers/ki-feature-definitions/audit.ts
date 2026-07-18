#!/usr/bin/env bun
/** Mechanical audit for Feature Definitions. Emits canonical checker JSONL only. */

import { existsSync } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  type CheckerLevel,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const DEFAULT_DIR = 'docs/features'
const INDEX_FILE = 'index.md'
const RUBRIC = 'references/rubric.md'
const RFC2119 = /\b(MUST NOT|MUST|SHALL NOT|SHALL|SHOULD NOT|SHOULD|MAY|REQUIRED|RECOMMENDED|NOT RECOMMENDED|OPTIONAL)\b/
const REQ_HEADING_RE = /^###\s+([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)-(\d{3,})\s+—\s+(.+?)\s*$/
const H3_RE = /^###\s+(.+?)\s*$/

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

function splitRow(line: string): string[] | null {
  if (!/^\s*\|/.test(line)) return null
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim())
}

function parseAreasTables(indexContent: string): Map<string, string> {
  const prefixToFile = new Map<string, string>()
  let prefixCol = -1
  let fileCol = -1
  for (const line of indexContent.split('\n')) {
    const cells = splitRow(line)
    if (!cells) {
      if (line.trim() === '') {
        prefixCol = -1
        fileCol = -1
      }
      continue
    }
    const prefixColumn = cells.findIndex((cell) => /^prefix$/i.test(cell.replace(/`/g, '')))
    const fileColumn = cells.findIndex((cell) => /^file$/i.test(cell.replace(/`/g, '')))
    if (prefixColumn >= 0 && fileColumn >= 0) {
      prefixCol = prefixColumn
      fileCol = fileColumn
      continue
    }
    if (prefixCol < 0 || fileCol < 0 || /^[-: ]+$/.test(cells.join(''))) continue
    const prefixCell = cells[prefixCol]?.replace(/`/g, '').trim() ?? ''
    const fileCell = (cells[fileCol] ?? '')
      .replace(/[`[\]]/g, '')
      .replace(/\(.*?\)/, '')
      .trim()
    if (!prefixCell || !fileCell) continue
    for (const prefix of prefixCell
      .split(/[·,/]|\s+/)
      .map((value) => value.trim())
      .filter(Boolean))
      prefixToFile.set(prefix, fileCell)
  }
  return prefixToFile
}

function emit(target: string, findings: CheckerFinding[]): never {
  findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
  emitCheckerReporter({ mode: 'audit', concern: 'feature-definitions', target, findings })
  process.exit(checkerReporterExitCode(findings))
}

async function main(): Promise<void> {
  const arg = process.argv.slice(2).find((value) => !value.startsWith('-')) ?? '.'
  const candidate = resolve(arg, DEFAULT_DIR)
  const resolvedDir = existsSync(candidate) ? candidate : resolve(arg)
  const findings: CheckerFinding[] = []
  const add = (code: string, level: CheckerLevel, file: string | undefined, message: string): void => {
    findings.push({ type: 'M', code, level, message, ref: RUBRIC, ...(file ? { file } : {}) })
  }

  if (!existsSync(candidate) && !existsSync(join(resolvedDir, INDEX_FILE))) {
    emit(resolvedDir, findings)
  }
  try {
    await stat(resolvedDir)
  } catch {
    add('INDEX-1', 'FAIL', resolvedDir, `Features directory not found: ${resolvedDir}.`)
    emit(resolvedDir, findings)
  }

  const entries = await readdir(resolvedDir)
  const areaFiles = entries.filter((file) => file.endsWith('.md') && file !== INDEX_FILE).sort()
  const hasIndex = entries.includes(INDEX_FILE)
  if (!hasIndex) add('INDEX-1', 'FAIL', INDEX_FILE, `Not found in ${resolvedDir}.`)
  const indexContent = hasIndex ? await readFile(join(resolvedDir, INDEX_FILE), 'utf8') : ''
  const prefixToFile = parseAreasTables(indexContent)
  const registeredFiles = new Set(prefixToFile.values())

  if (hasIndex && prefixToFile.size === 0) add('INDEX-2', 'FAIL', INDEX_FILE, 'No areas table found (expected Prefix and File columns).')
  for (const [prefix, file] of prefixToFile) {
    if (!entries.includes(file)) add('AREA-1', 'WARN', INDEX_FILE, `Areas table lists ${file} (prefix ${prefix}) but the file is missing.`)
  }
  for (const file of areaFiles) {
    if (!registeredFiles.has(file)) add('AREA-2', 'WARN', file, `Area file is not registered in the ${INDEX_FILE} areas table.`)
  }

  const seenIds = new Map<string, string>()
  for (const file of areaFiles) {
    const content = await readFile(join(resolvedDir, file), 'utf8')
    const lines = content.split('\n')
    let inGaps = false
    const requirements: Array<{ index: number; id: string; deprecated: boolean }> = []
    for (const [index, line] of lines.entries()) {
      const h2 = line.match(/^##\s+(.+?)\s*$/)
      if (h2) {
        inGaps = /^gaps\b/i.test((h2[1] as string).trim())
        continue
      }
      if (inGaps) continue
      const h3 = line.match(H3_RE)
      if (!h3) continue
      const requirement = line.match(REQ_HEADING_RE)
      if (!requirement) {
        add('ID-1', 'FAIL', file, `Level-3 heading is not a valid requirement ID: "${h3[1]}".`)
        continue
      }
      const [, prefix, serial, title] = requirement
      const id = `${prefix}-${serial}`
      const owner = prefixToFile.get(prefix)
      if (!owner) add('ID-2', 'FAIL', file, `${id} uses prefix ${prefix}, which no areas-table row registers.`)
      else if (owner !== file) add('ID-2', 'FAIL', file, `${id} uses prefix ${prefix}, registered to ${owner} not ${file}.`)
      if (seenIds.has(id))
        add('ID-3', 'WARN', file, `${id} is already defined by ${seenIds.get(id)} (IDs are append-only and never reused).`)
      else seenIds.set(id, file)
      requirements.push({ index, id, deprecated: /deprecated/i.test(title) || /^~~/.test(title.trim()) })
    }
    for (const [position, requirement] of requirements.entries()) {
      if (requirement.deprecated) continue
      const start = requirement.index + 1
      const end = requirements[position + 1]?.index ?? lines.length
      const block = lines.slice(start, end).join('\n')
      if (!RFC2119.test(block)) add('REQ-1', 'FAIL', file, `${requirement.id} has no RFC-2119 keyword in its statement.`)
      if (!/_Verify:_/.test(block)) add('VERIFY-1', 'WARN', file, `${requirement.id} has no \`_Verify:_\` line.`)
    }
  }
  emit(resolvedDir, findings)
}

main().catch((error) => {
  const findings: CheckerFinding[] = [
    { type: 'M', level: 'FAIL', code: 'RUNTIME', message: `Checker failed: ${String(error)}.`, ref: RUBRIC }
  ]
  emit(resolve('.'), findings)
})
