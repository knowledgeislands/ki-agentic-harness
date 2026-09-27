---
id: KI-HARNESS-GOV-120
area: GOV
title: Align KB roadmap declarations
theme: governance-consistency
horizon: now
status: ready
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-09-27T23:01:17Z
updated_at: 2026-09-27T23:01:17Z
---

# Align KB roadmap declarations

## Goal

Allow a Knowledge Base to declare its shared roadmap record configuration without contradicting its Streams planning model.

## Context

The HNR audit exposed a contradiction: `ki-repo` rejects any KB declaration of `ki-work-roadmap`, while the Streams and roadmap standards assign the shared record format and issuing-area configuration to that skill. Kris approved a shared-harness repair as part of the HNR audit follow-up. No business or acquired source content is transferred into this public repository.

## Boundary

Align only the kind rule, its owning standards, published rubric and regression tests. Preserve the KB Streams adapter, existing record identities and the prohibition on parallel project roadmap artefacts. No host changes, new adapter, push, deployment or work-item acceptance.

## Current state

The existing rule rejects a valid KB that declares both Streams and shared roadmap configuration. The selected work and roadmap audits pass before implementation.

## Steps

- [ ] Clarify that a KB may declare shared roadmap configuration only alongside its Streams container.
- [ ] Replace the blanket rejection with that compatibility check and add positive and negative regression fixtures.
- [ ] Regenerate the rubric, run source tests, TypeScript and focused audits, and record the HNR result.

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

## Discussion

### Authority and preservation

Kris approved the proposed shared-harness change and recoverable HNR memory retirement in the interactive thread. The latter remains in the HNR knowledge base, not this repository. Removing a legitimate issuing-area declaration solely to satisfy the old check is explicitly excluded.
