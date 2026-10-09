import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import catalogue from '../items/index.ts'
import { createDecisionRecordsSession, type DecisionRecordsRubricContext } from './decision-records.ts'

const temporaryRoots: string[] = []
const families = catalogue.families as unknown as readonly RubricFamily<DecisionRecordsRubricContext, unknown>[]
const item = (code: string): RubricItem<unknown> => {
  const selected = families.flatMap((family) => family.items).find((candidate) => candidate.code === code)
  if (!selected) throw new Error(`Missing rubric item ${code}`)
  return selected as RubricItem<unknown>
}

const audit = (code: string, context: DecisionRecordsRubricContext) => {
  const family = families.find((candidate) => candidate.items.some((candidate) => candidate.code === code))
  if (!family) throw new Error(`Missing rubric family for ${code}`)
  return item(code).mechanical?.audit.run(family.selectContext(context))
}

const conform = (code: string, context: DecisionRecordsRubricContext) => {
  const family = families.find((candidate) => candidate.items.some((candidate) => candidate.code === code))
  if (!family) throw new Error(`Missing rubric family for ${code}`)
  item(code).mechanical?.conform?.run(family.selectContext(context))
}

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
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
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

const fixture = (
  filename: string,
  options: { metadata?: string; legacyDate?: string; extra?: ReadonlyArray<{ file: string; content: string }> } = {}
) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-'))
  temporaryRoots.push(root)
  const directory = join(root, 'docs', 'decisions')
  writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, filename), record(options))
  for (const extra of options.extra ?? []) writeFileSync(join(directory, extra.file), extra.content)
  writeFileSync(join(directory, 'README.md'), `# Decisions\n\n1. [ADR-EXAMPLE-001](${filename}) — record shape.\n`)
  return createDecisionRecordsSession({
    mode: 'audit',
    repository: root,
    userHome: tmpdir(),
    configuration: {}
  }).subjects[0]?.context()
}

const rootRecord = ({ id, title, sharedRecord = false }: { id: string; title: string; sharedRecord?: boolean }) => {
  const prefix = id.slice(0, 3)
  const decisionType = prefix === 'GDR' ? 'governance' : 'architecture'
  return `---
id: ${id}
title: '${title}'
date: 2026-07-22
status: current
decision_type: ${decisionType}
decision_type_url: https://knowledgeislands.info/specifications/decision-records/${prefix.toLowerCase()}
${sharedRecord ? 'shared_record: true\n' : ''}---

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
  files,
  indexIds
}: {
  files: ReadonlyArray<{ file: string; id: string; title: string; sharedRecord?: boolean }>
  indexIds: readonly string[]
}) => {
  const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-root-'))
  temporaryRoots.push(root)
  const directory = join(root, 'docs', 'decisions')
  writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
  mkdirSync(directory, { recursive: true })
  for (const file of files) writeFileSync(join(directory, file.file), rootRecord(file))
  const entries = indexIds
    .map((id, index) => {
      const file = files.find((candidate) => candidate.id === id)
      return `${index + 1}. [${id}](${file?.file ?? `${id}.md`}) — ${file?.title ?? 'unknown'}.`
    })
    .join('\n')
  writeFileSync(join(directory, 'README.md'), `# Decisions\n\n${entries}\n`)
  return createDecisionRecordsSession({
    mode: 'audit',
    repository: root,
    userHome: tmpdir(),
    configuration: {}
  }).subjects[0]?.context()
}

