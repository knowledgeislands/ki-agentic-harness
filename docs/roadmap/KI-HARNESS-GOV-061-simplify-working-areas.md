---
id: KI-HARNESS-GOV-061
area: GOV
title: Simplify Working Areas
theme: governance-consistency
horizon: next
status: done
blocks: []
blocked_by: []
baseline_ref: c5cd90274ce82a9c107f1500318bd1c3c504bd14
created_at: 2026-09-14T14:30:19Z
updated_at: 2026-09-14T17:31:16Z
---

# Simplify Working Areas

## Goal

Make working-area direction, temporary retention, batch naming, and handoff ownership simple and consistent across the skills that use them.

## Context

The user clarified that `+/` holds inputs into further repository work, including local checkpoints and batches, rather than only material received externally. They requested renaming `+/_AUTHORISATIONS/` to `+/_BATCHES/`, keeping records only while useful, and regular cleanup of batch records older than one week through `ki-next`, `ki-recap`, and similar process entry points. They also requested removal of any handoff capability duplicating trades.

The source inspection found no standalone handoffs skill. The overlap is the KB DIGEST procedure's direct timestamped handoff files under `-/_TRADES/`, which conflicts with the peer-qualified TRD record shape owned by `ki-trades`. Additional drift includes required-versus-optional scaffold wording and the KB metadata checker failing to delegate checkpoint records to their owning skill.

## Boundary

Simplify existing owners rather than introduce another skill, generic lifecycle, configuration surface, or parallel handoff format. Preserve batch execution authority checks, trade release conditions, and canonical roadmap done-before-prune requirements. Do not infer deletion authority for active or contested shared-tree work from age alone. This capture does not authorise estate-wide migration or removal of another thread's files.

## Current state

The generic scaffold limits inbound material to external sources, while checkpoints and batches are local inputs. Batch records use the misleading `_AUTHORISATIONS` path and lack a common retirement rule. The KB DIGEST handoff format conflicts with trades, and the KB metadata checker does not delegate checkpoints.

## Steps

- [x] Clarify inbound inputs and outbound outputs in the generic standard, canonical READMEs, and focused scaffold checks.
- [x] Rename batch storage to `+/_BATCHES/` across the resolver, tests, guidance, KB delegation, and current repository artifacts without changing protected approval payloads.
- [x] Define one conservative seven-day inactive-batch cleanup rule and reusable no-write selection helper, consumed by regular `ki-next` and `ki-recap` procedures.
- [x] Remove the KB-specific handoff format, route cross-repository handoffs through trades, and delegate checkpoint metadata to its owner.
- [x] Refresh affected generated publications, run focused and full verification, and produce the canonical review packet.

## Files touched

`ki-repo` working-area standards, scaffold implementation and tests; `ki-batch` storage resolver, retention helper and tests, process guidance; `ki-next` and `ki-recap` guidance; `ki-repo-kb` guidance, metadata checker and tests; generic working-area READMEs; current batch directory contents; generated rubrics and capability catalogue; this work record and its batch run record.

## Verify

- Focused repository scaffold, batch authority and cleanup, and KB metadata tests.
- TypeScript and the full Harness test suite.
- Roadmap, skills, authoring, harness, and delegation audits.
- Generated rubric and catalogue parity.
- Confirm protected batch payload hashes survive the directory move.
- Confirm no legacy batch path remains in active skill contracts and no generic KB handoff writer remains.

## Dependencies / blocks

No build-order blocker. The user explicitly agreed the simplification and requested roadmap delivery. Consumer-repository migration and CLI implementation remain outside this repository's write scope.

## Delegation

### Locked decisions

- Inbound means inputs to further local work regardless of origin; outbound means produced outputs awaiting use or delivery.
- Rename storage to `_BATCHES`; preserve approval payloads and identities.
- Retention selection is no-write and conservative: only committed, unchanged, inactive batches with retained outcome evidence and last recorded activity strictly older than seven days are eligible.
- Use Git's last committed path-change timestamp plus existing record activity evidence, never filesystem modification time. Preserve current, active, malformed, uncommitted, or contested records.
- Cross-repository handoffs use trades; keep local digests.

### Escalate

- Any need to alter protected approval semantics, remove active work, write another repository, or expand the contract beyond the agreed simplification.

### Worker: batch-retention

- **Deliverable:** Renamed batch resolver and one pure retention selector with focused tests and owner guidance.
- **Inputs:** This record, current batch authority helper, batch standard, and user-agreed seven-day inactivity rule.
- **Scope:** `skills/change-management/ki-batch/` only.
- **Authority:** Edit and test these files; no live cleanup, staging, commit, push, external write, or other skill edits.
- **Isolation:** Exclusive file lane in the shared tree with thread-local touched-path tracking.
- **Verify:** Focused authority and retention tests, Biome, and coordinator TypeScript/integration checks.
- **Return:** Exact changed paths, selection contract, results, and unresolved concerns.
- **Checkpoint:** Stop once the rename and conservative no-write selector pass focused tests.

### Worker: kb-working-areas

