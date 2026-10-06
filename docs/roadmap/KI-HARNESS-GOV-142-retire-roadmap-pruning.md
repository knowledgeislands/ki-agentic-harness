---
id: KI-HARNESS-GOV-142
area: GOV
title: Retire roadmap pruning
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-06T01:22:00Z
updated_at: 2026-10-06T01:22:00Z
---

# KI-HARNESS-GOV-142: Retire roadmap pruning

## Goal

The roadmap standard, its rubric and the change-management skills agree with the owner's standing rule that work records are never pruned or deleted: a `done` record stays in the roadmap as `done`, and no skill recommends, selects or performs its removal.

## Context

The 2026-10-06 estate roadmap consolidation applied the owner's standing rule - done items stay done, and nothing is pruned or deleted - and found the harness still describes and enables the opposite path:

- `ki-work-roadmap` `references/standards-repository-roadmaps.md` defines an explicit prune path, the "Pruning exception" commit boundary, and done-before-prune for Triage dispositions; rubric item ROAD-8 reviews prune-only commits as conforming.
- `ki-accept` owns `prune <work-record-or-glob>...`, with the invocation as deletion authority (`SKILL.md` and `references/standards-acceptance.md`, backed by `scripts/internal/prune-selection.ts`).
- `ki-next` `SKILL.md` lets it recommend `done` records for pruning and names `ki repo roadmap prune`; `references/standards-next-work.md` routes intake dispositions to "done before any later prune".
- `tools-ki` implements `ki repo roadmap prune` (`src/core/work/operations.ts`).

Records were pruned under that guidance on 2026-10-04/05: in `mcp-gsuite` (`a77e8f2`, after a de facto withdrawal in `944ee78`), `mcp-m365` (`53f5d0c`), `mcp-ki-kb-notion-mirror` (`eb00d23`), `mcp-git-audit` (`d86f744`) and this harness (`47bc10e8`). Several live records now cite pruned items only by revision.

Raised by the 2026-10-06 consolidation (action C15).

## Boundary

In scope: the harness standard, rubric, skills, tests and exemplars that describe, recommend or perform work-record pruning, rewritten so `done` is the terminal retained state; and a non-blocking handoff to `tools-ki` to retire or disable `ki repo roadmap prune`.

Out of scope: restoring records already pruned, which is an open owner question below and is not performed by this item; the `ki-batch` batch-retention rule for `+/_BATCHES/`, which is not a work record; and trade-record release in `ki-trade`, unless shaping finds it removes work records.

## Discussion

### Open owner questions

- **Restoration.** Should records pruned before this rule was stated be restored from Git history into their roadmaps as `done`? Nothing has been restored; the consolidation recorded only the question.
- **Withdrawal.** Is a sanctioned withdrawal of adopted, undelivered work wanted? `mcp-gsuite` `944ee78` shows a de facto withdrawal before pruning; under this rule it would need a retained terminal state, for example an approved disposition recorded through `ki-accept`, rather than deletion.
- **Native command.** Should `ki repo roadmap prune` be removed from `tools-ki`, or kept behind an explicit refusal so older automation fails closed?
