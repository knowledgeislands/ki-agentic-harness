# Coordinating-work standard: sync

This file holds pushing beneath other sessions, the repository level check and keeping primary checkouts current. It extends [the core](standards-coordination.md).

## Pushing beneath other sessions

Several sessions commit into one checkout, so one session's commits can sit on another's unpushed ones.

- **Commit:** every session, coordinator or background agent, commits its own work by explicit path under the `ki-delegation` [coordination](../../../governance/ki-delegation/references/standards-background-runs.md#coordination) rules. It never commits, reverts or stashes another session's files.
- **Push:** fetch first. Where local `main` is ahead and fast-forwards its remote, push everything stacked, other sessions' commits included, within the session's authority and the repository's own rules. Never force-push or use `--no-verify`. Where the branches have diverged, stop and send the pull to the conflict run. A push is never put against the owner: it is no `[with you]` item, "with you" count or query.
- **Conflict run:** a pull that cannot fast-forward goes to a bounded resolve run at push tier in its own worktree.
  - It rebases only this work's unpublished commits onto the remote and verifies them.
  - It stops on another session's content, uncertain ownership or a judgement call. File ownership alone does not prove a file holds no other session's content.
  - When it stops, park a blocking query and push nothing more from that repository in the window, under the delegation [conflict-run boundary](../../../governance/ki-delegation/references/standards-background-runs.md#conflict-runs).
  - Nobody stashes, rebases or resets in the coordinator's checkout.
- **Report:** reports and banners omit routine push state and other sessions' stacked commits. Where a run's own unit could not be published because its push failed, its `## Done` names the unit and the reason. A hold report says nothing about pushes beyond a failure.

Sources: COMMIT-OWN-WORK, PACKAGE-PUSH, PUSH-NOT-WITH-YOU and CONFLICT-RUN in [the decision register](sources.md#decision-register).

## Repository level check

Check that the work's repositories are level before work resumes on another Mac, at every mark and before leaving a host: run `mgit fetch` across them, then read `mcp-git-audit`'s ahead and behind report. Check the repositories in the work's scope; a State of play checks its estate. Fetching and inspecting authorise no push and no change to another writer's working tree.

- **Behind:** carry each behind repository as `<repository>: <count> commits behind`, in the next report's `## In Progress` or as a 🤖 line of a Summary's status table, until a fresh check proves it level. It is not a banner item.
- **Ahead:** read under [Pushing beneath other sessions](#pushing-beneath-other-sessions). An unpublished change must not disappear in a host handoff.
- **Failed check:** a failed or unavailable check is unknown, never level. Report the repository and what prevented the check.
- **Reconciling:** reconcile a behind checkout only under [Keeping primary checkouts current](#keeping-primary-checkouts-current), leaving a dirty or diverged checkout to its owner.
- An On hold banner keeps its parked-and-release form.

Queue transfer, host-bound runs and the old session's closing form are outside this rule. The [deferred host-move design notes](sources.md#deferred-host-move-evidence) keep the open questions and transfer evidence and grant no implementation authority.

Sources: SYNC-GUARD in [the decision register](sources.md#decision-register).

## Keeping primary checkouts current

Background agents work in worktrees and push their own commits, so the owner's primary checkouts fall behind. The coordinator fast-forward pulls each affected primary checkout after a background agent that pushed finishes, and before a Summary.

It pulls only with `--ff-only` into a clean checkout. A checkout with uncommitted changes, or diverged from its upstream, is skipped and reported to the owner, never stashed, rebased or reset. The pull is a one-step check within the [turn budget](standards-coordination.md#coordinator-responsiveness); any repair goes to a background agent or the owner.
