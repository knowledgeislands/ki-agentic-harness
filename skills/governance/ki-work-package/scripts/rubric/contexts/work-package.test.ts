import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricItem } from '../../shared/rubric.ts'
import { BOUNDARY } from '../items/boundary.ts'
import { CONFIG } from '../items/configuration.ts'
import { LIFECYCLE } from '../items/lifecycle.ts'
import { RECORD } from '../items/records.ts'
import { STRUCTURE } from '../items/structure.ts'
import { checkpointReadme, createWorkPackageSession, type WorkPackageRubricContext } from './work-package.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const fixture = (): { repository: string; checkpointDirectory: string } => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-work-package-'))
  temporaryDirectories.push(repository)
  const checkpointDirectory = join(repository, '+', '_CHECKPOINTS')
  mkdirSync(checkpointDirectory, { recursive: true })
  writeFileSync(join(repository, checkpointReadme.path), checkpointReadme.content)
  return { repository, checkpointDirectory }
}

const record = ({
  thread = 'release-audit',
  label = 'Release: release-audit',
  role,
  state = 'active',
  body = ''
}: {
  thread?: string
  label?: string | null
  role?: string
  state?: string
  body?: string
} = {}) =>
  [
    '---',
    'type: ki-checkpoint',
    `thread: ${thread}`,
    ...(label === null ? [] : [`label: '${label}'`]),
    ...(role === undefined ? [] : [`role: ${role}`]),
    `state: ${state}`,
    'created_at: 2026-08-12T10:00:00Z',
    'updated_at: 2026-08-12T11:00:00Z',
    '---',
    '',
    `# ${thread}`,
    '',
    '## Objective',
    '',
    'Finish the release audit.',
    '',
    '## Current state',
    '',
    'The audit is ready for review.',
    '',
    '## Decisions made',
    '',
    'None',
    '',
    '## Files touched',
    '',
    'None',
    '',
    '## Open questions',
    '',
    'None',
    '',
    '## Next step',
    '',
    body || 'Ask the reviewer to approve the result.',
    ''
  ].join('\n')

const context = (repository: string): WorkPackageRubricContext => {
  const session = createWorkPackageSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const value = session.subjects[0]?.context()
  if (!value) throw new Error('ki-work-package session did not expose its repository subject')
  return value
}

