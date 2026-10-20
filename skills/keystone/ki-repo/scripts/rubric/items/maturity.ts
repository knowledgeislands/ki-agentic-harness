import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import { auditEvidence, type EvidenceRubricContext, type RepoRubricContext } from '../contexts/repository.ts'

const SOURCE = 'standards-repository.md#island-maturity'

const MATURITY_1: RubricItem<EvidenceRubricContext> = {
  code: 'MATURITY-1',
  title: 'Declared island maturity',
  description:
    ".ki.toml declares the island's `maturity` in [skills.ki-repo] as one level of the scale, `founding`, `growing`, `settled` or `thriving`; an absent key warns and a value outside the scale fails.",
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        'Declare `maturity` in [skills.ki-repo] as the one level of the scale that describes the island now; the owner chooses it, so no default is proposed. Then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.evidence, 'FAIL', ['WARN']) }
  }
}

export const MATURITY: RubricFamily<RepoRubricContext, EvidenceRubricContext> = {
  code: 'MATURITY',
  title: 'Island maturity',
  description: "The island's declared maturity on the fixed scale.",
  standard: 'standards-repository.md',
  selectContext: (context) => context.maturity,
  items: [MATURITY_1]
}
