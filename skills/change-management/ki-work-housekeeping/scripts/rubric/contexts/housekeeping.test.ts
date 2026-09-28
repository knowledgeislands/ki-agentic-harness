import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHousekeepingSession } from './housekeeping.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const temporaryDirectory = (): string => {
  const directory = mkdtempSync(join(tmpdir(), 'ki-work-housekeeping-'))
  temporaryDirectories.push(directory)
  return directory
}

const options = (repository: string) => ({ mode: 'audit' as const, repository, userHome: tmpdir(), configuration: {} })

const outcomes = (repository: string) => {
  const session = createHousekeepingSession(options(repository))
  const subject = session.subjects.find((candidate) => candidate.families.includes('HOUSE'))
  if (!subject) throw new Error('ki-work-housekeeping session did not expose the housekeeping subject')
  return subject.context().templates.outcomes
}

const template = (id = 'KI-HARNESS-HK-001') =>
  [
    '---',
    `id: ${id}`,
    'title: Monthly maintenance',
    'status: active',
    'cadence: P1M',
    'last-run: null',
    'grace: P7D',
    'spawn-policy: when-due',
    'spawn-horizon: next',
    'active-run: null',
    '---',
    '',
    '# Monthly maintenance',
    '',
    '## Goal',
    '',
    'Keep maintenance current.',
    '',
    '## Procedure',
    '',
    'Run the named maintenance check.',
    '',
    '## Successful-run evidence',
    '',
    'Record the completed check.',
    '',
    '## Obsolescence',
    '',
    'Remove this template when it is replaced.',
    ''
  ].join('\n')

test('accepts a valid non-KB housekeeping template', () => {
  const repository = temporaryDirectory()
  const root = join(repository, 'docs', 'housekeeping')
  mkdirSync(root, { recursive: true })
  writeFileSync(join(root, 'KI-HARNESS-HK-001-monthly-maintenance.md'), template())

  expect(outcomes(repository)).toEqual([
    {
      status: 'PASS',
      message: 'Housekeeping template has a complete lifecycle, identity, schedule, body, and linkage contract.',
      subject: 'docs/housekeeping/KI-HARNESS-HK-001-monthly-maintenance.md'
    }
  ])
})

test('accepts a housekeeping template whose repository code begins with a digit', () => {
  const repository = temporaryDirectory()
  const root = join(repository, 'docs', 'housekeeping')
  mkdirSync(root, { recursive: true })
  writeFileSync(join(root, '5GE-P2-HK-001-monthly-maintenance.md'), template('5GE-P2-HK-001'))

  expect(outcomes(repository)[0]?.status).toBe('PASS')
})

test('reports an invalid schedule without mutating the template', () => {
  const repository = temporaryDirectory()
  const root = join(repository, 'docs', 'housekeeping')
  mkdirSync(root, { recursive: true })
  writeFileSync(
    join(root, 'KI-HARNESS-HK-001-monthly-maintenance.md'),
    template().replace('cadence: P1M', 'cadence: weekly')
  )

  expect(outcomes(repository)).toEqual([
    {
      status: 'VIOLATION',
      message: expect.stringContaining('cadence must be a positive one-unit ISO-8601 duration'),
      subject: 'docs/housekeeping/KI-HARNESS-HK-001-monthly-maintenance.md'
    }
  ])
})

test('optional commit fields are validated while an unevidenced anchor is a schedule diagnostic', () => {
  const repository = temporaryDirectory()
  const root = join(repository, 'docs', 'housekeeping')
  mkdirSync(root, { recursive: true })
  const path = join(root, 'KI-HARNESS-HK-001-monthly-maintenance.md')
  const content = template().replace(
    'last-run: null',
    'last-run: 2026-09-01\ncommit-threshold: 100\nlast-run-ref: null'
  )
  writeFileSync(path, content)
  expect(outcomes(repository)[0]?.status).toBe('PASS')
  const session = createHousekeepingSession(options(repository))
  expect(session.subjects[0]?.context().templates.schedules).toContainEqual({
    status: 'VIOLATION',
    subject: 'docs/housekeeping/KI-HARNESS-HK-001-monthly-maintenance.md',
    message: expect.stringContaining('Change-volume evidence is unknown')
  })
  expect(session.proposal()).toEqual({ writes: [] })
  expect(readFileSync(path, 'utf8')).toBe(content)
  for (const fields of [
    'commit-threshold: 0',
    'commit-threshold: 1.5',
    'commit-threshold: 9007199254740992',
    'last-run-ref: HEAD',
    `last-run-ref: ${'a'.repeat(40)}`
  ]) {
    writeFileSync(path, template().replace('last-run: null', `last-run: null\n${fields}`))
    expect(outcomes(repository)[0]?.status).toBe('VIOLATION')
  }
})