const mechanical = <Context>(family: { items: readonly RubricItem<Context>[] }, code: string) => {
  const item = family.items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} mechanical item is missing`)
  return item.mechanical
}

test('a selected empty marker needs no subarea and audit never proposes writes', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-work-package-absent-'))
  temporaryDirectories.push(repository)
  const session = createWorkPackageSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const value = session.subjects[0]?.context() as WorkPackageRubricContext

  expect(mechanical(STRUCTURE, 'STRUCTURE-1').audit.run(STRUCTURE.selectContext(value))[0]?.status).toBe('PASS')
  expect(mechanical(STRUCTURE, 'STRUCTURE-2').audit.run(STRUCTURE.selectContext(value))[0]?.status).toBe('PASS')
  expect(session.proposal()).toEqual({ writes: [] })
})

test('an existing legacy checkpoint directory requires and can restore its scaffold', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-work-package-declared-'))
  temporaryDirectories.push(repository)
  mkdirSync(join(repository, '+', '_CHECKPOINTS'), { recursive: true })
  const session = createWorkPackageSession({
    mode: 'conform',
    repository,
    userHome: tmpdir(),
    configuration: {}
  })
  const value = session.subjects[0]?.context()
  if (!value) throw new Error('ki-work-package session did not expose repository subject')
  const item = mechanical(STRUCTURE, 'STRUCTURE-1')

  expect(item.audit.run(STRUCTURE.selectContext(value))[0]?.status).toBe('VIOLATION')
  item.conform?.run(STRUCTURE.selectContext(value))
  expect(session.proposal()).toEqual({
    writes: [{ path: checkpointReadme.path, content: checkpointReadme.content, create: true }]
  })
})

test('each old checkpoint is read with a tolerance warning', () => {
  const { repository, checkpointDirectory } = fixture()
  writeFileSync(join(checkpointDirectory, 'release-audit.md'), record())
  const item = mechanical(STRUCTURE, 'STRUCTURE-2')

  expect(item.level).toBe('WARN')
  expect(item.audit.run(STRUCTURE.selectContext(context(repository)))).toEqual([
    expect.objectContaining({
      status: 'VIOLATION',
      message: expect.stringContaining('legacy: an old checkpoint'),
      subject: '+/_CHECKPOINTS/release-audit.md'
    })
  ])
})

test('rejects retired storage, lifecycle collisions, and session locators', () => {
  const { repository, checkpointDirectory } = fixture()
  const retiredDirectory = join(checkpointDirectory, '_RETIRED')
  mkdirSync(retiredDirectory)
  writeFileSync(
    join(checkpointDirectory, 'release-audit.md'),
    record({ body: 'Resume https://example.test/conversation/abc.' })
  )
  writeFileSync(join(retiredDirectory, 'release-audit.md'), record({ state: 'retired' }))
  writeFileSync(join(checkpointDirectory, 'alternate.md'), record())
  const outside = join(repository, 'outside.md')
  writeFileSync(outside, record())
  symlinkSync(outside, join(checkpointDirectory, 'linked.md'))
  const value = context(repository)

  expect(mechanical(STRUCTURE, 'STRUCTURE-1').audit.run(STRUCTURE.selectContext(value))[0]?.status).toBe('VIOLATION')
  expect(mechanical(LIFECYCLE, 'LIFECYCLE-1').audit.run(LIFECYCLE.selectContext(value))).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ message: expect.stringContaining('more than one active record') })
    ])
  )
  expect(mechanical(BOUNDARY, 'BOUNDARY-1').audit.run(BOUNDARY.selectContext(value))).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ message: expect.stringContaining('session or conversation locator') })
    ])
  )
})

test('closed schema refuses an unexpected runtime field', () => {
  const { repository, checkpointDirectory } = fixture()
  writeFileSync(
    join(checkpointDirectory, 'release-audit.md'),
    record().replace('updated_at: 2026-08-12T11:00:00Z', 'updated_at: 2026-08-12T11:00:00Z\nsession_id: hidden')
  )
  const value = context(repository)

  expect(mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(value))[0]?.status).toBe('VIOLATION')
  expect(mechanical(BOUNDARY, 'BOUNDARY-1').audit.run(BOUNDARY.selectContext(value))[0]?.status).toBe('VIOLATION')
})

test('closed schema refuses a checkpoint-selected marker', () => {
  const { repository, checkpointDirectory } = fixture()
  writeFileSync(
    join(checkpointDirectory, 'release-audit.md'),
    record().replace('state: active', 'state: active\nselected: true')
  )
  const value = context(repository)

  expect(mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(value))[0]?.status).toBe('VIOLATION')
})

test('dotted coordination-thread and leading-underscore state-of-play names pass identity', () => {
  const { repository, checkpointDirectory } = fixture()
  writeFileSync(
    join(checkpointDirectory, 'techne.agent-host.md'),
    record({ thread: 'techne.agent-host', label: 'Techne: agent-host' })
  )
  writeFileSync(
    join(checkpointDirectory, '_state-of-play.md'),
    record({ thread: '_state-of-play', label: 'Master: state-of-play' })
  )
  const value = context(repository)

  for (const code of ['RECORD-1', 'RECORD-2', 'RECORD-3', 'RECORD-4'])
    expect(mechanical(RECORD, code).audit.run(RECORD.selectContext(value))[0]?.status).toBe('PASS')
})

test('a missing label warns and an empty label fails the closed schema', () => {
  const { repository, checkpointDirectory } = fixture()
  writeFileSync(join(checkpointDirectory, 'release-audit.md'), record({ label: null }))
  const value = context(repository)
  const labelItem = mechanical(RECORD, 'RECORD-3')

  expect(labelItem.level).toBe('WARN')
  expect(labelItem.audit.run(RECORD.selectContext(value))[0]?.status).toBe('VIOLATION')
  expect(mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(value))[0]?.status).toBe('PASS')

  writeFileSync(join(checkpointDirectory, 'release-audit.md'), record({ label: '' }))
  expect(mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(context(repository)))[0]?.status).toBe(
    'VIOLATION'
  )
})

test('a role is one of three values and a coordinating role needs a ki-coordination declaration', () => {
  const { repository, checkpointDirectory } = fixture()
  const roleItem = mechanical(RECORD, 'RECORD-4')
  const schema = () => mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(context(repository)))[0]?.status
  const role = () => roleItem.audit.run(RECORD.selectContext(context(repository)))[0]?.status

  expect(roleItem.level).toBe('FAIL')
  writeFileSync(join(checkpointDirectory, 'release-audit.md'), record({ role: 'conversational' }))
  expect(schema()).toBe('PASS')
  expect(role()).toBe('PASS')

  writeFileSync(join(checkpointDirectory, 'release-audit.md'), record({ role: 'ad-hoc' }))
  expect(schema()).toBe('VIOLATION')

  writeFileSync(join(checkpointDirectory, 'release-audit.md'), record({ role: 'coordination' }))
  expect(schema()).toBe('PASS')
  expect(role()).toBe('VIOLATION')

  writeFileSync(join(repository, '.ki.toml'), '[skills.ki-coordination]\n')
  expect(role()).toBe('PASS')
})

test('unknown selected capability keys warn without hiding scaffold requirements', () => {
  const { repository } = fixture()
  const session = createWorkPackageSession({
    mode: 'audit',
    repository,
    userHome: tmpdir(),
    configuration: { unexpected: true }
  })
  const value = session.subjects[0]?.context()
  if (!value) throw new Error('checkpoint context missing')
  expect(mechanical(CONFIG, 'CONFIG-1').audit.run(CONFIG.selectContext(value))).toEqual([
    expect.objectContaining({
      status: 'VIOLATION',
      level: 'WARN',
      message: 'unrecognised ki-work-package configuration key unexpected'
    })
  ])
})

test('malformed YAML records fail schema and CONFORM preserves authored bytes', () => {
  const { repository, checkpointDirectory } = fixture()
  const target = join(checkpointDirectory, 'release-audit.md')
  const malformed = record().replace('type: ki-checkpoint', 'type: [')
  writeFileSync(target, malformed)
  const session = createWorkPackageSession({ mode: 'conform', repository, userHome: tmpdir(), configuration: {} })
  const value = session.subjects[0]?.context()
  if (!value) throw new Error('checkpoint context missing')
  expect(mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(value))).toEqual([
    expect.objectContaining({ status: 'VIOLATION', message: 'checkpoint frontmatter must be a valid YAML mapping' })
  ])
  mechanical(STRUCTURE, 'STRUCTURE-1').conform?.run(STRUCTURE.selectContext(value))
  expect(session.proposal()).toEqual({ writes: [] })
  expect(readFileSync(target, 'utf8')).toBe(malformed)
})

for (const unsafe of [
  'plus-symlink',
  'checkpoint-symlink',
  'readme-symlink',
  'checkpoint-file',
  'readme-directory'
] as const) {
  test(`CONFORM refuses unsafe target: ${unsafe}`, () => {
    const repository = mkdtempSync(join(tmpdir(), 'ki-work-package-unsafe-'))
    temporaryDirectories.push(repository)
    const outside = mkdtempSync(join(tmpdir(), 'ki-work-package-outside-'))
    temporaryDirectories.push(outside)
    const plus = join(repository, '+')
    const directory = join(plus, '_CHECKPOINTS')
    if (unsafe === 'plus-symlink') symlinkSync(outside, plus)
    else {
      mkdirSync(plus)
      if (unsafe === 'checkpoint-symlink') symlinkSync(outside, directory)
      else if (unsafe === 'checkpoint-file') writeFileSync(directory, 'sentinel')
      else {
        mkdirSync(directory)
        if (unsafe === 'readme-symlink') {
          writeFileSync(join(outside, 'sentinel.md'), 'sentinel')
          symlinkSync(join(outside, 'sentinel.md'), join(directory, 'README.md'))
        } else mkdirSync(join(directory, 'README.md'))
      }
    }
    const session = createWorkPackageSession({ mode: 'conform', repository, userHome: tmpdir(), configuration: {} })
    const value = session.subjects[0]?.context()
    if (!value) throw new Error('checkpoint context missing')
    expect(value.structure.ensureScaffold).toBeUndefined()
    expect(session.proposal()).toEqual({ writes: [] })
  })
}

const workFile = ({
  id = 'ki.ways-of-working',
  fields = {},
  omit = [],
  body
}: {
  id?: string
  fields?: Record<string, string>
  omit?: readonly string[]
  body?: string
} = {}): string =>
  [
    '---',
    ...Object.entries({
      id,
      level: 'project',
      title: "'KI > Model > Ways of working'",
      project: 'ways-of-working',
      theme: 'knowledge-islands-model',
      worker: 'agent',
      supervisor: 'owner',
      state: 'handoff-to-supervisor',
      blocking: 'false',
      since: '2026-10-18T01:49:05Z',
      received: 'null',
      mark: '2026-10-17T21:34:00Z',
      created_at: '2026-10-17T20:00:00Z',
      ...fields
    })
      .filter(([key]) => !omit.includes(key))
      .map(([key, value]) => `${key}: ${value}`),
    '---',
    '',
    body ??
      [
        `# ${id}`,
        '',
        '## Next steps',
        '',
        'Take the answers to WORK-HOME and restart the migration.',
        '',
        '## Messages',
        '',
        'None',
        '',
        '## Parked',
        '',
        '- WORK-HOME: where work files live; a) the work folder.',
        ''
      ].join('\n')
  ].join('\n')

