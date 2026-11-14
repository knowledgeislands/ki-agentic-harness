import type { RubricFamily } from '../../shared/rubric.ts'
import { auditEvidence, type EngineeringRubricContext, type GeneratedRubricContext } from '../contexts/engineering.ts'

export const GENERATED: RubricFamily<EngineeringRubricContext, GeneratedRubricContext> = {
  code: 'GEN',
  title: 'Generated surfaces',
  description:
    'Managed discovery surfaces carry consistent tool exclusions, and generated output agrees with its normaliser.',
  standard: 'standards-engineering.md',
  selectContext: (context) => context.generated,
  items: [
    {
      code: 'GEN-1',
      title: 'Managed discovery surfaces share exclusions',
      description:
        'Known generated or managed discovery surfaces have matching Biome, Knip, and Markdown exclusions, and no legacy `.ki` runtime exclusion remains.',
      sources: ['standards-engineering.md'],
      mechanical: {
        level: 'FAIL',
        remediation: {
          class: 'diagnostic',
          guidance:
            'Align the Engineering-owned Biome and Knip exclusions deliberately, use ki-authoring for its wholly owned `.rumdl.toml`, remove legacy runtime exclusions, then rerun the audit. Knip may call managed-surface ignore entries unused configuration hints; that expected hint does not override the cross-tool GEN-1 contract.'
        },
        audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.gen1, 'FAIL') }
      }
    },
    {
      code: 'GEN-2',
      title: 'Generated output matches its normaliser',
      description:
        "Each committed generated path is classified by byte ownership: a repository-owned producer emits its normaliser's fixed point, an externally byte-authoritative copy is excluded with separate drift proof, and an unrepresentable format carries the narrowest recorded exclusion.",
      sources: ['standards-engineering.md#5-biomejson--rumdl-config-core'],
      judgment: {
        scope:
          'Committed generated paths, their producers, and the formatter or linter configuration that includes or excludes them.',
        prompt:
          "Is each committed generated path classified as repository-owned, externally byte-authoritative, or unrepresentable by its normaliser; does each repository-owned producer emit its normaliser's fixed point so that regenerating and formatting yields no diff; and does each exclusion name external byte authority or genuine representational incompatibility as its reason?",
        outcomes: [
          'conforming',
          'producer emits non-normal form',
          'exclusion unjustified',
          'classification decision required'
        ],
        guidance:
          'Fix a repository-owned producer so it emits the normal form, for example by formatting its output during generation, rather than excluding the path or changing formatter configuration; narrow or justify an exclusion; or record the classification decision the owner must make.'
      }
    }
  ]
}
