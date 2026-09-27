---
id: KI-HARNESS-GOV-120
area: GOV
title: Align KB roadmap declarations
theme: governance-consistency
horizon: now
status: awaiting-review
blocks: []
blocked_by: []
baseline_ref: e74ebc9daf4710e3eb94dd65a1fcbe7d4ca9ce59
created_at: 2026-09-27T23:01:17Z
updated_at: 2026-09-27T23:21:18Z
---

# Align KB roadmap declarations

## Goal

Allow a Knowledge Base to declare its shared roadmap record configuration without contradicting its Streams planning model.

## Context

The HNR audit exposed a contradiction: `ki-repo` rejects any KB declaration of `ki-work-roadmap`, while the Streams and roadmap standards assign the shared record format and issuing-area configuration to that skill. Kris approved a shared-harness repair as part of the HNR audit follow-up. No business or acquired source content is transferred into this public repository.

## Boundary

Align only the kind rule, its owning standards, published rubric and regression tests. Preserve the KB Streams adapter, existing record identities and the prohibition on parallel project roadmap artefacts. No host changes, new adapter, push, deployment or work-item acceptance.

## Current state

The rule and both owning standards now agree: a KB may configure shared roadmap records alongside its Streams container. Verification passes, including the complete eight-repository HNR audit. Delivery awaits human review.

## Steps

- [x] Clarify that a KB may declare shared roadmap configuration only alongside its Streams container.
- [x] Replace the blanket rejection with that compatibility check and add positive and negative regression fixtures.
- [x] Regenerate the rubric, run source tests, TypeScript and focused audits, and record the HNR result.

## Files touched

- `skills/keystone/ki-repo/references/standards-repository.md`, `references/rubric.md`, `scripts/rubric/items/kind.ts` and `scripts/rubric/contexts/{audit.ts,repository.test.ts}`.
- `skills/change-management/ki-work-roadmap/references/standards-repository-roadmaps.md`.
- This work record and its separately committed issue reservation.

## Verify

Run the focused repository and roadmap tests, `ki dev skill rubric ki-repo`, `bun run test`, `bunx tsc --noEmit`, the `ki-skills` and local work-adapter audits, and kit-hnr's `ki-repo` audit. A KB with both declarations must pass KIND-2; a roadmap declaration without a Streams root marker must fail. Project roadmap behaviour and the KB prohibition on project roadmap artefacts must remain intact.

## Dependencies / blocks

No prerequisite. Other active harness changes remain outside this file set. Interactive delivery uses the primary checkout; this is not a Paperclip-coordinated delivery. The tightly coupled rule, standard and fixtures are handled serially without delegated work.

## Documentation impact

### Decision Records

No new architectural choice: reconcile the existing shared-record and Streams-container ownership rather than introduce another model.

### Specifications

Update the two owning standards and the generated KIND-2 publication together.

### Guides

No human procedure changes.

### Roadmap

This record owns the shared repair. HNR's separately approved memory reconciliation remains outside this record.

## Review

### Delivered

Delivered the approved contract repair from immutable baseline `e74ebc9daf4710e3eb94dd65a1fcbe7d4ca9ce59`. No host, adapter, repository identity, push, deployment or acceptance changes are included.

### Change Summary

KIND-2 now requires a Streams root declaration when a KB declares shared roadmap configuration instead of rejecting that configuration outright. The repository and roadmap standards state the same boundary; the generated rubric matches its catalogue. Six fixture configurations exercise valid and invalid KB declarations, nested-table impostors and unchanged project behaviour.

### Verification

- The new regression failed against the previous blanket rejection and passes after the repair.
- `bun run test`: 839 tests pass, none fail. The existing KB project-artefact rejection test remains passing.
- An intermediate repeat hit two five-second timeouts in unchanged `ki-binding-claude/scripts/build-plugin.test.ts` publication tests. Their focused retry and the subsequent complete default suite both pass; no timeout, test policy or unrelated implementation was changed.
- `bunx tsc --noEmit`, `ki dev skill rubric ki-repo`, `ki-skills` and `ki-work-roadmap` audits pass.
- kit-hnr's focused `ki-repo` audit passes with its original roadmap IDs and area declarations intact.
- The full eight-repository HNR audit passes all 167 selected skills with no warning or failure after the independently approved memory reconciliation.
- `git diff --check` passes. Concurrent Paperclip documentation changes were committed by their owner and are excluded from this delivery's touched paths.

### Outstanding concerns

None within this repair. Local delivery is not publication: no push or release is authorised or performed.

### Post-change review

The change removes a cross-standard contradiction without bypassing adapter validation, allowing project roadmap artefacts in KBs or changing record configuration ownership. The rule remains fail-closed for a roadmap declaration without its KB container. The source, publication and tests are consistent and ready for human review.

### Mini recap

KB shared-record declarations now coexist correctly with their Streams container. The source suite and live HNR audit pass; the original issuing areas are preserved.

## Discussion

### Authority and preservation

Kris approved the proposed shared-harness change and recoverable HNR memory retirement in the interactive thread. The latter remains in the HNR knowledge base, not this repository. Removing a legitimate issuing-area declaration solely to satisfy the old check is explicitly excluded.
