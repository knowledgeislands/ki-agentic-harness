import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CheckpointsRubricContext, OutcomeContext } from '../contexts/checkpoints.ts'

const SOURCE = 'standards-checkpoints.md'

const STRUCTURE_1: RubricItem<OutcomeContext> = {
  code: 'STRUCTURE-1',
  title: 'active location is canonical',
  description:
    'When present, `+/_CHECKPOINTS/` is a physical directory containing only flat active Markdown records. Symlinks, unsupported files, retired-record directories, and nested or timestamped layouts are invalid; an absent subarea is not applicable.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Repair the checkpoint directory structure without creating or moving records, then rerun the audit.'
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  }
}

export const STRUCTURE: RubricFamily<CheckpointsRubricContext, OutcomeContext> = {
  code: 'STRUCTURE',
  title: 'Checkpoint locations',
  description: 'One optional subarea has a flat active record set; Git supplies history.',
  standard: SOURCE,
  selectContext: (context) => context.structure,
  items: [STRUCTURE_1]
}