const workFixture = (coordination = true): string => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-work-file-'))
  temporaryDirectories.push(repository)
  mkdirSync(join(repository, '+', '_WORK'), { recursive: true })
  if (coordination) writeFileSync(join(repository, '.ki.toml'), '[skills.ki-coordination]\n')
  return repository
}

const writeWork = (repository: string, folder: string, content: string): void => {
  mkdirSync(join(repository, '+', '_WORK', folder), { recursive: true })
  writeFileSync(join(repository, '+', '_WORK', folder, 'work.md'), content)
}

const statuses = (value: WorkPackageRubricContext): Record<string, string | undefined> => ({
  'STRUCTURE-1': mechanical(STRUCTURE, 'STRUCTURE-1').audit.run(STRUCTURE.selectContext(value))[0]?.status,
  'RECORD-1': mechanical(RECORD, 'RECORD-1').audit.run(RECORD.selectContext(value))[0]?.status,
  'RECORD-2': mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(value))[0]?.status,
  'RECORD-4': mechanical(RECORD, 'RECORD-4').audit.run(RECORD.selectContext(value))[0]?.status,
  'LIFECYCLE-1': mechanical(LIFECYCLE, 'LIFECYCLE-1').audit.run(LIFECYCLE.selectContext(value))[0]?.status,
  'BOUNDARY-1': mechanical(BOUNDARY, 'BOUNDARY-1').audit.run(BOUNDARY.selectContext(value))[0]?.status
})

