import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricContextOptions } from '../../shared/rubric.ts'
import { GATE } from '../items/gate.ts'
import definition from '../items/index.ts'
import { STREAM } from '../items/stream.ts'
import { createStreamsSession } from './streams.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const repository = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-repo-kb-streams-session-'))
  roots.push(root)
  return root
}

const options = (root: string, mode: 'audit' | 'conform'): RubricContextOptions => ({
  mode,
  repository: root,
  userHome: root,
  configuration: {}
})

const targetFixture = (): string => {
  const root = repository()
  mkdirSync(join(root, 'Streams', 'Roadmap'), { recursive: true })
  writeFileSync(join(root, 'Streams', 'Roadmap', '_ISSUES.md'), '# Streams issue ledger\n')
  writeFileSync(
    join(root, '.ki.toml'),
    '[skills.ki-repo-kb-streams]\nprocess_note = "Admin/Operations/Processes/Enactment Process"\n'
  )
  return root
}

const rootContext = (session: ReturnType<typeof createStreamsSession>) => {
  const [subject] = session.subjects
  if (!subject) throw new Error('ki-repo-kb-streams session did not expose its repository subject')
  return subject.context()
}

describe('ki-repo-kb-streams session', () => {
  test('assigns only declared rubric families to every subject', () => {
    const session = createStreamsSession(options(repository(), 'audit'))
    const declared = new Set(definition.families.map((family) => family.code))

    for (const subject of session.subjects) expect(subject.families.every((family) => declared.has(family))).toBe(true)
  })

  test('keeps conform read-only because record shape belongs to the roadmap adapter and Activities owner', () => {
    const session = createStreamsSession(options(targetFixture(), 'conform'))

    expect(session.proposal()).toEqual({ writes: [] })
  })

  test('reports an absent Streams zone as not applicable', () => {
    const root = repository()
    const session = createStreamsSession(options(root, 'audit'))
    const context = STREAM.selectContext(rootContext(session))

    expect(context.operationalAreas).toEqual([
      { level: 'NOT_APPLICABLE', message: 'No Streams/ zone; its presence is owned by ki-repo-kb.' }
    ])
    expect(session.proposal()).toEqual({ writes: [] })
  })

  test('recognises Roadmap without requiring a separate Housekeeping area', () => {
    const session = createStreamsSession(options(targetFixture(), 'audit'))
    const context = STREAM.selectContext(rootContext(session))

    expect(context.operationalAreas).toEqual([
      {
        level: 'PASS',
        message: 'Streams contains the configured Roadmap operational area.',
        subject: 'Streams'
      }
    ])
    expect(context.legacyFolders).toEqual([
      { level: 'PASS', message: 'No legacy Streams state or Focus folders are present.', subject: 'Streams' }
    ])
  })

  test('flags retained Housekeeping definitions for deliberate reconciliation without moving or deleting them', () => {
    const root = targetFixture()
    const directory = join(root, 'Streams', 'Housekeeping')
    mkdirSync(directory, { recursive: true })
    const path = join(directory, 'Weekly Review Housekeeping.md')
    const content = '# Retained recurring obligation\n'
    writeFileSync(path, content)
    const session = createStreamsSession(options(root, 'conform'))
    const context = STREAM.selectContext(rootContext(session))

    expect(context.operationalAreas).toEqual([
      {
        level: 'WARN',
        message: 'Streams operational areas need review: missing none; unexpected Housekeeping.',
        subject: 'Streams'
      },
      {
        level: 'WARN',
        message:
          'Recurring obligations belong in the configured Activity collection. Reconcile existing Streams/Housekeeping definitions with owner approval; do not automatically move, delete or duplicate them.',
        subject: 'Streams/Housekeeping'
      }
    ])
    expect(session.proposal()).toEqual({ writes: [] })
    expect(readFileSync(path, 'utf8')).toBe(content)
  })

  test('rejects a Triage directory because triage is roadmap metadata', () => {
    const root = targetFixture()
    mkdirSync(join(root, 'Streams', 'Triage'), { recursive: true })
    const session = createStreamsSession(options(root, 'audit'))
    const context = STREAM.selectContext(rootContext(session))

    expect(context.operationalAreas).toEqual([
      {
        level: 'FAIL',
        message: 'Triage is roadmap metadata; Streams/Triage/ must not exist.',
        subject: 'Streams'
      }
    ])
  })

  test('reports a legacy Focus folder without deriving a replacement record', () => {
    const root = targetFixture()
    mkdirSync(join(root, 'Streams', 'Now'), { recursive: true })
    const session = createStreamsSession(options(root, 'conform'))
    const context = STREAM.selectContext(rootContext(session))

    expect(context.legacyFolders).toEqual([
      { level: 'WARN', message: 'Legacy Streams state or Focus folders: Now.', subject: 'Streams' }
    ])
    expect(session.proposal()).toEqual({ writes: [] })
  })

  test('rejects inert area configuration rather than silently accepting it', () => {
    const root = targetFixture()
    writeFileSync(join(root, '.ki.toml'), '[skills.ki-repo-kb-streams.areas]\nOPS = "repository-operations"\n')
    const context = rootContext(createStreamsSession(options(root, 'audit')))
    const config = definition.families.find((family) => family.code === 'CONFIG')?.selectContext(context) as {
      knownKeys: readonly { level: string; message: string }[]
    }

    expect(config.knownKeys[0]).toMatchObject({ level: 'WARN', message: expect.stringContaining('areas') })
  })

  test('consumes process_note as a contained regular-file binding', () => {
    const root = targetFixture()
    const session = createStreamsSession(options(root, 'audit'))
    const context = rootContext(session)
    const config = definition.families.find((family) => family.code === 'CONFIG')?.selectContext(context) as {
      processNote: readonly { level: string; message: string }[]
    }

    expect(config.processNote[0]).toMatchObject({ level: 'WARN', message: expect.stringContaining('missing') })
  })

  test('allows the documented extensionless process-note binding', () => {
    const root = targetFixture()
    mkdirSync(join(root, 'Admin', 'Operations', 'Processes'), { recursive: true })
    writeFileSync(join(root, 'Admin', 'Operations', 'Processes', 'Enactment Process.md'), '# Enactment Process\n')
    const context = rootContext(createStreamsSession(options(root, 'audit')))
    const config = definition.families.find((family) => family.code === 'CONFIG')?.selectContext(context) as {
      processNote: readonly { level: string }[]
    }

    expect(config.processNote[0]).toMatchObject({ level: 'PASS' })
  })

  test('requires an always-loaded anchor only after a roadmap record exists', () => {
    const root = targetFixture()
    writeFileSync(join(root, 'Streams', 'Roadmap', 'KB-OPS-001-test.md'), '# Test\n')
    writeFileSync(join(root, 'AGENTS.md'), 'Canonical changes use Streams/Roadmap through ki-repo-kb-streams.\n')
    const session = createStreamsSession(options(root, 'audit'))
    const context = GATE.selectContext(rootContext(session))

    expect(context.anchor).toEqual([{ level: 'PASS', message: 'Enactment gate is anchored.', subject: 'AGENTS.md' }])
  })

  test('fails every Streams roadmap record whose identifier another record shares', () => {
    const root = targetFixture()
    const record = (name: string, id?: string) =>
      writeFileSync(
        join(root, 'Streams', 'Roadmap', name),
        `${id ? `---\nid: ${id}\ntitle: Fixture\n---\n\n` : ''}# Fixture\n`
      )
    record('KB-OPS-001-first.md', 'KB-OPS-001')
    record('KB-OPS-002-second.md', 'KB-OPS-002')
    record('notes.md')
    record('_ISSUES.md', 'KB-OPS-001')
    const unique = STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit'))))
    expect(unique.roadmapIdentity).toEqual([
      { level: 'PASS', message: 'Every roadmap record identifier is unique.', subject: join('Streams', 'Roadmap') }
    ])

    record('KB-OPS-001-collision.md', 'KB-OPS-001')
    const duplicated = STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit'))))
    const item = STREAM.items.find((candidate) => candidate.code === 'STREAM-6')

    expect(duplicated.roadmapIdentity.map((evidence) => [evidence.level, evidence.subject])).toEqual([
      ['FAIL', join('Streams', 'Roadmap', 'KB-OPS-001-collision.md')],
      ['FAIL', join('Streams', 'Roadmap', 'KB-OPS-001-first.md')]
    ])
    expect(item?.mechanical?.level).toBe('FAIL')
    expect(item?.mechanical?.audit.run(duplicated).map((outcome) => outcome.status)).toEqual(['VIOLATION', 'VIOLATION'])
  })

  test('treats a roadmap without identified records as not applicable', () => {
    const root = targetFixture()
    const context = STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit'))))

    expect(context.roadmapIdentity).toEqual([
      { level: 'NOT_APPLICABLE', message: 'No identified roadmap records are present.' }
    ])
  })
})
