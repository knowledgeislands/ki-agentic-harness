import { expect, test } from 'bun:test'
import { tmpdir } from 'node:os'
import definition from './index.ts'

test('the catalogue exposes the ordered Design criteria', () => {
  expect(definition.contract).toBe(1)
  expect(definition.name).toBe('ki-design')
  expect(definition.families.map((family) => family.code)).toEqual(['RUBRIC', 'DESIGN'])
  expect(definition.families.flatMap((family) => family.items.map((item) => item.code))).toEqual([
    'RUBRIC-1',
    'DESIGN-1',
    'DESIGN-2',
    'DESIGN-3',
    'DESIGN-4',
    'DESIGN-5'
  ])
})

test('the catalogue and family modules keep their public surfaces narrow', async () => {
  expect(Object.keys(await import('./index.ts'))).toEqual(['default'])
  expect(Object.keys(await import('./design.ts'))).toEqual(['DESIGN'])
})

test('every Design criterion is judgment, reviewed by a reader rather than a script', async () => {
  const session = await definition.createSession({
    mode: 'audit',
    repository: tmpdir(),
    userHome: tmpdir(),
    configuration: {},
    packageScriptClaims: []
  })
  expect(session.subjects.map((subject) => subject.families)).toEqual([['RUBRIC'], ['DESIGN']])
  const family = definition.families.find((candidate) => candidate.code === 'DESIGN')
  for (const item of family?.items ?? []) {
    expect(item.judgment).toBeDefined()
    expect('mechanical' in item).toBe(false)
  }
})
