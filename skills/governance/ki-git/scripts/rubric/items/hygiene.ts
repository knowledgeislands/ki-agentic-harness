import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { GitRubricContext } from '../contexts/git.ts'

const HYGIENE_1: RubricItem<GitRubricContext> = {
  code: 'HYGIENE-1',
  title: 'Git working hygiene preserves unrelated state',
  description:
    'Git work preserves a potentially shared working tree through thread-local touched paths, explicit staging, contested-path coordination, and serialized commit windows.',
  sources: ['standards-git.md'],
  judgment: {
    scope:
      'The pre-edit and current working tree (`git status --short`), expected `HEAD`, the thread-local touched-path set, touched, staged and actual committed diffs, contested paths, and Git write operations for the selected work.',
    prompt:
      'After recording the pre-edit state and expected `HEAD`, assess whether the thread tracked every path it may have changed, withheld pre-existing or overlapping paths for coordination, staged only enumerated uncontested paths, preserved unrelated staged and unstaged work, serialised the commit window that advances shared `HEAD`, and inspected actual committed paths after hooks.',
    outcomes: [
      'conforming',
      'state inspection required',
      'staging correction required',
      'operation coordination required'
    ],
    guidance:
      'Maintain a thread-local touched-path set, re-check status, `HEAD`, touched diffs, and staged paths before committing, and use `git add -- <path>...` only for enumerated uncontested paths. Inspect the actual commit after hooks and coordinate recovery of unrelated captured changes before rebuilding a commit this session has not pushed. Never use `git add -A`, `git add .`, `git add -u`, `git commit -a`, `git commit -am`, or broad wildcard pathspecs in a shared tree. Leave contested and unrelated work untouched, and serialize only the shared-index and commit window.'
  }
}

const HYGIENE_2: RubricItem<GitRubricContext> = {
  code: 'HYGIENE-2',
  title: 'amend rewrites only this session’s own unpushed commit',
  description:
    'An amend in a shared working tree happens inside the serialized write window and only after confirming `HEAD` is the committing session’s own unpushed commit; otherwise the change is a new commit.',
  sources: ['standards-git.md#safe-git-hygiene'],
  judgment: {
    scope:
      'Each `git commit --amend` or other `HEAD` rewrite, the commit identity this session recorded when it committed, `git rev-parse HEAD` immediately before the rewrite, `git branch -r --contains HEAD`, and the write window held.',
    prompt:
      'Before each amend, did the session hold the serialized write window and confirm that `HEAD` was still its own recorded commit and on no remote branch, making a new commit instead whenever either check failed?',
    outcomes: ['conforming', 'new commit required', 'rewritten commit recovery required'],
    guidance:
      'Inside the write window, compare `HEAD` with the commit this session recorded and check `git branch -r --contains HEAD`; amend only when both show its own unpushed commit, and otherwise make a new commit. Report a rewritten commit of another actor for its owner to recover rather than rewriting history again.'
  }
}

const HYGIENE_3: RubricItem<GitRubricContext> = {
  code: 'HYGIENE-3',
  title: 'no autostash setting stashes a shared tree',
  description:
    'No `pull.autostash` or `rebase.autoStash` setting of `true` lets a pull or rebase stash another actor’s uncommitted work, which the never-stash rule forbids.',
  sources: ['standards-git.md#safe-git-hygiene'],
  judgment: {
    scope:
      'The effective `git config --show-origin --get-all pull.autostash` and `git config --show-origin --get-all rebase.autoStash` values at every configuration level, and the pull commands the workflow uses.',
    prompt:
      'Is either autostash setting `true` at any configuration level, or does any pull or rebase in a shared working tree run without overriding it?',
    outcomes: ['conforming', 'autostash setting conflicts', 'pull override required'],
    guidance:
      'Report each `true` setting with its origin for the owner of that configuration to change, and pull with `git -c pull.autostash=false -c rebase.autoStash=false pull --ff-only` into a clean checkout. Never stash, directly or through autostash, in a shared working tree.'
  }
}

export const HYGIENE: RubricFamily<GitRubricContext, GitRubricContext> = {
  code: 'HYGIENE',
  title: 'Git working hygiene',
  description: 'Git operations preserve shared worktree state and recoverability.',
  standard: 'standards-git.md',
  selectContext: (context) => context,
  items: [HYGIENE_1, HYGIENE_2, HYGIENE_3]
}
