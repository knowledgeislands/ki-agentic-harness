import { expect, test } from 'bun:test'
import { KI_AGENTS_RUBRIC } from './index.ts'

const items = KI_AGENTS_RUBRIC.families.flatMap((family) => family.items)

test('the structured catalogue preserves the complete ki-agents rule surface', () => {
  expect(items.map((item) => item.code)).toEqual([
    'LAY-1',
    'LAY-2',
    'LAY-3',
    'NAME-1',
    'NAME-2',
    'NAME-3',
    'NAME-4',
    'NAME-5',
    'NAME-6',
    'DESC-1',
    'DESC-2',
    'DESC-3',
    'DESC-4',
    'DESC-5',
    'DESC-6',
    'DESC-7',
    'FM-1',
    'FM-2',
    'FM-3',
    'FM-4',
    'FM-5',
    'FM-6',
    'FM-7',
    'FM-8',
    'FM-9',
    'FM-10',
    'FM-11',
    'PROMPT-1',
    'PROMPT-2',
    'PROMPT-3',
    'PROMPT-4',
    'PROMPT-5',
    'PROMPT-6',
    'PROMPT-7',
    'LANE-1',
    'LANE-2',
    'LANE-3',
    'LANE-4',
    'LANE-5',
    'LINK-1',
    'LINK-2',
    'LINK-3',
    'PROC-1',
    'PROC-2',
    'LONG-1',
    'COLL-1',
    'COLL-2'
  ])
  expect(Object.fromEntries(items.filter((item) => item.mechanical).map((item) => [item.code, item.mechanical?.level]))).toEqual({
    'LAY-1': 'FAIL',
    'LAY-3': 'WARN',
    'NAME-1': 'FAIL',
    'NAME-2': 'FAIL',
    'NAME-3': 'FAIL',
    'NAME-4': 'FAIL',
    'NAME-5': 'FAIL',
    'DESC-1': 'FAIL',
    'DESC-2': 'WARN',
    'DESC-3': 'FAIL',
    'FM-11': 'FAIL',
    'PROMPT-1': 'FAIL',
    'LINK-1': 'FAIL',
    'COLL-1': 'WARN'
  })
  expect(items.filter((item) => item.judgment)).toHaveLength(33)
  expect(items.filter((item) => item.judgment).every((item) => Boolean(item.judgment?.prompt.trim()))).toBe(true)
})
