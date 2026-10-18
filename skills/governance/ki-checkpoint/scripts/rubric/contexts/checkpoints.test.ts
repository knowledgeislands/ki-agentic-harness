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
import { type CheckpointsRubricContext, checkpointReadme, createCheckpointsSession } from './checkpoints.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const fixture = (): { repository: string; checkpointDirectory: string } => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-checkpoint-'))
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

const context = (repository: string): CheckpointsRubricContext => {
  const session = createCheckpointsSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const value = session.subjects[0]?.context()
  if (!value) throw new Error('ki-checkpoint session did not expose its repository subject')
  return value
}

const mechanical = <Context>(family: { items: readonly RubricItem<Context>[] }, code: string) => {
  const item = family.items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} mechanical item is missing`)
  return item.mechanical
}

test('a selected empty marker needs no subarea and audit never proposes writes', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-checkpoint-absent-'))
  temporaryDirectories.push(repository)
  const session = createCheckpointsSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const value = session.subjects[0]?.context() as CheckpointsRubricContext

  expect(mechanical(STRUCTURE, 'STRUCTURE-1').audit.run(STRUCTURE.selectContext(value))[0]?.status).toBe('PASS')
  expect(mechanical(STRUCTURE, 'STRUCTURE-2').audit.run(STRUCTURE.selectContext(value))[0]?.status).toBe('PASS')
  expect(session.proposal()).toEqual({ writes: [] })
})

test('an existing legacy checkpoint directory requires and can restore its scaffold', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-checkpoint-declared-'))
  temporaryDirectories.push(repository)
  mkdirSync(join(repository, '+', '_CHECKPOINTS'), { recursive: true })
  const session = createCheckpointsSession({
    mode: 'conform',
    repository,
    userHome: tmpdir(),
    configuration: {}
  })
  const value = session.subjects[0]?.context()
  if (!value) throw new Error('ki-checkpoint session did not expose repository subject')
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

test('a role is one of three values and a coordinating role needs a ki-pmo declaration', () => {
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

  writeFileSync(join(repository, '.ki.toml'), '[skills.ki-pmo]\n')
  expect(role()).toBe('PASS')
})

test('unknown selected capability keys warn without hiding scaffold requirements', () => {
  const { repository } = fixture()
  const session = createCheckpointsSession({
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
      message: 'unrecognised ki-checkpoint configuration key unexpected'
    })
  ])
})

test('malformed YAML records fail schema and CONFORM preserves authored bytes', () => {
  const { repository, checkpointDirectory } = fixture()
  const target = join(checkpointDirectory, 'release-audit.md')
  const malformed = record().replace('type: ki-checkpoint', 'type: [')
  writeFileSync(target, malformed)
  const session = createCheckpointsSession({ mode: 'conform', repository, userHome: tmpdir(), configuration: {} })
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
    const repository = mkdtempSync(join(tmpdir(), 'ki-checkpoint-unsafe-'))
    temporaryDirectories.push(repository)
    const outside = mkdtempSync(join(tmpdir(), 'ki-checkpoint-outside-'))
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
    const session = createCheckpointsSession({ mode: 'conform', repository, userHome: tmpdir(), configuration: {} })
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

const workFixture = (pmo = true): string => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-work-file-'))
  temporaryDirectories.push(repository)
  mkdirSync(join(repository, '+', '_WORK'), { recursive: true })
  if (pmo) writeFileSync(join(repository, '.ki.toml'), '[skills.ki-pmo]\n')
  return repository
}

const writeWork = (repository: string, folder: string, content: string): void => {
  mkdirSync(join(repository, '+', '_WORK', folder), { recursive: true })
  writeFileSync(join(repository, '+', '_WORK', folder, 'work.md'), content)
}

const statuses = (value: CheckpointsRubricContext): Record<string, string | undefined> => ({
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

test('coordinating work needs a ki-pmo declaration', () => {
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

test('a work file carries no session field or locator', () => {
  const repository = workFixture()
  writeWork(repository, 'ki.ways-of-working', workFile({ fields: { session_id: 'hidden' } }))

  expect(statuses(context(repository))['BOUNDARY-1']).toBe('VIOLATION')
})