test('a well-formed work file passes every record check', () => {
  const repository = workFixture()
  writeWork(repository, 'ki.ways-of-working', workFile())
  writeWork(
    repository,
    'ki.regular',
    workFile({
      id: 'ki.regular',
      fields: {
        level: 'regular',
        title: "'KI > Regular work'",
        state: 'on-hold',
        hold: '{ reason: more-expected, release: new work arriving }'
      },
      omit: ['project', 'blocking']
    })
  )
  mkdirSync(join(repository, '+', '_WORK_REVIEW', 'ki.unsure'), { recursive: true })
  writeFileSync(join(repository, '+', '_WORK_REVIEW', 'ki.unsure', 'work.md'), 'not yet checked')

  expect(Object.values(statuses(context(repository)))).toEqual(Array(6).fill('PASS'))
})

test('coordinating work needs a ki-coordination declaration', () => {
  const repository = workFixture(false)
  writeWork(repository, 'ki.ways-of-working', workFile())

  expect(statuses(context(repository))['RECORD-4']).toBe('VIOLATION')
})

test('the id agrees with its folder and the body keeps its three sections', () => {
  const repository = workFixture()
  writeWork(repository, 'ki.other', workFile())
  writeWork(repository, 'ki.ways-of-working', workFile({ body: '# ki.ways-of-working\n\n## Next step\n\nGo on.\n' }))
  const value = statuses(context(repository))

  expect(value['RECORD-1']).toBe('VIOLATION')
  expect(value['RECORD-2']).toBe('VIOLATION')
})

for (const [name, change] of [
  ['an unknown field', { fields: { updated_at: '2026-10-18T01:49:05Z' } }],
  ['an unknown state', { fields: { state: 'resting' } }],
  ['a missing project at project level', { omit: ['project'] }],
  ['a hold outside on-hold', { fields: { hold: '{ reason: paused, release: later }' } }],
  ['on-hold without its hold', { fields: { state: 'on-hold' } }],
  ['handoff without its target', { fields: { state: 'handoff' } }],
  ['blocking outside a handoff to the supervisor', { fields: { state: 'with-worker', blocking: 'true' } }],
  ['a worker that is not a holder', { fields: { worker: 'sol' } }],
  ['a local since', { fields: { since: "'2026-10-18 02:49 BST'" } }]
] as const)
  test(`the closed work-file schema refuses ${name}`, () => {
    const repository = workFixture()
    writeWork(repository, 'ki.ways-of-working', workFile(change))

    expect(statuses(context(repository))['RECORD-2']).toBe('VIOLATION')
  })

test('the work area holds only work folders with their work files', () => {
  const repository = workFixture()
  writeFileSync(join(repository, '+', '_WORK', 'stray.md'), '# stray\n')
  mkdirSync(join(repository, '+', '_WORK', 'ki.empty'))

  expect(
    mechanical(STRUCTURE, 'STRUCTURE-1')
      .audit.run(STRUCTURE.selectContext(context(repository)))
      .map((outcome) => outcome.subject)
  ).toEqual(['+/_WORK/ki.empty', '+/_WORK/stray.md'])
})

test('an old checkpoint beside the work file that replaces it fails the lifecycle', () => {
  const repository = workFixture()
  writeWork(repository, 'ki.ways-of-working', workFile())
  mkdirSync(join(repository, '+', '_CHECKPOINTS'))
  writeFileSync(join(repository, checkpointReadme.path), checkpointReadme.content)
  writeFileSync(
    join(repository, '+', '_CHECKPOINTS', 'knowledge-islands-model.ways-of-working.md'),
    record({ thread: 'knowledge-islands-model.ways-of-working', label: 'KI > Model > ways of working' })
  )

  expect(mechanical(LIFECYCLE, 'LIFECYCLE-1').audit.run(LIFECYCLE.selectContext(context(repository)))).toEqual([
    expect.objectContaining({ message: expect.stringContaining('ki.ways-of-working are both active') })
  ])
})

