import type { RubricItem } from '../../lib/rubric.ts'

export const BODY_1: RubricItem<unknown> = {
  code: 'BODY-1',
  title: 'instruction freedom matches task fragility',
  description: 'Degrees of freedom match task fragility (prose → parameterised script → exact "do not modify").',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does the level of instruction freedom match this task’s fragility?' }
}

export const BODY_2: RubricItem<unknown> = {
  code: 'BODY-2',
  title: 'the main body avoids time-sensitive content',
  description: 'No time-sensitive content in the main body; legacy goes in a collapsed note.',
  sources: ['BP'],
  judgment: { prompt: 'Does the main body avoid time-sensitive content, containing legacy detail appropriately?' }
}

export const BODY_3: RubricItem<unknown> = {
  code: 'BODY-3',
  title: 'terminology is consistent',
  description: 'Consistent terminology — one term per concept.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does the skill use one consistent term for each concept?' }
}

export const BODY_4: RubricItem<unknown> = {
  code: 'BODY-4',
  title: 'style-sensitive output includes concrete examples',
  description: 'Concrete examples (2–3 I/O pairs) where output quality depends on style.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Where output quality depends on style, are there concrete input and output examples?' }
}

export const BODY_5: RubricItem<unknown> = {
  code: 'BODY-5',
  title: 'one default approach has an escape hatch',
  description: 'One default approach with an escape hatch, not a menu.',
  sources: ['BP'],
  judgment: { prompt: 'Does the skill give one default approach with a clear escape hatch rather than a menu?' }
}

export const BODY_6: RubricItem<unknown> = {
  code: 'BODY-6',
  title: 'template strictness matches its contract',
  description: 'Template strictness matches the contract (exact vs adapt).',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does any template make its strictness appropriate and explicit?' }
}

export const BODY_7: RubricItem<unknown> = {
  code: 'BODY-7',
  title: 'multi-step work has a copyable checklist and feedback loop where needed',
  description: 'Copyable checklist for multi-step tasks; feedback loop for quality-critical ones.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does multi-step work provide a copyable checklist and, when quality-critical, a feedback loop?' }
}

export const BODY_8: RubricItem<unknown> = {
  code: 'BODY-8',
  title: 'rules state their rationale',
  description: 'Rules state the _why_ alongside the rule, not bare MUST/NEVER.',
  sources: ['COMMUNITY'],
  judgment: { prompt: 'Do rules explain their rationale rather than stating bare MUST or NEVER directives?' }
}

export const BODY = [BODY_1, BODY_2, BODY_3, BODY_4, BODY_5, BODY_6, BODY_7, BODY_8] as const
