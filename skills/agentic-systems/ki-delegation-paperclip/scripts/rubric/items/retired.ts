import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { OutcomeContext, RetiredPaperclipRubricContext } from '../contexts/retired.ts'

const SOURCE = 'standards-retirement-migration.md'

const RETIRED_1: RubricItem<OutcomeContext> = {
  code: 'RETIRED-1',
  title: 'the retired declaration is removed',
  description:
    'Paperclip delegation is retired. A `[skills.ki-delegation-paperclip]` declaration still resolves through this stub, so the repository keeps auditing, and it warns until the repository removes the declaration.',
  sources: [`${SOURCE}#leaving-the-declaration`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Remove `[skills.ki-delegation-paperclip]` and its fields from `.ki.toml`, then rerun the audit.'
    },
    audit: { phase: 'PREPARE', run: ({ outcomes }) => outcomes }
  }
}

export const RETIRED: RubricFamily<RetiredPaperclipRubricContext, OutcomeContext> = {
  code: 'RETIRED',
  title: 'Retired declaration',
  description: 'The retired declaration resolves until the repository removes it.',
  standard: SOURCE,
  selectContext: (context) => context.retired,
  items: [RETIRED_1]
}
