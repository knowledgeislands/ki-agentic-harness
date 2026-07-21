import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BODY_3 } from '../items/body.ts'
import { FILENAME_1 } from '../items/filename.ts'
import { FM_6 } from '../items/frontmatter.ts'
import { createDecisionRecordsContextFactory } from './decision-records.ts'

const temporaryRoots: string[] = []

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const record = ({ metadata = '', legacyDate = '' }: { metadata?: string; legacyDate?: string }) => `---
${
  metadata ||
  `id: ADR-EXAMPLE-001
title: 'Decide the record shape'
date: 2026-07-21
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture`
}
---

# ADR-EXAMPLE-001: Decide the record shape

${legacyDate}
## Context

The record needs a stable, machine-checkable shape.

## Decision

The repository adopts the universal record metadata.

## Consequences

Readers can identify record type without inferring it from an acronym.
`

const fixture = (filename: string, options: { metadata?: string; legacyDate?: string } = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-'))
  temporaryRoots.push(root)
  const directory = join(root, 'docs', 'decisions')
  writeFileSync(join(root, '.ki-config.toml'), '[ki-decision-records]\n')
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, filename), record(options))
  writeFileSync(join(directory, 'README.md'), `# Decisions\n\n1. [ADR-EXAMPLE-001](${filename}) — record shape.\n`)
  return createDecisionRecordsContextFactory({ target: root })()
}

describe('decision-record metadata contract', () => {
  test('accepts a canonical ID followed by the title slug and universal metadata', () => {
    const context = fixture('ADR-EXAMPLE-001-decide-the-record-shape.md')

    expect(context.invalidFilenames).toEqual([])
    expect(FILENAME_1.mechanical?.audit.run(context)[0]?.status).toBe('PASS')
    expect(FM_6.mechanical?.audit.run(context)[0]?.status).toBe('PASS')
  })

  test('rejects a shortened filename, missing metadata, and a legacy date line', () => {
    const context = fixture('ADR-EXAMPLE-001-short.md', {
      metadata: `id: ADR-EXAMPLE-001
title: 'Decide the record shape'
date: 2026-07-21
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture`,
      legacyDate: '**Date:** 2026-07-21\n'
    })

    expect(FILENAME_1.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
    expect(FM_6.mechanical?.audit.run(context)[0]?.message).toBe('`status` is absent.')
    expect(BODY_3.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
  })
})
