import { expect, test } from 'bun:test'
import definition from './index.ts'

test('the catalogue exposes the ordered Diagrams criteria', () => {
  expect(definition.contract).toBe(1)
  expect(definition.name).toBe('ki-diagrams')
  expect(definition.createSession).toBeFunction()
  expect(definition.families.map((family) => family.code)).toEqual(['RUBRIC', 'DIAG'])
  expect(
    definition.families
      .filter((family) => family.code !== 'RUBRIC')
      .flatMap((family) => family.items.map((item) => item.code))
  ).toEqual(['DIAG-1', 'DIAG-2', 'DIAG-3', 'DIAG-4', 'DIAG-5'])
})

test('the catalogue and family modules keep their public surfaces narrow', async () => {
  expect(Object.keys(await import('./index.ts'))).toEqual(['default'])
  expect(Object.keys(await import('./diagrams.ts'))).toEqual(['DIAG'])
})

test('only publication is automatic; staleness warns and type fit is judgment alone', () => {
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
    'DIAG-1',
    'DIAG-2',
    'DIAG-3'
  ])
  expect(items.find((item) => item.code === 'DIAG-4')?.mechanical?.level).toBe('WARN')
  expect(items.find((item) => item.code === 'DIAG-4')?.judgment?.prompt).toContain('stale_when')
  expect(items.find((item) => item.code === 'DIAG-5')?.mechanical).toBeUndefined()
  expect(items.find((item) => item.code === 'DIAG-5')?.judgment?.prompt).toContain('--quality showcase')
})
