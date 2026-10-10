import { judgment, type RubricFamily } from '../../shared/rubric.ts'
import type { GranolaRubricContext } from '../contexts/granola.ts'

export const ROUTING = {
  code: 'ROUTING',
  title: 'Granola receiver routing',
  standard: 'standards-granola-acquisition.md',
  description: 'Folder evidence, explicit flag policies, central packages, visible receiver conflicts.',
  selectContext: (context) => context,
  items: [
    {
      code: 'ROUTING-1',
      title: 'folder evidence reconciled',
      description:
        'Folder membership comes from complete query context and unfoldered identity is inferred only from the complete global-minus-folder union.',
      sources: ['standards-granola-acquisition.md#folder-unfoldered-and-receiver-evidence'],
      judgment: judgment(
        'Does the routing evidence distinguish provider fields from query-derived folder and unfoldered inference?'
      )
    },
    {
      code: 'ROUTING-2',
      title: 'receiver conflicts fail closed',
      description:
        'Conflicting folder mappings require human selection; multi-repository acquisition requires explicit intentional duplication.',
      sources: ['standards-granola-acquisition.md#folder-unfoldered-and-receiver-evidence'],
      judgment: judgment(
        'Are unmatched, overlapping, excluded, and conflicting identities visible without silent precedence or duplication?'
      )
    },

    {
      code: 'ROUTING-3',
      title: 'flag-only outcomes stay visible',
      description:
        'Explicit unfoldered and residual flag policies report identity evidence without reading content or claiming acquisition.',
      sources: ['standards-granola-acquisition.md#receiver-declaration-and-flag-only-outcomes'],
      judgment: judgment(
        'Are flagged identities reported on each run without detail or transcript reads, implicit routing, or acquired-content claims?'
      )
    },

    {
      code: 'ROUTING-4',
      title: 'central captures preserve every route',
      description:
        'Many selected folders may share one receiver; each UUID has one package preserving all memberships and explicit territory routes, with multi-territory packages awaiting review.',
      sources: [
        'standards-granola-acquisition.md#receiver-declaration-and-flag-only-outcomes',
        'standards-granola-acquisition.md#staging-and-harvesting-boundary'
      ],
      judgment: judgment(
        'Does each UUID have one safe capture package with every observed membership, explicit territory mapping, and no silent choice between multiple territories?'
      )
    }
  ]
} satisfies RubricFamily<GranolaRubricContext, GranolaRubricContext>
