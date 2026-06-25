#!/usr/bin/env bun
/**
 * audit-kdrs.ts — mechanical checker for the Knowledge Islands KDR standard.
 *
 * Usage: bun audit-kdrs.ts [decisions-dir]
 * Default decisions-dir: Admin/Decisions
 *
 * Exits non-zero if any FAIL-severity finding is reported.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, join } from 'node:path'

const SEVERITY = { FAIL: 0, WARN: 1, POLISH: 2, ADVISORY: 3, INFO: 4, SKIP: 5, PASS: 6 } as const
type Sev = keyof typeof SEVERITY

interface Finding {
  file: string
  check: string
  severity: Sev
  message: string
}

const findings: Finding[] = []

function report(file: string, check: string, severity: Sev, message: string) {
  findings.push({ file, check, severity, message })
}

const KDR_FILENAME_RE = /^KDR-([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)(-(\d{3,}))(-[a-z0-9-]+)?\.md$/
const VALID_TYPES = new Set(['architecture', 'product', 'governance', 'taxonomy', 'naming', 'process'])
const VALID_STATUSES = new Set(['Proposed', 'Accepted', 'Deprecated'])

async function main() {
  const dir = process.argv[2] ?? 'Admin/Decisions'

  let entries: string[]
  try {
    entries = await readdir(dir)
  } catch {
    console.error(`FAIL: decisions directory not found: ${dir}`)
    process.exit(1)
  }

  const kdrFiles = entries.filter((f) => KDR_FILENAME_RE.test(f))
  const indexFile = join(dir, 'Decisions.md')

  // INDEX-1: index exists
  let indexContent = ''
  try {
    indexContent = await readFile(indexFile, 'utf8')
  } catch {
    report('Decisions.md', 'INDEX-1', 'FAIL', 'Decisions.md index not found in decisions directory')
  }

  // Per-file checks
  const seenSerials = new Map<string, string>() // scope -> serial -> filename

  for (const file of kdrFiles) {
    const path = join(dir, file)
    const content = await readFile(path, 'utf8')
    const lines = content.split('\n')

    // FILENAME-1 already satisfied by filter; extract scope+serial
    const m = KDR_FILENAME_RE.exec(file)!
    const scope = m[1]
    const serial = m[3]
    const scopeKey = scope
    const existing = seenSerials.get(`${scopeKey}-${serial}`)
    if (existing) {
      report(file, 'FILENAME-2', 'WARN', `Duplicate scope+serial ${scopeKey}-${serial} (also in ${existing})`)
    } else {
      seenSerials.set(`${scopeKey}-${serial}`, file)
    }

    // Frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch) {
      report(file, 'FM-1', 'FAIL', 'No YAML frontmatter found')
      continue
    }
    const fm = fmMatch[1]

    // FM-2: card/kdr tag
    if (!fm.includes('card/kdr')) {
      report(file, 'FM-2', 'FAIL', "Frontmatter missing 'card/kdr' tag")
    }

    // FM-3: type field
    const typeMatch = fm.match(/^type:\s*(.+)$/m)
    if (!typeMatch) {
      report(file, 'FM-3', 'FAIL', "Frontmatter missing 'type' field")
    } else if (!VALID_TYPES.has(typeMatch[1].trim())) {
      report(file, 'FM-3', 'FAIL', `Invalid type '${typeMatch[1].trim()}' — must be one of: ${[...VALID_TYPES].join(', ')}`)
    }

    // BODY-1: heading with ID prefix
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '')
    const headingMatch = body.match(/^#\s+(KDR-[A-Z][A-Z0-9-]+-\d{3,}):\s+(.+)$/m)
    if (!headingMatch) {
      report(file, 'BODY-1', 'FAIL', "Heading must start with the KDR ID prefix (e.g. '# KDR-ARCADIA-001: Title')")
    }

    // BODY-2: Status line
    const statusMatch = body.match(/^\*\*Status:\*\*\s+(.+)$/m)
    if (!statusMatch) {
      report(file, 'BODY-2', 'FAIL', "Missing '**Status:**' line in body")
    } else {
      const s = statusMatch[1].trim()
      if (!VALID_STATUSES.has(s) && !s.startsWith('Superseded by KDR-')) {
        report(file, 'BODY-2', 'WARN', `Unrecognised status value: '${s}'`)
      }
    }

    // BODY-3: Date line
    if (!/^\*\*Date:\*\*\s+\d{4}-\d{2}-\d{2}$/m.test(body)) {
      report(file, 'BODY-3', 'FAIL', "Missing or malformed '**Date:** YYYY-MM-DD' line in body")
    }

    // BODY-4: required sections
    for (const section of ['## Context', '## Decision', '## Consequences']) {
      if (!body.includes(section)) {
        report(file, 'BODY-4', 'FAIL', `Missing required section: ${section}`)
      }
    }

    // SUPER-1/SUPER-2: superseded links (basic check — existence only)
    const superMatch = body.match(/Superseded by (KDR-[A-Z][A-Z0-9-]+-\d{3,})/)
    if (superMatch) {
      const successor = superMatch[1]
      const successorFile = kdrFiles.find((f) => f.startsWith(successor))
      if (!successorFile) {
        report(file, 'SUPER-1', 'FAIL', `Superseded by ${successor} but that KDR file does not exist`)
      }
    }
  }

  // INDEX checks (basic)
  if (indexContent) {
    for (const file of kdrFiles) {
      const id = file.replace(/(-[a-z0-9-]+)?\.md$/, '')
      if (!indexContent.includes(id)) {
        report(file, 'INDEX-2', 'FAIL', `KDR ${id} has no row in Decisions.md`)
      }
    }
  }

  // Output
  const bySeverity = Object.keys(SEVERITY) as Sev[]
  let hasFail = false
  for (const sev of bySeverity) {
    const group = findings.filter((f) => f.severity === sev)
    for (const f of group) {
      console.log(`${sev.padEnd(7)} [${f.check}] ${f.file}: ${f.message}`)
      if (sev === 'FAIL') hasFail = true
    }
  }
  if (findings.length === 0) {
    console.log(`PASS   All KDR checks passed (${kdrFiles.length} file${kdrFiles.length === 1 ? '' : 's'})`)
  }

  process.exit(hasFail ? 1 : 0)
}

main()
