import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { FolderOutcomes } from '../contexts/work-folder.ts'
import type { WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standard-work-package.md'
const TIDY = `${SOURCE}#410-the-tidy`

const FOLDER_1: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-1',
  title: 'every package holds only its closed list',
  description:
    'A package holds only its `_index.md`, its change documents `NN-<slug>.change.md`, and sub-packages of the same shape, each a folder named by a lower-case kebab slug holding its own `_index.md` and one or more change documents. Any other file or folder fails: `state.md`, `decisions.md`, `discussions.md`, `messages.md`, focus folders, run reports, briefs, findings, feedback, scripts, screenshots, scratch folders and tool output.',
  sources: [`${SOURCE}#43-the-shape`, `${SOURCE}#47-sub-packages`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Under the tidy, fold the state into `_index.md`, move live decisions and open points into the change document they belong to, and delete what has a durable home or is temporary output, which belongs in the run's temporary directory. Fix only your own work's package; tell other work by a message."
    },
    audit: { phase: 'INSPECT', run: ({ closed }) => closed }
  }
}

const FOLDER_4: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-4',
  title: "no finished work's package is left standing",
  description:
    "Finished work keeps its package with `state: finished` only until its close-out; no coordinator reads a Finished work's package, so every package whose state is `finished` is due for close-out, whatever its mark.",
  sources: [TIDY, `${SOURCE}#415-removal-lifecycle`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'The finishing coordinator deletes the package at the mark that closes it; where the package outlives the finishing thread, territory work closes it at an owner-authorised mark whose report names it: once every close-out check holds, it deletes the package in one commit, Git keeping it, and otherwise deletes nothing and puts one open point to the owner in a change document of its own.'
    },
    audit: { phase: 'INSPECT', run: ({ finished }) => finished }
  }
}

const FOLDER_8: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-8',
  title: 'every change document and sub-package is linked from Changes',
  description:
    "A package's `_index.md` Changes section links every change document and every sub-package the package holds, so that an agent pointed at the entry file reaches all of its work.",
  sources: [`${SOURCE}#44-the-entry-file`, `${SOURCE}#47-sub-packages`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Add one list item under `## Changes` for each unlinked change document or sub-package, saying in a line what it is and where it stands. Fix only your own work's package; tell other work by a message."
    },
    audit: { phase: 'INSPECT', run: ({ changes }) => changes }
  }
}

export const FOLDER: RubricFamily<WorkPackageRubricContext, FolderOutcomes> = {
  code: 'FOLDER',
  title: 'Work-package closed list and tidy',
  description:
    'Each package holds only its closed list and links all of its work, and what is due for close-out is listed, so packages stay pruned without relying on memory.',
  standard: SOURCE,
  selectContext: (context) => context.folder,
  items: [FOLDER_1, FOLDER_4, FOLDER_8]
}
