import { afterEach, expect, setSystemTime, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricContextOptions } from '../../shared/rubric.ts'
import { ACT } from '../items/activities.ts'
import { createActivitiesSession } from './activities.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const temporaryDirectory = (prefix: string): string => {
  const directory = mkdtempSync(join(tmpdir(), prefix))
  temporaryDirectories.push(directory)
  return directory
}

const options = (
  repository: string,
  mode: 'audit' | 'conform',
  configuration: Readonly<Record<string, unknown>> = {}
): RubricContextOptions => ({
  mode,
  repository,
  userHome: tmpdir(),
  configuration
})

const activityBase = (): string => {
  const repository = temporaryDirectory('ki-repo-kb-activities-')
  const activities = join(repository, 'Admin', 'Operations', 'Activities')
  mkdirSync(activities, { recursive: true })
  writeFileSync(
    join(activities, 'Morning Briefing.md'),
    [
      '---',
      'status: active',
      'realization: scheduled-task',
      'schedule_name: Morning Briefing',
      'author: Test',
      '---',
      '# Morning Briefing',
      ''
    ].join('\n')
  )
  return repository
}

const activityContext = (session: ReturnType<typeof createActivitiesSession>) => {
  const subject = session.subjects[0]
  if (!subject) throw new Error('ki-repo-kb-activities session did not expose its repository subject')
  return ACT.selectContext(subject.context())
}

const indexItem = () => {
  const item = ACT.items.find((candidate) => candidate.code === 'ACT-S-1')
  if (!item?.mechanical) throw new Error('ACT-S-1 mechanical item is missing')
  return item.mechanical
}

test('recurring-work lifecycle is required only for opted-in Activities', () => {
  const repository = activityBase()
  const path = join(repository, 'Admin', 'Operations', 'Activities', 'Morning Briefing.md')
  const criterion = ACT.items.find((item) => item.code === 'ACT-R-5')?.mechanical
  if (!criterion) throw new Error('Missing recurring-work criterion')
  const audit = () => criterion.audit.run(activityContext(createActivitiesSession(options(repository, 'audit'))))
  expect(audit()[0]?.status).toBe('NOT_APPLICABLE')
  writeFileSync(
    path,
    readFileSync(path, 'utf8').replace('status: active', 'status: active\nhousekeeping:\n  cadence: P1W')
  )
  expect(audit()[0]?.status).toBe('VIOLATION')
  writeFileSync(join(repository, '.ki.toml'), '[skills.ki-work-recurring]\n')
  expect(audit()[0]?.status).toBe('PASS')
})

test("an Activity's home is regular work or its Project, and a legacy initiative warns", () => {
  const repository = activityBase()
  const path = join(repository, 'Admin', 'Operations', 'Activities', 'Morning Briefing.md')
  const original = readFileSync(path, 'utf8')
  const criterion = ACT.items.find((item) => item.code === 'ACT-F-5')?.mechanical
  if (!criterion) throw new Error('Missing activity home criterion')
  const audit = (fields: string) => {
    writeFileSync(path, original.replace('status: active', `status: active\n${fields}`))
    const [outcome] = criterion.audit.run(activityContext(createActivitiesSession(options(repository, 'audit'))))
    return { status: outcome?.status, message: outcome?.message }
  }
  expect(audit('author_note: none')).toEqual({ status: 'PASS', message: "home is the territory's regular work" })
  expect(audit('theme: model\nproject: ways-of-working')).toEqual({
    status: 'PASS',
    message: "home is Project 'ways-of-working', theme 'model'"
  })
  expect(audit('initiative: platform-foundations').message).toStartWith('legacy: ')
  expect(audit('housekeeping:\n  initiative: platform-foundations').status).toBe('VIOLATION')
  expect(audit('theme: model\nhousekeeping:\n  theme: foundations').message).toBe(
    "theme 'model' disagrees with the housekeeping profile's 'foundations'"
  )
  expect(audit('project: Ways of working').status).toBe('VIOLATION')
})

