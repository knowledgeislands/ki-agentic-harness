import type { AuditOutcome, RubricFamily, RubricItem } from '../../shared/rubric.ts'
import {
  type GitCleanEvidence,
  type GitFacts,
  type GitRubricContext,
  type ObsoleteBranch,
  STALE_DAYS
} from '../contexts/git.ts'

const SOURCE = 'standards-git.md#clean-down-state'

const APPROVAL =
  'Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.'

const FACTS = 'The host-supplied `mgit overview --json` record for this repository'

type Available = Extract<GitCleanEvidence, { state: 'available' }>

/**
 * Run a clean-down check over available facts. Without them the criterion is
 * unassessed, which is neutral context rather than a pass or a violation.
 */
const assess =
  (check: (evidence: Available) => readonly AuditOutcome[], repositoryWide = false) =>
  (evidence: GitCleanEvidence): readonly AuditOutcome[] => {
    if (evidence.state === 'unavailable') return [{ status: 'INFO', message: `unassessed: ${evidence.reason}` }]
    if (repositoryWide && !evidence.facts.worktrees)
      return [
        {
          status: 'INFO',
          message: 'unassessed: `mgit overview` reported the repository-wide facts for another checkout'
        }
      ]
    return check(evidence)
  }

const plural = (count: number, one: string, many: string): string => `${count} ${count === 1 ? one : many}`

const fetchNote = (facts: GitFacts): string =>
  facts.lastFetchAgeDays === null ? 'with no recorded fetch' : `as of a fetch ${facts.lastFetchAgeDays} days ago`

const branchLabel = (branch: ObsoleteBranch): string =>
  `${branch.scope} branch \`${branch.name}\`${branch.automation ? ' (automation)' : ''}`

const branchFinding = (branch: ObsoleteBranch, facts: GitFacts, finding: string): AuditOutcome => ({
  status: 'VIOLATION',
  subject: branch.name,
  message: `${branchLabel(branch)} ${finding}${branch.scope === 'remote' ? `, ${fetchNote(facts)}` : ''}`
})

const findingsOrPass = (findings: readonly AuditOutcome[], pass: string): readonly AuditOutcome[] =>
  findings.length > 0 ? findings : [{ status: 'PASS', message: pass }]

const CLEAN_1: RubricItem<GitCleanEvidence> = {
  code: 'CLEAN-1',
  title: 'open pull requests are known and owned',
  description:
    'Every open pull request is listed with its branch, author, draft state, and age, so none lingers unowned. It stays a judgment item while its only evidence is the provider’s network pull-request list, which `mgit overview` does not report and the offline audit cannot read.',
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

const CLEAN_2: RubricItem<GitCleanEvidence> = {
  code: 'CLEAN-2',
  title: 'merged branches are retired',
  description:
    'No local or remote branch other than the default and the current branch, automation branches included, carries work already in the default branch. Each branch `mgit overview` reports as merged or patch-equivalent is a finding.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance: `Propose \`git branch -d\` for a proven-merged local branch, never \`-D\`. ${APPROVAL}`
    },
    audit: {
      phase: 'INSPECT',
      run: assess(
        ({ facts }) =>
          findingsOrPass(
            facts.obsoleteBranches
              .filter((branch) => branch.reasons.includes('merged') || branch.reasons.includes('equivalent'))
              .map((branch) =>
                branchFinding(
                  branch,
                  facts,
                  branch.reasons.includes('merged')
                    ? 'is merged into the default branch'
                    : 'has no patch the default branch lacks'
                )
              ),
            'no branch other than the default or one checked out carries work already in the default branch'
          ),
        true
      )
    }
  },
  judgment: {
    scope: `${FACTS}, its \`obsolete_branches\` merged and equivalent reasons and last-fetch age, decided as \`git branch --merged <default>\`, \`git branch -r --merged origin/<default>\`, and \`git cherry <default> <branch>\` decide them, over local and remote-tracking refs including \`automation/*\`, \`dependabot/*\`, and \`renovate/*\`.`,
    prompt:
      'For each merged branch found, should its owner retire it now, and does an open pull request or another thread still use it?',
    outcomes: ['retire', 'leave in use', 'owner decision required'],
    guidance: `Propose \`git branch -d\` for a proven-merged local branch, never \`-D\`. ${APPROVAL}`
  }
}

