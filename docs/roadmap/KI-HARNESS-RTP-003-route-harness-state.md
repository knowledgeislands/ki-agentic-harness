---
id: KI-HARNESS-RTP-003
title: Route harness state
area: RTP
theme: runtime-portability
horizon: next
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-07-29T00:10:07Z
updated_at: 2026-09-16T12:59:39Z
---

## Goal

Put each kind of harness state in the durable home that matches how it must be shared, protected, and recovered.

## Context

The work will produce a finite routing table or Decision Record assigning each state class to repository tracking, knowledge-base content, synchronised personal configuration, or intentionally disposable machine-local storage.

The `workspaces/kis/` to `workspaces/kit/` checkout-path migration supplied the first concrete failure: Claude resolved a new project-memory directory for the current path, leaving the authored memory set in a writable legacy directory while the current directory began nearly empty. `KI-HARNESS-OPS-002` owns the narrow repair of three known legacy records; this item owns the wider durability and routing question exposed by that split.

## Boundary

Cover project memory, runtime settings and hooks, learned patterns, and caches; create follow-up migrations only for state proven to be in the wrong home.

## Current state

Existing decisions already assign repository source and accepted documentation, XDG harness installation state, managed user-environment bindings, and runtime-portable execution boundaries to distinct owners. The checkpoint and Claude-housekeeping standards separately distinguish durable repository state from runtime sessions, caches, and project memory. No single decision currently explains how those established owners compose or provides a finite test for new state classes.

The first concrete contradiction is bounded and reproducible: a checkout-path change caused Claude to resolve a new project-memory directory while durable-looking project guidance remained under the old path. The appropriate durable outcome is therefore a compact Architecture Decision Record with a routing table, rather than an operational migration guide or a broad state-moving implementation.

## Steps

- [ ] Inventory the finite Harness state classes: repository source and generated projections; installed harness registry, configuration, and cache; managed user-runtime settings and hooks; project memory and learned preferences; active checkpoints and acquired sessions; credentials; logs, caches, and temporary execution state.
- [ ] Map each class to one canonical authority, its derived or disposable projections, required durability and sharing, sensitivity boundary, regeneration path, and recovery expectation.
- [ ] Add `ADR-KI-HARNESS-014` with the rule that durable authority must not depend solely on a checkout path, runtime session, provider snapshot, generated projection, or cache.
- [ ] Reconcile the decision with existing repository-documentation, installation, user-environment binding, checkpoint, housekeeping, and runtime-portability ownership without restating their detailed contracts.
- [ ] Add the decision to the curated construction reading order and identify separately scoped migration work only where the inventory proves current state is misrouted.
- [ ] Run focused Decision Record, authoring, and roadmap audits plus repository-wide Markdown integrity checks.

## Files touched

- `docs/decisions/ADR-KI-HARNESS-014-route-state-by-authority-and-durability.md`
- `docs/decisions/README.md`
- This roadmap record

## Verify

- Every inventoried state class has exactly one canonical authority and explicit projection, durability, sensitivity, regeneration, and recovery treatment.
- The decision distinguishes durable authority from derived, runtime-local, secret, and disposable state without moving any state itself.
- Existing decisions remain the detailed owners of installation, binding, repository documentation, and runtime portability.
- `ki repo audit --skill ki-decision-records --repo .`
- `ki repo audit --skill ki-authoring --repo .`
- `ki repo audit --skill ki-work-roadmap --repo .`
- `git diff --check`

## Dependencies / blocks

No external dependency blocks planning. Readiness requires approval of the Architecture Decision Record outcome and the finite state-class vocabulary above. Implementation creates no external configuration, migration, credential, session, cache, or provider change.

## Documentation impact

### Decision Records

Add `ADR-KI-HARNESS-014` as the compact routing authority and update the curated decision index.

### Specifications

No behaviour-level specification is required; the outcome assigns ownership and durability rather than defining an executable interface.

### Guides

No guide is planned because this item does not define a migration or operator procedure.

### Roadmap

Create follow-on work only for a concrete state class the completed inventory proves is currently misrouted. `KI-HARNESS-OPS-002` remains the independently completed narrow legacy-memory repair.

## Discussion

### Routing test

Each state class needs an explicit durability, sharing, sensitivity, and ownership rationale before the work proposes moving it.

### State inventory

Start from concrete state rather than runtime names: repository source and generated projections; user configuration and installed harness metadata; runtime-local memory, sessions, caches, and logs; personal learned preferences; and durable knowledge-base material. A state class may have more than one representation, but each representation needs one declared canonical home.

### Routing criteria

For each class, assess whether it must survive machine replacement, be shared with collaborators, remain private to one user, be regenerated safely, or contain secrets. Repository tracking is for project-owned source; synchronised personal configuration is for durable user choice; a knowledge base is for maintained knowledge; disposable local storage is for recoverable runtime cache and session state.

### Evidence for promotion

The inventory is now bounded to the state classes in the approved plan. The contradictory state class is evidenced by the split Claude project-memory directories, and the planned outcome is a compact Architecture Decision Record containing the routing table. Do not start a broad migration merely because multiple copies exist.

### Return trigger

The trigger was met on 2026-09-16 when the checkout-path migration produced separate current and legacy Claude project-memory directories with materially different contents. Further examples may refine the inventory but are no longer required to justify shaping the routing decision.