- **Deliverable:** Unified KB handoff ownership and checkpoint/batch metadata delegation.
- **Inputs:** This record, KB DIGEST and frontmatter standards, current KB checker, checkpoint and trade schemas.
- **Scope:** `skills/repo-structure/ki-repo-kb/` only.
- **Authority:** Edit and test these files; no real KB writes, staging, commit, push, or external mutation.
- **Isolation:** Exclusive file lane in the shared tree with thread-local touched-path tracking.
- **Verify:** Focused KB tests, Biome, and coordinator generated-rubric checks.
- **Return:** Exact changed paths, compatibility findings, results, and concerns.
- **Checkpoint:** Stop when legacy handoff creation is removed and checkpoint/batch coexistence is covered.

## Documentation impact

### Decision Records

The existing ownership split is preserved; no new architecture decision is needed for this naming and lifecycle simplification.

### Specifications

The governing skill standards own these portable contracts; no separate specification is introduced.

### Guides

Update process guidance where cleanup or handoff ownership changes. Keep one retention rule in the batch standard.

### Roadmap

This record retains delivery and review evidence. The model radar remains independently evaluated work.

## Review

### Delivered

Delivered the agreed working-area simplification from immutable baseline `c5cd90274ce82a9c107f1500318bd1c3c504bd14`. Scope is this Harness's contracts, tests, generated rubric, working-area READMEs, and current batch migration. No sibling repository, actual expired-batch cleanup, roadmap acceptance or pruning, push, or runtime default was changed.

### Summary of changes

`ki-repo` now defines incoming material as inputs to further local work regardless of origin, and outgoing material as produced outputs awaiting use or delivery. `ki-batch` resolves only `+/_BATCHES/`; the active record moved without changing its protected approval hash. Its single retention rule and pure selector conservatively identify inactive records with preserved outcomes after strictly more than seven days. Regular `ki-next` and `ki-recap` consume that rule without another confirmation. KB DIGEST retains local session digests but delegates cross-repository handoffs to `ki-trades`; the KB checker rejects the retired handoff type and delegates exact checkpoint and batch metadata paths.

### Verification

- `bun run test`: 630 passed, 0 failed, 2903 assertions across 120 files.
- `bunx tsc --noEmit`: passed.
- Focused batch tests: 19 passed, 112 assertions; focused KB tests: 14 passed, 70 assertions. Full suite includes the working-area scaffold regressions.
- Skills, authoring, harness, delegation, and roadmap audits passed.
- Regenerated affected rubrics; repository rubric and capability catalogue already match their sources. Biome, rumdl, and diff whitespace checks passed.
- Migrated BATCH-015 resolves with unchanged protected hash `bd4ee623fcea5270cd5ee9bc755478607c33e2c851d15681cd7ce223ccc10182`. Remaining legacy names are explicit retirement guidance, rejection fixtures, or historical migration evidence.

### Outstanding concerns

Human acceptance remains outstanding. Consumer repositories may retain old batch paths or KB handoff notes; their migration is outside this delivery. The retention helper is a no-write selector, not a background scheduler: process callers must gather current evidence and revalidate before exact-path deletion. No live old-batch cleanup was performed.

### Post-change review

The two bounded worker lanes were integrated and independently reviewed for ownership, cross-skill consistency, and deletion safety; no material findings remain. Cleanup preserves active, dirty, malformed, unbound, or uncertain records and never implies work-item pruning. The change maintains file-level shared-tree ownership and introduces no new skill, generic lifecycle, or configuration surface. The record is ready for human review.

### Mini recap

GOV-061 simplifies directionality and naming, gives short-lived batches one conservative cleanup policy, and removes the duplicate KB handoff format. Checks are clean. Durable guidance is already in the owning skill standards; no additional learning promotion is proposed.

## Done

Accepted 2026-09-14 by the repository owner under explicit roadmap outcome authority on the review packet above.

## Discussion

### Direction

Define `+/` as inputs awaiting further repository work, regardless of whether they were received or created locally. Keep `-/` for produced outputs awaiting use or delivery. Generic working-area READMEs should express that distinction without conflicting with specialist records.

### Batch naming and retention

Rename the storage directory to `_BATCHES` while retaining the existing batch identities and approval semantics. Put the cleanup rule in the batch owner and have regular next-work and recap procedures consume it. Define one deterministic age basis and safe treatment of active, malformed, and concurrently modified records; a proposed simple interpretation is completed or stopped batches with no activity for more than seven days. Preserve useful outcomes in canonical work records before cleanup. Do not create an automatic expiry policy for other working-area record types.

### Handoff ownership

Remove the KB-specific cross-repository handoff format and route those handoffs through `ki-trades`. Keep local session digests and ordinary runtime delegation, which serve different purposes. Migrate any retained canonical-repository legacy artifacts deliberately; report consumer migration needs separately.

### Minimal consistency repairs

Align scaffold wording with the existing required directories and delegate checkpoint metadata in the KB checker. Update directly affected standards, fixtures, generated publications, and live canonical-repository paths together. Verification should cover the rename, cleanup selection boundaries, handoff ownership, and coexistence of KB and checkpoint governance.
