import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { AuthoringRubricContext } from '../contexts/authoring.ts'
import { MARKDOWN } from './markdown.ts'
import { OWNED } from './owned.ts'
import { SYNC } from './sync.ts'
import { TOML } from './toml.ts'

export const KI_AUTHORING_RUBRIC: RubricDefinition<AuthoringRubricContext> = {
  name: 'ki-authoring',
  concern: 'authoring conventions',
  families: [
    defineRubricFamily({
      code: 'MD',
      title: 'Markdown authoring',
      description: 'The mechanical Markdown gate and reviewer-applied Markdown conventions.',
      standard: 'standards/markdown.md',
      selectContext: (context: AuthoringRubricContext) => context,
      items: MARKDOWN
    }),
    defineRubricFamily({
      code: 'OWN',
      title: 'owned authoring configuration',
      description: 'Configuration files wholly owned by the authoring convention.',
      standard: '../SKILL.md',
      selectContext: (context: AuthoringRubricContext) => context,
      items: OWNED
    }),
    defineRubricFamily({
      code: 'TOML',
      title: 'TOML formatting',
      description: 'Reviewer-applied TOML formatting conventions.',
      standard: 'standards/toml.md',
      selectContext: (context: AuthoringRubricContext) => context,
      items: TOML
    }),
    defineRubricFamily({
      code: 'SYNC',
      title: 'convention synchronisation',
      description: 'The generated publication and its convention sources remain coherent.',
      standard: 'sources.md',
      selectContext: (context: AuthoringRubricContext) => context,
      items: SYNC
    })
  ]
}
