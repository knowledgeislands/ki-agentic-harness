import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { ScaffoldContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standards-work-package.md'

const STRUCTURE_1: RubricItem<ScaffoldContext> = {
  code: 'STRUCTURE-1',
  title: 'the work area holds only work folders',
  description:
    '`+/_WORK/` is a physical directory holding only physical work folders, each with its regular `work.md` work file and, once `state.md` exists, all five package files as regular files. While the legacy `+/_CHECKPOINTS/` directory exists it retains its exact `README.md` scaffold and only flat Markdown records beside it; once `+/_WORK/` exists, neither retired `+/_THREADS/` nor `+/_CHECKPOINTS/` exists beside it, tracked or not. Symlinks, unsupported files, retired-record directories, and nested or timestamped layouts are invalid.',
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
  title: 'single-file work folders and old checkpoints are read for the tolerance window',
  description:
    "Each single-file work folder, whose `work.md` carries its state and which has no `state.md`, and each old checkpoint under `+/_CHECKPOINTS/` is still read and checked under its old form, with a warning naming its new home, the five-file work package in `+/_WORK/<id>/`, until its territory's migration moves it; the window closes when an inventory shows none left.",
  sources: [`${SOURCE}#old-checkpoints`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance:
        "Move the work to its five-file package at the territory's migration, deleting the old form in the same commit."
    },
    audit: { phase: 'INSPECT', run: ({ legacy }) => legacy }
  },
  judgment: {
    scope:
      'Every single-file work folder, every old checkpoint under `+/_CHECKPOINTS/`, and the package named as its new home.',
    prompt:
      "Is the older shape still awaiting its territory's migration, rather than kept beside a package that replaces it?",
    outcomes: ['awaiting migration', 'move at migration'],
    guidance:
      "Leave the older shape until its territory's migration; then write the five package files and delete the old form in one commit."
  }
}

export const STRUCTURE: RubricFamily<WorkPackageRubricContext, ScaffoldContext> = {
  code: 'STRUCTURE',
  title: 'Work-package locations',
  description:
    'One flat folder per piece of work holds its package files, and older shapes stay readable; Git supplies history.',
  standard: SOURCE,
  selectContext: (context) => context.structure,
  items: [STRUCTURE_1, STRUCTURE_2]
}
