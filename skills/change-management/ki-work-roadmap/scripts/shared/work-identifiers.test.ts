import { expect, test } from 'bun:test'
import { AREA_CODE, isAreaCode, SCOPE_SEGMENT } from './work-identifiers.ts'

test('an area code may lead with a digit but must contain a letter', () => {
  for (const code of ['5GE', 'GOV', 'P2', 'A', '2A3']) expect(isAreaCode(code)).toBe(true)
  for (const code of ['555', '0', '', '5ge', 'G-E', ' GE']) expect(isAreaCode(code)).toBe(false)
  expect(isAreaCode(5)).toBe(false)
})

test('the scope segment composes into larger anchored patterns', () => {
  expect(new RegExp(`^(${SCOPE_SEGMENT}):\\s*(\\d+)$`).exec('5GE: 12')?.slice(1)).toEqual(['5GE', '12'])
  expect(AREA_CODE.test('5GE')).toBe(true)
})
