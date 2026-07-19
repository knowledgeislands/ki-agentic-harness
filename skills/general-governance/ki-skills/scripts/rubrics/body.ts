import type { RubricItem } from '../lib/rubric/rubric.ts'

export const BODY_1: RubricItem = {
  code: 'BODY-1',
  title: 'instruction freedom matches task fragility',
  description: 'The skill gives prose, parameters, or exact constraints in proportion to how fragile the task is.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does the level of instruction freedom match this task’s fragility?' }
}

export const BODY_2: RubricItem = {
  code: 'BODY-2',
  title: 'the main body avoids time-sensitive content',
  description: 'Volatile or legacy detail is kept out of the main body or explicitly contained.',
  sources: ['BP'],
  judgment: { prompt: 'Does the main body avoid time-sensitive content, containing legacy detail appropriately?' }
}

export const BODY_3: RubricItem = {
  code: 'BODY-3',
  title: 'terminology is consistent',
  description: 'Each concept has one consistently used term.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does the skill use one consistent term for each concept?' }
}

export const BODY_4: RubricItem = {
  code: 'BODY-4',
  title: 'style-sensitive output includes concrete examples',
  description: 'Where output quality depends on style, the skill provides concrete input and output examples.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Where output quality depends on style, are there concrete input and output examples?' }
}

export const BODY_5: RubricItem = {
  code: 'BODY-5',
  title: 'one default approach has an escape hatch',
  description: 'The skill gives a default path and a clear exception rather than an unconstrained menu.',
  sources: ['BP'],
  judgment: { prompt: 'Does the skill give one default approach with a clear escape hatch rather than a menu?' }
}

export const BODY_6: RubricItem = {
  code: 'BODY-6',
  title: 'template strictness matches its contract',
  description: 'A template clearly states whether it is exact or adaptable.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does any template make its strictness appropriate and explicit?' }
}

export const BODY_7: RubricItem = {
  code: 'BODY-7',
  title: 'multi-step work has a copyable checklist and feedback loop where needed',
  description: 'Complex or quality-critical work gives an executable checklist and a feedback path.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Does multi-step work provide a copyable checklist and, when quality-critical, a feedback loop?' }
}

export const BODY_8: RubricItem = {
  code: 'BODY-8',
  title: 'rules state their rationale',
  description: 'Rules explain why they exist rather than relying on bare imperative wording.',
  sources: ['COMMUNITY'],
  judgment: { prompt: 'Do rules explain their rationale rather than stating bare MUST or NEVER directives?' }
}

export const BODY: readonly RubricItem[] = [BODY_1, BODY_2, BODY_3, BODY_4, BODY_5, BODY_6, BODY_7, BODY_8]
