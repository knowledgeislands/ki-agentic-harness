import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'

export const TYPE_FIT_1: RubricItem<DecisionRecordsContext> = {
  code: 'TYPE-FIT-1',
  title: 'Semantic decision classification',
  description:
    'The filename prefix accurately categorises the decision itself; the body makes the type obvious. A mismatch is resolved with a human by choosing the correct canonical record ID or metadata, never by mechanically overwriting either side.',
  sources: ['dr-format.md'],
  judgment: {
    prompt:
      'Assess whether the filename prefix accurately categorises the decision itself without a stretch fit and whether the body makes the type obvious. Resolve a mismatch with a human, never by mechanically overwriting either side.'
  }
}

export const TYPE_FIT = [TYPE_FIT_1] as const satisfies readonly RubricItem<DecisionRecordsContext>[]
