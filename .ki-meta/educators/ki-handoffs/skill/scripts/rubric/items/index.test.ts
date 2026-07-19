import { expect, test } from 'bun:test'
import { HAND, HAND_1, HAND_2, HAND_3, HAND_4, HAND_5, HAND_6, HAND_7, HAND_8 } from './hand.ts'
import { KI_HANDOFFS_RUBRIC } from './index.ts'

const items = KI_HANDOFFS_RUBRIC.families.flatMap((family) => family.items)

test('the structured catalogue preserves every handoff criterion', () => {
  expect(HAND.map((item) => item.code)).toEqual([
    HAND_1.code,
    HAND_2.code,
    HAND_3.code,
    HAND_4.code,
    HAND_5.code,
    HAND_6.code,
    HAND_7.code,
    HAND_8.code
  ])
  expect(items.map((item) => item.code)).toEqual(['HAND-1', 'HAND-2', 'HAND-3', 'HAND-4', 'HAND-5', 'HAND-6', 'HAND-7', 'HAND-8'])
  expect(Object.fromEntries(items.filter((item) => item.mechanical).map((item) => [item.code, item.mechanical?.level]))).toEqual({
    'HAND-1': 'FAIL',
    'HAND-2': 'FAIL',
    'HAND-3': 'WARN'
  })
  expect(items.filter((item) => item.judgment)).toHaveLength(5)
  expect(items.filter((item) => item.judgment).every((item) => Boolean(item.judgment?.prompt.trim()))).toBe(true)
  expect(items.map((item) => item.title)).toEqual([
    'Semantic tier marker',
    'Decisions locked versus escalate',
    'Readiness marker',
    'Locked decisions are closed',
    'Definition of done',
    'Appropriate assigned tier',
    'Cold-agent readiness',
    'Tokenomics composition boundary'
  ])
  expect(items.map((item) => item.sources)).toEqual([
    ['standards.md#the-opt-in-marker-contract'],
    ['standards.md#the-opt-in-marker-contract', 'standards.md#the-quality-bar'],
    ['standards.md#the-opt-in-marker-contract', 'standards.md#the-readiness-test'],
    ['standards.md#the-reasoning-layer-split', 'standards.md#the-quality-bar'],
    ['standards.md#the-quality-bar'],
    ['standards.md#tier-assignment'],
    ['standards.md#the-readiness-test'],
    ['standards.md#tier-assignment']
  ])
  expect(items.filter((item) => item.judgment).map((item) => item.judgment?.prompt)).toEqual(
    items.filter((item) => item.judgment).map((item) => item.description)
  )
})
