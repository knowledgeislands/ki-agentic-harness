import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { LifecycleContext, WorkFolderRubricContext } from '../contexts/work-folder.ts'

const SOURCE = 'standards-work-folder.md'

const LIFECYCLE_1: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-1',
  title: 'state, uniqueness, and timestamps agree',
  description:
    "A work file's created_at is no later than its since; every old checkpoint carries state active, each thread has at most one, and its timestamps are chronologically coherent; and no old checkpoint stays active beside the work file that replaces it. Removal deletes the record rather than creating a retired state.",
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
    scope: 'Every work file and old checkpoint location, state, and timestamp.',
    prompt: 'Does the proposed lifecycle correction preserve explicit user authority and the one-record-per-work rule?',
    outcomes: ['conforming', 'explicit update required', 'explicit removal required'],
    guidance: 'Do not change state or timestamps until the user supplies UPDATE direction; REMOVE deletes the record.'
  }
}

const LIFECYCLE_2: RubricItem<LifecycleContext> = {
  code: 'LIFECYCLE-2',
  title: 'work-file content is current and durable facts are promoted',
  description:
    "The work file is a concise current state that agrees with the work's last move, with no moves list. Decisions, accepted work state, and reusable knowledge already live with their canonical owners; removal follows the closing mark or explicit direction and does not manufacture completion.",
  sources: [SOURCE],
  judgment: {
    scope: 'Every work file, its named durable owners, and removal authority.',
    prompt:
      'Is each work file current and concise, agreeing with its last move, with durable facts promoted to their canonical owners and any removal grounded in the closing mark or explicit user direction rather than inferred completion?',
    outcomes: ['conforming', 'explicit update required', 'promote durable fact'],
    guidance:
      'Promote facts through their owning lifecycle and update or remove a work file only with explicit authority.'
  }
}

export const LIFECYCLE: RubricFamily<WorkFolderRubricContext, LifecycleContext> = {
  code: 'LIFECYCLE',
  title: 'Work-file lifecycle',
  description:
    'Update, resume, and removal preserve one work file per piece of work without inventing lifecycle state.',
  standard: SOURCE,
  selectContext: (context) => context.lifecycle,
  items: [LIFECYCLE_1, LIFECYCLE_2]
}