test('a retired thread or checkpoint folder beside the work area fails the structure', () => {
  const repository = workFixture()
  writeWork(repository, 'ki.ways-of-working', workFile())
  const item = mechanical(STRUCTURE, 'STRUCTURE-1')
  expect(item.audit.run(STRUCTURE.selectContext(context(repository)))[0]?.status).toBe('PASS')

  mkdirSync(join(repository, '+', '_THREADS', 'chezmoi'), { recursive: true })
  writeFileSync(join(repository, '+', '_THREADS', 'chezmoi', 'host-locals-sol.report.md'), '# Report\n')
  mkdirSync(join(repository, '+', '_CHECKPOINTS'))
  writeFileSync(join(repository, checkpointReadme.path), checkpointReadme.content)

  expect(item.level).toBe('FAIL')
  expect(
    item.audit
      .run(STRUCTURE.selectContext(context(repository)))
      .filter((outcome) => outcome.message.includes('is retired beside +/_WORK/'))
      .map((outcome) => outcome.subject)
  ).toEqual(['+/_THREADS', '+/_CHECKPOINTS'])
})

test('a work file carries no session field or locator', () => {
  const repository = workFixture()
  writeWork(repository, 'ki.ways-of-working', workFile({ fields: { session_id: 'hidden' } }))

  expect(statuses(context(repository))['BOUNDARY-1']).toBe('VIOLATION')
})

const packageFiles = (
  id = 'ki.ways-of-working',
  {
    work = {},
    state = {},
    workBody,
    stateBody,
    queries,
    messages
  }: {
    work?: Record<string, string>
    state?: Record<string, string>
    workBody?: string
    stateBody?: string
    queries?: string
    messages?: string
  } = {}
): Record<string, string> => ({
  'work.md': [
    '---',
    ...Object.entries({
      id,
      level: 'project',
      ...(id.includes('.') ? { parent: id.split('.')[0] } : { covers: '[]' }),
      title: "'KI > Model > Ways of working'",
      project: 'ways-of-working',
      theme: 'model',
      description:
        "'Shapes how Knowledge Islands work is held and moved. Takes changes to the work model and its skills. Not for the Observatory (ki.observatory).'",
      worker: 'agent',
      supervisor: 'owner',
      created_at: '2026-10-17T20:00:00Z',
      ...work
    }).map(([key, value]) => `${key}: ${value}`),
    '---',
    '',
    workBody ??
      [
        `# ${id}`,
        '',
        '## Goals',
        '',
        'Deliver the outcome in the Project note.',
        '',
        '## Scope',
        '',
        'In: the work model. Out: the Observatory (ki.observatory).',
        ''
      ].join('\n')
  ].join('\n'),
  'state.md': [
    '---',
    ...Object.entries({
      id,
      state: 'with-worker',
      since: '2026-10-19T11:25:41Z',
      mark: '2026-10-19T07:47:18Z',
      method_read: '88cce3e',
      ...state
    }).map(([key, value]) => `${key}: ${value}`),
    '---',
    '',
    stateBody ??
      [
        `# ${id} state`,
        '',
        '## Now',
        '',
        'The standard run is with its agent.',
        '',
        '## Next steps',
        '',
        '1. Receive the standard run.',
        '',
        '## Held',
        '',
        'None',
        ''
      ].join('\n')
  ].join('\n'),
  'queries.md':
    queries ??
    [
      `# ${id} queries`,
      '',
      '## Open',
      '',
      '### WORK-INSTRUMENT - Whether the instrument reads both shapes',
      '',
      'since 2026-10-19',
      '',
      '**Context:** The reader changes first.',
      '',
      '**Query:** Should the instrument read both shapes?',
      '',
      '**Options:**',
      '',
      'a) (recommended, confidence high - additive) Read both.',
      '',
      '## Parked',
      '',
      'None',
      ''
    ].join('\n'),
  'messages.md':
    messages ??
    [
      `# ${id} messages`,
      '',
      `- IMPORTANT · ${new Date().toISOString().slice(0, 10)} · REFRESH · KI > State of play: re-read ki-coordination.`,
      `- ${new Date().toISOString().slice(0, 10)} · ROUTE · KI > State of play: take the timeline unit.`,
      ''
    ].join('\n'),
  'decisions.md': '# ki.ways-of-working decisions\n\nNone\n'
})

const writePackage = (repository: string, folder: string, files: Record<string, string>): void => {
  mkdirSync(join(repository, '+', '_WORK', folder), { recursive: true })
  for (const [name, content] of Object.entries(files))
    writeFileSync(join(repository, '+', '_WORK', folder, name), content)
}

const run = <Context>(
  family: { items: readonly RubricItem<Context>[]; selectContext: (value: WorkPackageRubricContext) => Context },
  code: string,
  value: WorkPackageRubricContext
) => mechanical(family, code).audit.run(family.selectContext(value))

test('a well-formed five-file package passes every check without a legacy or size warning', () => {
  const repository = workFixture()
  writePackage(repository, 'ki.ways-of-working', packageFiles())
  const value = context(repository)

  expect(Object.values(statuses(value))).toEqual(Array(6).fill('PASS'))
  expect(run(STRUCTURE, 'STRUCTURE-2', value)[0]?.status).toBe('PASS')
  expect(run(LIFECYCLE, 'LIFECYCLE-3', value)[0]?.status).toBe('PASS')
})

