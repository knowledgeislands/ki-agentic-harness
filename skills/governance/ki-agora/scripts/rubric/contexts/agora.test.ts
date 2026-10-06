import { afterEach, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricContextOptions } from '../../shared/rubric.ts'
import { CONFIG } from '../items/configuration.ts'
import { createAgoraSession } from './agora.ts'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-agora-'))
  temporaryDirectories.push(root)
  writeFileSync(
    join(root, '.ki.toml'),
    ['[skills.ki-repo]', 'repository = "https://github.com/knowledgeislands/home"', ''].join('\n')
  )
  return root
}

const options = (repository: string, configuration: Record<string, unknown>): RubricContextOptions => ({
  mode: 'audit',
  repository,
  userHome: repository,
  configuration
})

const outcomes = (session: ReturnType<typeof createAgoraSession>) => {
  const item = CONFIG.items[0]
  if (!item?.mechanical) throw new Error('CONFIG has no mechanical item')
  return item.mechanical.audit.run(CONFIG.selectContext(session.subjects[1]?.context() as never) as never)
}

test('owner-declared members and both inclusion kinds pass local validation', () => {
  const session = createAgoraSession(
    options(fixture(), {
      team: {
        title: 'Team',
        purpose: 'Team repositories',
        members: ['https://github.com/knowledgeislands/tools-ki'],
        includes: ['legal', 'https://github.com/example/plain-git-repository']
      }
    })
  )

  expect(outcomes(session)).toEqual([
    { status: 'PASS', message: 'Agora homes use canonical title, purpose, members, and optional inclusion shape.' }
  ])
})

test('an empty owner table has no membership side effect', () => {
  expect(outcomes(createAgoraSession(options(fixture(), {})))).toEqual([
    { status: 'PASS', message: 'Agora homes use canonical title, purpose, members, and optional inclusion shape.' }
  ])
})

test('local shape rejects malformed declarations', () => {
  const session = createAgoraSession(
    options(fixture(), {
      Knowledge_Islands: {
        title: 'Knowledge Islands',
        purpose: '',
        members: ['not a repository', 'https://github.com/knowledgeislands/home']
      }
    })
  )

  expect(outcomes(session).map((outcome) => outcome.message)).toEqual([
    'home Knowledge_Islands must use a stable lower-case hyphenated identifier',
    'home Knowledge_Islands requires a non-empty purpose',
    'home Knowledge_Islands member not a repository must be a canonical HTTPS GitHub repository',
    'home Knowledge_Islands must not list its own repository as a member'
  ])
})

test('legacy fields and unknown fields fail closed', () => {
  const session = createAgoraSession(
    options(fixture(), {
      team: {
        owner: 'https://github.com/knowledgeislands/home',
        title: 'Team',
        purpose: 'Team work',
        order: [],
        references: [],
        memberships: {},
        members: []
      }
    })
  )

  expect(outcomes(session).map((outcome) => outcome.message)).toEqual([
    'home team has unrecognised key owner',
    'home team has unrecognised key order',
    'home team has unrecognised key references',
    'home team has unrecognised key memberships'
  ])
})

test('inclusions are distinct, canonical, and cannot include self or a direct participant', () => {
  const session = createAgoraSession(
    options(fixture(), {
      team: {
        title: 'Team',
        purpose: 'Team work',
        members: ['https://github.com/knowledgeislands/tools-ki'],
        includes: [
          'not a group',
          'team',
          'legal',
          'legal',
          'https://github.com/knowledgeislands/home',
          'https://github.com/knowledgeislands/tools-ki'
        ]
      }
    })
  )

  expect(outcomes(session).map((outcome) => outcome.message)).toEqual([
    'home team includes entries must be Agora identifiers or canonical HTTPS GitHub repositories',
    'home team must not include itself',
    'home team includes repeats legal',
    'home team must not include its owner or a direct member',
    'home team must not include its owner or a direct member'
  ])
})

test('role-bearing members and repeated members are rejected', () => {
  const session = createAgoraSession(
    options(fixture(), {
      legacy: {
        title: 'Legacy',
        purpose: 'Shared work',
        members: { 'https://github.com/knowledgeislands/tools-ki': 'observer' }
      },
      repeated: {
        title: 'Repeated',
        purpose: 'Shared work',
        members: ['https://github.com/knowledgeislands/tools-ki', 'https://github.com/knowledgeislands/tools-ki']
      }
    })
  )

  expect(outcomes(session).map((outcome) => outcome.message)).toEqual([
    'home legacy members must be an array of canonical HTTPS GitHub repositories',
    'home repeated members repeats https://github.com/knowledgeislands/tools-ki'
  ])
})

test('every Agora requires a non-empty single-line title', () => {
  const session = createAgoraSession(
    options(fixture(), {
      missing: { purpose: 'Shared work', members: [] },
      blank: { title: '   ', purpose: 'Shared work', members: [] },
      padded: { title: ' Padded ', purpose: 'Shared work', members: [] },
      multiline: { title: 'Two\nlines', purpose: 'Shared work', members: [] },
      typed: { title: 7, purpose: 'Shared work', members: [] },
      titled: { title: 'Titled', purpose: 'Shared work', members: [] }
    })
  )

  expect(outcomes(session).map((outcome) => outcome.message)).toEqual([
    'home missing requires a non-empty single-line title',
    'home blank requires a non-empty single-line title',
    'home padded requires a non-empty single-line title',
    'home multiline requires a non-empty single-line title',
    'home typed requires a non-empty single-line title'
  ])
})
