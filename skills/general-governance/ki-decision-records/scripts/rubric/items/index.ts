import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'
import { BODY } from './body.ts'
import { FILENAME } from './filename.ts'
import { FM } from './frontmatter.ts'
import { INDEX } from './index-records.ts'
import { ROOT } from './root.ts'
import { TYPE_FIT } from './type-fit.ts'

export const KI_DECISION_RECORDS_RUBRIC: RubricDefinition<DecisionRecordsContext> = {
  name: 'ki-decision-records',
  concern: 'decision records',
  families: [
    defineRubricFamily({
      code: 'FILENAME',
      title: 'file and naming checks',
      description: 'Canonical decision-record filenames and serial namespaces.',
      standard: 'dr-format.md',
      selectContext: (context: DecisionRecordsContext) => context,
      items: FILENAME
    }),
    defineRubricFamily({
      code: 'ROOT',
      title: 'collection-root checks',
      description: 'The first Decision Record in a newly marked collection adopts the instrument itself.',
      standard: 'dr-format.md',
      selectContext: (context: DecisionRecordsContext) => context,
      items: ROOT
    }),
    defineRubricFamily({
      code: 'FM',
      title: 'frontmatter checks',
      description: 'Required universal decision metadata.',
      standard: 'dr-format.md',
      selectContext: (context: DecisionRecordsContext) => context,
      items: FM
    }),
    defineRubricFamily({
      code: 'TYPE-FIT',
      title: 'decision classification',
      description: 'Semantic alignment between a decision and its canonical prefix.',
      standard: 'dr-format.md',
      selectContext: (context: DecisionRecordsContext) => context,
      items: TYPE_FIT
    }),
    defineRubricFamily({
      code: 'BODY',
      title: 'body structure checks',
      description: 'Present-state decision-record structure and writing quality.',
      standard: 'dr-format.md',
      selectContext: (context: DecisionRecordsContext) => context,
      items: BODY
    }),
    defineRubricFamily({
      code: 'INDEX',
      title: 'index checks',
      description: 'Complete, current, and readable decision-record indexes.',
      standard: 'dr-format.md',
      selectContext: (context: DecisionRecordsContext) => context,
      items: INDEX
    })
  ]
}

export const DECISION_RECORDS_FAMILY_CODES = KI_DECISION_RECORDS_RUBRIC.families.map((entry) => entry.code)
