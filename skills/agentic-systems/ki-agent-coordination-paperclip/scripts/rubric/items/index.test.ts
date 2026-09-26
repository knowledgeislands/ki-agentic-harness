import { expect, test } from 'bun:test'
import type { RubricItem } from '../../shared/rubric.ts'
import catalogue from './index.ts'

const items = catalogue.families.flatMap((family) => family.items as readonly RubricItem<unknown>[])

test('Paperclip coordination keeps relationship criteria judgment-led', () => {
  expect(catalogue.name).toBe('ki-agent-coordination-paperclip')
  expect(items.map((item) => item.code)).toEqual([
    'COORD-1',
    'COORD-2',
    'COORD-3',
    'COORD-4',
    'COORD-5',
    'COORD-6',
    'COORD-7',
    'RUBRIC-1'
  ])
  expect(items.every((item) => !item.mechanical || item.code === 'RUBRIC-1')).toBe(true)
})
