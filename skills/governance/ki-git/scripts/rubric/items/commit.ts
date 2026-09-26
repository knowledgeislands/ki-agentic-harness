import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { GitRubricContext } from '../contexts/git.ts'

const COMMIT_1: RubricItem<GitRubricContext> = {
  code: 'COMMIT-1',
  title: 'commit shape expresses the completed unit',
  description:
    'A commit uses the portable Conventional Commit shape and accurately represents one completed unit of work.',
  sources: ['standards-git.md'],
  judgment: {
    scope: 'Each proposed commit, its `git diff --cached` (or explicit patch) evidence, and its proposed subject line.',
    prompt:
      'After inspecting the proposed diff and subject line, assess whether the commit type, optional scope, and imperative summary accurately describe one completed unit, using the established vocabulary without combining unrelated changes.',
    outcomes: ['conforming', 'split required', 'message revision required'],
    guidance:
      'Split unrelated changes into separately reviewable commits, then revise the Conventional Commit type, scope, or imperative summary to describe the completed unit.'
  }
}

const COMMIT_2: RubricItem<GitRubricContext> = {
  code: 'COMMIT-2',
  title: 'publication and integration retain separate authority',
  description: 'Local commits, pushes, and integration into the primary branch use distinct authority boundaries.',
  sources: ['standards-git.md#commit-publication-and-integration-authority'],
  judgment: {
    scope:
      'The requested change, repository instructions, selected branch or worktree, proposed commit, push target, integration action, and any explicit or standing authority.',
    prompt:
      'Does the actor have authority for each local commit, push, and primary-branch integration action independently, without inferring publication or merge authority from assignment, autonomy, or task completion?',
    outcomes: ['conforming', 'commit authority required', 'push authority required', 'integration authority required'],
    guidance:
      'Commit only the authorised unit and branch. Push or integrate only under explicit current-user instruction or a standing repository workflow that names the actor and scope.'
  }
}

export const COMMIT: RubricFamily<GitRubricContext, GitRubricContext> = {
  code: 'COMMIT',
  title: 'commit shape',
  description: 'Commit messages express one completed unit through the portable convention.',
  standard: 'standards-git.md',
  selectContext: (context) => context,
  items: [COMMIT_1, COMMIT_2]
}
