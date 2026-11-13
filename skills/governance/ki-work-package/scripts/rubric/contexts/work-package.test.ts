import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome, RubricItem } from '../../shared/rubric.ts'
import { BOUNDARY } from '../items/boundary.ts'
import { CONFIG } from '../items/configuration.ts'
import { FOLDER } from '../items/folder.ts'
import { LIFECYCLE } from '../items/lifecycle.ts'
import { RECORD } from '../items/records.ts'
import { STRUCTURE } from '../items/structure.ts'
import { createWorkPackageSession, roleCatalogue, type WorkPackageRubricContext } from './work-package.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-work-package-'))
  roots.push(root)
  return root
}

const write = (root: string, path: string, text: string): void => {
  const file = join(root, path)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, text)
}

type Entry = {
  readonly id: string
  readonly fields?: readonly string[]
  readonly drop?: readonly string[]
  readonly body?: string
  readonly changes?: readonly string[]
}

const BASE_FIELDS = (id: string): Record<string, string> => ({
  id: `id: ${id}`,
  parent: 'parent: ki.sop.main',
  level: 'level: regular',
  description: 'description: Pilots the package shape. Takes pilot units. Not for other work.',
  worker: 'worker: agent',
  supervisor: 'supervisor: owner',
  role: 'role: warden',
  created_at: 'created_at: 2026-11-01T10:00:00Z',
  repositories: 'repositories:\n  - ki-agentic-harness',
  state: 'state: with-worker',
  since: 'since: 2026-11-09T10:00:00Z'
})

/** An entry file: the base fields less `drop`, plus `fields`, then the standard body. */
const entry = ({ id, fields = [], drop = [], body, changes = ['10-pilot.change.md'] }: Entry): string => {
  const base = Object.entries(BASE_FIELDS(id))
    .filter(([key]) => !drop.includes(key))
    .map(([, line]) => line)
  const links = changes.length > 0 ? changes.map((target) => `- [${target}](${target}) - in hand.`).join('\n') : 'None'
  return [
    '---',
    ...base,
    ...fields,
    '---',
    '',
    body ??
      [
        `# ${id}`,
        '',
        '## Goals',
        '',
        'Pilot the shape.',
        '',
        '## Scope',
        '',
        'In: the pilot. Out: everything else. Works mainly in ki-agentic-harness and may change others.',
        '',
        '## Now',
        '',
        '- The pilot runs.',
        '',
        '## Held',
        '',
        'None',
        '',
        '## Changes',
        '',
        links,
        ''
      ].join('\n')
  ].join('\n')
}

const MAIN = entry({
  id: 'ki.sop.main',
  drop: ['parent'],
  fields: ['covers:\n  - ki.reg.pilot'],
  changes: []
}).replace('level: regular', 'level: territory')

/** A store with the main State of play and one regular package, `ki.reg.pilot`, each passing. */
const store = (pilot: Partial<Entry> = {}): string => {
  const root = fixture()
  write(root, 'work/ki/ki.sop.main/_index.md', MAIN)
  write(root, 'work/ki/ki.reg.pilot/_index.md', entry({ id: 'ki.reg.pilot', ...pilot }))
  write(root, 'work/ki/ki.reg.pilot/10-pilot.change.md', '# Pilot\n')
  return root
}

const context = (
  root: string,
  configuration: Readonly<Record<string, unknown>> | null = {}
): WorkPackageRubricContext => {
  const session = createWorkPackageSession({
    mode: 'audit',
    repository: root,
    userHome: tmpdir(),
    configuration: configuration as Readonly<Record<string, unknown>>
  })
  const found = session.subjects[0]?.context()
  if (!found) throw new Error('ki-work-package session did not expose its subject')
  return found as WorkPackageRubricContext
}

