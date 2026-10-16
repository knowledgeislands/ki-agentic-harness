<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Knowledge Islands Git conventions

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-git --write`.

Line-by-line criteria for auditing ki-git. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [COMMIT — commit shape](#commit--commit-shape)
- [BRANCH — working approach](#branch--working-approach)
- [HYGIENE — Git working hygiene](#hygiene--git-working-hygiene)
- [CLEAN — clean-down state](#clean--clean-down-state)
- [LOCK — stale-lock semantics](#lock--stale-lock-semantics)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## COMMIT — commit shape

→ [standard](standards-git.md)

Commit messages express one completed unit through the portable convention.

- **COMMIT-1 [J] — commit shape expresses the completed unit** — A commit uses the portable Conventional Commit shape and accurately represents one completed unit of work. (standards-git.md)
  - _Evidence scope:_ Each proposed commit, its `git diff --cached` (or explicit patch) evidence, and its proposed subject line.
  - _Review prompt:_ After inspecting the proposed diff and subject line, assess whether the commit type, optional scope, and imperative summary accurately describe one completed unit, using the established vocabulary without combining unrelated changes.
  - _Outcomes:_ conforming; split required; message revision required
  - _Conforming guidance:_ Split unrelated changes into separately reviewable commits, then revise the Conventional Commit type, scope, or imperative summary to describe the completed unit.
- **COMMIT-2 [J] — publication and integration retain separate authority** — Commits, task-branch publication, pull-request review, approval, merge, and primary-branch integration use explicit separable authority. (standards-git.md#commit-publication-and-integration-authority)
  - _Evidence scope:_ The requested change, repository instructions, stable actor identity, selected branch or worktree, proposed commit, push target, pull-request action, integration target, required gates, and any explicit or standing authority.
  - _Review prompt:_ Does the actor have independently evidenced authority for each push, review, approval, merge, or auto-merge action, scoped to the named repository, refs, work domain, gates, and lifetime, without inferring it from assignment, autonomy, credentials, or task completion? A local commit of a verified unit on the authorised branch is the ordinary default and needs no separate grant; withholding it requires a repository instruction that says so.
  - _Outcomes:_ conforming; commit authority required; push authority required; review authority required; integration authority required; authority scope incomplete
  - _Conforming guidance:_ Commit the verified unit to the authorised branch rather than leaving it dirty; flag a commit only where the repository gates commits or the branch is wrong. A bounded unattended workflow may publish its task branch and draft pull request. Review, approval, merge, and auto-merge require separately named capabilities with actor, repository, ref, domain, gate, and revocation scope.

## BRANCH — working approach

→ [standard](standards-git.md)

Working-copy topology and review flow follow local protection, review, and concurrency needs.

- **BRANCH-1 [J] — working approach matches the delivery boundary** — Primary-checkout, branch-with-PR, worktree-with-PR, and local worktree integration approaches follow repository policy, review needs, concurrency, and unattended isolation. (standards-git.md#working-copy-and-review-approaches, standards-git.md#local-integration-write-boundary)
  - _Evidence scope:_ The selected repository, requested change, current `git branch --show-current` and `git worktree list` evidence, protection policy, concurrency, and review boundary.
  - _Review prompt:_ Does the selected approach satisfy isolation and review needs, and does local worktree integration use an authorised owner and serialised destination write without imposing remote publication?
  - _Outcomes:_ conforming; use single-working-copy-on-main; use single-working-copy-on-branch-with-pr; use worktrees-with-pr; use worktrees-with-local-integration
  - _Conforming guidance:_ Use the primary checkout for ordinary interactive work. Isolate unattended implementation. When delivery is local-only, independently review the candidate and integrate through the authorised serialised write boundary without requiring a push or pull request.
- **BRANCH-2 [J] — finished worktrees are integrated or disposed** — Finished linked worktrees are inspected, deliberately integrated or disposed, removed, and pruned without losing unmerged work. (standards-git.md)
  - _Evidence scope:_ Every linked worktree in `git worktree list --porcelain`, its branch, `git status --short`, commits not reachable from the intended integration branch, branch diff, and delivery authority.
  - _Review prompt:_ For each finished linked worktree, is its work deliberately integrated or explicitly disposed before the worktree and any proven-redundant local branch are removed?
  - _Outcomes:_ conforming; integrate worktree; dispose worktree; ownership decision required
  - _Conforming guidance:_ Inspect before removal. Integrate coherent authorised work; dispose only confirmed unwanted work. Delete a branch only after proving reachability or no remaining diff, prune stale metadata, and retain only intentionally active worktrees.
- **BRANCH-3 [J] — linked worktrees use a safe runtime-owned root** — Linked working files stay outside the primary working tree and Git common directory under a collision-safe runtime-owned root. (standards-git.md#worktree-location)
  - _Evidence scope:_ Every linked worktree path, the repository primary working tree, Git common directory, estate discovery roots, and the runtime that owns creation and retirement.
  - _Review prompt:_ Is each linked worktree contained under an explicit runtime-owned root outside the repository and its Git common directory, excluded from estate discovery, and uniquely keyed to avoid collisions?
  - _Outcomes:_ conforming; relocate worktree root; define runtime ownership; collision risk
  - _Conforming guidance:_ Use one runtime-owned application-state or XDG root with repository and task identity. Do not place working files inside the repository, under `.git`, or in an estate-scanned workspace tree.

## HYGIENE — Git working hygiene

→ [standard](standards-git.md)

Git operations preserve shared worktree state and recoverability.

- **HYGIENE-1 [J] — Git working hygiene preserves unrelated state** — Git work preserves a potentially shared working tree through thread-local touched paths, explicit staging, contested-path coordination, and serialized commit windows. (standards-git.md)
  - _Evidence scope:_ The pre-edit and current working tree (`git status --short`), expected `HEAD`, the thread-local touched-path set, touched, staged and actual committed diffs, contested paths, and Git write operations for the selected work.
  - _Review prompt:_ After recording the pre-edit state and expected `HEAD`, assess whether the thread tracked every path it may have changed, withheld pre-existing or overlapping paths for coordination, staged only enumerated uncontested paths, preserved unrelated staged and unstaged work, serialised the commit window that advances shared `HEAD`, and inspected actual committed paths after hooks.
  - _Outcomes:_ conforming; state inspection required; staging correction required; operation coordination required
  - _Conforming guidance:_ Maintain a thread-local touched-path set, re-check status, `HEAD`, touched diffs, and staged paths before committing, and use `git add -- <path>...` only for enumerated uncontested paths. Inspect the actual commit after hooks and coordinate recovery of unrelated captured changes before rebuilding a commit this session has not pushed. Never use `git add -A`, `git add .`, `git add -u`, `git commit -a`, `git commit -am`, or broad wildcard pathspecs in a shared tree. Leave contested and unrelated work untouched, and serialize only the shared-index and commit window.

## CLEAN — clean-down state

→ [standard](standards-git.md)

A repository at rest carries no Git leftovers, each criterion decided by a named read-only command and a fixed rule.

- **CLEAN-1 [J] — open pull requests are known and owned** — Every open pull request is listed with its branch, author, draft state, and age, so none lingers unowned. (standards-git.md#clean-down-state)
  - _Evidence scope:_ The provider’s open pull-request list, such as `gh pr list --state open`, with each pull request’s branch, author, draft state, and creation date.
  - _Review prompt:_ Is there any open pull request? Each one is a finding, reported with its branch, author, draft state, and age, for its owner to merge, update, or close.
  - _Outcomes:_ conforming; open pull request; provider evidence unavailable
  - _Conforming guidance:_ Report each open pull request for its owner to merge, update, or close. Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.
- **CLEAN-2 [J] — merged branches are retired** — No local or remote branch other than the default and the current branch, automation branches included, carries work already in the default branch. (standards-git.md#clean-down-state)
  - _Evidence scope:_ `git branch --merged <default>`, `git branch -r --merged origin/<default>`, and `git cherry <default> <branch>` for patch-equivalent squash merges, over local and remote-tracking refs including `automation/*`, `dependabot/*`, and `renovate/*`, with the age of the last fetch.
  - _Review prompt:_ Does any local or remote branch, other than the default and the current branch, have its tip reachable from the default branch, or show no remaining patch under `git cherry`? Each is a finding.
  - _Outcomes:_ conforming; merged local branch; merged remote branch; remote evidence stale
  - _Conforming guidance:_ Propose `git branch -d` for a proven-merged local branch, never `-D`. Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.
- **CLEAN-3 [J] — unmerged branches are not stale** — No unmerged local or remote branch, automation branches included, has a tip older than the 30-day stale threshold. (standards-git.md#clean-down-state)
  - _Evidence scope:_ `git for-each-ref --format='%(refname) %(committerdate:unix)' refs/heads refs/remotes`, the merged set from CLEAN-2, and the age of the last fetch.
  - _Review prompt:_ Does any unmerged local or remote branch have a tip whose committer date is more than 30 days old? Each is a finding, reported with its age and any open pull request that uses it.
  - _Outcomes:_ conforming; stale local branch; stale remote branch; remote evidence stale
  - _Conforming guidance:_ Report each stale branch for its owner to resume, merge, or abandon; an unmerged branch is never deleted on age alone. Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.
- **CLEAN-4 [J] — local branches are level with upstream** — No local branch is ahead of or behind its upstream, tracks a gone upstream, or holds commits on no remote without an upstream. (standards-git.md#clean-down-state)
  - _Evidence scope:_ `git for-each-ref --format='%(refname:short) %(upstream:short) %(upstream:track)' refs/heads`, `git log --branches --not --remotes` for commits on no remote, and the age of the last fetch.
  - _Review prompt:_ Is any local branch ahead of or behind its upstream, tracking an upstream that is gone, or holding commits on no remote without an upstream? Each is a finding, with its ahead and behind counts.
  - _Outcomes:_ conforming; ahead of upstream; behind upstream; upstream gone; unpublished branch; remote evidence stale
  - _Conforming guidance:_ Report each finding for its owner to push, pull, or retire under the repository’s publication authority; levelling never force-pushes, rebases another actor’s commits, or resets shared `main`.
- **CLEAN-5 [J] — no stash entries remain** — The repository holds no stash entries. (standards-git.md#clean-down-state)
  - _Evidence scope:_ `git stash list --format='%gd %ct %gs'`.
  - _Review prompt:_ Does the repository hold any stash entry? Each is a finding, reported with its age and message.
  - _Outcomes:_ conforming; stash entry
  - _Conforming guidance:_ Report each stash for its owner to apply, commit, or drop. Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.
- **CLEAN-6 [J] — linked worktrees show no retirement signal** — No linked worktree is prunable, detached, locked without a reason, or on a branch already merged into the default branch. (standards-git.md#clean-down-state, standards-git.md#finished-worktree-retirement)
  - _Evidence scope:_ `git worktree list --porcelain` and the merged set from CLEAN-2.
  - _Review prompt:_ Is any linked worktree prunable, detached, locked without a reason, or on a branch already merged into the default branch? Each is a finding for the BRANCH-2 retirement judgment.
  - _Outcomes:_ conforming; prunable worktree; detached worktree; unexplained lock; merged worktree branch
  - _Conforming guidance:_ Route each finding to the BRANCH-2 integrate-or-dispose decision. Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.
- **CLEAN-7 [J] — no untracked or staged leftovers at rest** — A working tree no thread is using holds no untracked path that is not ignored and no staged entry. (standards-git.md#clean-down-state)
  - _Evidence scope:_ `git status --porcelain=v1 --untracked-files=all` for a working tree no thread is actively using, with the threads known to be using it.
  - _Review prompt:_ Does a working tree no thread is using hold any untracked path that is not ignored, or any staged entry? Each is a finding.
  - _Outcomes:_ conforming; untracked leftover; staged leftover; working tree in use
  - _Conforming guidance:_ Report each leftover for its owner to commit, ignore, or remove. Never delete a remote branch, close a pull request, drop a stash, remove a worktree, or delete an untracked file without the owner’s explicit approval naming that item; report a finding in a working tree or branch another thread is using and leave it untouched.

## LOCK — stale-lock semantics

→ [standard](standards-git.md)

The stale-lock guard remains bounded recovery rather than general cleanup.

- **LOCK-1 [J] — stale-lock recovery preserves the safety boundary** — Stale-lock recovery follows the guard’s worktree, process, containment, and file-type limits. (standards-git.md)
  - _Evidence scope:_ Every stale-lock candidate and its physical-worktree, relevant-process, containment, and regular-file evidence.
  - _Review prompt:_ Assess whether stale-lock recovery remains best-effort: it must not interrupt Git, cross the current physical worktree boundary, remove ambiguous or symlinked candidates, or act when process inspection is inconclusive.
  - _Outcomes:_ conforming; safe removal authorised; leave untouched; investigation required
  - _Conforming guidance:_ Remove only a clearly stale regular lock within the current physical worktree after process checks; otherwise leave it untouched and investigate through the repository owner.
