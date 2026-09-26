---
id: KI-HARNESS-GOV-104
area: GOV
title: Order roadmap number reservation
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-26T15:23:47Z
updated_at: 2026-09-26T15:59:21Z
---

# KI-HARNESS-GOV-104: Order roadmap number reservation

## Goal

A roadmap number is owned by whoever commits the ledger advance first, and every later reader can see that it is taken. Two agents working the same repository at the same time can each capture work without discovering, after the fact, that they allocated the same identifier.

## Context

`ki` doctrine currently requires the item record and the advanced `_ISSUES.md` ledger to land in "the same coherent write boundary" — [`standards-repository-roadmaps.md`](../../skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md) for the owning rule, restated in [`standards-next-work.md`](../../skills/change-management/ki-next/references/standards-next-work.md) for the capture procedure and again for housekeeping spawning. That requirement is safe against one writer and unsafe against two. Atomicity of the pair says nothing about who observed the high-water mark first: two runs that both read `GOV: 101` both believe they own `GOV-102`, and neither learns otherwise until the second record is written.

This is not theoretical in this repository. Two concurrent runs of one coordination-plane agent executed the same approved capture and produced a duplicate capture commit that had to be reconciled by hand. The evidence is stronger still at the moment this record was written: the task branch carried `GOV: 101` while `main` already carried `GOV: 103`, so two numbers had been taken by other runs during a single task. Re-reading the ledger "immediately before publication" does not close the window, because the window is between the read and the commit, not between the record and the ledger.

The rule that closes it is an ordering rule: advance the ledger, commit that alone, and only then write the record. A committed bump is observable by every other run at the moment the reservation is taken, which is the earliest point at which it can be observed at all.

Two companion rules make the ordering enforceable rather than aspirational. First, a coordination-plane run that will write to a repository works in its own linked worktree on its own branch, cut from a named commit, so a human checkout is never an agent's working directory. Second, roadmap records are the deliberate exception: every write under `docs/roadmap/**` happens on the repository's designated primary checkout, because a serialising write locus is what makes "commit the bump first" mean one queue rather than one queue per worktree. Those three rules were accepted by the responsible human on 2026-09-26 on coordination task `KNO-22` and are carried today only in coordination-plane project configuration, which no `ki` audit reads.

## Boundary

In scope: the ledger-first ordering wherever `ki` doctrine states the numbering rule; the worktree and primary-checkout write-locus rules in the Paperclip coordination standard; the rubric criteria that make those rules assessable; and the corresponding statements in the Streams propose path.

Out of scope: write-root enforcement mechanism, which is coordination task `KNO-10`; coordination-plane project configuration and its convention text, which is `KNO-9`; the seven KI–Paperclip boundary rules and their single-citation homes, which is `KI-HARNESS-GOV-103`; the `_ISSUES.md` body text, which is generated and byte-checked and therefore needs its own item; and any change to how `ki repo conform` repairs a ledger.

## Current state

The numbering rule appears in four doctrine locations and states atomicity rather than ordering:

- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md` — the owning rule: "publish the new record and advanced ledger in one coherent write boundary".
- `skills/change-management/ki-next/references/standards-next-work.md` — the capture procedure: "Publish the new record and advanced ledger in the same coherent write boundary".
- `skills/change-management/ki-next/references/standards-next-work.md` — housekeeping spawning: "write the spawned record, advanced ledger, and template `active-run` linkage as one coherent change".
- `skills/repo-structure/ki-repo-kb-streams/references/mode-propose.md` — "allocate its next serial from `_ISSUES.md`, and create the flat roadmap item", with no ordering stated.

`ROAD-7` in the generated `ki-work-roadmap` rubric describes the same requirement as "publishes the record with its atomic ledger advance", so the audit criterion would have to change with the standard or it would read as contradicting it.

The Paperclip coordination standard already requires separate worktrees for concurrent mutating tasks in its workspace model, but states it as a concurrency precaution rather than a standing rule, and says nothing about where roadmap records are written. `COORD-4` assesses workspace isolation; no criterion assesses the roadmap write locus.

`ki-agent-coordination-paperclip` is `ki-applicability: declaration-only`. No repository declared it when this record was first written, so its rubric had nothing to run against. That is no longer true: `ff42edc4` added `[skills.ki-agent-coordination-paperclip]` to this repository's `.ki.toml`, so as of `main` at `6c79a75b` the criteria do have a declaration to run against. Whether they can be executed on a given host is a separate gap, captured as `KI-HARNESS-GOV-109`, and neither is this item's to close.

The ledger body text is generated: `issueLedger()` in `skills/change-management/ki-work-roadmap/scripts/rubric/contexts/roadmap-evidence.ts` produces it and `ledgerAllocation()` accepts a ledger only when the file is byte-identical to that output. Adding the order of steps to `_ISSUES.md` therefore cannot be an edit to the file; it is a change to the generator plus a repair path for every already-conforming repository, since `CONFORM` scaffolds a ledger only when it is absent and never overwrites one.

## Steps

- [ ] Replace the atomicity requirement with the ledger-first ordering in `standards-repository-roadmaps.md`, and state the single-writing-checkout rule that makes the ordering meaningful across concurrent runs.
- [ ] Apply the same ordering to the capture procedure and the housekeeping spawn rule in `standards-next-work.md`, citing the owning standard rather than restating its reasoning.
- [ ] State the ordering in the Streams propose path in `mode-propose.md`.
- [ ] Record the worktree rule and the roadmap primary-checkout exception in the workspace model of `standards-agent-coordination-paperclip.md`, and name them in the coordination `SKILL.md` shared model.
- [ ] Update `ROAD-7` in `skills/change-management/ki-work-roadmap/scripts/rubric/items/roadmaps.ts` to the ordering wording and regenerate the rubric.
- [ ] Add a `COORD` criterion for the roadmap write locus in `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/coordination.ts` and regenerate the rubric.
- [ ] Deliver the ledger-body change through `KI-HARNESS-GOV-105`, which owns the generator change and its estate repair path.

## Files touched

- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`
- `skills/change-management/ki-work-roadmap/scripts/rubric/items/roadmaps.ts`
- `skills/change-management/ki-work-roadmap/references/rubric.md` (generated)
- `skills/change-management/ki-next/references/standards-next-work.md`
- `skills/repo-structure/ki-repo-kb-streams/references/mode-propose.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/SKILL.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/standards-agent-coordination-paperclip.md`
- `skills/agentic-systems/ki-agent-coordination-paperclip/scripts/rubric/items/coordination.ts`
- `skills/agentic-systems/ki-agent-coordination-paperclip/references/rubric.md` (generated)

