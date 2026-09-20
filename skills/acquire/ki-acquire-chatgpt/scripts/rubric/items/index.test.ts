import { describe, expect, test } from 'bun:test'
import definition from './index.ts'

describe('ChatGPT acquisition catalogue', () => {
  test('owns source, routing, fidelity, retirement, and publication judgments', () => {
    expect(definition.families.flatMap((family) => family.items.map((item) => item.code))).toEqual([
      'SOURCE-1',
      'SOURCE-2',
      'ROUTING-1',
      'ROUTING-2',
      'FIDELITY-1',
      'FIDELITY-2',
      'RETIRE-1',
      'RUBRIC-1'
    ])
  })

  test('keeps acquisition policy judgments non-mechanical', () => {
    const policyFamilies = definition.families.filter(({ code }) => code !== 'RUBRIC')
    expect(
      policyFamilies.every((family) => family.items.every((item) => !('mechanical' in item) && 'judgment' in item))
    ).toBe(true)
  })
})
