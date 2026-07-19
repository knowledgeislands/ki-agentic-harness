import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { FeatureDefinitionsContext } from '../contexts/feature-definitions.ts'
import { AREA } from './area.ts'
import { AREA_FIT } from './area-fit.ts'
import { AS_BUILT } from './as-built.ts'
import { BEHAVIOUR } from './behaviour.ts'
import { DR_LINK } from './decision-link.ts'
import { ID } from './identity.ts'
import { INDEX } from './index-family.ts'
import { REQ } from './requirement.ts'
import { SPLIT } from './split.ts'
import { VERIFY } from './verification.ts'

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
      items: INDEX
    }),
    defineRubricFamily({
      code: 'AREA',
      title: 'area registration',
      description: 'Area-table files and corpus files agree.',
      standard: 'feature-format.md',
      selectContext: context,
      items: AREA
    }),
    defineRubricFamily({
      code: 'ID',
      title: 'requirement identity',
      description: 'Requirement headings, prefixes, and append-only IDs form a coherent registry.',
      standard: 'feature-format.md',
      selectContext: context,
      items: ID
    }),
    defineRubricFamily({
      code: 'REQ',
      title: 'normative requirement shape',
      description: 'Active requirements state normative behaviour.',
      standard: 'feature-format.md',
      selectContext: context,
      items: REQ
    }),
    defineRubricFamily({
      code: 'VERIFY',
      title: 'verification hooks',
      description: 'Active requirements carry a verification hook whose quality is reviewed.',
      standard: 'feature-format.md',
      selectContext: context,
      items: VERIFY
    }),
    defineRubricFamily({
      code: 'BEHAVIOUR',
      title: 'behavioural altitude',
      description: 'Requirements specify behaviour rather than rationale or procedure.',
      standard: 'feature-format.md',
      selectContext: context,
      items: BEHAVIOUR
    }),
    defineRubricFamily({
      code: 'AS-BUILT',
      title: 'as-built truth',
      description: 'The numbered contract describes current system behaviour.',
      standard: 'feature-format.md',
      selectContext: context,
      items: AS_BUILT
    }),
    defineRubricFamily({
      code: 'SPLIT',
      title: 'requirement focus',
      description: 'Independently verifiable behaviours have independent IDs.',
      standard: 'feature-format.md',
      selectContext: context,
      items: SPLIT
    }),
    defineRubricFamily({
      code: 'DR-LINK',
      title: 'decision traceability',
      description: 'Governed behaviours preserve their link from why to what.',
      standard: 'feature-format.md',
      selectContext: context,
      items: DR_LINK
    }),
    defineRubricFamily({
      code: 'AREA-FIT',
      title: 'area fit',
      description: 'Requirements remain in the area their behaviour belongs to.',
      standard: 'feature-format.md',
      selectContext: context,
      items: AREA_FIT
    })
  ]
}

export const FEATURE_DEFINITIONS_FAMILY_CODES = KI_FEATURE_DEFINITIONS_RUBRIC.families.map((family) => family.code)
