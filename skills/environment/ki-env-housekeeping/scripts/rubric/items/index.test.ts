import { expect, test } from 'bun:test'
import { tmpdir } from 'node:os'
import definition from './index.ts'

test('the catalogue exposes the ordered Housekeeping criteria', () => {
  expect(definition.contract).toBe(1)
  expect(definition.name).toBe('ki-env-housekeeping')
  expect(definition.families.map((family) => family.code)).toEqual(['RUBRIC', 'HOUSE'])
  expect(definition.families.flatMap((family) => family.items.map((item) => item.code))).toEqual([
    'RUBRIC-1',
    'HOUSE-1',
    'HOUSE-2',
    'HOUSE-3',
    'HOUSE-4'
  ])
})

test('the catalogue and family modules keep their public surfaces narrow', async () => {
  expect(Object.keys(await import('./index.ts'))).toEqual(['default'])
  expect(Object.keys(await import('./housekeeping.ts'))).toEqual(['HOUSE'])
})

test('every Housekeeping criterion is judgment, reviewed by a reader rather than a script', async () => {
  const session = await definition.createSession({
    mode: 'audit',
    repository: tmpdir(),
    userHome: tmpdir(),
    configuration: {},
    packageScriptClaims: []
  })
  expect(session.subjects.map((subject) => subject.families)).toEqual([['RUBRIC'], ['HOUSE']])
  const family = definition.families.find((candidate) => candidate.code === 'HOUSE')
  for (const item of family?.items ?? []) {
    expect(item.judgment).toBeDefined()
    expect('mechanical' in item).toBe(false)
  }
})