## Verify

```bash
ki repo audit --skill ki-work-roadmap
ki repo audit --skill ki-agent-coordination-paperclip
ki repo audit --skill ki-repo-kb-streams
ki repo audit --skill ki-skills
ki dev skill rubric ki-work-roadmap
ki dev skill rubric ki-agent-coordination-paperclip
bun run test
bunx tsc --noEmit
```

Each audit reports no FAIL. Both rubric commands report the generated file current. The phrase `coherent write boundary` no longer carries the numbering rule anywhere under `skills/`.

## Dependencies / blocks

No build-order dependency. `KI-HARNESS-GOV-103` and this item touch the same coordination standard and should not be shaped into conflicting edits of the same section; that is sequencing preference, not build order, so `blocked_by` stays empty.

The generated-`_ISSUES.md` follow-on is created by this item's final Step and does not gate it.

## Documentation impact

### Decision Records

The three rules are a standing constraint on how every agent run writes to a repository, so they warrant a Decision Record in this repository rather than living only in standards prose. This item writes the standards and proposes the record separately; the record is not a precondition for the standards edit, because the standards already own the numbering rule and the coordination standard already owns the workspace model.

### Specifications

`standards-repository-roadmaps.md`, `standards-next-work.md`, and `standards-agent-coordination-paperclip.md` are the behaviour-level contracts and all three change. The change is a strengthening: every sequence that satisfies the new ordering already satisfied the old atomicity requirement, so no conforming writer becomes non-conforming.

### Guides

No human-guidance change. The website skills-by-outcome guide selects skills by task and does not restate the numbering rule.

### Roadmap

`KI-HARNESS-GOV-105` owns the generated `_ISSUES.md` body, which needs a conform repair path before its text can change. Activation of `ki-agent-coordination-paperclip` in a repository `.ki.toml` remains separately owned; until then the new `COORD` criterion is published but unexercised.

## Discussion

### Why ordering rather than atomicity

Atomicity answers "can a reader see a record without its ledger advance?" Ordering answers "can two writers believe they own the same number?" Those are different failure modes and only the second one has actually happened here. The atomicity requirement is not wrong and is not being dropped: committing the bump first and the record second still leaves the pair coherent, and the record still never lands without its advance. What changes is that the advance is no longer permitted to wait for the record.

### Why the write locus belongs in doctrine

Committing the bump first is only a reservation if all writers commit to the same place. Two worktrees each committing a bump on their own branch reproduce the original collision exactly, one merge later. The serialising checkout is therefore part of the rule, not an implementation detail of one runtime — which is why the general form belongs in the roadmap standard and only the Paperclip instantiation in the coordination standard.

### Open question: enforcement

Both rules remain judgment criteria. A mechanical check is conceivable — a repository could reject a commit that changes both `_ISSUES.md` and a new `docs/roadmap/` record together — but that check would live in a Git hook or in `ki`, and it would also have to tolerate the legitimate coupled cases the standards still allow, such as an acceptance closure landing with its evidence. Until something can fail when the rule is violated, this is doctrine that a reviewer must apply, and the item should not claim otherwise.

### Coordination linkage

Covering coordination task: `KNO-34`. Approval origin: `KNO-22`, confirmation `b822a290`, accepted 2026-09-26T14:38Z. The number for this record was reserved by commit `77a99d509504a8c556ff47694aa7ba8d82e9a0b7` on the primary checkout before the record existed, applying the rule the record writes. Steps 1 to 4 are delivered by `KNO-34` on branch `paperclip/KNO-34-write-the-roadmap-rules-into-ki-doctrine` at `1ea2ee31`; Steps 5 and 6 are delivered by covering coordination task `KNO-36`. The doctrine change was approved by the responsible human on `KNO-34`, confirmation `cc5c042f`, accepted 2026-09-26T15:53:32Z, bound to proposal revision 1. The readiness re-audit `ki-plan` requires could not run: no harness is installed on this host, so every `ki repo audit` exits 1. That gate is unmet rather than passed, and this record is shaped to `ready` on the approval rather than on the audit.