test('audit is read-only and returns one stable prepared context', () => {
  const repository = activityBase()
  const session = createActivitiesSession(options(repository, 'audit'))
  const subject = session.subjects[0]
  const context = activityContext(session)

  expect(subject?.context()).toBe(subject?.context())
  expect(context.ensureIndex).toBeUndefined()
  expect(indexItem().audit.run(context)[0]?.status).toBe('VIOLATION')
  expect(session.proposal()).toEqual({ writes: [] })
  expect(existsSync(join(repository, 'Admin', 'Operations', 'Activities', 'Activities.md'))).toBe(false)
})

test('the index item stages one idempotent create behind the session proposal', () => {
  const repository = activityBase()
  const session = createActivitiesSession(options(repository, 'conform'))
  const context = activityContext(session)

  indexItem().conform?.run(context)
  indexItem().conform?.run(context)

  expect(session.proposal()).toEqual({
    writes: [
      {
        path: 'Admin/Operations/Activities/Activities.md',
        content: '# Activities\n\n- [Morning Briefing](<Morning Briefing.md>)\n',
        create: true
      }
    ]
  })
  expect(existsSync(join(repository, 'Admin', 'Operations', 'Activities', 'Activities.md'))).toBe(false)
})

test('a configured collection path produces one bounded index proposal', () => {
  const repository = temporaryDirectory('ki-repo-kb-activities-alias-')
  const activities = join(repository, 'Operations', 'Activity Register')
  mkdirSync(activities, { recursive: true })
  writeFileSync(join(activities, 'Manual Review.md'), '# Manual Review\n')
  const session = createActivitiesSession(
    options(repository, 'conform', { activities_dir: 'Operations/Activity Register' })
  )

  indexItem().conform?.run(activityContext(session))

  expect(session.proposal().writes.map((write) => write.path)).toEqual(['Operations/Activity Register/Activities.md'])
})

test('an index symlink is neither followed nor proposed for replacement', () => {
  const repository = activityBase()
  const outside = join(temporaryDirectory('ki-repo-kb-activities-outside-'), 'outside.md')
  writeFileSync(outside, 'outside\n')
  symlinkSync(outside, join(repository, 'Admin', 'Operations', 'Activities', 'Activities.md'))
  const session = createActivitiesSession(options(repository, 'conform'))

  indexItem().conform?.run(activityContext(session))

  expect(session.proposal()).toEqual({ writes: [] })
  expect(readFileSync(outside, 'utf8')).toBe('outside\n')
})

test('prose and code lookalikes do not satisfy index-link coverage', () => {
  const repository = activityBase()
  const activities = join(repository, 'Admin', 'Operations', 'Activities')
  writeFileSync(
    join(activities, 'Activities.md'),
    '# Activities\n\nMorning Briefing.md is adopted.\n\n```md\n- [Morning Briefing](<Morning Briefing.md>)\n```\n'
  )
  const session = createActivitiesSession(options(repository, 'audit'))

  expect(indexItem().audit.run(activityContext(session))[0]).toMatchObject({ status: 'VIOLATION' })
})

test('Obsidian wikilinks satisfy index coverage without a conform write', () => {
  const repository = activityBase()
  const activities = join(repository, 'Admin', 'Operations', 'Activities')
  writeFileSync(join(activities, 'Activities.md'), '# Activities\n\n- [[Morning Briefing]]\n')
  const session = createActivitiesSession(options(repository, 'conform'))
  const context = activityContext(session)

  expect(indexItem().audit.run(context)[0]).toMatchObject({ status: 'PASS' })
  indexItem().conform?.run(context)
  expect(session.proposal()).toEqual({ writes: [] })
})