const CLEAN_3: RubricItem<GitCleanEvidence> = {
  code: 'CLEAN-3',
  title: 'unmerged branches are not stale',
  description: `No unmerged local or remote branch, automation branches included, has a tip older than the ${STALE_DAYS}-day stale threshold. Each branch \`mgit overview\` reports as stale at that threshold is a finding.`,
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance: `Report each stale branch for its owner to resume, merge, or abandon; an unmerged branch is never deleted on age alone. ${APPROVAL}`
    },
    audit: {
      phase: 'INSPECT',
      run: assess(({ staleDays, facts }) => {
        if (staleDays !== STALE_DAYS)
          return [
            {
              status: 'INFO',
              message: `unassessed: \`mgit overview\` used a ${staleDays}-day stale threshold, not the standard’s ${STALE_DAYS} days`
            }
          ]
        return findingsOrPass(
          facts.obsoleteBranches
            .filter((branch) => branch.reasons.includes('stale'))
            .map((branch) =>
              branchFinding(branch, facts, `has a tip ${branch.ageDays ?? 'an unknown number of'} days old`)
            ),
          `no unmerged branch has a tip older than ${STALE_DAYS} days`
        )
      }, true)
    }
  },
  judgment: {
    scope: `${FACTS}, its \`stale_days\`, its \`obsolete_branches\` stale reasons with their ages, and its last-fetch age, decided as \`git for-each-ref --format='%(refname) %(committerdate:unix)' refs/heads refs/remotes\` and the merged set from CLEAN-2 decide them.`,
    prompt:
      'For each stale branch found, should its owner resume, merge, or abandon it, and does an open pull request use it?',
    outcomes: ['resume', 'merge', 'abandon with approval', 'owner decision required'],
    guidance: `Report each stale branch for its owner to resume, merge, or abandon; an unmerged branch is never deleted on age alone. ${APPROVAL}`
  }
}

const CLEAN_4: RubricItem<GitCleanEvidence> = {
  code: 'CLEAN-4',
  title: 'local branches are level with upstream',
  description:
    'No local branch is ahead of or behind its upstream, tracks a gone upstream, or holds commits on no remote without an upstream. The checked-out branch’s ahead, behind, and gone state, and each other local branch `mgit overview` reports as gone, are findings; a checked-out branch with no upstream is reported as neutral context because the overview does not show whether it holds unpublished commits.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance:
        'Report each finding for its owner to push, pull, or retire under the repository’s publication authority; levelling never force-pushes, rebases another actor’s commits, or resets shared `main`.'
    },
    audit: {
      phase: 'INSPECT',
      run: assess(({ facts }) => {
        const outcomes: AuditOutcome[] = []
        const { branch, upstream } = facts
        if (!facts.bare && branch !== null) {
          const label = `checked-out branch \`${branch}\``
          if (upstream.state === 'none')
            outcomes.push({
              status: 'INFO',
              subject: branch,
              message: `${label} has no upstream; the overview does not show whether it holds commits on no remote`
            })
          if (upstream.state === 'gone')
            outcomes.push({ status: 'VIOLATION', subject: branch, message: `${label} tracks a gone upstream` })
          if (upstream.ahead > 0)
            outcomes.push({
              status: 'VIOLATION',
              subject: branch,
              message: `${label} is ${upstream.ahead} ahead of \`${upstream.name}\`, ${fetchNote(facts)}`
            })
          if (upstream.behind > 0)
            outcomes.push({
              status: 'VIOLATION',
              subject: branch,
              message: `${label} is ${upstream.behind} behind \`${upstream.name}\`, ${fetchNote(facts)}`
            })
        }
        for (const gone of facts.obsoleteBranches.filter(
          (item) => item.scope === 'local' && item.reasons.includes('gone')
        ))
          outcomes.push(branchFinding(gone, facts, 'tracks a gone upstream'))
        return findingsOrPass(outcomes, 'every reported local branch is level with its upstream')
      })
    }
  },
  judgment: {
    scope: `${FACTS}, its \`upstream\` state with ahead and behind counts, its \`obsolete_branches\` gone reasons, and its last-fetch age, decided as \`git for-each-ref --format='%(refname:short) %(upstream:short) %(upstream:track)' refs/heads\` and \`git log --branches --not --remotes\` decide them.`,
    prompt:
      'For each branch found, should its owner push, pull, or retire it under the repository’s publication authority? Also check any local branch other than the checked-out one for ahead, behind, or unpublished commits, which the overview does not yet report.',
    outcomes: ['push', 'pull', 'retire', 'owner decision required'],
    guidance:
      'Report each finding for its owner to push, pull, or retire under the repository’s publication authority; levelling never force-pushes, rebases another actor’s commits, or resets shared `main`.'
  }
}

const CLEAN_5: RubricItem<GitCleanEvidence> = {
  code: 'CLEAN-5',
  title: 'no stash entries remain',
  description: 'The repository holds no stash entries. A non-zero `mgit overview` stash count is a finding.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance: `Report each stash for its owner to apply, commit, or drop. ${APPROVAL}`
    },
    audit: {
      phase: 'INSPECT',
      run: assess(
        ({ facts }) =>
          findingsOrPass(
            facts.stashes > 0
              ? [
                  {
                    status: 'VIOLATION',
                    message: `the repository holds ${plural(facts.stashes, 'stash entry', 'stash entries')}`
                  }
                ]
              : [],
            'the repository holds no stash entries'
          ),
        true
      )
    }
  },
  judgment: {
    scope: `${FACTS} and its \`stashes\` count, with \`git stash list --format='%gd %ct %gs'\` for each entry’s age and message.`,
    prompt: 'For each stash entry, should its owner apply, commit, or drop it?',
    outcomes: ['apply', 'commit', 'drop with approval', 'owner decision required'],
    guidance: `Report each stash for its owner to apply, commit, or drop. ${APPROVAL}`
  }
}

