import { expect, test } from 'bun:test'
import definition from './index.ts'

test('the catalogue exposes the ordered Design System criteria', () => {
  expect(definition.contract).toBe(1)
  expect(definition.name).toBe('ki-design-system')
  expect(definition.createSession).toBeFunction()
  expect(definition.families.map((family) => family.code)).toEqual(['RUBRIC', 'DSYS'])
  expect(
    definition.families
      .filter((family) => family.code !== 'RUBRIC')
      .flatMap((family) => family.items.map((item) => item.code))
  ).toEqual(['DSYS-1', 'DSYS-2', 'DSYS-3', 'DSYS-4', 'DSYS-5', 'DSYS-6', 'DSYS-7', 'DSYS-8'])
})

test('the catalogue and family modules keep their public surfaces narrow', async () => {
  expect(Object.keys(await import('./index.ts'))).toEqual(['default'])
  expect(Object.keys(await import('./design.ts'))).toEqual(['DSYS'])
})

test('presence fails, guide drift warns, and placement, floor and retirement are judgment alone', () => {
  const items = definition.families.flatMap((family) => family.items as readonly unknown[]) as readonly {
    code: string
    mechanical?: { level: string; remediation: { class: string } }
    judgment?: { prompt: string }
  }[]

  expect(items.filter((item) => item.mechanical?.remediation.class === 'automatic').map((item) => item.code)).toEqual([
    'RUBRIC-1'
  ])
  expect(items.filter((item) => item.mechanical?.level === 'FAIL').map((item) => item.code)).toEqual([
    'RUBRIC-1',
    'DSYS-1',
    'DSYS-2',
    'DSYS-3'
  ])
  expect(items.filter((item) => item.mechanical?.level === 'WARN').map((item) => item.code)).toEqual([
    'DSYS-4',
    'DSYS-5'
  ])
  for (const code of ['DSYS-6', 'DSYS-7', 'DSYS-8']) {
    expect(items.find((item) => item.code === code)?.mechanical).toBeUndefined()
    expect(items.find((item) => item.code === code)?.judgment?.prompt).toBeString()
  }
})
