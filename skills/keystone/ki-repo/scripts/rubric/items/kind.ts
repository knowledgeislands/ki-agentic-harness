import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import { auditEvidence, type KindRubricContext, type RepoRubricContext } from '../contexts/repository.ts'

const SOURCE = 'standards-repository.md'

const KIND_1: RubricItem<KindRubricContext> = {
  code: 'KIND-1',
  title: 'Repository kind, primary shape, and store roles',
  description:
    'ki-repo requires explicit Project or Knowledge Base kind and a compatible declared primary shape, and validates named KB stores.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Resolve Project or Knowledge Base, compatible store roles, and an unambiguous declared primary shape, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.kind1, 'FAIL') }
  }
}

const KIND_2: RubricItem<KindRubricContext> = {
  code: 'KIND-2',
  title: 'Kind and structure compatibility',
  description:
    'A KB kind declares KB structure; shared ki-work-roadmap configuration requires its Streams container. A non-KB does not declare KB structure.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Align the repository kind with its declared structure and planning model, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: (context) => auditEvidence(context.kind2, 'FAIL') }
  }
}

export const KIND: RubricFamily<RepoRubricContext, KindRubricContext> = {
  code: 'KIND',
  title: 'Repository kind',
  description: 'The repository kind, primary Project shape, and named Knowledge Base store roles.',
  standard: SOURCE,
  selectContext: (context) => context.kind,
  items: [KIND_1, KIND_2]
}
