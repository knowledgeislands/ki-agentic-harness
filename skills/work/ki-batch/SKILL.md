---
name: ki-batch
ki-kind: process
ki-applicability: invocation-only
ki-guild: work
ki-depends-on: []
ki-optional-depends-on: [ki-delegation]
ki-shared-dependencies: [ki-work-roadmap:work-identifiers]
description: >
  Retired batch authority, kept only so existing batch records stay readable while its removal lands. Use only
  to read an existing batch record; deliver new work as a frozen wave in a `ki-coordination` unattended window.
argument-hint: 'batch <work>... | batch outcome <outcome> | run <batch-authorisation> | help'
---

# ki-batch

**Kind:** process. Coordinates one exact set of repository-local Ready records under reviewed-item or explicit outcome authority.

**Retired.** Kris took BATCH-RETIRE a) on 7 November 2026: an unattended window's grant in the decisions log is the one authority record, a wave is frozen before its delivery starts under `ki-coordination`'s [unattended window](../ki-coordination/references/standards-unattended.md#unattended-windows) rule, and `ki-accept` closes a wave's records only where that grant names closure. Start no new batch. The rest of this skill stays only until its removal lands, under [the adapter migration file](../../keystone/ki-work/references/standards-change-management-adapters-migration.md).

Read [the batch procedure](references/standards-batch.md) before acting, and read [the outcome-authority procedure](references/standards-outcome-authority.md) when autonomous delivery is requested. Use the [reviewed-item example](references/exemplars.md), [outcome-authority example](references/standards-outcome-authority-example.md), and [source notes](references/sources.md) as needed.

## Contract

A batch is an authority envelope and run account, not another plan. The canonical work items own scope, dependencies, files, checks, implementation evidence, review packets, and follow-up work.

Reviewed-item mode requires the human-approved exact item set. Outcome mode requires affirmative, current human authority for an outcome. In outcome mode, finish selection and readiness first, exclude work outside that authority, then freeze the complete eligible set once. Do not require a second item-by-item approval gate.

One batch covers one repository and one autonomous window. `completion_target: done` grants consolidated closure for every named item after its review evidence is rechecked. `completion_target: awaiting-review` grants no closure. `policy: safe-local-v1` supplies the fixed stops; the authorisation does not repeat them.

## Execution

Resolve the local adapter, re-ground every named canonical record, surface known blocking questions, and run independent `ki-implement` cycles in dependency order. The `in-progress` transition is operational and need not receive a standalone commit. Prefer one preparation/authorisation commit, one delivery commit per item, and one consolidated close commit: `N + 2` commits for `N` items when repository state permits.

Run focused checks while delivering each item and one aggregate final gate before consolidated closure. Append only concise item results to the run ledger. Capture non-blocking remedial findings as candidates for a later wave; never admit them dynamically to the active batch.

Park an item when ambiguity or a fixed stop falls outside authority. Continue only with items proven independent. Pruning, push, release, destructive work, material scope expansion, external coordination, public-contract choices outside an approved item, and bypassing verification are never implied.

## Relationship boundary

`ki-next` owns capture and selection. `ki-plan` owns work-item readiness. `ki-implement` owns the single-item delivery cycle. `ki-accept` owns closure and pruning semantics. `ki-recap` owns session recap and learning routes. `ki-delegation`, when selected, supplies the durable high-risk delegation packet.

The `ki` CLI may provide deterministic `prepare`, `validate`, `run`, and `close` mechanics. It does not infer authority, select contentious work, replace item plans, decide acceptance, or move these portable semantics out of the Harness.

## Invocation

- `help`, `-h`, or `?` explains the process without writing.
- `batch <work>...` prepares an exact reviewed-item proposal through the normal selection and planning cycle.
- `batch outcome <outcome>` uses current explicit outcome authority to select and ready the complete eligible set, then writes and binds one authorisation before implementation.
- `run <batch-authorisation>` validates one canonical local record beneath `+/_BATCHES/` and coordinates the exact set in dependency order.

With no usable authority or target, report the missing input and stop. Never treat silence, a clean gate, ordinary implementation permission, or an old standing preference as outcome authority.

Routine batch-record cleanup follows [the retention rule](references/standards-batch.md#batch-retention). Work-item pruning always requires its own explicit authority.
