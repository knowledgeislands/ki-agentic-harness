import type { RubricItem } from '../lib/rubric/rubric.ts'

export const KI_INVOKE_1: RubricItem = {
  code: 'KI-INVOKE-1',
  title: 'HELP is the safe bare-invocation default',
  description: 'A mode-bearing skill explains itself without side effects when invoked with help or without a recognisable mode.',
  sources: ['COMMUNITY', 'ADR-KI-HARNESS-SKILLS-001'],
  judgment: {
    prompt:
      'Does explicit help stop after a generated HELP explanation, while an unclear interactive invocation explains the skill before asking for a mode?'
  }
}

export const KI_INVOKE: readonly RubricItem[] = [KI_INVOKE_1]