test('a single-file work folder is read under its old form with a legacy warning', () => {
  const repository = workFixture()
  writeWork(repository, 'ki.ways-of-working', workFile())
  writePackage(repository, 'ki.observatory', packageFiles('ki.observatory', { work: { project: 'observatory' } }))
  const value = context(repository)

  expect(statuses(value)['RECORD-2']).toBe('PASS')
  expect(run(STRUCTURE, 'STRUCTURE-2', value).map((outcome) => outcome.subject)).toEqual([
    '+/_WORK/ki.ways-of-working/work.md'
  ])
})

test("a package's work.md that still carries state fails the schema", () => {
  const repository = workFixture()
  writePackage(repository, 'ki.ways-of-working', packageFiles('ki.ways-of-working', { work: { state: 'with-worker' } }))

  expect(run(RECORD, 'RECORD-2', context(repository))).toContainEqual(
    expect.objectContaining({ message: expect.stringContaining('carries no state field (state)') })
  )
})

test('a package missing one of its five files fails the structure', () => {
  const repository = workFixture()
  const { 'messages.md': _, ...files } = packageFiles()
  writePackage(repository, 'ki.ways-of-working', files)

  expect(run(STRUCTURE, 'STRUCTURE-1', context(repository))).toEqual([
    expect.objectContaining({ message: expect.stringContaining('messages.md is missing') })
  ])
})

test('an empty message queue may say None with or without a full stop', () => {
  for (const messages of ['None', 'None.']) {
    const repository = workFixture()
    writePackage(
      repository,
      'ki.ways-of-working',
      packageFiles('ki.ways-of-working', { messages: `# ki.ways-of-working messages\n\n${messages}\n` })
    )

    expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
  }
})

const today = new Date().toISOString().slice(0, 10)
for (const [name, change] of [
  [
    'an important line below an ordinary one',
    {
      messages: `# ki.ways-of-working messages\n\n- ${today} · ROUTE · Sender: take it.\n- IMPORTANT · ${today} · REFRESH · Sender: re-read.\n`
    }
  ],
  ['a message line out of shape', { messages: '# ki.ways-of-working messages\n\n- take the timeline unit\n' }],
  ['a missing description', { work: { description: "''" } }],
  ['a method_read that is not a revision', { state: { method_read: 'latest' } }],
  ['a numeric method_read instead of a revision string', { state: { method_read: '1234567' } }],
  ['a timestamp method_read instead of a revision', { state: { method_read: '2026-10-19T21:00:00Z' } }],
  ['a state field it does not know', { state: { updated_at: '2026-10-19T11:25:41Z' } }],
  [
    'a Queue outside territory work',
    {
      stateBody:
        '# ki.ways-of-working state\n\n## Now\n\nNone\n\n## Queue\n\nNone\n\n## Next steps\n\nNone\n\n## Held\n\nNone\n'
    }
  ],
  [
    'a query without its options',
    {
      queries:
        '# ki.ways-of-working queries\n\n## Open\n\n### TAG - A title\n\n**Context:** c\n\n**Query:** q\n\n## Parked\n\nNone\n'
    }
  ],
  ['a state.md id that disagrees', { state: { id: 'ki.other' } }]
] as const)
  test(`the package schema refuses ${name}`, () => {
    const repository = workFixture()
    writePackage(repository, 'ki.ways-of-working', packageFiles('ki.ways-of-working', change))
    const value = statuses(context(repository))

    expect([value['RECORD-1'], value['RECORD-2']]).toContain('VIOLATION')
  })

test('territory work may keep a Queue after Now', () => {
  const repository = workFixture()
  writePackage(
    repository,
    'ki',
    packageFiles('ki', {
      work: { level: 'territory', title: "'KI > State of play'" },
      stateBody:
        '# ki state\n\n## Now\n\nNone\n\n## Queue\n\n1. ki.observatory\n\n## Next steps\n\nNone\n\n## Held\n\nNone\n'
    })
  )
  const files = packageFiles('ki')
  writeFileSync(
    join(repository, '+', '_WORK', 'ki', 'work.md'),
    (files['work.md'] ?? '').replace('project: ways-of-working\n', '').replace('level: project', 'level: territory')
  )

  expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
})

const territoryPackage = (repository: string, id: string, extra: readonly string[]): void => {
  const files = packageFiles(id, { work: { level: 'territory', title: "'HNR > SoP (5ge)'" } })
  writePackage(repository, id, {
    ...files,
    'work.md': (files['work.md'] ?? '')
      .replace('project: ways-of-working\n', '')
      .replace('covers: []\n', extra.some((line) => line.startsWith('covers:')) ? '' : 'covers: []\n')
      .replace(`parent: ${id.split('.')[0]}\n`, '')
      .replace('theme: model\n', extra.map((line) => `${line}\n`).join(''))
  })
}