const CLEAN_6: RubricItem<GitCleanEvidence> = {
  code: 'CLEAN-6',
  title: 'linked worktrees show no retirement signal',
  description:
    'No linked worktree is prunable, detached, locked without a reason, or on a branch already merged into the default branch. The prunable and detached counts `mgit overview` reports are findings; an unexplained lock and a merged worktree branch remain for review until the overview reports them.',
  sources: [SOURCE, 'standards-git.md#finished-worktree-retirement'],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance: `Route each finding to the BRANCH-2 integrate-or-dispose decision. ${APPROVAL}`
    },
    audit: {
      phase: 'INSPECT',
      run: assess(({ facts }) => {
        const worktrees = facts.worktrees ?? { linked: 0, prunable: 0, detached: 0 }
        const outcomes: AuditOutcome[] = []
        if (worktrees.prunable > 0)
          outcomes.push({
            status: 'VIOLATION',
            message: `${plural(worktrees.prunable, 'linked worktree is', 'linked worktrees are')} prunable`
          })
        if (worktrees.detached > 0)
          outcomes.push({
            status: 'VIOLATION',
            message: `${plural(worktrees.detached, 'linked worktree is', 'linked worktrees are')} detached`
          })
        return findingsOrPass(
          outcomes,
          `no linked worktree is prunable or detached (${plural(worktrees.linked, 'linked worktree', 'linked worktrees')})`
        )
      }, true)
    }
  },
  judgment: {
    scope: `${FACTS} and its \`worktrees\` counts, with \`git worktree list --porcelain\` and the merged set from CLEAN-2 for each worktree’s lock reason and branch.`,
    prompt:
      'Is any linked worktree locked without a reason or on a branch already merged into the default branch? For each finding, what does the BRANCH-2 retirement judgment decide?',
    outcomes: ['integrate', 'dispose with approval', 'leave in use', 'owner decision required'],
    guidance: `Route each finding to the BRANCH-2 integrate-or-dispose decision. ${APPROVAL}`
  }
}

const CLEAN_7: RubricItem<GitCleanEvidence> = {
  code: 'CLEAN-7',
  title: 'no untracked or staged leftovers at rest',
  description:
    'A working tree no thread is using holds no untracked path that is not ignored and no staged entry. The `mgit overview` untracked and staged counts are heuristic findings: whether a thread is using the working tree is not a Git fact, so that stays a judgment.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    heuristic: true,
    remediation: {
      class: 'guarded',
      guidance: `Report each leftover for its owner to commit, ignore, or remove. ${APPROVAL}`
    },
    audit: {
      phase: 'INSPECT',
      run: assess(({ facts }) => {
        if (facts.bare) return [{ status: 'NOT_APPLICABLE', message: 'a bare repository has no working tree' }]
        const { staged, untracked } = facts.changes
        const outcomes: AuditOutcome[] = []
        if (untracked > 0)
          outcomes.push({
            status: 'VIOLATION',
            message: `the working tree holds ${plural(untracked, 'untracked path', 'untracked paths')} that are not ignored, a leftover unless a thread is using it`
          })
        if (staged > 0)
          outcomes.push({
            status: 'VIOLATION',
            message: `the working tree holds ${plural(staged, 'staged entry', 'staged entries')}, a leftover unless a thread is using it`
          })
        return findingsOrPass(outcomes, 'the working tree holds no untracked or staged leftovers')
      })
    }
  },
  judgment: {
    scope: `${FACTS} and its \`changes\` counts, with \`git status --porcelain=v1 --untracked-files=all\` and the threads known to be using the working tree.`,
    prompt:
      'Is any thread using this working tree? If none is, each untracked path and staged entry is a leftover for its owner to commit, ignore, or remove.',
    outcomes: ['conforming', 'untracked leftover', 'staged leftover', 'working tree in use'],
    guidance: `Report each leftover for its owner to commit, ignore, or remove. ${APPROVAL}`
  }
}

export const CLEAN: RubricFamily<GitRubricContext, GitCleanEvidence> = {
  code: 'CLEAN',
  title: 'clean-down state',
  description:
    'A repository at rest carries no Git leftovers, each criterion decided by a fixed rule over the read-only Git facts the host composes from `mgit overview --json`.',
  standard: 'standards-git.md',
  selectContext: (context) => context.clean,
  items: [CLEAN_1, CLEAN_2, CLEAN_3, CLEAN_4, CLEAN_5, CLEAN_6, CLEAN_7]
}
