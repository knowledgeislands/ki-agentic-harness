import { expect, test } from 'bun:test'
import { tmpdir } from 'node:os'
import definition from './index.ts'

test('the catalogue exposes the ordered Meeting criteria', () => {
  expect(definition.contract).toBe(1)
  expect(definition.name).toBe('ki-meeting')
  expect(definition.families.map((family) => family.code)).toEqual(['RUBRIC', 'MEETING'])
  expect(definition.families.flatMap((family) => family.items.map((item) => item.code))).toEqual([
    'RUBRIC-1',
    'MEETING-1',
    'MEETING-2',
    'MEETING-3',
    'MEETING-4',
    'MEETING-5',
    'MEETING-6',
    'MEETING-7',
    'MEETING-8',
    'MEETING-9'
  ])
})

test('the catalogue and family modules keep their public surfaces narrow', async () => {
  expect(Object.keys(await import('./index.ts'))).toEqual(['default'])
  expect(Object.keys(await import('./meeting.ts'))).toEqual(['MEETING'])
})

test('every Meeting criterion is judgment, reviewed by a reader rather than a script', async () => {
  const session = await definition.createSession({
    mode: 'audit',
    repository: tmpdir(),
    userHome: tmpdir(),
    configuration: {},
    packageScriptClaims: []
  })
  expect(session.subjects.map((subject) => subject.families)).toEqual([['RUBRIC'], ['MEETING']])
  const family = definition.families.find((candidate) => candidate.code === 'MEETING')
  for (const item of family?.items ?? []) {
    expect(item.judgment).toBeDefined()
    expect('mechanical' in item).toBe(false)
  }
})