describe('decision-record metadata contract', () => {
  test('accepts a canonical ID followed by the title slug and universal metadata', () => {
    const context = fixture('ADR-EXAMPLE-001-decide-the-record-shape.md')

    expect(context?.filename.invalidFilenames).toEqual([])
    expect(audit('FILENAME-1', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
    expect(audit('FM-6', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('rejects a shortened filename, missing metadata, and a legacy date line', () => {
    const context = fixture('ADR-EXAMPLE-001-short.md', {
      metadata: `id: ADR-EXAMPLE-001
title: 'Decide the record shape'
date: 2026-07-21
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture`,
      legacyDate: '**Date:** 2026-07-21\n'
    })

    expect(audit('FILENAME-1', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('VIOLATION')
    expect(audit('FM-6', context as DecisionRecordsRubricContext)?.[0]?.message).toBe('`status` is absent.')
    expect(audit('BODY-3', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('VIOLATION')
  })

  test('rejects generic type metadata', () => {
    const context = fixture('ADR-EXAMPLE-001-decide-the-record-shape.md', {
      metadata: `id: ADR-EXAMPLE-001
title: 'Decide the record shape'
date: 2026-07-21
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr`
    })

    expect(audit('FM-3', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('VIOLATION')
  })

  test('reports unparseable Markdown files in the selected decisions directory', () => {
    const context = fixture('ADR-EXAMPLE-001-decide-the-record-shape.md', {
      extra: [{ file: 'supporting-note.md', content: '# Supporting note\n' }]
    })

    expect(audit('FILENAME-0', context as DecisionRecordsRubricContext)?.[0]).toMatchObject({
      status: 'VIOLATION',
      subject: 'supporting-note.md'
    })
  })

  test('conforms only canonical scalar legacy metadata and preserves the record body', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-conform-'))
    temporaryRoots.push(root)
    const directory = join(root, 'docs', 'decisions')
    const file = 'ADR-EXAMPLE-001-decide-the-record-shape.md'
    const body = `# ADR-EXAMPLE-001: Decide the record shape\n\n## Context\n\nThe record needs a stable shape.\n\n## Decision\n\nThe repository records the decision.\n\n## Consequences\n\nReaders can identify the decision.\n`
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
    writeFileSync(
      join(directory, file),
      `---\nid: ADR-EXAMPLE-001\ntitle: 'Decide the record shape'\ndate: 2026-07-21\nstatus: current\ntype: Architecture Decision Record\ntype_url: https://knowledgeislands.info/specifications/decision-records/adr\n---\n\n${body}`
    )
    writeFileSync(join(directory, 'README.md'), '# Decisions\n')

    const session = createDecisionRecordsSession({
      mode: 'conform',
      repository: root,
      userHome: tmpdir(),
      configuration: {}
    })
    const context = session.subjects[1]?.context() as DecisionRecordsRubricContext
    conform('FM-3', context)
    conform('FM-4', context)
    const write = session.proposal().writes.find((candidate) => candidate.path.endsWith(file))

    if (!write) throw new Error('Expected a frontmatter conform proposal.')

    expect(write.content).toContain('decision_type: architecture')
    expect(write.content).toContain(
      'decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr'
    )
    expect(write.content).not.toContain('\ntype:')
    expect(write.content).not.toContain('\ntype_url:')
    expect(write.content).toEndWith(body)

    conform('FM-3', context)
    conform('FM-4', context)
    expect(session.proposal().writes).toEqual([write])
  })

  test('is idempotent for canonical decision metadata', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-idempotent-'))
    temporaryRoots.push(root)
    const directory = join(root, 'docs', 'decisions')
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
    writeFileSync(join(directory, 'README.md'), '# Decisions\n')
    writeFileSync(join(directory, 'ADR-EXAMPLE-001-decide-the-record-shape.md'), record({}))

    const session = createDecisionRecordsSession({
      mode: 'conform',
      repository: root,
      userHome: tmpdir(),
      configuration: {}
    })
    const context = session.subjects[1]?.context() as DecisionRecordsRubricContext
    conform('FM-3', context)
    conform('FM-4', context)
    expect(session.proposal().writes).toEqual([])
  })

  test('refuses malformed, conflicting, and symlinked frontmatter sources', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-refuse-'))
    temporaryRoots.push(root)
    const directory = join(root, 'docs', 'decisions')
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
    writeFileSync(join(directory, 'README.md'), '# Decisions\n')
    const malformed = 'ADR-EXAMPLE-001-decide-the-record-shape.md'
    const conflicting = 'ADR-EXAMPLE-002-conflicting-decision.md'
    const linked = 'ADR-EXAMPLE-003-linked-decision.md'
    writeFileSync(
      join(directory, malformed),
      record({
        metadata: `id: ADR-EXAMPLE-001\ntitle: 'Decide the record shape'\ndate: 2026-07-21\nstatus: current\ntype: [unclosed`
      })
    )
    writeFileSync(
      join(directory, conflicting),
      record({
        metadata: `id: ADR-EXAMPLE-001\ntitle: 'Decide the record shape'\ndate: 2026-07-21\nstatus: current\ntype: Architecture Decision Record\ndecision_type: governance\ndecision_type_url: https://knowledgeislands.info/specifications/decision-records/adr`
      })
        .replaceAll('ADR-EXAMPLE-001', 'ADR-EXAMPLE-002')
        .replaceAll('Decide the record shape', 'Conflicting decision')
    )
    symlinkSync(malformed, join(directory, linked))

    const session = createDecisionRecordsSession({
      mode: 'conform',
      repository: root,
      userHome: tmpdir(),
      configuration: {}
    })
    const context = session.subjects[1]?.context() as DecisionRecordsRubricContext
    conform('FM-3', context)
    conform('FM-4', context)
    expect(session.proposal().writes).toEqual([])
    expect(readFileSync(join(directory, malformed), 'utf8')).toContain('type: [unclosed')
  })
})

describe('new collection adoption root', () => {
  const adoption = {
    file: 'GDR-EXAMPLE-001-adopting-decision-records.md',
    id: 'GDR-EXAMPLE-001',
    title: 'Adopting Decision Records'
  }
  const unrelated = {
    file: 'ADR-EXAMPLE-001-unrelated-decision.md',
    id: 'ADR-EXAMPLE-001',
    title: 'Unrelated decision'
  }

  test('accepts a collection whose first record adopts Decision Records', () => {
    const context = rootFixture({ files: [adoption], indexIds: [adoption.id] })

    expect(audit('ROOT-1', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('accepts a compound adoption title that contains the adoption', () => {
    const compound = {
      file: 'GDR-EXAMPLE-001-adopt-decision-records-and-documentation-instruments.md',
      id: 'GDR-EXAMPLE-001',
      title: 'Adopt decision records and documentation instruments'
    }
    const context = rootFixture({ files: [compound], indexIds: [compound.id] })

    expect(audit('ROOT-1', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('rejects a collection whose first record has an unrelated classification, title, or serial', () => {
    const wrongTitle = { ...adoption, file: 'GDR-EXAMPLE-001-governance-baseline.md', title: 'Governance baseline' }
    const wrongSerial = { ...adoption, file: 'GDR-EXAMPLE-002-adopting-decision-records.md', id: 'GDR-EXAMPLE-002' }

    for (const record of [unrelated, wrongTitle, wrongSerial]) {
      const context = rootFixture({ files: [record], indexIds: [record.id] })
      expect(audit('ROOT-1', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('VIOLATION')
    }
  })

  test('rejects a collection when the adoption root is not first in the index', () => {
    const context = rootFixture({ files: [adoption, unrelated], indexIds: [unrelated.id, adoption.id] })

    expect(audit('ROOT-1', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('VIOLATION')
  })
})

describe('contiguous serial series', () => {
  const first = { file: 'ADR-EXAMPLE-001-first-decision.md', id: 'ADR-EXAMPLE-001', title: 'First decision' }
  const second = { file: 'ADR-EXAMPLE-002-second-decision.md', id: 'ADR-EXAMPLE-002', title: 'Second decision' }
  const third = { file: 'ADR-EXAMPLE-003-third-decision.md', id: 'ADR-EXAMPLE-003', title: 'Third decision' }

  test('fails a series with a gap, naming the missing serial', () => {
    const context = rootFixture({ files: [first, third], indexIds: [first.id, third.id] })

    expect(context?.filename.serialGaps).toEqual(new Map([['ADR-EXAMPLE', [2]]]))
    const [outcome] = audit('FILENAME-5', context as DecisionRecordsRubricContext) ?? []
    expect(outcome?.status).toBe('VIOLATION')
    expect(outcome?.message).toContain('002')
  })

  test('fails a series that does not start at 001', () => {
    const context = rootFixture({ files: [second], indexIds: [second.id] })

    expect(audit('FILENAME-5', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('VIOLATION')
  })

  test('passes a contiguous series', () => {
    const context = rootFixture({ files: [first, second, third], indexIds: [first.id, second.id, third.id] })

    expect(audit('FILENAME-5', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('exempts a pending XXX record', () => {
    const pending = { file: 'ADR-EXAMPLE-XXX-pending-decision.md', id: 'ADR-EXAMPLE-XXX', title: 'Pending decision' }
    const context = rootFixture({ files: [first, pending], indexIds: [first.id, pending.id] })

    expect(context?.filename.serialGaps).toEqual(new Map())
  })
})

describe('shared record mirrors', () => {
  const shared = {
    file: 'ADR-EXAMPLE-002-shared-decision.md',
    id: 'ADR-EXAMPLE-002',
    title: 'Shared decision',
    sharedRecord: true
  }
  const ordinary = { ...shared, sharedRecord: false }

  test('excludes a deliberately marked shared record from the receiving collection serial series', () => {
    const context = rootFixture({ files: [shared], indexIds: [shared.id] })

    expect(context?.filename.serialGaps).toEqual(new Map())
    expect(audit('FILENAME-5', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('retains the shared record in its canonical local series', () => {
    const first = { file: 'ADR-EXAMPLE-001-first-decision.md', id: 'ADR-EXAMPLE-001', title: 'First decision' }
    const third = { file: 'ADR-EXAMPLE-003-third-decision.md', id: 'ADR-EXAMPLE-003', title: 'Third decision' }
    const context = rootFixture({ files: [first, shared, third], indexIds: [first.id, shared.id, third.id] })

    expect(context?.filename.serialGaps).toEqual(new Map())
    expect(audit('FILENAME-5', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('retains serial continuity enforcement for an ordinary local record', () => {
    const context = rootFixture({ files: [ordinary], indexIds: [ordinary.id] })

    expect(audit('FILENAME-5', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('VIOLATION')
  })
})

describe('decision-record index links', () => {
  test('reports unordered or stale decision-record links', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-index-links-'))
    temporaryRoots.push(root)
    const directory = join(root, 'docs', 'decisions')
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
    const id = 'ADR-EXAMPLE-001'
    const file = 'ADR-EXAMPLE-001-first-decision.md'
    writeFileSync(join(directory, file), rootRecord({ id, title: 'First decision' }))
    writeFileSync(
      join(directory, 'README.md'),
      `# Decisions\n\n- [${id}](wrong.md) — First decision.\n1. [${id}](wrong.md) — First decision.\n`
    )
    const context = createDecisionRecordsSession({
      mode: 'audit',
      repository: root,
      userHome: tmpdir(),
      configuration: {}
    }).subjects[0]?.context()
    const outcomes = audit('INDEX-4', context as DecisionRecordsRubricContext)

    expect(outcomes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: 'VIOLATION', message: expect.stringContaining('ordered list form') }),
        expect.objectContaining({ status: 'VIOLATION', subject: id, message: expect.stringContaining('wrong.md') })
      ])
    )
  })

  test('repairs only canonical ordered entries while preserving every other index line idempotently', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-index-conform-'))
    temporaryRoots.push(root)
    const directory = join(root, 'docs', 'decisions')
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
    writeFileSync(
      join(directory, 'ADR-EXAMPLE-001-first-decision.md'),
      rootRecord({ id: 'ADR-EXAMPLE-001', title: 'First decision' })
    )
    writeFileSync(
      join(directory, 'ADR-EXAMPLE-002-not-the-canonical-title.md'),
      rootRecord({ id: 'ADR-EXAMPLE-002', title: 'Second decision' })
    )
    const original =
      '# Decisions\n\n' +
      'Introductory prose stays untouched.\n\n' +
      '1. [ADR-EXAMPLE-001](wrong.md) — First decision.\n' +
      '2. [ADR-EXAMPLE-002](wrong-too.md) — Second decision.\n' +
      '- [ADR-EXAMPLE-001](unordered-wrong.md) — a non-index reference.\n' +
      'See [ADR-EXAMPLE-001](prose-wrong.md) for context.\n'
    writeFileSync(join(directory, 'README.md'), original)

    const session = createDecisionRecordsSession({
      mode: 'conform',
      repository: root,
      userHome: tmpdir(),
      configuration: {}
    })
    const context = session.subjects[0]?.context() as DecisionRecordsRubricContext

    conform('INDEX-4', context)
    conform('INDEX-4', context)

    expect(session.proposal().writes).toEqual([
      {
        path: 'docs/decisions/README.md',
        content:
          '# Decisions\n\n' +
          'Introductory prose stays untouched.\n\n' +
          '1. [ADR-EXAMPLE-001](ADR-EXAMPLE-001-first-decision.md) — First decision.\n' +
          '2. [ADR-EXAMPLE-002](wrong-too.md) — Second decision.\n' +
          '- [ADR-EXAMPLE-001](unordered-wrong.md) — a non-index reference.\n' +
          'See [ADR-EXAMPLE-001](prose-wrong.md) for context.\n'
      }
    ])
  })
})

describe('decision dependency graph', () => {
  const dependentRecord = ({
    id,
    title,
    dependsOn,
    note = ''
  }: {
    id: string
    title: string
    dependsOn: string
    note?: string
  }) => `---
id: ${id}
title: '${title}'
date: 2026-07-22
status: current
decision_type: architecture
decision_type_url: https://knowledgeislands.info/specifications/decision-records/adr
${dependsOn}---

# ${id}: ${title}

## Context

The collection needs a durable decision record.

## Decision

The repository records this decision.

## Consequences

The decision remains readable. ${note}
`

  const dependsFixture = (
    files: ReadonlyArray<{ file: string; id: string; title: string; dependsOn: string; note?: string }>,
    indexIds: readonly string[]
  ) => {
    const root = mkdtempSync(join(tmpdir(), 'ki-decision-records-depends-'))
    temporaryRoots.push(root)
    const directory = join(root, 'docs', 'decisions')
    writeFileSync(join(root, '.ki.toml'), '[skills.ki-decision-records]\n')
    mkdirSync(directory, { recursive: true })
    for (const file of files) writeFileSync(join(directory, file.file), dependentRecord(file))
    const entries = indexIds
      .map((id, index) => {
        const file = files.find((candidate) => candidate.id === id)
        return `${index + 1}. [${id}](${file?.file ?? `${id}.md`}) — ${file?.title ?? 'unknown'}.`
      })
      .join('\n')
    writeFileSync(join(directory, 'README.md'), `# Decisions\n\n${entries}\n`)
    return createDecisionRecordsSession({
      mode: 'audit',
      repository: root,
      userHome: tmpdir(),
      configuration: {}
    }).subjects[0]?.context() as DecisionRecordsRubricContext
  }

  test('accepts resolvable, acyclic dependencies in reveal order, including a wrapped list and a foreign scope', () => {
    const context = dependsFixture(
      [
        { file: 'ADR-EXAMPLE-001-first-decision.md', id: 'ADR-EXAMPLE-001', title: 'First decision', dependsOn: '' },
        {
          file: 'GDR-EXAMPLE-001-second-decision.md',
          id: 'GDR-EXAMPLE-001',
          title: 'Second decision',
          dependsOn: 'decision_depends_on: [ADR-EXAMPLE-001]\n'
        },
        {
          file: 'ADR-EXAMPLE-002-third-decision.md',
          id: 'ADR-EXAMPLE-002',
          title: 'Third decision',
          dependsOn: 'decision_depends_on:\n  - ADR-EXAMPLE-001\n  - GDR-EXAMPLE-001\n  - SDR-ELSEWHERE-004\n'
        }
      ],
      ['ADR-EXAMPLE-001', 'GDR-EXAMPLE-001', 'ADR-EXAMPLE-002']
    )

    expect(context.depends.records.find((record) => record.id === 'ADR-EXAMPLE-002')?.dependsOn).toEqual([
      'ADR-EXAMPLE-001',
      'GDR-EXAMPLE-001',
      'SDR-ELSEWHERE-004'
    ])
    expect(audit('DEPENDS-1', context)?.[0]?.status).toBe('PASS')
    expect(audit('DEPENDS-2', context)?.[0]?.status).toBe('PASS')
    expect(audit('DEPENDS-3', context)?.[0]?.status).toBe('PASS')
  })

  test('reports an unresolved local target, a malformed entry, a cycle, and a dependency the index places later', () => {
    const context = dependsFixture(
      [
        {
          file: 'ADR-EXAMPLE-001-first-decision.md',
          id: 'ADR-EXAMPLE-001',
          title: 'First decision',
          dependsOn: 'decision_depends_on: [ADR-EXAMPLE-002, ADR-EXAMPLE-009, adopting-decision-records]\n'
        },
        {
          file: 'ADR-EXAMPLE-002-second-decision.md',
          id: 'ADR-EXAMPLE-002',
          title: 'Second decision',
          dependsOn: 'decision_depends_on: [ADR-EXAMPLE-001]\n'
        }
      ],
      ['ADR-EXAMPLE-001', 'ADR-EXAMPLE-002']
    )

    expect(audit('DEPENDS-1', context)?.map((outcome) => outcome.subject)).toEqual([
      'ADR-EXAMPLE-001',
      'ADR-EXAMPLE-001'
    ])
    expect(audit('DEPENDS-2', context)?.[0]).toMatchObject({
      status: 'VIOLATION',
      subject: 'ADR-EXAMPLE-001 -> ADR-EXAMPLE-002 -> ADR-EXAMPLE-001'
    })
    expect(audit('DEPENDS-3', context)?.[0]).toMatchObject({ status: 'VIOLATION', subject: 'ADR-EXAMPLE-001' })
  })

  test('reports a body citation of a higher-numbered record of the same type, and allows another type', () => {
    const context = dependsFixture(
      [
        {
          file: 'ADR-EXAMPLE-001-first-decision.md',
          id: 'ADR-EXAMPLE-001',
          title: 'First decision',
          dependsOn: '',
          note: 'ADR-EXAMPLE-002 generalises this, and GDR-EXAMPLE-001 carries the governance of it.'
        },
        {
          file: 'ADR-EXAMPLE-002-second-decision.md',
          id: 'ADR-EXAMPLE-002',
          title: 'Second decision',
          dependsOn: 'decision_depends_on: [ADR-EXAMPLE-001]\n',
          note: 'ADR-EXAMPLE-001 is the record this one builds on.'
        },
        { file: 'GDR-EXAMPLE-001-third-decision.md', id: 'GDR-EXAMPLE-001', title: 'Third decision', dependsOn: '' }
      ],
      ['ADR-EXAMPLE-001', 'ADR-EXAMPLE-002', 'GDR-EXAMPLE-001']
    )

    expect(audit('DEPENDS-4', context)).toEqual([
      expect.objectContaining({ status: 'VIOLATION', subject: 'ADR-EXAMPLE-001' })
    ])
  })

  test('treats a self-dependency as a cycle', () => {
    const context = dependsFixture(
      [
        {
          file: 'ADR-EXAMPLE-001-first-decision.md',
          id: 'ADR-EXAMPLE-001',
          title: 'First decision',
          dependsOn: 'decision_depends_on: [ADR-EXAMPLE-001]\n'
        }
      ],
      ['ADR-EXAMPLE-001']
    )

    expect(audit('DEPENDS-2', context)?.[0]).toMatchObject({
      status: 'VIOLATION',
      subject: 'ADR-EXAMPLE-001 -> ADR-EXAMPLE-001'
    })
  })
})

describe('self-contained collection', () => {
  const file = 'ADR-EXAMPLE-001-decide-the-record-shape.md'
  const sibling = { file: 'ADR-EXAMPLE-002-keep-records-whole.md', content: '# ADR-EXAMPLE-002: Keep records whole\n' }

  test('reports a references directory and a supporting file in the collection', () => {
    const context = fixture(file, { extra: [{ file: 'evidence.json', content: '{}\n' }] })
    const root = context as DecisionRecordsRubricContext
    expect(audit('FILENAME-4', root)?.map((outcome) => outcome.subject)).toEqual(['evidence.json'])

    const nested = mkdtempSync(join(tmpdir(), 'ki-decision-records-refs-'))
    temporaryRoots.push(nested)
    const directory = join(nested, 'docs', 'decisions')
    writeFileSync(join(nested, '.ki.toml'), '[skills.ki-decision-records]\n')
    mkdirSync(join(directory, 'references'), { recursive: true })
    writeFileSync(join(directory, 'references', 'brief.md'), '# Brief\n')
    writeFileSync(join(directory, file), record({}))
    writeFileSync(join(directory, '.DS_Store'), '')
    writeFileSync(join(directory, 'README.md'), `# Decisions\n\n1. [ADR-EXAMPLE-001](${file}) — record shape.\n`)
    const withReferences = createDecisionRecordsSession({
      mode: 'audit',
      repository: nested,
      userHome: tmpdir(),
      configuration: {}
    }).subjects[0]?.context() as DecisionRecordsRubricContext
    expect(audit('FILENAME-4', withReferences)?.map((outcome) => outcome.subject)).toEqual(['references'])
  })

  test('accepts a collection of records and their index alone', () => {
    const context = fixture(file, { extra: [sibling] })
    expect(audit('FILENAME-4', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('allows links to sibling records and external sources only', () => {
    const context = fixture(file, {
      extra: [sibling],
      legacyDate: [
        'See [ADR-EXAMPLE-002](ADR-EXAMPLE-002-keep-records-whole.md#decision), [[ADR-EXAMPLE-002-keep-records-whole|the sibling]],',
        '[the source](https://github.com/example/repo/blob/0123abc/README.md), [above](#context) and `[code](ignored.md)`.',
        ''
      ].join('\n')
    })
    expect(audit('BODY-11', context as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')
  })

  test('reports relative links and wikilinks that leave the collection', () => {
    const context = fixture(file, {
      extra: [sibling],
      legacyDate: [
        'See [the brief](references/brief.md), [the guide](../guides/guide.md), [[Charter]] and',
        '[ADR-OTHER-001](../../other/ADR-OTHER-001-x.md).',
        '',
        '[ref]: ./notes.md',
        ''
      ].join('\n')
    })
    expect(audit('BODY-11', context as DecisionRecordsRubricContext)?.map((outcome) => outcome.message)).toEqual([
      'Record links outside the collection: references/brief.md',
      'Record links outside the collection: ../guides/guide.md',
      'Record links outside the collection: ../../other/ADR-OTHER-001-x.md',
      'Record links outside the collection: ./notes.md',
      'Record links outside the collection: [[Charter]]'
    ])
  })

  test('reports history and alternatives sections but not ordinary ones', () => {
    const plain = fixture(file)
    expect(audit('BODY-12', plain as DecisionRecordsRubricContext)?.[0]?.status).toBe('PASS')

    const context = fixture(file, {
      legacyDate: '## Alternatives considered\n\nA.\n\n### History\n\nB.\n\n## Optional extras\n\nC.\n\n'
    })
    expect(audit('BODY-12', context as DecisionRecordsRubricContext)?.map((outcome) => outcome.message)).toEqual([
      'Record has a history or alternatives section: Alternatives considered',
      'Record has a history or alternatives section: History'
    ])
  })
})
