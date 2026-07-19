import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { FeatureDefinitionsContext } from '../contexts/feature-definitions.ts'
import {
  AREA_1,
  AREA_2,
  AREA_FIT_1,
  AS_BUILT_1,
  BEHAVIOUR_1,
  DR_LINK_1,
  ID_1,
  ID_2,
  ID_3,
  INDEX_1,
  INDEX_2,
  REQ_1,
  SPLIT_1,
  VERIFY_1,
  VERIFY_2
} from './feature-definitions.ts'

const context = (value: FeatureDefinitionsContext): FeatureDefinitionsContext => value

export const KI_FEATURE_DEFINITIONS_RUBRIC: RubricDefinition<FeatureDefinitionsContext> = {
  name: 'ki-feature-definitions',
  concern: 'feature definitions',
  families: [
    defineRubricFamily({
      code: 'INDEX',
      title: 'feature index',
      description: 'The corpus has a populated registry that maps prefixes to area files.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [INDEX_1, INDEX_2]
    }),
    defineRubricFamily({
      code: 'AREA',
      title: 'area registration',
      description: 'Area-table files and corpus files agree.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [AREA_1, AREA_2]
    }),
    defineRubricFamily({
      code: 'ID',
      title: 'requirement identity',
      description: 'Requirement headings, prefixes, and append-only IDs form a coherent registry.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [ID_1, ID_2, ID_3]
    }),
    defineRubricFamily({
      code: 'REQ',
      title: 'normative requirement shape',
      description: 'Active requirements state normative behaviour.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [REQ_1]
    }),
    defineRubricFamily({
      code: 'VERIFY',
      title: 'verification hooks',
      description: 'Active requirements carry a verification hook whose quality is reviewed.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [VERIFY_1, VERIFY_2]
    }),
    defineRubricFamily({
      code: 'BEHAVIOUR',
      title: 'behavioural altitude',
      description: 'Requirements specify behaviour rather than rationale or procedure.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [BEHAVIOUR_1]
    }),
    defineRubricFamily({
      code: 'AS-BUILT',
      title: 'as-built truth',
      description: 'The numbered contract describes current system behaviour.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [AS_BUILT_1]
    }),
    defineRubricFamily({
      code: 'SPLIT',
      title: 'requirement focus',
      description: 'Independently verifiable behaviours have independent IDs.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [SPLIT_1]
    }),
    defineRubricFamily({
      code: 'DR-LINK',
      title: 'decision traceability',
      description: 'Governed behaviours preserve their link from why to what.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [DR_LINK_1]
    }),
    defineRubricFamily({
      code: 'AREA-FIT',
      title: 'area fit',
      description: 'Requirements remain in the area their behaviour belongs to.',
      standard: 'feature-format.md',
      selectContext: context,
      items: [AREA_FIT_1]
    })
  ]
}

export const FEATURE_DEFINITIONS_FAMILY_CODES = KI_FEATURE_DEFINITIONS_RUBRIC.families.map((family) => family.code)
