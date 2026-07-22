import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { BODY_3 } from '../items/body.ts'
import { FILENAME_1 } from '../items/filename.ts'
import { FM_6 } from '../items/frontmatter.ts'
import { ROOT_1 } from '../items/root.ts'
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

const rootRecord = ({ id, title }: { id: string; title: string }) => {
  const prefix = id.slice(0, 3)
  const type = prefix === 'GDR' ? 'Governance Decision Record' : 'Architecture Decision Record'
  const decisionType = prefix === 'GDR' ? 'governance' : 'architecture'
  return `---
id: ${id}
title: '${title}'
date: 2026-07-22
status: current
type: ${type}
type_url: https://knowledgeislands.info/specifications/decision-records/${prefix.toLowerCase()}
decision_type: ${decisionType}
---

# ${id}: ${title}

## Context

The collection needs a durable decision record.

## Decision

The repository records this decision.

## Consequences

The decision remains readable.
`
}

const rootFixture = ({
  marker = true,
  files,
  indexIds
}: {
  marker?: boolean
  files: ReadonlyArray<{ file: string; id: string; title: string }>
  indexIds: readonly string[]
}) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-root-'))
  temporaryRoots.push(root)
  const directory = join(root, 'docs', 'decisions')
  writeFileSync(join(root, '.ki-config.toml'), '[ki-decision-records]\n')
  mkdirSync(directory, { recursive: true })
  for (const file of files) writeFileSync(join(directory, file.file), rootRecord(file))
  const entries = indexIds
    .map((id, index) => {
      const file = files.find((candidate) => candidate.id === id)
      return `${index + 1}. [${id}](${file?.file ?? `${id}.md`}) — ${file?.title ?? 'unknown'}.`
    })
    .join('\n')
  writeFileSync(
    join(directory, 'README.md'),
    `# Decisions\n\n${marker ? '<!-- ki-decision-records: adoption-root -->\n\n' : ''}${entries}\n`
  )
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

describe('new collection adoption root', () => {
  const adoption = { file: 'GDR-EXAMPLE-001-adopting-decision-records.md', id: 'GDR-EXAMPLE-001', title: 'Adopting Decision Records' }
  const unrelated = { file: 'ADR-EXAMPLE-001-unrelated-decision.md', id: 'ADR-EXAMPLE-001', title: 'Unrelated decision' }

  test('accepts a marked collection whose first record adopts Decision Records', () => {
    const context = rootFixture({ files: [adoption], indexIds: [adoption.id] })

    expect(ROOT_1.mechanical?.audit.run(context)[0]?.status).toBe('PASS')
  })

  test('rejects a marked collection whose first record has an unrelated type, title, or serial', () => {
    const wrongTitle = { ...adoption, file: 'GDR-EXAMPLE-001-governance-baseline.md', title: 'Governance baseline' }
    const wrongSerial = { ...adoption, file: 'GDR-EXAMPLE-002-adopting-decision-records.md', id: 'GDR-EXAMPLE-002' }

    for (const record of [unrelated, wrongTitle, wrongSerial]) {
      const context = rootFixture({ files: [record], indexIds: [record.id] })
      expect(ROOT_1.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
    }
  })

  test('rejects a marked collection when the adoption root is not first in the index', () => {
    const context = rootFixture({ files: [adoption, unrelated], indexIds: [unrelated.id, adoption.id] })

    expect(ROOT_1.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
  })

  test('leaves an unmarked established collection as a migration case', () => {
    const context = rootFixture({ marker: false, files: [unrelated], indexIds: [unrelated.id] })

    expect(ROOT_1.mechanical?.audit.run(context)[0]?.status).toBe('NOT_APPLICABLE')
  })
})
