# Coordinating-work standard: sync

This file holds pushing beneath other sessions, the repository level check and keeping primary checkouts current. It extends [the core](standards-coordination.md).

## Pushing beneath other sessions

Several sessions commit into one checkout, so a session's commits can sit on top of another's that are not yet pushed. Kris set the first rule on 2026-10-14, that each session commits its own work and pushes only when its own commits alone are stacked, and replaced its push half on 25 October 2026, choosing "Tonight's rule always" under PACKAGE-PUSH, read back as: "as a standing rule, a session may push everything stacked on `main`, other sessions' commits included, fast-forward only, never forced, never `--no-verify`, stopping on divergence; this supersedes the 14 and 19 October own-commits-only rule".

- **Commit:** every session, a coordinator or a background agent, commits its own work by explicit path, under the `ki-delegation` [coordination](../../../governance/ki-delegation/references/standards-background-runs.md#coordination) rules, and never commits, reverts or stashes another session's files.
- **Push:** before pushing it fetches. When local `main` is ahead of its remote and fast-forwards it, it pushes everything stacked, its own and other sessions' commits alike, under its authority and where the repository's own rules allow. It never force-pushes and never uses `--no-verify`. When the branches have diverged it stops, and the pull goes to the conflict run. Under PUSH-NOT-WITH-YOU of 2026-10-19 a push is never put against the owner: it is not a `[with you]` item, a "with you" count or a query.
- **Conflict run:** a pull that cannot fast-forward goes to a bounded resolve run at push tier in its own worktree, as Kris took CONFLICT-RUN a) on 25 October 2026. It rebases only this work's unpublished commits onto the remote and verifies them, and stops on another session's content, uncertain ownership or a judgement call; file ownership alone does not prove a file holds no other session's content. Park a blocking query and make no further push from that repository in the window when it stops, under the delegation [conflict-run boundary](../../../governance/ki-delegation/references/standards-background-runs.md#conflict-runs). Nobody stashes, rebases or resets in the coordinator's checkout.
- **Report:** owner reports, run reports and banners omit routine push state and other sessions' stacked commits. If a run's own unit could not be published because its push failed, its `## Done` names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure.

## Repository level check

Before work resumes on another Mac, at every mark, and before leaving a host, check the work's repositories are level: run `mgit fetch` across those repositories, then read `mcp-git-audit`'s ahead and behind report. Use the repositories in the work's scope; territory work checks its estate. Fetch and inspection do not authorise a push or a change to another writer's working tree.

Carry each repository that is behind its remote as a line in the next report's `## In Progress`, or a 🤖 line of a Summary's status table, `<repository>: <count> commits behind`, until a fresh check proves it level; under BANNER-TRIM it is no longer a banner item. Read ahead findings under [Pushing beneath other sessions](#pushing-beneath-other-sessions); an unpublished change must not disappear during a host handoff. A failed or unavailable check is unknown, never level: report the affected repository and what prevented the check. Reconcile a behind checkout only under [Keeping primary checkouts current](#keeping-primary-checkouts-current), leaving dirty or diverged checkouts for their owner. An On hold banner still follows its existing parked-and-release form.

Kris approved this check on 18 October 2026, “sync guard. Yeah, got your recommendation”, and narrowed the delivery to the level check and its behind finding on 22 October 2026. Queue transfer, host-bound runs and the old session's closing form remain outside this rule. The [deferred host-move design notes](sources.md#deferred-host-move-evidence) preserve the open questions and historical transfer evidence; they grant no implementation authority.

## Keeping primary checkouts current

Background agents work in worktrees and push their own commits, so the owner's primary checkouts fall behind. The coordinator fast-forward pulls each affected primary checkout periodically: after a background agent that pushed finishes, and before a Summary.

It pulls only with `--ff-only` into a clean checkout. A checkout with uncommitted changes, or one that has diverged from its upstream, is skipped and reported to the owner rather than stashed, rebased or reset. The pull is a quick one-step check under [Coordinator responsiveness](standards-coordination.md#coordinator-responsiveness); anything needing repair goes to a background agent or the owner.
