import { describe, expect, test } from 'bun:test'
import definition from './index.ts'

describe('ChatGPT housekeeping catalogue', () => {
  test('keeps session judgments separate from mechanical memory checks', () => {
    expect(definition.families.flatMap((family) => family.items.map((item) => item.code))).toEqual([
      'STATE-1',
      'STATE-2',
      'STATE-3',
      'STATE-4',
      'MEMORY-1',
      'MEMORY-2',
      'MEMORY-3',
      'RUBRIC-1'
    ])
  })

  test('keeps destructive state judgments non-mechanical', () => {
    const state = definition.families.find(({ code }) => code === 'STATE')
    expect(state?.items.every((item) => !('mechanical' in item) && 'judgment' in item)).toBe(true)
  })
})
