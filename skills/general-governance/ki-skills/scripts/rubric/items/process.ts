import type { RubricItem } from '../../lib/rubric/rubric.ts'

export const PROC_1: RubricItem = {
  code: 'PROC-1',
  title: 'the skill was built evaluation-first',
  description: 'The skill has evaluation scenarios against a no-skill baseline before extensive documentation.',
  sources: ['BP', 'ENG'],
  judgment: { prompt: 'Was this skill built evaluation-first with meaningful scenarios against a no-skill baseline?' }
}

export const PROC_2: RubricItem = {
  code: 'PROC-2',
  title: 'the skill has been tested across intended models and real use',
  description: 'The skill has evidence of cross-model and real-usage testing appropriate to its intended scope.',
  sources: ['BP'],
  judgment: { prompt: 'Has the skill been tested across its intended models and through real usage?' }
}

export const PROCESS: readonly RubricItem[] = [PROC_1, PROC_2]
