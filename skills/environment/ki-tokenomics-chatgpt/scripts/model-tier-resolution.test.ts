import { describe, expect, test } from 'bun:test'
import { resolveCodexModelTier } from './internal/model-tier-resolution.ts'

describe('Codex model-tier resolution', () => {
  test('keeps orchestration at the portable frontier purpose when no family evidence exists', () =>
    expect(resolveCodexModelTier('orchestration')).toEqual({
      purpose: 'frontier',
      status: 'inherit',
      requiresAuthorisedEvaluation: true
    }))

  test('maps bounded worker roles to dated source-local evidence, not an effective model', () => {
    expect(resolveCodexModelTier('judgment')).toMatchObject({
      purpose: 'reasoning',
      evidenceFamily: 'Sol',
      status: 'runtime-evidence'
    })
    expect(resolveCodexModelTier('mechanical')).toMatchObject({
      purpose: 'fast',
      evidenceFamily: 'Luna',
      status: 'runtime-evidence'
    })
  })

  test('retains repository bindings as advisory rather than treating them as live availability', () =>
    expect(resolveCodexModelTier('judgment', '  local-preference  ')).toEqual({
      purpose: 'reasoning',
      evidenceFamily: 'Sol',
      advisoryBinding: 'local-preference',
      status: 'advisory-binding',
      requiresAuthorisedEvaluation: true
    }))
})
