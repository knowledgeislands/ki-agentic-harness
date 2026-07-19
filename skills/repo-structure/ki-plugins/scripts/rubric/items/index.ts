import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { PluginsContext } from '../contexts/plugins.ts'
import { PLUG } from './plugins.ts'

export const KI_PLUGINS_RUBRIC: RubricDefinition<PluginsContext> = {
  name: 'ki-plugins',
  concern: 'plugins',
  families: [
    defineRubricFamily({
      code: 'PLUG',
      title: 'Plugin marketplace projection',
      description: 'The marketplace manifest, generated plugin projection, and repository scaffold.',
      standard: 'standards.md',
      selectContext: (context: PluginsContext) => context,
      items: PLUG
    })
  ]
}

export const KI_PLUGINS_FAMILY_CODES = ['PLUG'] as const
