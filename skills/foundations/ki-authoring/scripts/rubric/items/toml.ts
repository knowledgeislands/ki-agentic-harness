import type { RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { AuthoringRubricContext } from '../contexts/authoring.ts'

export const TOML_KEYS: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-keys',
  title: 'TOML keys are concise lowercase nouns',
  description:
    'Keys are lowercase, use `snake_case` for multiple words, and name the noun their value holds (`visibility`, not `repo_visibility_setting`).',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Are TOML keys concise lowercase nouns, using snake_case for multiple words?' }
}

export const TOML_VALUES: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-values',
  title: 'TOML values use the house formatting',
  description: 'Strings are double-quoted and short lists remain inline (`["a", "b"]`).',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Do TOML strings and short lists follow the house formatting?' }
}

export const TOML_TABLES: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-tables',
  title: 'TOML uses one table per skill',
  description:
    'One table appears per skill, named for that skill, with subtables nested under it; `ki-repo` owns the `.ki-config.toml` contract behind this convention.',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Does the TOML use one table per skill with nested subtables where appropriate?' }
}

export const TOML_COMMENTS: RubricItem<AuthoringRubricContext> = {
  code: 'TOML-comments',
  title: 'non-obvious TOML keys explain their rationale',
  description: 'Non-obvious keys carry a preceding `#` comment explaining why they exist.',
  sources: ['standards/toml.md'],
  judgment: { prompt: 'Do non-obvious TOML keys carry a preceding rationale comment?' }
}

export const TOML = [TOML_KEYS, TOML_VALUES, TOML_TABLES, TOML_COMMENTS] as const
