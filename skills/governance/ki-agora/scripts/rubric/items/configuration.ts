import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { AgoraRubricContext, OutcomeContext } from '../contexts/agora.ts'

const SOURCE = 'standards-agora.md'

const CONFIG_1: RubricItem<OutcomeContext> = {
  code: 'CONFIG-1',
  title: 'Agora homes are canonical',
  description:
    'An owner-declared Agora has a stable identifier, a required non-empty single-line title, a non-empty purpose, duplicate-free canonical member repositories, and optional duplicate-free inclusions naming Agora identifiers or canonical repositories. An included repository is not a member. Owner identity comes from ki-repo.repository. Unknown fields fail closed.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance: 'Correct the local ki-agora home declaration, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  }
}

export const CONFIG: RubricFamily<AgoraRubricContext, OutcomeContext> = {
  code: 'CONFIG',
  title: 'Agora home declaration',
  description: 'Title, purpose, membership, and inclusion are owner-declared and portable.',
  standard: SOURCE,
  selectContext: (context) => context.configuration,
  items: [CONFIG_1]
}
