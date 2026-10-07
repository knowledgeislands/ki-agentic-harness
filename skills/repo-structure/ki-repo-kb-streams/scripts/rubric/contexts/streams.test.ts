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

  test('recognises the Projects and Initiatives registry and the ideas list beside the Roadmap ledger', () => {
    const root = targetFixture()
    mkdirSync(join(root, 'Streams', 'Projects'), { recursive: true })
    writeFileSync(join(root, 'Streams', 'Projects', 'Projects.md'), '# Projects\n')
    mkdirSync(join(root, 'Streams', 'Initiatives'), { recursive: true })
    writeFileSync(join(root, 'Streams', 'Initiatives', 'Initiatives.md'), '# Initiatives\n')
    mkdirSync(join(root, 'Streams', 'Roadmap'), { recursive: true })
    writeFileSync(join(root, 'Streams', 'Roadmap', '_IDEAS.md'), '# Ideas\n\n- Try a faster parser.\n')
    const session = createStreamsSession(options(root, 'audit'))
    const context = STREAM.selectContext(rootContext(session))

    expect(context.operationalAreas[0]).toEqual({
      level: 'PASS',
      message: 'Streams contains the configured Roadmap operational area.',
      subject: 'Streams'
    })
    expect(JSON.stringify(context)).not.toContain('_IDEAS.md')
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

  test('fails each Streams roadmap record without valid frontmatter whose id matches its filename', () => {
    const root = targetFixture()
    const roadmap = join(root, 'Streams', 'Roadmap')
    const write = (name: string, content: string) => writeFileSync(join(roadmap, name), content)
    write('KB-OPS-001-valid.md', '---\nid: KB-OPS-001\ntitle: Valid\n---\n\n# Valid\n')
    write('KB-OPS-008-2026-review.md', '---\nid: KB-OPS-008\ntitle: Digit-led slug\n---\n\n# Digit-led slug\n')
    write('_ISSUES.md', '# Ledger without frontmatter\n')
    write('Roadmap.md', '# Roadmap index note without frontmatter\n')
    const item = STREAM.items.find((candidate) => candidate.code === 'STREAM-7')
    const evaluate = () => STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit'))))

    expect(evaluate().roadmapFrontmatter).toEqual([
      {
        level: 'PASS',
        message: 'Every roadmap record has frontmatter whose id matches its filename identifier.',
        subject: join('Streams', 'Roadmap')
      }
    ])

    write('KB-OPS-002-no-frontmatter.md', '# No frontmatter\n')
    write('KB-OPS-003-no-id.md', '---\ntitle: No id\n---\n\n# No id\n')
    write('KB-OPS-004-mismatch.md', '---\nid: KB-OPS-040\ntitle: Mismatch\n---\n\n# Mismatch\n')
    write('KB-OPS-005-unparseable.md', '---\nid: KB-OPS-005\ntitle: [unclosed\n---\n\n# Unparseable\n')
    write('notes.md', '---\nid: KB-OPS-006\n---\n\n# Notes\n')
    write('KB-OPS-007.md', '---\nid: KB-OPS-007\n---\n\n# No slug\n')
    const malformed = evaluate()
    const subject = (name: string) => join('Streams', 'Roadmap', name)

    expect(malformed.roadmapFrontmatter).toEqual([
      {
        level: 'FAIL',
        message: `Roadmap record ${subject('KB-OPS-002-no-frontmatter.md')} does not begin with YAML frontmatter.`,
        subject: subject('KB-OPS-002-no-frontmatter.md')
      },
      {
        level: 'FAIL',
        message: `Roadmap record ${subject('KB-OPS-003-no-id.md')} has no frontmatter id.`,
        subject: subject('KB-OPS-003-no-id.md')
      },
      {
        level: 'FAIL',
        message: `Roadmap record ${subject('KB-OPS-004-mismatch.md')} has id KB-OPS-040, which does not match its filename identifier KB-OPS-004.`,
        subject: subject('KB-OPS-004-mismatch.md')
      },
      {
        level: 'FAIL',
        message: `Roadmap record ${subject('KB-OPS-005-unparseable.md')} has frontmatter that is not parseable YAML.`,
        subject: subject('KB-OPS-005-unparseable.md')
      },
      {
        level: 'FAIL',
        message: `Roadmap record ${subject('KB-OPS-007.md')} has id KB-OPS-007, but its filename is not of the form KB-OPS-007-<slug>.md.`,
        subject: subject('KB-OPS-007.md')
      },
      {
        level: 'FAIL',
        message: `Roadmap record ${subject('notes.md')} has id KB-OPS-006, but its filename is not of the form KB-OPS-006-<slug>.md.`,
        subject: subject('notes.md')
      }
    ])
    expect(item?.mechanical?.level).toBe('FAIL')
    expect(item?.mechanical?.audit.run(malformed).map((outcome) => outcome.status)).toEqual(Array(6).fill('VIOLATION'))

    for (const name of [
      'KB-OPS-002-no-frontmatter.md',
      'KB-OPS-003-no-id.md',
      'KB-OPS-004-mismatch.md',
      'KB-OPS-005-unparseable.md',
      'KB-OPS-007.md',
      'notes.md'
    ])
      rmSync(join(roadmap, name))
    expect(evaluate().roadmapFrontmatter.map((evidence) => evidence.level)).toEqual(['PASS'])
  })

  test('reports a record skipped by the identity check under STREAM-7 and a shared id under STREAM-6', () => {
    const root = targetFixture()
    const roadmap = join(root, 'Streams', 'Roadmap')
    writeFileSync(join(roadmap, 'KIT-007-first.md'), '---\nid: KIT-007\n---\n\n# First\n')
    writeFileSync(join(roadmap, 'KIT-007-second.md'), '---\nid: KIT-007\n---\n\n# Second\n')
    writeFileSync(join(roadmap, 'KIT-008-unformatted.md'), '# Unformatted\n')
    const context = STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit'))))

    expect(context.roadmapIdentity.map((evidence) => [evidence.level, evidence.subject])).toEqual([
      ['FAIL', join('Streams', 'Roadmap', 'KIT-007-first.md')],
      ['FAIL', join('Streams', 'Roadmap', 'KIT-007-second.md')]
    ])
    expect(context.roadmapFrontmatter.map((evidence) => [evidence.level, evidence.subject])).toEqual([
      ['FAIL', join('Streams', 'Roadmap', 'KIT-008-unformatted.md')]
    ])
  })

  test('treats a roadmap without records as not applicable for frontmatter', () => {
    const context = STREAM.selectContext(rootContext(createStreamsSession(options(targetFixture(), 'audit'))))

    expect(context.roadmapFrontmatter).toEqual([
      { level: 'NOT_APPLICABLE', message: 'No roadmap records are present.' }
    ])
  })

  test('treats a roadmap without identified records as not applicable', () => {
    const root = targetFixture()
    const context = STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit'))))

    expect(context.roadmapIdentity).toEqual([
      { level: 'NOT_APPLICABLE', message: 'No identified roadmap records are present.' }
    ])
  })

  test('passes a canonical counts-only ledger and fails one carrying extra prose', () => {
    const root = targetFixture()
    const ledger = join(root, 'Streams', 'Roadmap', '_ISSUES.md')
    const canonical =
      "---\nareas: { GOV: 27, OPS: 11 }\n---\n\n# Roadmap issue ledger\n\nThis ledger reserves fixed issuing-area namespaces. Allocate the next work item in its area as one greater than that area's high-water mark; never lower a value or reuse an issued number after a record is pruned. Reserve a number by committing this ledger's advance on its own before writing the record. Areas are not mutable themes or groups.\n\n- `GOV` reserves through `027`.\n- `OPS` reserves through `011`.\n"
    writeFileSync(ledger, canonical)
    expect(STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit')))).issueLedger).toEqual([
      {
        level: 'PASS',
        message: 'The issue ledger holds only its header and counters.',
        subject: 'Streams/Roadmap/_ISSUES.md'
      }
    ])

    writeFileSync(ledger, `${canonical}\n## Owner-reviewed legacy migration\n\nDispositions.\n`)
    expect(STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit')))).issueLedger).toEqual([
      {
        level: 'FAIL',
        message: 'The issue ledger holds content beyond its canonical header and counters.',
        subject: 'Streams/Roadmap/_ISSUES.md'
      }
    ])

    writeFileSync(ledger, '# Roadmap issue ledger\n\n| Area | High-water mark |\n| --- | --- |\n| `GOV` | 027 |\n')
    expect(STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit')))).issueLedger[0]?.level).toBe(
      'FAIL'
    )
  })

  test('fails registry notes that list work records or carry an Update section, but not Decision Records', () => {
    const root = targetFixture()
    mkdirSync(join(root, 'Streams', 'Projects'), { recursive: true })
    mkdirSync(join(root, 'Streams', 'Initiatives'), { recursive: true })
    writeFileSync(join(root, 'Streams', 'Projects', 'Projects.md'), '# Projects\n\n- [[website]] - The public site.\n')
    writeFileSync(
      join(root, 'Streams', 'Projects', 'website.md'),
      '---\nnote_type: streams/project\ninitiative: techne\nlifecycle: active\n---\n\n# Website\n\n## Outcome\n\nA site.\n\n## Notes\n\nSee [[GDR-KI-ARCADIA-005-the-roadmap-model|GDR-KI-ARCADIA-005]] and ISO-8601 dates.\n'
    )
    writeFileSync(join(root, 'Streams', 'Initiatives', 'techne.md'), '# Techne\n\n## Direction\n\nHosting.\n')
    const audit = () => STREAM.selectContext(rootContext(createStreamsSession(options(root, 'audit')))).registryNotes

    expect(audit()).toEqual([
      {
        level: 'PASS',
        message: 'Project and Initiative notes link upwards only.',
        subject: 'Streams/Projects, Streams/Initiatives'
      }
    ])

    writeFileSync(
      join(root, 'Streams', 'Initiatives', 'techne.md'),
      '# Techne\n\n## Projects\n\n- KI-TOOL-CLI-112 - Read the model\n- [[KI-ARCADIA-GOV-026-create-the-registry]]\n\n## Update\n\n**2026-10-07.** On track.\n'
    )
    expect(audit()).toEqual([
      {
        level: 'FAIL',
        message:
          'Registry note lists work records (KI-TOOL-CLI-112; KI-ARCADIA-GOV-026); records name their Project or Initiative instead.',
        subject: 'Streams/Initiatives/techne.md'
      },
      {
        level: 'FAIL',
        message: 'Registry note carries a dated ## Update section; status lives in the records and lifecycle.',
        subject: 'Streams/Initiatives/techne.md'
      }
    ])
  })
})
