import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CheckpointsRubricContext, ScaffoldContext } from '../contexts/checkpoints.ts'

const SOURCE = 'standards-checkpoints.md'

const STRUCTURE_1: RubricItem<ScaffoldContext> = {
  code: 'STRUCTURE-1',
  title: 'the work area holds only work folders',
  description:
    '`+/_WORK/` is a physical directory holding only physical work folders, each with its regular `work.md` work file. While the legacy `+/_CHECKPOINTS/` directory exists it retains its exact `README.md` scaffold and only flat Markdown records beside it. Symlinks, unsupported files, retired-record directories, and nested or timestamped layouts are invalid.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: { class: 'automatic' },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes },
    conform: { phase: 'PRIMARY', run: (context) => context.ensureScaffold?.() }
  }
}

const STRUCTURE_2: RubricItem<ScaffoldContext> = {
  code: 'STRUCTURE-2',
  title: 'old checkpoints are read for the tolerance window',
  description:
    "Each old checkpoint under `+/_CHECKPOINTS/` is still read and checked under its old form, with a warning naming its new home, `+/_WORK/<id>/work.md`, until its territory's migration moves it; phase 5 of the migration closes the window.",
  sources: [`${SOURCE}#old-checkpoints`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance:
        "Move the work to its work file at the territory's migration, deleting the checkpoint in the same commit."
    },
    audit: { phase: 'INSPECT', run: ({ legacy }) => legacy }
  },
  judgment: {
    scope: 'Every old checkpoint under `+/_CHECKPOINTS/` and the work file named as its new home.',
    prompt:
      "Is the old checkpoint still awaiting its territory's migration, rather than kept beside a work file that replaces it?",
    outcomes: ['awaiting migration', 'move at migration'],
    guidance:
      "Leave the checkpoint until its territory's migration; then move its state to the work file and delete it in one commit."
  }
}

export const STRUCTURE: RubricFamily<CheckpointsRubricContext, ScaffoldContext> = {
  code: 'STRUCTURE',
  title: 'Work-file locations',
  description:
    'One flat folder per piece of work holds its work file, and old checkpoints stay readable; Git supplies history.',
  standard: SOURCE,
  selectContext: (context) => context.structure,
  items: [STRUCTURE_1, STRUCTURE_2]
}
