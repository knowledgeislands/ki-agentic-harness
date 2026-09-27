---
id: KI-HARNESS-GOV-100
area: GOV
title: Report push as action
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T12:39:00Z
updated_at: 2026-09-27T22:06:13Z
---

# KI-HARNESS-GOV-100: Report push as action

## Goal

A session reports what it did rather than what the shared branch currently looks like, so that a handoff statement does not become false through someone else's action.

## Context

Raised by `apps-observatory` on 2026-09-26. Two commits were made there under the standing rule that an agent never pushes unprompted, and both recaps reported them as unpushed — true at the time, and verified against `git` rather than recalled.

By the next recap both were on `origin/main`. `git reflog show origin/main` recorded pushes at 2026-09-24 09:16 and 2026-09-25 15:15, and `git ls-remote` confirmed the remote tip. Neither push was mine. A peer writer in the same checkout committed twice and pushed, carrying my commits with theirs, as a push of a shared branch necessarily does.

Nothing was damaged and no rule was broken by either party: the peer pushed their own work, and a push takes the branch, not a selection of commits. What broke was the truth value of a handoff statement. "Committed, not pushed" was a claim about a shared ref that a third party can change without touching my work, and it decayed silently between two recaps of the same session.

## Boundary

In scope: how `ki-git` and the recap procedure phrase push state, and whether the no-push rule needs a matching statement about what an agent may assert about a shared ref.

Out of scope: the standing no-push rule itself, which worked exactly as intended; concurrent-writer policy, which `ki-git` already governs under one-writer-per-checkout; and the peer's commits, which were legitimate.

## Discussion

### Pickup checkpoint — 2026-09-27

- Verified delivery candidate: `f9dbcd90` added the action-versus-position reporting rule, still present in [the Git standard’s publication authority section](../../skills/governance/ki-git/references/standards-git.md#commit-publication-and-integration-authority). The central requested rule is not missing and should not be implemented again.
- Remaining: assess whether the recap procedure needs an explicit corresponding instruction or already obtains sufficient guidance from the governing Git policy. No runtime recap-behaviour test or independent acceptance was established by this audit.
- Closure route: this remains unadopted Triage, not an accepted delivery. Use the proper human-approved adoption and review route, or an applicable approved intake disposition; do not mark it done solely because matching wording exists.

Evidence scope: inspected local `main` at `0ad0377a0e7e14b1cd7314bce414d4871b062efc` on 2026-09-27. The read-only probe of `http://127.0.0.1:3100/api/health` could not connect; live tasks, current claims and runtime configuration were not verified. The local Git worktree registry was inspected, not every retained worktree’s contents. Before further implementation, reconcile the current destination branch, linked coordination tasks and retained worktrees where applicable, including reachability, patch equivalence and uncommitted work. Missing evidence does not release ownership or lift a hold. This checkpoint is guidance, not a mechanical execution block or a grant to resume. Lifecycle, checkboxes and ownership remain unchanged; retain any later done record until the principal explicitly selects pruning.

The distinction the guidance currently blurs is between two different facts. _I did not push_ is a statement about this session's actions, is permanently true once true, and is the thing the no-push rule is actually about. _The commit is unpushed_ is a statement about a shared ref's current position, is true only at the moment it is checked, and is not this session's property at all. Recaps have been making the second while meaning the first.

It matters at handoff more than during work. A reader of "two commits are local, unpushed" plans to review before publication and may find publication already happened — which, where a push to `main` triggers a deploy, means the decision the sentence was protecting was taken by someone else while the reader was reading. In this instance CI was the only consequence, and it was already red for an unrelated reason.

Candidate wording for `ki-git`: _Report push state as an action, not a position: "I did not push" rather than "this is unpushed". A shared ref moves under any writer with access, so a claim about its current position is true only when made and must be re-checked, not carried forward._

There is a second-order point worth keeping. Verifying against `git` — which both recaps did — is not sufficient here, because the check was sound and the fact changed afterwards. Grounding protects against stale context; it does not make a volatile fact durable. The only reliable fix is to assert the invariant thing instead.

- [KI-HARNESS-GOV-096](KI-HARNESS-GOV-096-detect-zero-match-generators.md) and this record share a root: a statement that was true when measured, carried forward as though it were a standing fact.
