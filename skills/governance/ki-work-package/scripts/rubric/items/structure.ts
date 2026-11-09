import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { StructureContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standard-work-package.md'

const STRUCTURE_1: RubricItem<StructureContext> = {
  code: 'STRUCTURE-1',
  title: '`work/` holds only territory folders of packages',
  description:
    "`work/` is a physical directory holding only territory folders, each named by the first segment of its packages' ids and holding only package folders, each a physical directory with its regular `_index.md`. Symlinks, loose files, empty folders, and timestamped, archived or alternate layouts are invalid; the one nesting is a sub-package.",
  sources: [`${SOURCE}#42-location-and-identity`, `${SOURCE}#43-the-shape`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Move each stray entry to its owning package or delete it where it is temporary output, and remove empty folders. Fix only your own work's package; tell other work by a message."
    },
    audit: { phase: 'INSPECT', run: ({ outcomes }) => outcomes }
  }
}

const STRUCTURE_2: RubricItem<StructureContext> = {
  code: 'STRUCTURE-2',
  title: 'earlier copies of packages are listed',
  description:
    'A retired working area, `+/_WORK/`, `+/_WORK_REVIEW/`, `+/_THREADS/` or `+/_CHECKPOINTS/`, left in a declaring repository holds earlier copies of packages. Each is listed for its owner, who moves any live package to `work/<territory>/<id>/` in the Agora store; the listing is never permission to delete.',
  sources: [`${SOURCE}#410-the-tidy`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance:
        "Move any live package to the store under the tidy, then remove the earlier copy on its owner's word, Git keeping its history."
    },
    audit: { phase: 'INSPECT', run: ({ earlier }) => earlier }
  },
  judgment: {
    scope: 'Every retired working area the listing names, and the package in `work/` that replaces each copy.',
    prompt: 'Is each listed copy already replaced by a package in the store, or still the only copy of live work?',
    outcomes: ["replaced, remove on the owner's word", 'move to the store first', 'escalate to owner'],
    guidance: "Remove an earlier copy only on its owner's word, and never before its live work is in the store."
  }
}

export const STRUCTURE: RubricFamily<WorkPackageRubricContext, StructureContext> = {
  code: 'STRUCTURE',
  title: 'Work-package locations',
  description:
    'One folder per piece of work, under its territory in `work/`, holds its package; earlier copies are listed; Git supplies history.',
  standard: SOURCE,
  selectContext: (context) => context.structure,
  items: [STRUCTURE_1, STRUCTURE_2]
}