test('a secondary State of play names its main as parent and lists the work it covers', () => {
  const repository = workFixture()
  territoryPackage(repository, 'hnr', ['covers: [hnr.5g-emerge-apex, hnr.regular.demo]'])
  territoryPackage(repository, 'hnr.sop.5ge', ['parent: hnr', 'covers: [hnr.5g-emerge-apex, hnr.regular.demo]'])

  expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
})

test('parent identifies coordinating work and covers belongs only to States of play', () => {
  for (const [id, extra] of [
    ['hnr', ['parent: hnr']],
    ['hnr.sop.5ge', ['parent: other', 'covers: [hnr.5g-emerge-apex]']],
    ['hnr.sop.5ge', ['parent: hnr']],
    ['hnr.sop.5ge', ['parent: hnr', 'covers: [other.a]']],
    ['hnr.sop.5ge', ['parent: hnr', 'covers: [hnr.sop.sites]']],
    ['hnr.hub', []]
  ] as const) {
    const repository = workFixture()
    territoryPackage(repository, id, extra)
    expect(statuses(context(repository))['RECORD-2']).toBe('VIOLATION')
  }
  const project = workFixture()
  writePackage(project, 'ki.ways-of-working', packageFiles('ki.ways-of-working', { work: { parent: 'ki' } }))
  expect(statuses(context(project))['RECORD-2']).toBe('PASS')
  const misplaced = workFixture()
  writePackage(misplaced, 'ki.sop.tools', packageFiles('ki.sop.tools', { work: { project: 'sop' } }))
  expect(statuses(context(misplaced))['RECORD-2']).toBe('VIOLATION')
})

test('size limits and history warn without failing', () => {
  const repository = workFixture()
  writePackage(
    repository,
    'ki.ways-of-working',
    packageFiles('ki.ways-of-working', {
      work: { description: `'${'Takes everything. '.repeat(40)}'` },
      stateBody: [
        '# ki.ways-of-working state',
        '',
        '## Now',
        '',
        '- 2026-10-17 committed 1a2b3c4d',
        '- 2026-10-18 committed 5e6f7a8b',
        '- 2026-10-19 committed 9c0d1e2f, 412 tests pass',
        '',
        '## Next steps',
        '',
        'None',
        '',
        '## Held',
        '',
        'None',
        ''
      ].join('\n'),
      messages: '# ki.ways-of-working messages\n\n- 2026-09-01 · ROUTE · Sender: take the old unit.\n'
    })
  )
  const value = context(repository)
  const messages = run(LIFECYCLE, 'LIFECYCLE-3', value).map((outcome) => outcome.message)

  expect(mechanical(LIFECYCLE, 'LIFECYCLE-3').level).toBe('WARN')
  expect(messages).toEqual([
    expect.stringContaining('description runs past 500 characters'),
    expect.stringContaining('state.md appears to carry history'),
    expect.stringContaining('has waited more than 7 days')
  ])
  expect(statuses(value)['RECORD-2']).toBe('PASS')
})

test('a message line on work that is on hold may wait', () => {
  const repository = workFixture()
  writePackage(
    repository,
    'ki.ways-of-working',
    packageFiles('ki.ways-of-working', {
      state: { state: 'on-hold', hold: '{ reason: paused, release: after the migration }' },
      messages: '# ki.ways-of-working messages\n\n- 2026-09-01 · ROUTE · Sender: take the old unit.\n'
    })
  )

  expect(run(LIFECYCLE, 'LIFECYCLE-3', context(repository))[0]?.status).toBe('PASS')
})

test('a message line names its sender by work name, and the label alone stays readable', () => {
  for (const sender of [
    'KI > Model > Ways of working (ki.ways-of-working)',
    'KI > SoP (ki)',
    'KI > Model > Ways of working'
  ]) {
    const repository = workFixture()
    writePackage(
      repository,
      'ki.ways-of-working',
      packageFiles('ki.ways-of-working', {
        messages: `# ki.ways-of-working messages\n\n- ${today} · ROUTE · ${sender}: take the timeline unit.\n`
      })
    )
    expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
  }
})

