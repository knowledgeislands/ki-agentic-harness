import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { GitRubricContext } from '../contexts/git.ts'

const SOURCE = 'standards-git.md#clean-down-state'

const APPROVAL =
  'Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.'

const CLEAN_1: RubricItem<GitRubricContext> = {
  code: 'CLEAN-1',
  title: 'open pull requests are known and owned',
  description:
    'Every open pull request is listed with its branch, author, draft state, and age, so none lingers unowned.',
  sources: [SOURCE],
  judgment: {
    scope:
      'The provider’s open pull-request list, such as `gh pr list --state open`, with each pull request’s branch, author, draft state, and creation date.',
    prompt:
      'Is there any open pull request? Each one is a finding, reported with its branch, author, draft state, and age, for its owner to merge, update, or close.',
    outcomes: ['conforming', 'open pull request', 'provider evidence unavailable'],
    guidance: `Report each open pull request for its owner to merge, update, or close. ${APPROVAL}`
  }
}

const CLEAN_2: RubricItem<GitRubricContext> = {
  code: 'CLEAN-2',
  title: 'merged branches are retired',
  description:
    'No local or remote branch other than the default and the current branch, automation branches included, carries work already in the default branch.',
  sources: [SOURCE],
  judgment: {
    scope:
      '`git branch --merged <default>`, `git branch -r --merged origin/<default>`, and `git cherry <default> <branch>` for patch-equivalent squash merges, over local and remote-tracking refs including `automation/*`, `dependabot/*`, and `renovate/*`, with the age of the last fetch.',
    prompt:
      'Does any local or remote branch, other than the default and the current branch, have its tip reachable from the default branch, or show no remaining patch under `git cherry`? Each is a finding.',
    outcomes: ['conforming', 'merged local branch', 'merged remote branch', 'remote evidence stale'],
    guidance: `Propose \`git branch -d\` for a proven-merged local branch, never \`-D\`. ${APPROVAL}`
  }
}

const CLEAN_3: RubricItem<GitRubricContext> = {
  code: 'CLEAN-3',
  title: 'unmerged branches are not stale',
  description:
    'No unmerged local or remote branch, automation branches included, has a tip older than the 30-day stale threshold.',
  sources: [SOURCE],
  judgment: {
    scope:
      "`git for-each-ref --format='%(refname) %(committerdate:unix)' refs/heads refs/remotes`, the merged set from CLEAN-2, and the age of the last fetch.",
    prompt:
      'Does any unmerged local or remote branch have a tip whose committer date is more than 30 days old? Each is a finding, reported with its age and any open pull request that uses it.',
    outcomes: ['conforming', 'stale local branch', 'stale remote branch', 'remote evidence stale'],
    guidance: `Report each stale branch for its owner to resume, merge, or abandon; an unmerged branch is never deleted on age alone. ${APPROVAL}`
  }
}

const CLEAN_4: RubricItem<GitRubricContext> = {
  code: 'CLEAN-4',
  title: 'local branches are level with upstream',
  description:
    'No local branch is ahead of or behind its upstream, tracks a gone upstream, or holds commits on no remote without an upstream.',
  sources: [SOURCE],
  judgment: {
    scope:
      "`git for-each-ref --format='%(refname:short) %(upstream:short) %(upstream:track)' refs/heads`, `git log --branches --not --remotes` for commits on no remote, and the age of the last fetch.",
    prompt:
      'Is any local branch ahead of or behind its upstream, tracking an upstream that is gone, or holding commits on no remote without an upstream? Each is a finding, with its ahead and behind counts.',
    outcomes: [
      'conforming',
      'ahead of upstream',
      'behind upstream',
      'upstream gone',
      'unpublished branch',
      'remote evidence stale'
    ],
    guidance:
      'Report each finding for its owner to push, pull, or retire under the repository’s publication authority; levelling never force-pushes, rebases another actor’s commits, or resets shared `main`.'
  }
}

const CLEAN_5: RubricItem<GitRubricContext> = {
  code: 'CLEAN-5',
  title: 'no stash entries remain',
  description: 'The repository holds no stash entries.',
  sources: [SOURCE],
  judgment: {
    scope: "`git stash list --format='%gd %ct %gs'`.",
    prompt: 'Does the repository hold any stash entry? Each is a finding, reported with its age and message.',
    outcomes: ['conforming', 'stash entry'],
    guidance: `Report each stash for its owner to apply, commit, or drop. ${APPROVAL}`
  }
}

const CLEAN_6: RubricItem<GitRubricContext> = {
  code: 'CLEAN-6',
  title: 'linked worktrees show no retirement signal',
  description:
    'No linked worktree is prunable, detached, locked without a reason, or on a branch already merged into the default branch.',
  sources: [SOURCE, 'standards-git.md#finished-worktree-retirement'],
  judgment: {
    scope: '`git worktree list --porcelain` and the merged set from CLEAN-2.',
    prompt:
      'Is any linked worktree prunable, detached, locked without a reason, or on a branch already merged into the default branch? Each is a finding for the BRANCH-2 retirement judgment.',
    outcomes: ['conforming', 'prunable worktree', 'detached worktree', 'unexplained lock', 'merged worktree branch'],
    guidance: `Route each finding to the BRANCH-2 integrate-or-dispose decision. ${APPROVAL}`
  }
}

const CLEAN_7: RubricItem<GitRubricContext> = {
  code: 'CLEAN-7',
  title: 'no untracked or staged leftovers at rest',
  description: 'A working tree no thread is using holds no untracked path that is not ignored and no staged entry.',
  sources: [SOURCE],
  judgment: {
    scope:
      '`git status --porcelain=v1 --untracked-files=all` for a working tree no thread is actively using, with the threads known to be using it.',
    prompt:
      'Does a working tree no thread is using hold any untracked path that is not ignored, or any staged entry? Each is a finding.',
    outcomes: ['conforming', 'untracked leftover', 'staged leftover', 'working tree in use'],
    guidance: `Report each leftover for its owner to commit, ignore, or remove. ${APPROVAL}`
  }
}

export const CLEAN: RubricFamily<GitRubricContext, GitRubricContext> = {
  code: 'CLEAN',
  title: 'clean-down state',
  description:
    'A repository at rest carries no Git leftovers, each criterion decided by a named read-only command and a fixed rule.',
  standard: 'standards-git.md',
  selectContext: (context) => context,
  items: [CLEAN_1, CLEAN_2, CLEAN_3, CLEAN_4, CLEAN_5, CLEAN_6, CLEAN_7]
}
