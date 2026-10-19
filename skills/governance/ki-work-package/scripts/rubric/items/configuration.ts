import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { OutcomeContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standards-work-package.md'

const CONFIG_1: RubricItem<OutcomeContext> = {
  code: 'CONFIG-1',
  title: 'the declaration has no private options',
  description:
    'The optional `ki-work-package` declaration is an empty capability marker. It carries no runtime, session, retention, or lifecycle options; repository policy and optional adapters remain separate owners.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: { class: 'diagnostic', guidance: 'Remove unsupported declaration options, then rerun the audit.' },
    audit: { phase: 'PREPARE', run: ({ outcomes }) => outcomes }
  }
}

export const CONFIG: RubricFamily<WorkPackageRubricContext, OutcomeContext> = {
  code: 'CONFIG',
  title: 'Capability declaration',
  description: 'The repository opts into one portable contract without embedding runtime or retention policy.',
  standard: SOURCE,
  selectContext: (context) => context.configuration,
  items: [CONFIG_1]
}
