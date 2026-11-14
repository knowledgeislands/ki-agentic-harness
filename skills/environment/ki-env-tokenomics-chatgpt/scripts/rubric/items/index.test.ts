import { describe, expect, test } from 'bun:test'
import definition from './index.ts'

describe('Codex tokenomics catalogue', () => {
  test('owns only Codex evidence and explicit unavailable metrics', () =>
    expect(definition.families.flatMap((family) => family.items.map((item) => item.code))).toEqual([
      'CODEX-SURF-1',
      'CODEX-NA-1',
      'RUBRIC-1'
    ]))

  test('every criterion declares strict v1 remediation evidence', () => {
    const families = definition.families as unknown as readonly {
      items: readonly { mechanical?: { remediation: { class: string }; conform?: unknown } }[]
    }[]
    for (const item of families.flatMap((family) => family.items)) {
      if (!item.mechanical) continue
      expect(item.mechanical.remediation.class).not.toBe('')
      if (item.mechanical.conform) expect(item.mechanical.remediation.class).toBe('automatic')
    }
  })
})