const run = <Context>(
  family: { items: readonly RubricItem<Context>[]; selectContext: (root: WorkPackageRubricContext) => Context },
  code: string,
  root: WorkPackageRubricContext
): readonly AuditOutcome[] => {
  const item = family.items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} mechanical item is missing`)
  return item.mechanical.audit.run(family.selectContext(root))
}

const statuses = (outcomes: readonly AuditOutcome[]): string[] =>
  outcomes.map((outcome) => (outcome.status === 'VIOLATION' ? (outcome.level ?? 'VIOLATION') : outcome.status))

const messages = (outcomes: readonly AuditOutcome[]): string => outcomes.map((outcome) => outcome.message).join('\n')

describe('a store in the standard shape', () => {
  test('passes every mechanical item', () => {
    const found = context(store())
    for (const [family, codes] of [
      [CONFIG, ['CONFIG-1']],
      [STRUCTURE, ['STRUCTURE-1', 'STRUCTURE-2']],
      [RECORD, ['RECORD-1', 'RECORD-2']],
      [LIFECYCLE, ['LIFECYCLE-1', 'LIFECYCLE-3']],
      [FOLDER, ['FOLDER-1', 'FOLDER-4', 'FOLDER-8']],
      [BOUNDARY, ['BOUNDARY-1']]
    ] as const)
      for (const code of codes)
        expect({ code, outcomes: statuses(run(family as never, code, found)) }).toEqual({ code, outcomes: ['PASS'] })
  })

  test('an optional one-line Values after Scope is admitted', () => {
    const root = store()
    write(
      root,
      'work/ki/ki.reg.pilot/_index.md',
      entry({ id: 'ki.reg.pilot' }).replace('## Now', '## Values\n\nThe shared values.\n\n## Now')
    )
    expect(statuses(run(RECORD, 'RECORD-2', context(root)))).toEqual(['PASS'])
  })

  test('a repository without `work/` is not applicable, and an undeclared one is never read', () => {
    const empty = fixture()
    expect(statuses(run(STRUCTURE, 'STRUCTURE-1', context(empty)))).toEqual(['NOT_APPLICABLE'])
    expect(statuses(run(FOLDER, 'FOLDER-1', context(empty)))).toEqual(['NOT_APPLICABLE'])
    const undeclared = context(store(), null)
    expect(statuses(run(RECORD, 'RECORD-2', undeclared))).toEqual(['NOT_APPLICABLE'])
    expect(statuses(run(STRUCTURE, 'STRUCTURE-2', undeclared))).toEqual(['NOT_APPLICABLE'])
  })

  test('configuration options warn', () => {
    expect(statuses(run(CONFIG, 'CONFIG-1', context(store(), { retention: 3 })))).toEqual(['WARN'])
  })

  test('the session proposes no writes', () => {
    const session = createWorkPackageSession({
      mode: 'conform',
      repository: store(),
      userHome: tmpdir(),
      configuration: {}
    })
    expect(session.proposal()).toEqual({ writes: [] })
  })
})

describe('STRUCTURE', () => {
  test('`work/` holds only territory folders of packages with their entry file', () => {
    const root = store()
    write(root, 'work/notes.md', '# Notes\n')
    mkdirSync(join(root, 'work', 'empty'))
    mkdirSync(join(root, 'work', 'ki', 'no-entry'))
    write(root, 'work/ki/loose.md', '# Loose\n')
    const outcomes = run(STRUCTURE, 'STRUCTURE-1', context(root))
    expect(outcomes.map((outcome) => outcome.subject)).toEqual([
      'work/empty',
      'work/ki/loose.md',
      'work/ki/no-entry',
      'work/notes.md'
    ])
  })

  test('a symlinked package folder fails', () => {
    const root = store()
    symlinkSync(join(root, 'work', 'ki', 'ki.reg.pilot'), join(root, 'work', 'ki', 'ki.reg.alias'))
    expect(run(STRUCTURE, 'STRUCTURE-1', context(root)).map((outcome) => outcome.subject)).toEqual([
      'work/ki/ki.reg.alias'
    ])
  })

  test('each earlier copy in a retired working area is listed and warned', () => {
    const root = store()
    for (const area of ['_WORK', '_THREADS']) write(root, `+/${area}/ki.reg.pilot/_index.md`, '# old\n')
    const outcomes = run(STRUCTURE, 'STRUCTURE-2', context(root))
    expect(outcomes.map((outcome) => outcome.subject)).toEqual(['+/_WORK', '+/_THREADS'])
    expect(STRUCTURE.items.find((item) => item.code === 'STRUCTURE-2')?.mechanical?.level).toBe('WARN')
  })

  test('earlier copies are listed in a declaring repository without `work/`', () => {
    const root = fixture()
    write(root, '+/_CHECKPOINTS/README.md', '# Checkpoints\n')
    expect(run(STRUCTURE, 'STRUCTURE-2', context(root)).map((outcome) => outcome.subject)).toEqual(['+/_CHECKPOINTS'])
  })
})

describe('RECORD-1 identity', () => {
  test('the id, folder and H1 agree, and the territory folder is the first segment', () => {
    const root = store({ fields: [] })
    write(
      root,
      'work/ki/ki.reg.pilot/_index.md',
      entry({ id: 'ki.reg.pilot' }).replace('id: ki.reg.pilot', 'id: ki.reg.other')
    )
    write(root, 'work/hnr/ki.reg.stray/_index.md', entry({ id: 'ki.reg.stray' }))
    write(root, 'work/hnr/ki.reg.stray/10-pilot.change.md', '# Pilot\n')
    const text = messages(run(RECORD, 'RECORD-1', context(root)))
    expect(text).toContain('id must exactly match the package folder name')
    expect(text).toContain('territory folder of its id')
  })

  test('an opaque session name fails', () => {
    const root = store()
    const id = 'session-abcdef123456789'
    write(root, `work/ki/${id}/_index.md`, entry({ id }))
    write(root, `work/ki/${id}/10-pilot.change.md`, '# Pilot\n')
    expect(messages(run(RECORD, 'RECORD-1', context(root)))).toContain('dotted id')
  })

  test('a sub-package is `<parent id>.<slug>`', () => {
    const root = store({ changes: ['10-pilot.change.md', 'viewer/'] })
    write(
      root,
      'work/ki/ki.reg.pilot/viewer/_index.md',
      entry({ id: 'ki.reg.pilot.viewer', drop: ['parent'], fields: ['parent: ki.reg.pilot'] })
    )
    write(root, 'work/ki/ki.reg.pilot/viewer/10-pilot.change.md', '# Viewer\n')
    expect(statuses(run(RECORD, 'RECORD-1', context(root)))).toEqual(['PASS'])
    expect(statuses(run(RECORD, 'RECORD-2', context(root)))).toEqual(['PASS'])
    write(
      root,
      'work/ki/ki.reg.pilot/viewer/_index.md',
      entry({ id: 'ki.reg.viewer', drop: ['parent'], fields: ['parent: ki.reg.pilot'] })
    )
    expect(messages(run(RECORD, 'RECORD-1', context(root)))).toContain('id must be ki.reg.pilot.viewer')
  })
})

describe('RECORD-2 schema', () => {
  const failing: readonly [string, Partial<Entry>, string][] = [
    ['a missing repositories', { drop: ['repositories'] }, 'missing: repositories'],
    [
      'repositories that is not a list',
      { drop: ['repositories'], fields: ['repositories: harness'] },
      'repositories must be a list'
    ],
    ['a retired state.md field kept elsewhere', { fields: ['focus: pilot'] }, 'outside it: focus'],
    ['an unknown state', { drop: ['state'], fields: ['state: done'] }, 'state must be one of'],
    ['a target outside handoff', { fields: ['target: owner'] }, 'target names a holder'],
    ['a hold outside on-hold', { fields: ['hold:\n  reason: paused\n  release: later'] }, 'hold carries reason'],
    [
      'a worker setting a paused hold',
      {
        drop: ['state'],
        fields: ['state: on-hold', 'hold:\n  reason: paused\n  release: later\n  set_by: worker']
      },
      'hold carries reason'
    ],
    ['a status without its capability', { fields: ['listening_status: on'] }, 'listening_status is on or off'],
    [
      'syncing without listening',
      {
        fields: ['syncing_enabled: true', 'syncing_status: on']
      },
      'a syncing thread is always a listening thread'
    ],
    ['a bad method_read', { fields: ['method_read: latest'] }, 'method_read must be'],
    ['a project field below project level', { fields: ['project: pilot'] }, 'project names the Project slug'],
    ['a non-catalogue role', { drop: ['role'], fields: ['role: wizard'] }, 'role must be one catalogue role'],
    [
      'a worker tier not its role',
      {
        fields: ['workers:\n  - role: housekeeper\n    tier: leaders']
      },
      'tier must be managers'
    ],
    [
      'a worker key outside the closed set',
      {
        fields: ['workers:\n  - role: warden\n    tier: managers\n    seat: one']
      },
      'outside role, tier, since, status and listening'
    ],
    [
      'covers below territory level',
      { fields: ['covers:\n  - ki.reg.other'] },
      'covers belongs only to States of play'
    ],
    [
      'a parent outside the territory',
      { drop: ['parent'], fields: ['parent: hnr.sop.main'] },
      'same-territory State of play'
    ]
  ]
  for (const [name, change, expected] of failing)
    test(`${name} fails`, () => {
      const outcomes = run(RECORD, 'RECORD-2', context(store(change)))
      expect(statuses(outcomes)).toContain('VIOLATION')
      expect(messages(outcomes)).toContain(expected)
    })

  test('the old body sections fail', () => {
    const root = store()
    write(
      root,
      'work/ki/ki.reg.pilot/_index.md',
      entry({
        id: 'ki.reg.pilot',
        body: '# ki.reg.pilot\n\n## Goals\n\nPilot.\n\n## Scope\n\nIn: all.\n\n## Focus\n\n- `pilot`\n'
      })
    )
    expect(messages(run(RECORD, 'RECORD-2', context(root)))).toContain(
      'then Goals, Scope, an optional Values, Now, Held and Changes'
    )
  })

  test('an empty section fails', () => {
    const root = store()
    write(root, 'work/ki/ki.reg.pilot/_index.md', entry({ id: 'ki.reg.pilot' }).replace('None\n', '\n'))
    expect(messages(run(RECORD, 'RECORD-2', context(root)))).toContain('Held must say something')
  })

  test('work absent from the main register fails', () => {
    const root = store()
    write(root, 'work/ki/ki.sop.main/_index.md', MAIN.replace('covers:\n  - ki.reg.pilot', 'covers: []'))
    expect(messages(run(RECORD, 'RECORD-2', context(root)))).toContain('absent from the main covers register')
  })

  test('a sub-package names its parent package and keeps its level', () => {
    const root = store({ changes: ['10-pilot.change.md', 'viewer/'] })
    write(
      root,
      'work/ki/ki.reg.pilot/viewer/_index.md',
      entry({ id: 'ki.reg.pilot.viewer', fields: ['covers: []'] }).replace('level: regular', 'level: project')
    )
    write(root, 'work/ki/ki.reg.pilot/viewer/10-pilot.change.md', '# Viewer\n')
    const text = messages(run(RECORD, 'RECORD-2', context(root)))
    expect(text).toContain("parent must name the sub-package's parent package, ki.reg.pilot")
    expect(text).toContain('covers belongs only to States of play')
    expect(text).toContain("a sub-package's level is its parent's, regular")
  })

  const tolerated: readonly [string, Partial<Entry>][] = [
    ['an absent role', { drop: ['role'] }],
    ['the old role word keeper', { drop: ['role'], fields: ['role: keeper'] }],
    ['a worker focus', { fields: ['workers:\n  - role: warden\n    tier: managers\n    focus:\n      - pilot'] }],
    ['the old tier enablers', { fields: ['workers:\n  - role: warden\n    tier: enablers'] }],
    ['listening agora-call', { fields: ['workers:\n  - role: warden\n    tier: managers\n    listening: agora-call'] }]
  ]
  for (const [name, change] of tolerated)
    test(`${name} warns under the role migration file`, () => {
      const outcomes = run(RECORD, 'RECORD-2', context(store(change)))
      expect(statuses(outcomes)).toEqual(['WARN'])
      expect(messages(outcomes)).toContain('standards-roles-migration.md')
    })

  test('every outcome level is one RECORD-2 declares', () => {
    const declared = RECORD.items.find((item) => item.code === 'RECORD-2')?.mechanical
    const levels = [declared?.level, ...(declared?.overrideLevels ?? [])]
    const outcomes = run(RECORD, 'RECORD-2', context(store({ drop: ['role'] })))
    for (const outcome of outcomes)
      if (outcome.status === 'VIOLATION' && outcome.level) expect(levels).toContain(outcome.level)
  })
})

describe('LIFECYCLE', () => {
  test('created_at later than since fails', () => {
    const outcomes = run(
      LIFECYCLE,
      'LIFECYCLE-1',
      context(store({ drop: ['created_at'], fields: ['created_at: 2026-11-10T10:00:00Z'] }))
    )
    expect(messages(outcomes)).toContain('created_at must not be later than since')
  })

  test('a long description, a long Now and history in the state warn', () => {
    const root = store({ drop: ['description'], fields: [`description: ${'x'.repeat(501)}`] })
    const now = Array.from({ length: 6 }, (_, index) => `- 2026-11-0${index + 1} line ${index}`).join('\n')
    write(
      root,
      'work/ki/ki.reg.pilot/_index.md',
      entry({ id: 'ki.reg.pilot', drop: ['description'], fields: [`description: ${'x'.repeat(501)}`] }).replace(
        '- The pilot runs.',
        now
      )
    )
    const text = messages(run(LIFECYCLE, 'LIFECYCLE-3', context(root)))
    expect(text).toContain('description runs past 500 characters')
    expect(text).toContain('Now runs past 5 lines')
    expect(text).toContain('appear to carry history')
  })
})

describe('BOUNDARY', () => {
  test('a session field and a session claim fail', () => {
    const root = store({ fields: ['session_id: abc'] })
    write(
      root,
      'work/ki/ki.reg.pilot/_index.md',
      entry({ id: 'ki.reg.pilot', fields: ['session_id: abc'] }).replace(
        '- The pilot runs.',
        '- Resume the conversation session to continue.'
      )
    )
    const text = messages(run(BOUNDARY, 'BOUNDARY-1', context(root)))
    expect(text).toContain('forbidden session or transcript field')
    expect(text).toContain('claim continuity')
  })
})

test('the role catalogue is read from the role standard', () => {
  const catalogue = roleCatalogue()
  expect([...catalogue.keys()]).toEqual([
    'governor',
    'councillor',
    'quartermaster',
    'agoranomos',
    'warden',
    'steward',
    'housekeeper',
    'gatekeeper',
    'librarian',
    'guildmaster',
    'journeyman',
    'illustrator',
    'architect'
  ])
  const glyphs = [...catalogue.values()].map((role) => role.glyph)
  expect(new Set(glyphs).size).toBe(glyphs.length)
  expect(catalogue.get('housekeeper')).toEqual({ tier: 'managers', glyph: '🏠' })
  expect(catalogue.get('quartermaster')).toEqual({ tier: 'leaders', glyph: '🧰' })
  expect(catalogue.get('agoranomos')).toEqual({ tier: 'leaders', glyph: '🏺' })
  expect(catalogue.get('architect')?.tier).toBe('makers')
})