test('package parents and coverage reject missing, cross-territory and conflicting assignments', () => {
  for (const parent of ['other', 'ki.ways-of-working', 'ki.regular']) {
    const repository = workFixture()
    writePackage(repository, 'ki.ways-of-working', packageFiles('ki.ways-of-working', { work: { parent } }))
    expect(statuses(context(repository))['RECORD-2']).toBe('VIOLATION')
  }
  const missing = workFixture()
  const files = packageFiles()
  files['work.md'] = (files['work.md'] ?? '').replace('parent: ki\n', '')
  writePackage(missing, 'ki.ways-of-working', files)
  expect(statuses(context(missing))['RECORD-2']).toBe('VIOLATION')

  const repository = workFixture()
  territoryPackage(repository, 'ki', ['covers: [ki.ways-of-working]'])
  // Replace the helper's inherited empty main register rather than authoring duplicate YAML keys.
  const main = join(repository, '+', '_WORK', 'ki', 'work.md')
  writeFileSync(main, readFileSync(main, 'utf8').replace('covers: []\n', ''))
  territoryPackage(repository, 'ki.sop.model', ['parent: ki', 'covers: [ki.ways-of-working]'])
  writePackage(
    repository,
    'ki.ways-of-working',
    packageFiles('ki.ways-of-working', { work: { parent: 'ki.sop.model' } })
  )
  expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
  territoryPackage(repository, 'ki.sop.other', ['parent: ki', 'covers: [ki.ways-of-working]'])
  expect(statuses(context(repository))['RECORD-2']).toBe('VIOLATION')
})

test('ad hoc parent names a State of play and host requirements preserve queue shape', () => {
  const repository = workFixture()
  const id = 'ki.regular.intake'
  const files = packageFiles(id, {
    work: { level: 'regular', parent: 'ki.sop.operations' },
    messages: `# ${id} messages\n\n- IMPORTANT · 2026-10-25 @terra · HOST-WORK · KI State of play: plan intake.\n- 2026-10-25 @macos · HOST-NEXT · KI State of play: receive evidence.\n`
  })
  files['work.md'] = (files['work.md'] ?? '').replace('project: ways-of-working\n', '')
  writePackage(repository, id, files)
  expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
})

test('regular umbrella and child packages are assigned through covers without requiring coordination capability', () => {
  const repository = workFixture()
  territoryPackage(repository, 'ki', ['covers: [ki.regular, ki.regular.intake]'])
  territoryPackage(repository, 'ki.sop.operations', ['parent: ki', 'covers: [ki.regular, ki.regular.intake]'])
  for (const id of ['ki.regular', 'ki.regular.intake']) {
    const files = packageFiles(id, { work: { level: 'regular', parent: 'ki.sop.operations' } })
    files['work.md'] = (files['work.md'] ?? '').replace('project: ways-of-working\n', '')
    writePackage(repository, id, files)
  }
  expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
  // Capability belongs to an explicit opening, not every regular package.
  const ordinary = workFixture()
  writeFileSync(join(ordinary, '.ki.toml'), '[skills.ki-work-package]\n')
  const files = packageFiles('ki.regular', { work: { level: 'regular', parent: 'ki' } })
  files['work.md'] = (files['work.md'] ?? '').replace('project: ways-of-working\n', '')
  writePackage(ordinary, 'ki.regular', files)
  expect(statuses(context(ordinary))['RECORD-4']).toBe('PASS')
  // Existing main and secondary coverage must both retain the umbrella.
  territoryPackage(repository, 'ki.sop.operations', ['parent: ki', 'covers: [ki.regular.intake]'])
  expect(run(RECORD, 'RECORD-2', context(repository))).toContainEqual(
    expect.objectContaining({
      status: 'VIOLATION',
      subject: '+/_WORK/ki.regular/work.md',
      message: 'parent covers does not include this work'
    })
  )
})

test('typed main, secondary, Project and regular packages pass without changing state grammar', () => {
  const { repository } = fixture()
  writePackage(
    repository,
    'ki.sop.main',
    packageFiles('ki.sop.main', {
      work: {
        level: 'territory',
        project: '',
        parent: '',
        covers: '[ki.prj.ways-of-working, ki.regular.main, ki.regular.topic]',
        title: "'KI > SoP'"
      }
    })
  )
  const mainPath = join(repository, '+/_WORK/ki.sop.main/work.md')
  writeFileSync(
    mainPath,
    readFileSync(mainPath, 'utf8')
      .replace(/^parent:.*\n/gm, '')
      .replace(/^project:.*\n/gm, '')
  )
  writePackage(
    repository,
    'ki.prj.ways-of-working',
    packageFiles('ki.prj.ways-of-working', { work: { parent: 'ki.sop.main' } })
  )
  for (const id of ['ki.reg.main', 'ki.reg.topic']) {
    writePackage(repository, id, packageFiles(id, { work: { level: 'regular', parent: 'ki.sop.main' } }))
    const file = join(repository, '+/_WORK', id, 'work.md')
    writeFileSync(file, readFileSync(file, 'utf8').replace(/^project:.*\n/gm, ''))
  }
  expect(statuses(context(repository))['RECORD-2']).toBe('PASS')
  writePackage(
    repository,
    'ki.regular.topic',
    packageFiles('ki.regular.topic', { work: { level: 'regular', parent: 'ki.sop.main' } })
  )
  writePackage(repository, 'ki.ways-of-working', packageFiles())
  expect(run(RECORD, 'RECORD-2', context(repository))).toContainEqual(
    expect.objectContaining({ message: expect.stringContaining('ambiguous work home') })
  )
})
