import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { HousekeepingRubricContext } from '../contexts/housekeeping.ts'
import { DOC } from './doc.ts'
import { FRONTMATTER } from './frontmatter.ts'
import { INDEX } from './indexing.ts'
import { LINK } from './link.ts'
import { SELF } from './self.ts'

/** Catalogue composition only; evidence builders remain in each semantic family. */
export const KI_HOUSEKEEPING_RUBRIC: RubricDefinition<HousekeepingRubricContext> = {
  name: 'ki-housekeeping',
  concern: 'housekeeping',
  families: [
    defineRubricFamily({
      code: 'SELF',
      title: 'Repository-local companion',
      description: 'Repository-local ki-self companion requirements.',
      standard: 'standards.md',
      selectContext: (context: HousekeepingRubricContext) => context,
      items: SELF as never
    }),
    defineRubricFamily({
      code: 'IDX',
      title: 'Index/file agreement',
      description: 'Memory index and file agreement.',
      standard: 'memory-format.md',
      selectContext: (context: HousekeepingRubricContext) => context,
      items: INDEX as never
    }),
    defineRubricFamily({
      code: 'FM',
      title: 'Frontmatter',
      description: 'Memory frontmatter requirements.',
      standard: 'memory-format.md',
      selectContext: (context: HousekeepingRubricContext) => context,
      items: FRONTMATTER as never
    }),
    defineRubricFamily({
      code: 'LINK',
      title: 'Explicitly not checked',
      description: 'Informational link treatment.',
      standard: 'memory-format.md',
      selectContext: (context: HousekeepingRubricContext) => context,
      items: LINK as never
    }),
    defineRubricFamily({
      code: 'DOC',
      title: 'Content doctrine',
      description: 'Judgment-applied memory content doctrine.',
      standard: 'rubric.md',
      selectContext: (context: HousekeepingRubricContext) => context,
      items: DOC as never
    })
  ]
}

export const KI_HOUSEKEEPING_FAMILY_CODES = ['SELF', 'IDX', 'FM', 'LINK', 'DOC'] as const
