import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { LiveArtifactsContext } from '../contexts/live-artifacts.ts'
import { LA_FRONTMATTER } from './frontmatter.ts'
import { LA_STRUCTURE } from './structure.ts'

export const KI_KB_LIVE_ARTIFACTS_RUBRIC: RubricDefinition<LiveArtifactsContext> = {
  name: 'ki-kb-live-artifacts',
  concern: 'kb-live-artifacts',
  families: [
    defineRubricFamily({
      code: 'LA',
      title: 'artifact structure',
      description: 'Artifact pairing, index, freshness, and judgment prompts.',
      standard: 'standards.md',
      selectContext: (context: LiveArtifactsContext) => context,
      items: LA_STRUCTURE as never
    }),
    defineRubricFamily({
      code: 'LA-F',
      title: 'artifact frontmatter',
      description: 'Required metadata on Markdown artifact sources.',
      standard: 'standards.md',
      selectContext: (context: LiveArtifactsContext) => context,
      items: LA_FRONTMATTER as never
    })
  ]
}

export const KI_KB_LIVE_ARTIFACTS_FAMILY_CODES = ['LA', 'LA-F'] as const
