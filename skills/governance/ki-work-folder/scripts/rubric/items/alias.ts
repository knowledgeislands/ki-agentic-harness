import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { OutcomeContext, WorkFolderAliasRubricContext } from '../contexts/alias.ts'

const SOURCE = '../../ki-work-package/references/standards-work-package.md'

const ALIAS_1: RubricItem<OutcomeContext> = {
  code: 'ALIAS-1',
  title: 'the deprecated declaration names its replacement',
  description:
    "A `[skills.ki-work-folder]` declaration is a deprecated alias for `ki-work-package`, kept for the rename's tolerance window. It warns until the repository declares `[skills.ki-work-package]` in its place; the work-package checks run only under the new declaration.",
  sources: [`${SOURCE}#activation-and-ownership`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Replace `[skills.ki-work-folder]` with `[skills.ki-work-package]` in `.ki.toml`, then rerun the audit.'
    },
    audit: { phase: 'PREPARE', run: ({ outcomes }) => outcomes }
  }
}

export const ALIAS: RubricFamily<WorkFolderAliasRubricContext, OutcomeContext> = {
  code: 'ALIAS',
  title: 'Deprecated alias',
  description: 'The old declaration resolves for the tolerance window and names the new one.',
  standard: SOURCE,
  selectContext: (context) => context.alias,
  items: [ALIAS_1]
}
