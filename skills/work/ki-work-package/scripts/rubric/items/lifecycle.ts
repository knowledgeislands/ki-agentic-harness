import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { LifecycleContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standard-work-package.md'

const LIFECYCLE_1: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-1',
  title: 'timestamps agree',
  description:
    "A package's created_at is no later than its since. Removal deletes the package rather than creating a retired state.",
  sources: [`${SOURCE}#45-the-state`, `${SOURCE}#415-removal-lifecycle`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'guarded',
      guidance: 'Correct lifecycle metadata only through an explicit UPDATE request; use REMOVE to delete a package.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.mechanical }
  },
  judgment: {
    scope: "Every package's state and timestamps.",
    prompt:
      'Does the proposed lifecycle correction preserve explicit user authority and the one-package-per-work rule?',
    outcomes: ['conforming', 'explicit update required', 'explicit removal required'],
    guidance: 'Do not change state or timestamps until the user supplies UPDATE direction; REMOVE deletes the package.'
  }
}

const LIFECYCLE_2: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-2',
  title: 'package content is current and durable facts are promoted',
  description:
    "The entry file's definition is stable, its description routing clearly against its neighbours, and its state is current and agrees with the work's last move, with no moves list. Decisions sit in their change document until homed, and decisions of closed changes, accepted work state and reusable knowledge already live with their canonical owners; removal follows the closing mark or explicit direction and does not manufacture completion.",
  sources: [`${SOURCE}#44-the-entry-file`, `${SOURCE}#46-change-documents`, `${SOURCE}#415-removal-lifecycle`],
  judgment: {
    scope: 'Every package, its change documents, its named durable owners, and removal authority.',
    prompt:
      'Is each package current and concise, its description routing clearly and its state agreeing with its last move, with the decisions of closed changes promoted to their canonical owners and any removal grounded in the closing mark or explicit user direction rather than inferred completion?',
    outcomes: ['conforming', 'explicit update required', 'promote durable fact'],
    guidance:
      'Promote facts through their owning lifecycle and update or remove a package only with explicit authority.'
  }
}

const LIFECYCLE_3: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-3',
  title: 'the state stays short and carries no history',
  description:
    'A description runs to at most 500 characters, and Now to at most five lines, and Now and Held carry no bulk history: no dated log lines, runs of commit identifiers or test counts, a single link being fine. These are warned, never failed.',
  sources: [`${SOURCE}#45-the-state`],
  mechanical: {
    level: 'WARN',
    heuristic: true,
    remediation: {
      class: 'guarded',
      guidance: 'Trim at the next update: link the detail and leave history to the Git log and the commit.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.size }
  },
  judgment: {
    scope: 'Every entry file the warning names.',
    prompt: 'Is the flagged content needed in the state, or does it belong in a link, the commit or a durable home?',
    outcomes: ['conforming', 'trim at next update', 'escalate to user'],
    guidance: "Trim only at the work's own next update; another session names the warning in a message."
  }
}

export const LIFECYCLE: RubricFamily<WorkPackageRubricContext, LifecycleContext> = {
  code: 'LIFECYCLE',
  title: 'Work-package lifecycle',
  description: 'Update, resume, and removal preserve one package per piece of work without inventing lifecycle state.',
  standard: SOURCE,
  selectContext: (context) => context.lifecycle,
  items: [LIFECYCLE_1, LIFECYCLE_2, LIFECYCLE_3]
}