const activity = (status = 'active') =>
  [
    '---',
    'note_type: admin/operations/activity',
    'id: KI-BASE-HK-001',
    'title: Weekly review',
    `status: ${status}`,
    'realization: manual',
    'author: Repository owner',
    'tags: [review, maintenance]',
    'housekeeping:',
    '  cadence: P1W',
    '  last_run: null',
    '  last_run_ref: null',
    '  grace: P1D',
    '  spawn_policy: when-due',
    '  spawn_horizon: next',
    '  active_run: null',
    '---',
    template().split('\n---\n')[1]
  ].join('\n')

const kbRepository = (location = 'Admin/Operations/Activities') => {
  const repository = temporaryDirectory()
  const root = join(repository, location)
  mkdirSync(root, { recursive: true })
  writeFileSync(
    join(repository, '.ki.toml'),
    `[skills.ki-repo]\nrepo_type = "kb"\n[skills.ki-repo-kb-activities]\nactivities_dir = "${location}"\n[skills.ki-work-housekeeping]\n`
  )
  writeFileSync(join(root, 'Activities.md'), '# Activities\n')
  return { repository, root }
}

test('uses a single recurring Activity with nested fields and ordinary KB metadata', () => {
  const { repository, root } = kbRepository()
  const path = join(root, 'Weekly Review.md')
  const content = activity()
  writeFileSync(path, content)
  expect(outcomes(repository)[0]?.subject).toBe('Admin/Operations/Activities/Weekly Review.md')
  expect(outcomes(repository)[0]?.status).toBe('PASS')
  const session = createHousekeepingSession({ ...options(repository), mode: 'conform' })
  expect(session.subjects[0]?.context().templates.schedules[0]?.message).toContain('spawn')
  expect(session.proposal()).toEqual({ writes: [] })
  expect(readFileSync(path, 'utf8')).toBe(content)
})

test('uses configured Activities placement and safely discovers nested recurring notes', () => {
  const { repository, root } = kbRepository('Admin/Operations/Review Activities')
  mkdirSync(join(root, 'Reviews'))
  writeFileSync(join(root, 'Reviews', 'Weekly.md'), activity())
  writeFileSync(
    join(root, 'Conversation.md'),
    '---\nstatus: active\nrealization: conversational\n---\n# Conversation\n'
  )
  expect(outcomes(repository)).toHaveLength(1)
  expect(outcomes(repository)[0]).toMatchObject({
    status: 'PASS',
    subject: 'Admin/Operations/Review Activities/Reviews/Weekly.md'
  })
})

test('ordinary Activities do not acquire recurring-work obligations', () => {
  const { repository, root } = kbRepository()
  writeFileSync(
    join(root, 'Daily Report.md'),
    '---\nstatus: active\nrealization: scheduled-task\nschedule_name: daily\n---\n# Report\n'
  )
  expect(outcomes(repository)[0]?.status).toBe('NOT_APPLICABLE')
  expect(createHousekeepingSession(options(repository)).subjects[0]?.context().templates.schedules).toEqual([])
})

test('retired Activities retain their evidence without becoming eligible and cannot hide active work', () => {
  const { repository, root } = kbRepository()
  const path = join(root, 'Weekly.md')
  writeFileSync(path, activity('retired'))
  expect(outcomes(repository)[0]?.status).toBe('PASS')
  expect(
    createHousekeepingSession(options(repository)).subjects[0]?.context().templates.schedules[0]?.message
  ).toContain('no run is eligible')
  writeFileSync(path, activity('retired').replace('active_run: null', 'active_run: KI-BASE-001'))
  expect(outcomes(repository)[0]?.message).toContain('retirement requires explicit disposition')
})

test('recurring Activity rejects malformed profiles, duplicate YAML keys, wrong field spellings and duplicate identities', () => {
  const { repository, root } = kbRepository()
  const path = join(root, 'Weekly.md')
  for (const content of [
    activity().replace('housekeeping:\n', 'housekeeping: true\n'),
    activity().replace('  cadence: P1W', '  cadence: P1W\n  cadence: P1D'),
    activity().replace('  last_run: null', '  last-run: null'),
    activity().replace('  active_run: null', '  active_run: []'),
    activity().replace('  cadence: P1W', '  cadence: [P1W]'),
    activity().replace('  last_run: null', '  last_run: 9999-12-31')
  ]) {
    writeFileSync(path, content)
    expect(outcomes(repository)[0]?.status).toBe('VIOLATION')
  }
  writeFileSync(path, activity())
  writeFileSync(join(root, 'Duplicate.md'), activity())
  expect(outcomes(repository).every((outcome) => outcome.message.includes('identity must be unique'))).toBe(true)
})

test('recurring Activity shares the roadmap reservation and remains read-only', () => {
  const { repository, root } = kbRepository()
  writeFileSync(join(root, 'Weekly.md'), activity().replace('active_run: null', 'active_run: KI-BASE-001'))
  const roadmap = join(repository, 'Streams', 'Roadmap')
  mkdirSync(roadmap, { recursive: true })
  writeFileSync(
    join(roadmap, 'KI-BASE-001-review.md'),
    '---\nid: KI-BASE-001\nstatus: draft\nhousekeeping_template: KI-BASE-HK-001\nscheduled_for: 2026-09-28\n---\n'
  )
  expect(outcomes(repository)[0]?.status).toBe('PASS')
  const session = createHousekeepingSession(options(repository))
  expect(session.subjects[0]?.context().templates.schedules[0]?.message).toContain('Schedule action: blocked;')
  expect(session.proposal()).toEqual({ writes: [] })
})

