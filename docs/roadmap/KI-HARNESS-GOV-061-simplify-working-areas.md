---
id: KI-HARNESS-GOV-061
area: GOV
title: Simplify Working Areas
theme: governance-consistency
horizon: triage
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-14T14:30:19Z
updated_at: 2026-09-14T14:30:19Z
---

# Simplify Working Areas

## Goal

Make working-area direction, temporary retention, batch naming, and handoff ownership simple and consistent across the skills that use them.

## Context

The user clarified that `+/` holds inputs into further repository work, including local checkpoints and batches, rather than only material received externally. They requested renaming `+/_AUTHORISATIONS/` to `+/_BATCHES/`, keeping records only while useful, and regular cleanup of batch records older than one week through `ki-next`, `ki-recap`, and similar process entry points. They also requested removal of any handoff capability duplicating trades.

The source inspection found no standalone handoffs skill. The overlap is the KB DIGEST procedure's direct timestamped handoff files under `-/_TRADES/`, which conflicts with the peer-qualified TRD record shape owned by `ki-trades`. Additional drift includes required-versus-optional scaffold wording and the KB metadata checker failing to delegate checkpoint records to their owning skill.

## Boundary

Simplify existing owners rather than introduce another skill, generic lifecycle, configuration surface, or parallel handoff format. Preserve batch execution authority checks, trade release conditions, and canonical roadmap done-before-prune requirements. Do not infer deletion authority for active or contested shared-tree work from age alone. This capture does not authorise estate-wide migration or removal of another thread's files.

## Discussion

### Direction

Define `+/` as inputs awaiting further repository work, regardless of whether they were received or created locally. Keep `-/` for produced outputs awaiting use or delivery. Generic working-area READMEs should express that distinction without conflicting with specialist records.

### Batch naming and retention

Rename the storage directory to `_BATCHES` while retaining the existing batch identities and approval semantics. Put the cleanup rule in the batch owner and have regular next-work and recap procedures consume it. Define one deterministic age basis and safe treatment of active, malformed, and concurrently modified records; a proposed simple interpretation is completed or stopped batches with no activity for more than seven days. Preserve useful outcomes in canonical work records before cleanup. Do not create an automatic expiry policy for other working-area record types.

### Handoff ownership

Remove the KB-specific cross-repository handoff format and route those handoffs through `ki-trades`. Keep local session digests and ordinary runtime delegation, which serve different purposes. Migrate any retained canonical-repository legacy artifacts deliberately; report consumer migration needs separately.

### Minimal consistency repairs

Align scaffold wording with the existing required directories and delegate checkpoint metadata in the KB checker. Update directly affected standards, fixtures, generated publications, and live canonical-repository paths together. Verification should cover the rename, cleanup selection boundaries, handoff ownership, and coexistence of KB and checkpoint governance.