test('aliased Obsidian wikilinks satisfy index coverage', () => {
  const repository = activityBase()
  const activities = join(repository, 'Admin', 'Operations', 'Activities')
  writeFileSync(join(activities, 'Activities.md'), '# Activities\n\n- [[Morning Briefing|Daily briefing]]\n')
  const session = createActivitiesSession(options(repository, 'audit'))

  expect(indexItem().audit.run(activityContext(session))[0]).toMatchObject({ status: 'PASS' })
})

test('Obsidian wikilinks inside fenced code do not satisfy index coverage', () => {
  const repository = activityBase()
  const activities = join(repository, 'Admin', 'Operations', 'Activities')
  writeFileSync(join(activities, 'Activities.md'), '# Activities\n\n```md\n- [[Morning Briefing]]\n```\n')
  const session = createActivitiesSession(options(repository, 'audit'))

  expect(indexItem().audit.run(activityContext(session))[0]).toMatchObject({ status: 'VIOLATION' })
})

test('malformed YAML frontmatter fails rather than appearing as an unstructured note', () => {
  const repository = activityBase()
  const activities = join(repository, 'Admin', 'Operations', 'Activities')
  writeFileSync(join(activities, 'Morning Briefing.md'), '---\nstatus: [active\n---\n# Morning Briefing\n')
  const context = activityContext(createActivitiesSession(options(repository, 'audit')))
  const status = ACT.items.find((item) => item.code === 'ACT-F-1')?.mechanical?.audit.run(context)

  expect(status?.[0]).toMatchObject({ status: 'VIOLATION', message: expect.stringContaining('malformed') })
})

test('a configured collection cannot traverse an intermediate symlink', () => {
  const repository = temporaryDirectory('ki-repo-kb-activities-root-')
  const outside = temporaryDirectory('ki-repo-kb-activities-linked-')
  mkdirSync(join(outside, 'Activities'), { recursive: true })
  writeFileSync(join(outside, 'Activities', 'Escaped.md'), '# Escaped\n')
  symlinkSync(outside, join(repository, 'linked'))
  const session = createActivitiesSession(options(repository, 'conform', { activities_dir: 'linked/Activities' }))

  indexItem().conform?.run(activityContext(session))

  expect(session.proposal()).toEqual({ writes: [] })
  expect(existsSync(join(outside, 'Activities', 'Activities.md'))).toBe(false)
})

test('encoded spaces cover the Activity index without decoding reserved escapes or literal percent signs', () => {
  const repository = activityBase()
  const directory = join(repository, 'Admin', 'Operations', 'Activities')
  writeFileSync(join(directory, 'Literal%23.md'), '# Literal escape\n')
  writeFileSync(join(directory, '100%.md'), '# Literal percent\n')
  writeFileSync(
    join(directory, 'Activities.md'),
    '# Activities\n\n- [Morning](Morning%20Briefing.md)\n- [Literal](Literal%23.md)\n- [Percent](100%.md)\n'
  )
  expect(indexItem().audit.run(activityContext(createActivitiesSession(options(repository, 'audit'))))[0]?.status).toBe(
    'PASS'
  )
})

test('legacy initiative fields warn before THEME-CLOSE and fail on the cutover day', () => {
  const repository = activityBase()
  const path = join(repository, 'Admin', 'Operations', 'Activities', 'Morning Briefing.md')
  const original = readFileSync(path, 'utf8')
  writeFileSync(path, original.replace('status: active', 'status: active\ninitiative: model'))
  const criterion = ACT.items.find((item) => item.code === 'ACT-F-5')?.mechanical
  if (!criterion) throw new Error('Missing activity home criterion')
  try {
    for (const [date, level] of [
      ['2026-11-06', 'WARN'],
      ['2026-11-07', 'FAIL'],
      ['2026-11-08', 'FAIL']
    ]) {
      setSystemTime(new Date(`${date}T00:00:00Z`))
      const outcomes = criterion.audit.run(activityContext(createActivitiesSession(options(repository, 'audit'))))
      expect(outcomes[0]).toMatchObject({ status: 'VIOLATION', level })
    }
  } finally {
    setSystemTime()
  }
})
