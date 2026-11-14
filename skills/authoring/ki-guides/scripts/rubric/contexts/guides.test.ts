import { expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createGuidesSession } from './guides.ts'

const LEAD = 'x'.repeat(120)

const temporaryRepository = (): string => mkdtempSync(join(tmpdir(), 'ki-guides-'))

test('the session identifies the controlled root, guides, and retired roots', () => {
  const repository = temporaryRepository()
  mkdirSync(join(repository, 'docs/guides/developer'), { recursive: true })
  mkdirSync(join(repository, 'docs/spec'), { recursive: true })
  writeFileSync(join(repository, 'docs/guides/README.md'), '# Guides\n')
  writeFileSync(join(repository, 'docs/guides/developer/workflow.md'), '# Workflow\n')
  writeFileSync(
    join(repository, 'docs/guides/developer/example.md'),
    '# Example\n\n```sh\n# A shell comment, not an H1.\n```\n'
  )
  writeFileSync(join(repository, 'docs/guides/developer/broken.md'), 'No H1\n')

  const session = createGuidesSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const context = session.subjects[1]?.context()
  if (!context) throw new Error('ki-guides session did not expose its repository subject')

  expect(context.layout).toEqual({
    directoryExists: true,
    indexExists: true,
    rootGuides: [],
    headingIssues: ['docs/guides/developer/broken.md'],
    openingIssues: [
      { file: 'docs/guides/developer/broken.md', length: 5 },
      { file: 'docs/guides/developer/example.md', length: 39 },
      { file: 'docs/guides/developer/workflow.md', length: 0 }
    ],
    escapingLinks: []
  })
  expect(context.boundary.retiredRoots).toEqual(['docs/spec'])
  expect(session.proposal()).toEqual({ writes: [] })
})

test('a docs/logs path is left to its specialised owner', () => {
  const repository = temporaryRepository()
  mkdirSync(join(repository, 'docs/guides'), { recursive: true })
  mkdirSync(join(repository, 'docs/logs'), { recursive: true })
  writeFileSync(join(repository, 'docs/guides/README.md'), '# Guides\n')
  const session = createGuidesSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const context = session.subjects[1]?.context()
  if (!context) throw new Error('ki-guides session did not expose its repository subject')

  expect(context.boundary.retiredRoots).toEqual([])
})

test('a guide directly below docs/guides is reported; audience folders and references are not', () => {
  const cases: readonly (readonly [readonly string[], readonly string[]])[] = [
    [[], []],
    [['developer/workflow.md'], []],
    [['developer/release/checklist.md', 'operator/runbook.md'], []],
    [['references/glossary.md', 'user/start.md'], []],
    [['overview.md'], ['docs/guides/overview.md']],
    [['overview.md', 'developer/workflow.md'], ['docs/guides/overview.md']]
  ]
  for (const [guides, rootGuides] of cases) {
    const repository = temporaryRepository()
    mkdirSync(join(repository, 'docs/guides'), { recursive: true })
    writeFileSync(join(repository, 'docs/guides/README.md'), '# Guides\n')
    for (const guide of guides) {
      const path = join(repository, 'docs/guides', guide)
      mkdirSync(join(path, '..'), { recursive: true })
      writeFileSync(path, `# Guide\n\n${LEAD}\n`)
    }

    const session = createGuidesSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
    const context = session.subjects[1]?.context()
    if (!context) throw new Error('ki-guides session did not expose its repository subject')

    expect(context.layout).toEqual({
      directoryExists: true,
      indexExists: true,
      rootGuides,
      headingIssues: [],
      openingIssues: [],
      escapingLinks: []
    })
    expect(session.proposal()).toEqual({ writes: [] })
  }
})

test('a link to a document outside the collection escapes; code paths and siblings do not', () => {
  const repository = temporaryRepository()
  mkdirSync(join(repository, 'docs/guides/developer'), { recursive: true })
  writeFileSync(join(repository, 'docs/guides/README.md'), '# Guides\n')
  writeFileSync(
    join(repository, 'docs/guides/developer/workflow.md'),
    [
      '# Workflow',
      '',
      'A sibling: [provenance](provenance.md), and the index: [guides](../README.md).',
      'Code is the subject: [the script](../../../scripts/verify.ts) and [a directory](../../../src/).',
      'An external URL: [Bun](https://bun.sh).',
      'Escaping: [a decision](../../decisions/ADR-001-a-decision.md) and [the orientation](../../../AGENTS.md#working-here).',
      ''
    ].join('\n')
  )
  writeFileSync(join(repository, 'docs/guides/developer/provenance.md'), '# Provenance\n')

  const session = createGuidesSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const context = session.subjects[1]?.context()
  if (!context) throw new Error('ki-guides session did not expose its repository subject')

  expect(context.layout.escapingLinks).toEqual([
    'docs/guides/developer/workflow.md -> ../../decisions/ADR-001-a-decision.md',
    'docs/guides/developer/workflow.md -> ../../../AGENTS.md#working-here'
  ])
})

test('a guide opening shorter than 120 characters of prose is reported; the root index is exempt', () => {
  const repository = temporaryRepository()
  mkdirSync(join(repository, 'docs/guides/developer'), { recursive: true })
  writeFileSync(join(repository, 'docs/guides/README.md'), '# Guides\n\nShort.\n')
  const guides: Record<string, string> = {
    'short.md': `# Short\n\n${'x'.repeat(119)}\n\n## Steps\n\n${LEAD}\n`,
    'floor.md': `# Floor\n\n${LEAD}\n\n## Steps\n`,
    'wrapped.md': `---\ntitle: ${LEAD}\n---\n\n# Wrapped\n\n<!-- ${LEAD} -->\n${'y'.repeat(60)}\n${'z'.repeat(59)}\n\n## Steps\n`,
    'unbroken.md': `# Unbroken\n\n${'w'.repeat(40)}\n`
  }
  for (const [name, content] of Object.entries(guides)) {
    writeFileSync(join(repository, 'docs/guides/developer', name), content)
  }

  const session = createGuidesSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const context = session.subjects[1]?.context()
  if (!context) throw new Error('ki-guides session did not expose its repository subject')

  expect(context.layout.openingIssues).toEqual([
    { file: 'docs/guides/developer/short.md', length: 119 },
    { file: 'docs/guides/developer/unbroken.md', length: 40 }
  ])
})
