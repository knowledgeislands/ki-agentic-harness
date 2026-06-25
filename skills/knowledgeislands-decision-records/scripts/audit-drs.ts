#!/usr/bin/env bun
/**
 * audit-drs.ts [decisions-dir]
 *
 * Audits Decision Records in the given directory against the knowledgeislands-decision-records standard.
 * Auto-detects KB vs code repo mode from .ki-config.toml. Exits non-zero on any FAIL-severity finding.
 *
 * decisions-dir defaults to Admin/Governance/Decisions (KB) or docs/decisions (code).
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

enum Sev {
  FAIL = 0,
  WARN = 1,
  POLISH = 2,
  ADVISORY = 3,
  INFO = 4,
  SKIP = 5,
  PASS = 6
}

const SEV_LABELS: Record<number, string> = {
  0: 'FAIL',
  1: 'WARN',
  2: 'POLISH',
  3: 'ADVISORY',
  4: 'INFO',
  5: 'SKIP',
  6: 'PASS'
}

interface Finding {
  check: string
  severity: Sev
  file: string
  message: string
}

const PREFIX_TO_TYPE: Record<string, string> = {
  SDR: 'strategy',
  PDR: 'product',
  ADR: 'architecture',
  DDR: 'data',
  XDR: 'security',
  ODR: 'operations',
  GDR: 'governance',
  RDR: 'research',
  KDR: 'knowledge'
}

const VALID_DECISION_TYPES = new Set(Object.values(PREFIX_TO_TYPE))

const DR_FILENAME_RE = /^(SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)(-(\d{3,}))(-[a-z0-9-]+)?\.md$/

async function findKiConfig(startDir: string): Promise<string | null> {
  let dir = resolve(startDir)
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, '.ki-config.toml')
    try {
      await stat(candidate)
      return candidate
    } catch {
      const parent = dirname(dir)
      if (parent === dir) return null
      dir = parent
    }
  }
  return null
}

async function detectKbMode(decisionsDir: string): Promise<boolean> {
  const configPath = await findKiConfig(decisionsDir)
  if (!configPath) return false
  const content = await readFile(configPath, 'utf8')
  // Check for explicit repo_type = "kb" anywhere in the file
  if (/^\s*repo_type\s*=\s*["']kb["']/m.test(content)) return true
  // Presence of [knowledgeislands-kb] table also implies KB mode
  if (/^\[knowledgeislands-kb\]/m.test(content)) return true
  return false
}

const decisionsDir = process.argv[2] ?? 'Admin/Governance/Decisions'

async function main() {
  const resolvedDir = resolve(decisionsDir)

  try {
    await stat(resolvedDir)
  } catch {
    console.error(`FAIL: decisions directory not found: ${resolvedDir}`)
    process.exit(1)
  }

  const kbMode = await detectKbMode(resolvedDir)
  const entries = await readdir(resolvedDir)
  const drFiles = entries.filter((f) => DR_FILENAME_RE.test(f)).sort()
  const indexFile = 'Decisions.md'
  const findings: Finding[] = []

  const add = (check: string, severity: Sev, file: string, message: string) => findings.push({ check, severity, file, message })

  // INDEX-1
  const hasIndex = entries.includes(indexFile)
  if (!hasIndex) {
    add('INDEX-1', Sev.FAIL, indexFile, `${indexFile} not found in ${decisionsDir}`)
  }

  const indexContent = hasIndex ? await readFile(join(resolvedDir, indexFile), 'utf8') : ''

  // Parse index DR IDs for cross-checks
  const indexedIds = new Set<string>()
  for (const line of indexContent.split('\n')) {
    const rowMatch = line.match(/^\|\s*([A-Z]+DR-[A-Z][A-Z0-9-]+-\d{3,})\s*\|/)
    if (rowMatch) indexedIds.add(rowMatch[1])
  }

  // Parse index rows for status/date sync
  interface IndexRow {
    status: string
    date: string
  }
  const indexRows = new Map<string, IndexRow>()
  for (const line of indexContent.split('\n')) {
    const cols = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean)
    if (cols.length >= 4) {
      const idMatch = cols[0].match(/^([A-Z]+DR-[A-Z][A-Z0-9-]+-\d{3,})$/)
      if (idMatch) {
        indexRows.set(idMatch[1], { status: cols[3] ?? '', date: cols[4] ?? '' })
      }
    }
  }

  const seenSerials = new Map<string, string>() // "SCOPE-NNN" → filename

  for (const file of drFiles) {
    const filePath = join(resolvedDir, file)
    const content = await readFile(filePath, 'utf8')
    const match = DR_FILENAME_RE.exec(file)
    if (!match) continue
    const prefix = match[1]
    const scopeKey = match[2]
    const serial = match[4]
    const drId = `${prefix}-${scopeKey}-${serial}`
    const expectedType = PREFIX_TO_TYPE[prefix]

    // FILENAME-2: serial uniqueness within scope (global across prefixes)
    const scopeSerial = `${scopeKey}-${serial}`
    if (seenSerials.has(scopeSerial)) {
      add('FILENAME-2', Sev.WARN, file, `serial ${scopeSerial} already used by ${seenSerials.get(scopeSerial)}`)
    } else {
      seenSerials.set(scopeSerial, file)
    }

    // FM-0: frontmatter required for KB repos
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (kbMode && !fmMatch) {
      add('FM-0', Sev.FAIL, file, 'YAML frontmatter block missing (required for KB repos)')
      // Can't check further FM items without frontmatter
    } else if (fmMatch) {
      const fm = fmMatch[1]

      if (kbMode) {
        // FM-3: type field
        const typeMatch = fm.match(/^type:\s*(.+)$/m)
        if (!typeMatch) {
          add('FM-3', Sev.FAIL, file, '`type` field missing')
        } else if (typeMatch[1].trim() !== 'admin/governance/decision') {
          add('FM-3', Sev.FAIL, file, `type must be 'admin/governance/decision', got '${typeMatch[1].trim()}'`)
        }

        // FM-4: decision_type present
        const dtMatch = fm.match(/^decision_type:\s*(.+)$/m)
        if (!dtMatch) {
          add('FM-4', Sev.FAIL, file, '`decision_type` field missing')
        } else {
          const dtValue = dtMatch[1].trim()

          // FM-5: valid value
          if (!VALID_DECISION_TYPES.has(dtValue)) {
            add(
              'FM-5',
              Sev.FAIL,
              file,
              `invalid decision_type '${dtValue}' — must be one of: ${[...VALID_DECISION_TYPES].sort().join(', ')}`
            )
          } else {
            // PREFIX-TYPE-1: prefix must match decision_type
            if (dtValue !== expectedType) {
              add(
                'PREFIX-TYPE-1',
                Sev.FAIL,
                file,
                `prefix ${prefix}- implies decision_type '${expectedType}' but frontmatter declares '${dtValue}'`
              )
            }
          }
        }
      } else if (!kbMode) {
        // Code repo with frontmatter: still check prefix-type consistency if decision_type is present
        const dtMatch = fm.match(/^decision_type:\s*(.+)$/m)
        if (dtMatch) {
          const dtValue = dtMatch[1].trim()
          if (VALID_DECISION_TYPES.has(dtValue) && dtValue !== expectedType) {
            add(
              'PREFIX-TYPE-1',
              Sev.WARN,
              file,
              `prefix ${prefix}- implies decision_type '${expectedType}' but frontmatter declares '${dtValue}'`
            )
          }
        }
      }
    }

    // Body checks (strip frontmatter first)
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '')

    // BODY-1: heading with DR ID prefix
    const headingMatch = body.match(/^#\s+([A-Z]+DR-[A-Z][A-Z0-9-]+-\d{3,}):\s+(.+)$/m)
    if (!headingMatch) {
      add('BODY-1', Sev.FAIL, file, `heading must match '# ${drId}: <Title>'`)
    } else if (headingMatch[1] !== drId) {
      add('BODY-1', Sev.WARN, file, `heading ID '${headingMatch[1]}' does not match filename ID '${drId}'`)
    }

    // BODY-2: **Status:** line
    const statusMatch = body.match(/^\*\*Status:\*\*\s+(.+)$/m)
    if (!statusMatch) {
      add('BODY-2', Sev.FAIL, file, '`**Status:**` line missing')
    }

    // BODY-3: **Date:** line
    const dateMatch = body.match(/^\*\*Date:\*\*\s+(\d{4}-\d{2}-\d{2})$/m)
    if (!dateMatch) {
      add('BODY-3', Sev.FAIL, file, '`**Date:**` line missing or not in YYYY-MM-DD format')
    }

    // BODY-4: required sections
    for (const section of ['## Context', '## Decision', '## Consequences']) {
      if (!body.includes(section)) {
        add('BODY-4', Sev.FAIL, file, `missing required section '${section}'`)
      }
    }

    // SUPER-1: superseded reference target exists
    if (statusMatch?.[1]?.trim().startsWith('Superseded')) {
      const superIdMatch = statusMatch[1].match(/Superseded by ([A-Z]+DR-[A-Z][A-Z0-9-]+-\d{3,})/)
      if (superIdMatch) {
        const targetId = superIdMatch[1]
        const targetExists = drFiles.some((f) => f.startsWith(targetId))
        if (!targetExists) {
          add('SUPER-1', Sev.FAIL, file, `references superseding DR '${targetId}' but no matching file found`)
        }
      }
    }

    // SUPER-2: if this DR supersedes another, that other must reference this one back
    const supersedingMatch = body.match(/Supersedes ([A-Z]+DR-[A-Z][A-Z0-9-]+-\d{3,})/i)
    if (supersedingMatch) {
      const oldId = supersedingMatch[1]
      const oldFile = drFiles.find((f) => f.startsWith(oldId))
      if (oldFile) {
        const oldContent = await readFile(join(resolvedDir, oldFile), 'utf8')
        if (!oldContent.includes(`Superseded by ${drId}`)) {
          add('SUPER-2', Sev.FAIL, file, `${oldId} does not reference 'Superseded by ${drId}' (bidirectional link missing)`)
        }
      }
    }

    // INDEX-2: must have a row in Decisions.md
    if (hasIndex && !indexedIds.has(drId)) {
      add('INDEX-2', Sev.FAIL, file, `no row in ${indexFile} for ${drId}`)
    }

    // INDEX-4/5: status/date sync with index
    if (hasIndex && statusMatch && dateMatch) {
      const row = indexRows.get(drId)
      if (row) {
        if (row.status !== statusMatch[1].trim()) {
          add('INDEX-4', Sev.WARN, file, `index status '${row.status}' does not match DR status '${statusMatch[1].trim()}'`)
        }
        if (row.date !== dateMatch[1]) {
          add('INDEX-5', Sev.WARN, file, `index date '${row.date}' does not match DR date '${dateMatch[1]}'`)
        }
      }
    }
  }

  // INDEX-3: no orphan rows in index
  if (hasIndex) {
    for (const indexedId of indexedIds) {
      if (!drFiles.some((f) => f.startsWith(indexedId))) {
        add('INDEX-3', Sev.FAIL, indexFile, `index row for '${indexedId}' has no matching DR file`)
      }
    }
  }

  // INDEX-6: rows in index are ordered by filename
  if (hasIndex) {
    const rowIds = [...indexedIds]
    const sorted = [...rowIds].sort()
    for (let i = 0; i < rowIds.length; i++) {
      if (rowIds[i] !== sorted[i]) {
        add('INDEX-6', Sev.WARN, indexFile, `rows are not in filename order (found ${rowIds[i]} before ${sorted[i]})`)
        break
      }
    }
  }

  // Report grouped by severity
  let hasFail = false
  for (let sev = Sev.FAIL; sev <= Sev.PASS; sev++) {
    const group = findings.filter((f) => f.severity === sev)
    for (const f of group) {
      const label = SEV_LABELS[f.severity] ?? String(f.severity)
      console.log(`${label.padEnd(8)} [${f.check}] ${f.file}: ${f.message}`)
      if (sev === Sev.FAIL) hasFail = true
    }
  }

  if (findings.length === 0) {
    const modeLabel = kbMode ? 'KB mode' : 'code mode'
    console.log(`PASS     DR audit — ${drFiles.length} file${drFiles.length === 1 ? '' : 's'}, ${modeLabel}, ${decisionsDir}`)
  }

  process.exit(hasFail ? 1 : 0)
}

main().catch((err) => {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
})
