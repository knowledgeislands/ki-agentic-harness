import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createPmoSession, isCapital, repositoryIdentity } from './pmo.ts'

const roots: string[] = []

const fixture = (identity: { repository: string; capital: string } | null): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-pmo-'))
  roots.push(root)
  if (identity)
    writeFileSync(
      join(root, '.ki.toml'),
      `[skills.ki-repo]\nrepository = "${identity.repository}"\ncapital = "${identity.capital}"\n`
    )
  return root
}

const checkpoint = (root: string, name: string, fields: Record<string, string>): void => {
  mkdirSync(join(root, '+', '_CHECKPOINTS'), { recursive: true })
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: '${value}'`)
    .join('\n')
  writeFileSync(join(root, '+', '_CHECKPOINTS', `${name}.md`), `---\n${frontmatter}\n---\n\n# ${name}\n`)
}

const register = (root: string, kind: 'Projects' | 'Initiatives', slug: string): void => {
  mkdirSync(join(root, 'Streams', kind, slug), { recursive: true })
  writeFileSync(join(root, 'Streams', kind, slug, `${slug}.md`), `# ${slug}\n`)
}

const context = (root: string) => {
  const session = createPmoSession({ mode: 'audit', repository: root, userHome: root, configuration: {} })
  return session.subjects[0]!.context()
}

const statuses = (outcomes: readonly { status: string }[]) => outcomes.map((outcome) => outcome.status)

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('repository identity', () => {
  test('a repository whose capital is itself is a Capital', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    expect(isCapital(repositoryIdentity(root))).toBe(true)
  })

  test('a repository naming another capital is not', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    expect(isCapital(repositoryIdentity(root))).toBe(false)
  })

  test('a missing configuration yields no identity', () => {
    expect(isCapital(repositoryIdentity(fixture(null)))).toBe(false)
  })
})

describe('master checkpoint', () => {
  test('a Capital without _state-of-play.md is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    expect(statuses(context(root).master.outcomes)).toEqual(['VIOLATION'])
  })

  test('a Capital with a labelled master checkpoint passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    expect(statuses(context(root).master.outcomes)).toEqual(['PASS'])
  })

  test('a master checkpoint outside a Capital is a violation', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    const [outcome] = context(root).master.outcomes
    expect(outcome?.status).toBe('VIOLATION')
    expect(outcome?.subject).toBe(join('+', '_CHECKPOINTS', '_state-of-play.md'))
  })

  test('no checkpoints outside a Capital is not applicable', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    const ctx = context(root)
    expect(statuses(ctx.master.outcomes)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(ctx.labels.outcomes)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(ctx.cap.outcomes)).toEqual(['NOT_APPLICABLE'])
  })
})

describe('project thread checkpoints', () => {
  test('a label ending in the Project name that resolves in the registry passes', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    register(root, 'Projects', 'ways-of-working')
    register(root, 'Initiatives', 'knowledge-islands-model')
    expect(statuses(context(root).labels.outcomes)).toEqual(['PASS'])
  })

  test('a label not ending in the Project name is a violation', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'Ways of working' })
    register(root, 'Projects', 'ways-of-working')
    register(root, 'Initiatives', 'knowledge-islands-model')
    const outcomes = context(root).labels.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toContain('ends in its Project name')
  })

  test('an unregistered Project or Initiative is a violation on a Capital', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    mkdirSync(join(root, 'Streams', 'Projects'), { recursive: true })
    mkdirSync(join(root, 'Streams', 'Initiatives'), { recursive: true })
    expect(statuses(context(root).labels.outcomes)).toEqual(['VIOLATION', 'VIOLATION'])
  })

  test('the registry is not consulted outside a Capital', () => {
    const root = fixture({ repository: 'ki-agentic-harness', capital: 'ki-principal' })
    checkpoint(root, 'knowledge-islands-model.ways-of-working', { label: 'KI Model: ways-of-working' })
    expect(statuses(context(root).labels.outcomes)).toEqual(['PASS'])
  })
})

describe('active thread cap', () => {
  test('four active Project threads are within the cap', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    for (const project of ['one', 'two', 'three', 'four'])
      checkpoint(root, `initiative.${project}`, { label: `Initiative: ${project}` })
    expect(statuses(context(root).cap.outcomes)).toEqual(['PASS'])
  })

  test('five active Project threads exceed the cap', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    for (const project of ['one', 'two', 'three', 'four', 'five'])
      checkpoint(root, `initiative.${project}`, { label: `Initiative: ${project}` })
    const outcomes = context(root).cap.outcomes
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toContain('5 Project threads')
  })

  test('a closed thread does not count', () => {
    const root = fixture({ repository: 'ki-principal', capital: 'ki-principal' })
    checkpoint(root, '_state-of-play', { label: 'Master: state-of-play' })
    for (const project of ['one', 'two', 'three', 'four'])
      checkpoint(root, `initiative.${project}`, { label: `Initiative: ${project}` })
    checkpoint(root, 'initiative.five', { label: 'Initiative: five', state: 'closed' })
    expect(statuses(context(root).cap.outcomes)).toEqual(['PASS'])
  })
})
