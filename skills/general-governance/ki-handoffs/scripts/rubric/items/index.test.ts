import { expect, test } from 'bun:test'
import { KI_HANDOFFS_RUBRIC } from './index.ts'

const items = KI_HANDOFFS_RUBRIC.families.flatMap((family) => family.items)

test('the structured catalogue preserves every handoff criterion', () => {
  expect(items.map((item) => item.code)).toEqual(['HAND-1', 'HAND-2', 'HAND-3', 'HAND-4', 'HAND-5', 'HAND-6', 'HAND-7', 'HAND-8'])
  expect(Object.fromEntries(items.filter((item) => item.mechanical).map((item) => [item.code, item.mechanical?.level]))).toEqual({
    'HAND-1': 'FAIL',
    'HAND-2': 'FAIL',
    'HAND-3': 'WARN'
  })
  expect(items.filter((item) => item.judgment)).toHaveLength(5)
  expect(items.filter((item) => item.judgment).every((item) => Boolean(item.judgment?.prompt.trim()))).toBe(true)
})
