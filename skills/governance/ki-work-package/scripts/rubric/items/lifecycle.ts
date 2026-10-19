import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { LifecycleContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standards-work-package.md'

const LIFECYCLE_1: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-1',
  title: 'state, uniqueness, and timestamps agree',
  description:
    "A work package's created_at is no later than its since; every old checkpoint carries state active, each thread has at most one, and its timestamps are chronologically coherent; and no old checkpoint stays active beside the work package that replaces it. Removal deletes the record rather than creating a retired state.",
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'guarded',
      guidance: 'Correct lifecycle metadata only through an explicit UPDATE request; use REMOVE to delete a record.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.mechanical }
  },
  judgment: {
    scope: 'Every work package, single-file work folder and old checkpoint location, state, and timestamp.',
    prompt: 'Does the proposed lifecycle correction preserve explicit user authority and the one-record-per-work rule?',
    outcomes: ['conforming', 'explicit update required', 'explicit removal required'],
    guidance: 'Do not change state or timestamps until the user supplies UPDATE direction; REMOVE deletes the record.'
  }
}

const LIFECYCLE_2: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-2',
  title: 'package content is current and durable facts are promoted',
  description:
    "The work file is a stable definition whose description routes clearly against its neighbours, and `state.md` is a concise current state that agrees with the work's last move, with no moves list. Decisions, accepted work state, and reusable knowledge already live with their canonical owners; removal follows the closing mark or explicit direction and does not manufacture completion.",
  sources: [SOURCE],
  judgment: {
    scope: 'Every work package, its named durable owners, and removal authority.',
    prompt:
      'Is each package current and concise, its description routing clearly and its state agreeing with its last move, with durable facts promoted to their canonical owners and any removal grounded in the closing mark or explicit user direction rather than inferred completion?',
    outcomes: ['conforming', 'explicit update required', 'promote durable fact'],
    guidance:
      'Promote facts through their owning lifecycle and update or remove a package only with explicit authority.'
  }
}

const LIFECYCLE_3: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-3',
  title: 'package files keep within their soft size limits',
  description:
    'A description runs to at most 500 characters, a `work.md` body to at most 300 words and a `state.md` body to at most 400 words with Now at most five lines and no bulk history: no dated log lines, runs of commit identifiers or test counts, a single link being fine. Each message line runs to about 60 words at most, and none waits more than 7 days on work that is not on hold; `decisions.md` runs to at most 400 lines. The limits are soft and warned, never failed.',
  sources: [`${SOURCE}#size-limits`],
  mechanical: {
    level: 'WARN',
    heuristic: true,
    remediation: {
      class: 'guarded',
      guidance:
        'Trim at the next update: link the detail, move history to the commit or run report, act on old messages, and strike homed decisions.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.size }
  },
  judgment: {
    scope: 'Every package file the size warning names.',
    prompt:
      'Is the flagged content needed in the package, or does it belong in a link, the commit, a run report or a durable home?',
    outcomes: ['conforming', 'trim at next update', 'escalate to user'],
    guidance: "Trim only at the work's own next update; another session names the warning in a message line."
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
