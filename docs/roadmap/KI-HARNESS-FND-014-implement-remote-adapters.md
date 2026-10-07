---
id: KI-HARNESS-FND-014
area: FND
title: Implement remote adapter execution
kind: deliver
purpose: capability
initiative: platform-foundations
component: change-management
status: cancelled
resolution: rejected
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-08-09T20:58:31Z
updated_at: 2026-10-07T20:29:48Z
---

## Goal

Let the shared change-management lifecycle operate authorised GitHub Issues and Linear records rather than stopping at configuration standards.

## Context

`ki-work` and both remote adapter standards define adapter selection, provider-owned locators, lifecycle mapping, migration stops, closure semantics, and fail-closed remote execution. Process skills still have no authorised path to perform authenticated remote reads and writes. `ki-next` and `ki-plan` each carry a duplicate pure selected-adapter resolver, while `ki-implement` and `ki-accept` model remote refusal independently.

The Harness shared-module contract gives `ki-work` a portable ownership seam: it can publish one operation module that each process materialises locally, avoiding checkout-relative imports and process-specific resolver forks.

## Boundary

Do not introduce a parallel local tracker, synchronisation layer, runtime-vendor-specific shared contract, or unauthorised remote write. Repository-roadmap and KB Streams adapters retain their local implementations. A provider binding may use a connector, CLI, or API, but the common lifecycle sees only the adapter's declared mapping and opaque provider evidence. If the runtime cannot prove suitable capability, authentication, current identity, concurrency, or write authority, the process stops.

### Shaping

#### Selected design

`ki-work` owns one selected-adapter operation module published through the shared-module contract and materialised into `ki-next`, `ki-plan`, `ki-implement`, and `ki-accept`. The module retains provider-native locators and exposes the shared lifecycle projection plus opaque snapshot evidence.

The first operational slice uses GitHub Issues. `ki-next` performs read-only inventory, then `ki-plan` performs exactly one authorised reversible readiness transition after an immediate reread and verifies the post-write snapshot. Multi-record remote readiness, implementation, acceptance, and pruning remain unsupported until that slice proves the authority and concurrency boundary. Linear receives the workspace-locator contract and pure fixtures but is not a live first provider.

#### Operation evidence

The provider-neutral input and result cover provider, current native locator, retained aliases, lifecycle projection, opaque snapshot or version evidence, authenticated identity, mutation authority, intended transition, approval evidence, durable remote reference, post-write snapshot, and explicit refusal or partial-write evidence. Provider-specific concurrency tokens remain opaque outside the owning adapter.

#### Promotion conditions

Mark Ready when the Linear workspace locator, operation shapes, capability-resolution rule, stale-read stop, provider fixtures, and single-record boundary are specified, and an explicitly authorised GitHub repository and draft Issue are selected for the `ki-next` to `ki-plan` pilot.

## Cancelled

Approved by Kris on 2026-10-07 under decision 17 of the state-of-play design, which approved every cancel and merge in the easiest-first delivery plan.

Resolution `rejected`: no repository selects a GitHub Issues or Linear adapter, and the pilot repository was never named. Recapture when a repository selects a remote adapter. It leaves no outstanding change; process skills that stopped "pending" this record now simply stop for remote adapters.

## Discussion

### Delegation

Keep the shared contract and first provider fixture in one coordinator-owned lane. Once that contract is fixed, GitHub and Linear fixture work can proceed independently. The coordinator retains pilot selection, remote authority, integration, and live verification.

### Owner question

Recorded 2026-10-05 by the Fable reviewer during make-ready triage; this record stays draft until Kris answers. Which GitHub repository and which reversible draft Issue are authorised as the live Issues pilot, and who owns its lifecycle metadata and write authority?
