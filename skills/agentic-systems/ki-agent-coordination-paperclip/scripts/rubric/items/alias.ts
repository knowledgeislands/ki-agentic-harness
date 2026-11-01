import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { OutcomeContext, PaperclipAliasRubricContext } from '../contexts/alias.ts'

const SOURCE = '../../ki-delegation-paperclip/references/standards-agent-coordination-paperclip.md'

const ALIAS_1: RubricItem<OutcomeContext> = {
  code: 'ALIAS-1',
  title: 'the deprecated declaration names its replacement',
  description:
    "A `[skills.ki-agent-coordination-paperclip]` declaration is a deprecated alias of `ki-delegation-paperclip`, kept for the rename's tolerance window. It warns until the repository declares `[skills.ki-delegation-paperclip]` in its place; the Paperclip checks run only under the new declaration.",
  sources: [`${SOURCE}#organisation-identity`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Replace `[skills.ki-agent-coordination-paperclip]` with `[skills.ki-delegation-paperclip]` in `.ki.toml`, keeping `organisation_code`, then rerun the audit.'
    },
    audit: { phase: 'PREPARE', run: ({ outcomes }) => outcomes }
  }
}

export const ALIAS: RubricFamily<PaperclipAliasRubricContext, OutcomeContext> = {
  code: 'ALIAS',
  title: 'Deprecated alias',
  description: 'The old declaration resolves for the tolerance window and names the new one.',
  standard: SOURCE,
  selectContext: (context) => context.alias,
  items: [ALIAS_1]
}
