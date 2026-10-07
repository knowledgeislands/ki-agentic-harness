import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { AuthoringRubricContext, TomlRubricContext } from '../contexts/authoring.ts'

const TOML_VALUES: RubricItem<TomlRubricContext> = {
  code: 'TOML-values',
  title: 'TOML values use the house formatting',
  description:
    'Strings are double-quoted, arrays are multiline with one element per line and a trailing comma, there are no inline tables, and comments sit on the line above.',
  sources: ['standards-toml.md#keys-and-values'],
  judgment: {
    scope: 'Every authored TOML string, array, map and comment in the convention scope.',
    prompt: 'Assess whether TOML strings, arrays, maps and comments follow the house formatting.',
    outcomes: ['conforming', 'reformat required', 'exception required'],
    guidance:
      'Use double-quoted strings, multiline arrays, dotted keys or nested tables instead of inline tables, and comments above, or record the external-contract exception.'
  }
}

const TOML_STRUCTURE: RubricItem<TomlRubricContext> = {
  code: 'TOML-structure',
  title: 'TOML configuration remains compact and navigable',
  description:
    'Mechanically valid `.ki.toml` structure uses the neighbourhood banners in their fixed order with each declaration under its most meaningful banner, `[skills.ki-trades]` last in Relationships, while readable short subordinate maps use dotted keys under their explicit owner root.',
  sources: ['standards-toml.md#configuration-structure'],
  judgment: {
    scope: 'Every substantial `.ki.toml` and each short subordinate map in convention scope.',
    prompt:
      'Assess whether each declaration sits under a meaningful neighbourhood banner and whether dotted child keys keep the complete entry readable.',
    outcomes: ['conforming', 'restructure recommended', 'nested form justified'],
    guidance:
      'Use only needed neighbourhood banners and compact dotted child keys; retain a nested table when comments, length, or further structure make it clearer.'
  }
}

const TOML_COMMENTS: RubricItem<TomlRubricContext> = {
  code: 'TOML-comments',
  title: 'non-obvious TOML keys explain their rationale',
  description: 'Non-obvious keys carry a preceding `#` comment explaining why they exist.',
  sources: ['standards-toml.md#keys-and-values'],
  judgment: {
    scope: 'Every non-obvious authored TOML key in the convention scope.',
    prompt: 'Assess whether non-obvious TOML keys carry a preceding rationale comment.',
    outcomes: ['conforming', 'comment required', 'self-evident'],
    guidance: 'Add a preceding rationale comment or record why the key is self-evident in its local context.'
  }
}

export const TOML: RubricFamily<AuthoringRubricContext, TomlRubricContext> = {
  code: 'TOML',
  title: 'TOML formatting',
  description: 'Reviewer-applied TOML formatting conventions.',
  standard: 'standards-toml.md',
  selectContext: (context: AuthoringRubricContext) => context.toml,
  items: [TOML_VALUES, TOML_STRUCTURE, TOML_COMMENTS]
}
