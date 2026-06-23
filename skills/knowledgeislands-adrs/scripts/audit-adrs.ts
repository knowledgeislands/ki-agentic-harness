#!/usr/bin/env bun
/**
 * Mechanical auditor for the Knowledge Islands ADR standard.
 *
 *   bun scripts/audit-adrs.ts [decisions-dir] [--json] [--report]
 *
 * Checks every ADR-*.md file in the given directory (default: docs/decisions) against:
 *   - Filename pattern: ADR-<SCOPE>-NNN.md
 *   - Title heading matches filename stem
 *   - **Status:** and **Date:** bold-key lines present and valid
 *   - Superseded link references an existing file
 *   - Required sections: ## Context, ## Decision, ## Consequences
 *   - Serial uniqueness across the directory
 *   - Index (README.md / index.md): present, complete, status-synced, ordered
 *
 * Flags:
 *   --json    Emit a JSON findings array to stdout (suppresses human-readable output).
 *   --report  Write .ki-meta/audits/adrs.md and .ki-meta/audits/adrs.json in the target
 *             (the directory containing decisions-dir, or cwd if decisions-dir is the root).
 *
 * Exit code: non-zero on any FAIL.
 * Standard: skills/knowledgeislands-adrs/references/adr-format.md
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

// ── severity ladder (knowledgeislands-engineering enforcement-framework §2) ──
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'SKIP' | 'PASS'
const ICON: Record<Level, string> = {
  FAIL: '❌',
  WARN: '⚠️ ',
  POLISH: '✨',
  ADVISORY: '🧭',
  INFO: 'ℹ️ ',
  SKIP: '⊘ ',
  PASS: '✅'
}
const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
}
const paint = (c: string, s: string) => `${c}${s}${C.reset}`

interface Finding {
  level: Level
  check: string
  file: string
  msg: string
}

const findings: Finding[] = []
let hasFail = false

function emit(level: Level, check: string, file: string, msg: string) {
  findings.push({ level, check, file, msg })
  if (level === 'FAIL') hasFail = true
}

// ── ADR filename pattern ──────────────────────────────────────────────────────
// ADR-<SCOPE>-NNN.md
// SCOPE: one or more uppercase alpha-leading segments ([A-Z][A-Z0-9]*)
// NNN: all-digit, ≥ 3 chars
const ADR_FILENAME_RE = /^ADR-[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,}\.md$/
const ADR_STEM_RE = /^ADR-[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,}$/
const ADR_ID_RE_LOOSE = /ADR-[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,}/

// ── status values ─────────────────────────────────────────────────────────────
const VALID_STATUS_RE = /^(Proposed|Accepted|Deprecated|Superseded by ADR-[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,})$/
const SUPERSEDED_BY_RE = /^Superseded by (ADR-[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,})$/

interface AdrMeta {
  stem: string
  file: string
  title: string | null
  status: string | null
  date: string | null
  hasSectionContext: boolean
  hasSectionDecision: boolean
  hasSectionConsequences: boolean
}

function parseAdr(filePath: string, filename: string): AdrMeta {
  const stem = filename.replace(/\.md$/, '')
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  let title: string | null = null
  let status: string | null = null
  let date: string | null = null
  let hasSectionContext = false
  let hasSectionDecision = false
  let hasSectionConsequences = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (title === null && trimmed.startsWith('# ')) {
      title = trimmed.slice(2).trim()
    }
    const statusMatch = trimmed.match(/^\*\*Status:\*\*\s*(.+)$/)
    if (statusMatch) status = statusMatch[1].trim()
    const dateMatch = trimmed.match(/^\*\*Date:\*\*\s*(.+)$/)
    if (dateMatch) date = dateMatch[1].trim()
    if (/^##\s+Context/.test(trimmed)) hasSectionContext = true
    if (/^##\s+Decision/.test(trimmed)) hasSectionDecision = true
    if (/^##\s+Consequences/.test(trimmed)) hasSectionConsequences = true
  }

  return { stem, file: filename, title, status, date, hasSectionContext, hasSectionDecision, hasSectionConsequences }
}

function checkAdr(meta: AdrMeta, decisionsDir: string) {
  const { stem, file, title, status, date } = meta
  const ref = file

  // name-format
  if (!ADR_FILENAME_RE.test(file)) {
    emit('FAIL', 'name-format', ref, `Filename does not match ADR-<SCOPE>-NNN.md pattern`)
  }

  // title-heading
  if (!title) {
    emit('FAIL', 'title-heading', ref, `No # heading found`)
  } else if (!title.startsWith(`${stem}:`)) {
    emit('FAIL', 'title-heading', ref, `Heading "${title}" does not start with "${stem}:"`)
  }

  // status-field
  if (!status) {
    emit('FAIL', 'status-field', ref, `No **Status:** line found`)
  } else if (!VALID_STATUS_RE.test(status)) {
    emit('FAIL', 'status-field', ref, `Status "${status}" is not a valid value (Proposed | Accepted | Deprecated | Superseded by ADR-…)`)
  } else {
    // superseded-link
    const supMatch = status.match(SUPERSEDED_BY_RE)
    if (supMatch) {
      const successorId = supMatch[1]
      const successorFile = join(decisionsDir, `${successorId}.md`)
      if (!existsSync(successorFile)) {
        emit('WARN', 'superseded-link', ref, `Superseded by "${successorId}" but ${successorId}.md not found in decisions directory`)
      }
    }
  }

  // date-field
  if (!date) {
    emit('FAIL', 'date-field', ref, `No **Date:** line found`)
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    emit('FAIL', 'date-field', ref, `Date "${date}" does not match YYYY-MM-DD`)
  }

  // required sections
  if (!meta.hasSectionContext) emit('FAIL', 'section-context', ref, `Missing ## Context section`)
  if (!meta.hasSectionDecision) emit('FAIL', 'section-decision', ref, `Missing ## Decision section`)
  if (!meta.hasSectionConsequences) emit('FAIL', 'section-consequences', ref, `Missing ## Consequences section`)
}

function checkIndex(decisionsDir: string, adrs: AdrMeta[]) {
  const indexPath = join(decisionsDir, 'README.md')
  const indexAlt = join(decisionsDir, 'index.md')
  const chosenIndex = existsSync(indexPath) ? indexPath : existsSync(indexAlt) ? indexAlt : null

  if (!chosenIndex) {
    emit('WARN', 'index-present', 'README.md', `No index file (README.md or index.md) found in decisions directory`)
    return
  }

  const content = readFileSync(chosenIndex, 'utf-8')
  const indexFile = chosenIndex.split('/').pop() ?? 'README.md'

  // collect all ADR IDs referenced in the index table rows (| ADR-… | … )
  const rowRe = /^\|\s*(ADR-[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-\d{3,})\b/
  const indexedIds: string[] = []
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(rowRe)
    if (m) indexedIds.push(m[1])
  }

  // index-complete: every ADR file should appear
  for (const adr of adrs) {
    if (!indexedIds.includes(adr.stem)) {
      emit('WARN', 'index-complete', indexFile, `${adr.stem} is not in the index table`)
    }
  }

  // index-stale: status in index rows should match the file
  // Parse rows: | ID | [Title](link) | Status | Date |
  const statusRe = /^\|\s*(ADR-[^|]+?)\s*\|\s*(?:\[.*?\]\(.*?\)|[^|]+?)\s*\|\s*([^|]+?)\s*\|/
  const adrBystem = new Map(adrs.map((a) => [a.stem, a]))
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(statusRe)
    if (!m) continue
    const id = m[1].trim()
    const indexStatus = m[2].trim()
    const adr = adrBystem.get(id)
    if (adr && adr.status && !indexStatus.startsWith(adr.status.split(' ')[0])) {
      // rough check: first word of status should match
      if (adr.status !== indexStatus) {
        emit('WARN', 'index-stale', indexFile, `${id} status in index ("${indexStatus}") differs from file ("${adr.status}")`)
      }
    }
  }

  // index-order: indexed IDs should be in ascending lexicographic order
  const sortedIds = [...indexedIds].sort()
  for (let i = 0; i < indexedIds.length; i++) {
    if (indexedIds[i] !== sortedIds[i]) {
      emit(
        'ADVISORY',
        'index-order',
        indexFile,
        `Index rows are not in filename-ascending order (found ${indexedIds[i]}, expected ${sortedIds[i]} at position ${i + 1})`
      )
      break
    }
  }
}

function buildMarkdownReport(decisionsDir: string, adrs: AdrMeta[]): string {
  const order: Level[] = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'SKIP', 'PASS']
  const sorted = [...findings].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level))
  const counts = findings.reduce(
    (acc, f) => {
      acc[f.level] = (acc[f.level] ?? 0) + 1
      return acc
    },
    {} as Record<Level, number>
  )
  const summary = order
    .filter((l) => counts[l])
    .map((l) => `${counts[l]} ${l}`)
    .join('  ')

  const rows = sorted.map((f) => `| ${f.level} | ${f.check} | ${f.file} | ${f.msg} |`).join('\n')
  return [
    `# ADR Audit`,
    ``,
    `**Directory:** \`${decisionsDir}\`  `,
    `**ADRs checked:** ${adrs.length}  `,
    `**Summary:** ${summary || 'all pass'}`,
    ``,
    `| Level | Check | File | Message |`,
    `| ----- | ----- | ---- | ------- |`,
    rows || `| PASS | — | — | All checks passed |`,
    ``
  ].join('\n')
}

function main() {
  const args = process.argv.slice(2)
  const emitJson = args.includes('--json')
  const writeReport = args.includes('--report')
  const positional = args.filter((a) => !a.startsWith('--'))
  const decisionsDir = resolve(positional[0] ?? 'docs/decisions')

  if (!existsSync(decisionsDir)) {
    console.error(`${paint(C.red, 'ERROR')} decisions directory not found: ${decisionsDir}`)
    process.exit(1)
  }

  // collect ADR files (exclude README/index)
  const allFiles = readdirSync(decisionsDir).filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'index.md')
  const adrFiles = allFiles.filter((f) => ADR_FILENAME_RE.test(f))
  const nonAdrMd = allFiles.filter((f) => !ADR_FILENAME_RE.test(f))

  for (const f of nonAdrMd) {
    emit('WARN', 'name-format', f, `${f} is a .md file in the decisions directory but does not match the ADR filename pattern`)
  }

  if (adrFiles.length === 0 && !emitJson) {
    console.log(paint(C.dim, `No ADR files found in ${decisionsDir}`))
    process.exit(0)
  }

  // parse and check each ADR
  const adrs: AdrMeta[] = []
  for (const f of adrFiles.sort()) {
    const meta = parseAdr(join(decisionsDir, f), f)
    adrs.push(meta)
    checkAdr(meta, decisionsDir)
  }

  // serial-unique: no two stems are identical (case-insensitive)
  const stems = adrs.map((a) => a.stem.toUpperCase())
  const seen = new Set<string>()
  for (const s of stems) {
    if (seen.has(s)) {
      emit('FAIL', 'serial-unique', `${s}.md`, `Duplicate ADR ID: ${s}`)
    }
    seen.add(s)
  }

  // index checks
  checkIndex(decisionsDir, adrs)

  // ── --json: emit findings array to stdout, suppress human output ─────────────
  if (emitJson) {
    console.log(JSON.stringify(findings, null, 2))
    process.exit(hasFail ? 1 : 0)
  }

  // ── --report: write .ki-meta/audits/adrs.{md,json} in the target repo root ──
  if (writeReport) {
    // target root is the parent of decisionsDir (or cwd if decisionsDir is cwd)
    const targetRoot = dirname(decisionsDir) === decisionsDir ? process.cwd() : dirname(decisionsDir)
    const auditDir = join(targetRoot, '.ki-meta', 'audits')
    mkdirSync(auditDir, { recursive: true })
    writeFileSync(join(auditDir, 'adrs.json'), JSON.stringify(findings, null, 2) + '\n', 'utf-8')
    writeFileSync(join(auditDir, 'adrs.md'), buildMarkdownReport(decisionsDir, adrs), 'utf-8')
    console.log(paint(C.dim, `Report written to ${join(auditDir, 'adrs.md')} and ${join(auditDir, 'adrs.json')}`))
  }

  // ── print report ────────────────────────────────────────────────────────────
  console.log(`\n${paint(C.cyan, 'ADR audit')} — ${paint(C.dim, decisionsDir)}`)
  console.log(`${paint(C.dim, `${adrs.length} ADR file(s) checked`)}\n`)

  if (findings.length === 0) {
    console.log(`${ICON.PASS} ${paint(C.green, 'All checks passed')}`)
    process.exit(0)
  }

  const order: Level[] = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'SKIP', 'PASS']
  const sorted = [...findings].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level))

  for (const f of sorted) {
    const lvlColor = f.level === 'FAIL' ? C.red : f.level === 'WARN' ? C.yellow : C.dim
    console.log(`${ICON[f.level]} ${paint(lvlColor, f.level.padEnd(8))} [${f.check}] ${paint(C.dim, f.file)} — ${f.msg}`)
  }

  const counts = findings.reduce(
    (acc, f) => {
      acc[f.level] = (acc[f.level] ?? 0) + 1
      return acc
    },
    {} as Record<Level, number>
  )
  const summary = order
    .filter((l) => counts[l])
    .map((l) => `${counts[l]} ${l}`)
    .join('  ')
  console.log(`\n${paint(C.dim, summary)}`)

  process.exit(hasFail ? 1 : 0)
}

main()
