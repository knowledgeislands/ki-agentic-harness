import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { AuthoringRubricContext } from '../contexts/authoring.ts'
import {
  MD_CELL_PROSE,
  MD_FOOTNOTE,
  MD_LINK,
  MD_MECH,
  MD_TABLE,
  OWN_1,
  SYNC_1,
  TOML_COMMENTS,
  TOML_KEYS,
  TOML_TABLES,
  TOML_VALUES
} from './authoring.ts'

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
      items: [MD_MECH, MD_TABLE, MD_FOOTNOTE, MD_LINK, MD_CELL_PROSE]
    }),
    defineRubricFamily({
      code: 'OWN',
      title: 'owned authoring configuration',
      description: 'Configuration files wholly owned by the authoring convention.',
      standard: '../SKILL.md',
      selectContext: (context: AuthoringRubricContext) => context,
      items: [OWN_1]
    }),
    defineRubricFamily({
      code: 'TOML',
      title: 'TOML formatting',
      description: 'Reviewer-applied TOML formatting conventions.',
      standard: 'standards/toml.md',
      selectContext: (context: AuthoringRubricContext) => context,
      items: [TOML_KEYS, TOML_VALUES, TOML_TABLES, TOML_COMMENTS]
    }),
    defineRubricFamily({
      code: 'SYNC',
      title: 'convention synchronisation',
      description: 'The generated publication and its convention sources remain coherent.',
      standard: 'sources.md',
      selectContext: (context: AuthoringRubricContext) => context,
      items: [SYNC_1]
    })
  ]
}