test('retained Streams definitions block scheduling without being moved or deleted', () => {
  const { repository, root } = kbRepository()
  writeFileSync(join(root, 'Weekly.md'), activity())
  const oldRoot = join(repository, 'Streams', 'Housekeeping')
  mkdirSync(oldRoot, { recursive: true })
  const path = join(oldRoot, 'Retained.md')
  writeFileSync(path, 'retained work')
  expect(outcomes(repository)[0]).toMatchObject({ status: 'VIOLATION', subject: 'Streams/Housekeeping' })
  expect(
    createHousekeepingSession(options(repository)).subjects[0]?.context().templates.schedules[0]?.message
  ).toContain('no schedule was evaluated')
  expect(readFileSync(path, 'utf8')).toBe('retained work')
})

test('housekeeping rejects escaped and symlinked collections and malformed configuration', () => {
  const repository = temporaryDirectory()
  const outside = temporaryDirectory()
  writeFileSync(join(outside, 'Weekly.md'), activity())
  symlinkSync(outside, join(repository, 'linked'))
  for (const location of ['../outside', outside, 'linked', 'linked/subdir']) {
    writeFileSync(
      join(repository, '.ki.toml'),
      `[skills.ki-repo]\nrepo_type = "kb"\n[skills.ki-repo-kb-activities]\nactivities_dir = "${location}"\n`
    )
    expect(outcomes(repository)[0]?.status).toBe('VIOLATION')
  }
  writeFileSync(join(repository, '.ki.toml'), 'invalid [')
  expect(outcomes(repository)[0]?.message).toContain('malformed repository configuration')
})

test('rejects future successful-run dates through the hosted template contract without writes', () => {
  const repository = temporaryDirectory()
  const root = join(repository, 'docs', 'housekeeping')
  mkdirSync(root, { recursive: true })
  const path = join(root, 'KI-HARNESS-HK-001-monthly-maintenance.md')
  const content = template().replace('last-run: null', 'last-run: 9999-12-31')
  writeFileSync(path, content)
  expect(outcomes(repository)[0]).toMatchObject({
    status: 'VIOLATION',
    message: expect.stringContaining('after the evaluation date')
  })
  expect(readFileSync(path, 'utf8')).toBe(content)
})

test('rejects malformed template identity and missing required body sections', () => {
  const repository = temporaryDirectory()
  const root = join(repository, 'docs', 'housekeeping')
  mkdirSync(root, { recursive: true })
  writeFileSync(
    join(root, 'wrong-name.md'),
    template().replace('## Obsolescence\n\nRemove this template when it is replaced.\n', '')
  )

  expect(outcomes(repository)[0]).toMatchObject({
    status: 'VIOLATION',
    message: expect.stringContaining('filename must repeat the template id')
  })
  expect(outcomes(repository)[0]?.message).toContain("requires a non-empty 'Obsolescence' body section")
})

test('rejects unsafe entries and duplicate or stale active-run linkage', () => {
  const repository = temporaryDirectory()
  const housekeeping = join(repository, 'docs', 'housekeeping')
  const roadmap = join(repository, 'docs', 'roadmap')
  mkdirSync(housekeeping, { recursive: true })
  mkdirSync(roadmap, { recursive: true })
  const active = template().replace('active-run: null', 'active-run: KI-HARNESS-123')
  writeFileSync(join(housekeeping, 'KI-HARNESS-HK-001-monthly-maintenance.md'), active)
  writeFileSync(
    join(housekeeping, 'KI-HARNESS-HK-002-monthly-maintenance.md'),
    active.replace('KI-HARNESS-HK-001', 'KI-HARNESS-HK-002')
  )
  mkdirSync(join(housekeeping, 'unsafe.md'))
  writeFileSync(
    join(roadmap, 'KI-HARNESS-123-stale-run.md'),
    [
      '---',
      'id: KI-HARNESS-123',
      'status: done',
      'housekeeping_template: KI-HARNESS-HK-001',
      'scheduled_for: 2026-08-12',
      '---'
    ].join('\n')
  )

  const results = outcomes(repository)
  expect(results).toContainEqual({
    status: 'VIOLATION',
    message: 'Housekeeping template root contains an unsafe or unexpected entry.',
    subject: 'docs/housekeeping/unsafe.md'
  })
  expect(results.find((outcome) => outcome.subject?.endsWith('HK-001-monthly-maintenance.md'))?.message).toContain(
    'active-run must reference an unfinished lifecycle record'
  )
  expect(results.find((outcome) => outcome.subject?.endsWith('HK-002-monthly-maintenance.md'))?.message).toContain(
    'active-run cannot be linked by more than one housekeeping template'
  )
})
